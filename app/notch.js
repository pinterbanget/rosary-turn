// Notch surface: decides when the curtain comes out of the notch and when it goes
// back in; the host (QuranNotch.swift on macOS, notch-win.ps1 on Windows) only
// draws and animates it. Ayat go through text.js like everywhere else.
//
//   agent starts working  → curtain drops, ayah fades in
//   agent needs you       → a strip slides in; Space goes back, curtain folds up
//   turn finished         → "Saved at …" then folds up, unless you're still
//                           reading (mouse on the card): then it waits for you
//   hover the notch       → peek; move away and it folds back
import { VERSION } from './config.js';
import { QUICK_STARTS, arabicDigits, buildSearchIndex, resolveQuery } from './quran-core.js';
import { fillAyah as fillVerified, loadText } from './text.js';

const $ = (id) => document.getElementById(id);
const meta = window.QuranData;
const counts = meta.Sura.map((s) => s[1] ?? 0);
const NAMES = { claude: 'Claude', codex: 'Codex' };
const params = new URLSearchParams(location.search);
const BUILD = params.get('build') || '';
const MAX_HEIGHT = 420;

let quran = null;
let pos = { surah: 1, ayah: 1 };
let agent = { status: 'idle' };
let canSwitch = false;
let saving = Promise.resolve();
let pendingSaves = 0;

// Curtain state
let open = false;
let openedBy = null; // 'agent' | 'user'
let hovering = false;
let lastInteract = 0;
let closeTimer = null;
let peekTimer = null;
let waitForLeave = false; // turn finished while you were reading
let dismissed = null; // the turn you closed with Esc stays closed
let lastStatus = null;
let lastTurnKey = null;
let sentStatus = null;

// ── Host bridge ─────────────────────────────────────────────────────────────
// macOS: WKWebView message handler. Windows: the helper long-polls the server.
const native = window.webkit?.messageHandlers?.notch;
function send(msg) {
  if (native) return native.postMessage(msg);
  fetch('/api/surface', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(msg) }).catch(() => {});
}

// chrome: on Windows, the height of the browser's own title strip, which the
// helper tucks above the top edge of the screen.
function reportHeight() {
  const h = Math.min(MAX_HEIGHT, Math.ceil($('card').getBoundingClientRect().height));
  send({ type: 'height', value: h, chrome: Math.max(0, window.outerHeight - window.innerHeight) });
}

function setOpen(on, by = 'agent', { focus = false } = {}) {
  clearTimeout(closeTimer);
  if (on) {
    waitForLeave = false;
    if (!open || focus) send({ type: 'open', focus });
    if (!open) openedBy = by;
    open = true;
    reportHeight();
  } else if (open) {
    open = false;
    openedBy = null;
    waitForLeave = false;
    closeSearch();
    send({ type: 'close' });
  }
}
const closeSoon = (ms) => { clearTimeout(closeTimer); closeTimer = setTimeout(() => setOpen(false), ms); };

// Events from the host: the pointer over the collapsed notch, a click on it.
window.__notch = (event) => {
  if (event === 'hover-in') onEnter();
  else if (event === 'hover-out') onLeave();
  else if (event === 'click') setOpen(true, 'user', { focus: true });
};
document.documentElement.addEventListener('mouseenter', onEnter);
document.documentElement.addEventListener('mouseleave', onLeave);
document.addEventListener('pointerdown', () => { lastInteract = Date.now(); });

function onEnter() {
  hovering = true;
  clearTimeout(closeTimer);
  if (!open) {
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => { if (hovering) setOpen(true, 'user'); }, 250);
  }
}
function onLeave() {
  hovering = false;
  clearTimeout(peekTimer);
  const busy = agent.status === 'working' || agent.status === 'needs_you';
  if (searching()) return; // typing a search: stay open until it's done
  if (waitForLeave) closeSoon(1000);
  else if (open && openedBy === 'user' && !busy) closeSoon(600);
}

// ── Rendering ───────────────────────────────────────────────────────────────

function fail(err) {
  quran = null;
  $('ayah-text').replaceChildren();
  $('ayah-end').textContent = '';
  $('error').textContent = err.message;
  $('error').hidden = false;
  for (const id of ['next', 'prev']) $(id).disabled = true;
  reportHeight();
}

function renderAyah(animate = false) {
  if (!quran) return;
  const { surah, ayah } = pos;
  try {
    fillVerified($('ayah-text'), quran, surah, ayah);
  } catch (err) {
    return fail(err);
  }
  $('ayah-end').textContent = '۝' + arabicDigits(ayah);
  $('surah-ar').textContent = meta.Sura[surah][4];
  $('surah-en').textContent = meta.Sura[surah][5].toUpperCase();
  $('ref').textContent = `${surah}:${ayah}`;
  $('stage').scrollTop = 0;
  const p = document.querySelector('.n-ayah');
  if (animate) { p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); }
  updateMore();
  reportHeight();
}

function setAlert(kind, title) {
  const a = $('alert');
  a.classList.toggle('show', Boolean(kind));
  if (kind) {
    a.dataset.kind = kind;
    $('alert-title').textContent = title;
  }
  // The card keeps its height; the strip takes room from the ayah, which scrolls.
  setTimeout(updateMore, 300);
}

// How long the agent has worked: "<1m", "4m", "1h 5m" beside the notch;
// "under a minute", "4 min", "1 h 5 min" in the strip.
function duration(fromIso, toMs = Date.now()) {
  const from = Date.parse(fromIso);
  if (!Number.isFinite(from)) return null;
  const min = Math.max(0, Math.floor((toMs - from) / 60_000));
  const h = Math.floor(min / 60), m = min % 60;
  return {
    short: min < 1 ? '<1m' : h ? `${h}h ${m}m` : `${m}m`,
    long: min < 1 ? 'under a minute' : h ? `${h} h ${m} min` : `${m} min`,
  };
}

function renderStatus() {
  const name = NAMES[agent.agent] || 'Agent';
  const status = agent.status || 'idle';
  // The host's tiny pill on the notch breathes while the agent works.
  if (status !== sentStatus) { sentStatus = status; send({ type: 'status', value: status }); }
  $('card').dataset.status = status;
  // Beside the notch: the agent, how long it has worked, and a coloured dot
  // (teal working, yellow needs you, green done).
  const t = agent.last_turn;
  const took = status === 'done' && t ? duration(t.started_at, Date.parse(t.ended_at)) : null;
  const running = status === 'working' || status === 'needs_you' ? duration(agent.turn_started_at) : null;
  $('status-text').textContent = status === 'idle' ? 'Quran Turn' : name;
  $('status-time').textContent = (running || took)?.short || '';
  $('status').title = status === 'working' ? `${name} has been working for ${running?.long || 'a moment'}`
    : status === 'needs_you' ? `${name} needs you` : took ? `${name} worked for ${took.long}` : '';
  $('back').textContent = `Back to ${name}`;
  $('back').hidden = !canSwitch;
  $('back-key').hidden = !canSwitch;
  const n = agent.ayat || 0;
  $('counter').textContent = status === 'working' || status === 'needs_you'
    ? `${n} ${n === 1 ? 'ayah' : 'ayat'} this turn`
    : `${pos.surah}:${pos.ayah}`;

  if (status === 'needs_you') setAlert('needs_you', `${name} needs you`);
  else if (status === 'done' && t) {
    setAlert('done', took ? `${name} worked ${took.long} · saved at ${t.to}` : `Saved at ${t.to} · ${t.ayat} ${t.ayat === 1 ? 'ayah' : 'ayat'}`);
  } else setAlert(null);
}

// The curtain follows the turn.
function followTurn() {
  const status = agent.status || 'idle';
  const turn = status === 'done' ? agent.last_turn?.ended_at : agent.turn_started_at;
  const changed = status !== lastStatus || turn !== lastTurnKey;
  lastStatus = status;
  lastTurnKey = turn;
  if (!changed) return;
  if ((status === 'working' || status === 'needs_you') && dismissed !== agent.turn_started_at) {
    setOpen(true, 'agent');
  } else if (status === 'done') {
    const reading = hovering || Date.now() - lastInteract < 8000;
    if (!open) return;
    if (reading) waitForLeave = true;
    else closeSoon(1600);
  }
}

// ── Position ────────────────────────────────────────────────────────────────

function go(next) {
  if (!quran) return;
  pos = { surah: next.surah, ayah: next.ayah };
  renderAyah(true);
  renderStatus();
  pendingSaves++;
  const body = JSON.stringify(pos);
  saving = saving
    .then(() => fetch('/api/position', { method: 'POST', headers: { 'content-type': 'application/json' }, body }))
    .then((r) => (r.ok ? r.json() : null))
    .then((snap) => { if (snap) { agent = snap.agent; renderStatus(); } })
    .catch(() => {})
    .finally(() => { pendingSaves--; });
}

function step(delta) {
  lastInteract = Date.now();
  hideStart(); // reading on from 1:1 is a choice too
  let { surah, ayah } = pos;
  ayah += delta;
  if (ayah > counts[surah]) { surah = (surah % 114) + 1; ayah = 1; }
  else if (ayah < 1) { surah = surah === 1 ? 114 : surah - 1; ayah = counts[surah]; }
  go({ surah, ayah });
}

const valid = (p) => p && Number.isInteger(p.surah) && p.surah >= 1 && p.surah <= 114 &&
  Number.isInteger(p.ayah) && p.ayah >= 1 && p.ayah <= counts[p.surah];

// ── First run ───────────────────────────────────────────────────────────────
// No place saved yet: ask where to start instead of assuming 1:1.

function showStart() {
  const chips = [];
  for (const qs of QUICK_STARTS) {
    const [r] = resolveQuery(qs.query, meta, quran.bySurah);
    if (r) chips.push([qs.label, () => go({ surah: r.surah, ayah: r.ayah })]);
  }
  chips.push(['Search…', () => openSearch()]);
  $('chips').replaceChildren(...chips.map(([label, pick]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'n-chip';
    b.textContent = label;
    b.addEventListener('click', () => { lastInteract = Date.now(); hideStart(); pick(); });
    return b;
  }));
  $('start').hidden = false;
  reportHeight();
}
function hideStart() {
  if ($('start').hidden) return;
  $('start').hidden = true;
  reportHeight();
}

// ── Search / jump to ────────────────────────────────────────────────────────
// The same search as the full reader (quran-core.js): surah names and their
// meanings, juz, page, ayah numbers and Arabic words. Every ayah shown in the
// results goes through fillVerified, exactly like the reading view.

let searchIndex = null; // built on the first Arabic search
const searching = () => !$('search').hidden;
const tag = (name, props = {}, ...kids) => { const n = Object.assign(document.createElement(name), props); n.append(...kids); return n; };

function resultRow(r) {
  const [, ayas, , , ar, tr, en] = meta.Sura[r.surah];
  const num = r.kind === 'juz' ? `Juz ${r.n}` : r.kind === 'page' ? `p. ${r.n}` : r.kind === 'ayah' ? `${r.surah}:${r.ayah}` : String(r.surah);
  const title = r.kind === 'juz' || r.kind === 'page' ? `${tr} ${r.surah}:${r.ayah}` : tr;
  const sub = r.kind === 'surah' ? `${en} · ${ayas} ayat` : r.kind === 'ayah' ? en : `starts at ${r.surah}:${r.ayah}`;
  const name = tag('span', { className: 'n-rname' }, title);
  if (r.kind === 'ayah') {
    const line = tag('span', { className: 'n-rayah', lang: 'ar', dir: 'rtl' });
    fillVerified(line, quran, r.surah, r.ayah);
    name.append(line);
  } else {
    name.append(tag('span', { className: 'n-rsub', textContent: sub }));
  }
  const b = tag('button', { type: 'button', className: 'n-result' },
    tag('span', { className: 'n-rnum', textContent: num }), name,
    tag('span', { className: 'n-rar', lang: 'ar', dir: 'rtl', textContent: ar }));
  b.addEventListener('click', () => { closeSearch(); hideStart(); go({ surah: r.surah, ayah: r.ayah }); });
  return tag('li', {}, b);
}

function renderResults() {
  if (!quran) return;
  const q = $('search-q').value.trim();
  let items;
  if (!q) {
    items = QUICK_STARTS.map((qs) => resolveQuery(qs.query, meta, quran.bySurah)[0]).filter(Boolean);
  } else {
    if (!searchIndex && /[؀-ۿ]/.test(q)) searchIndex = buildSearchIndex(quran.bySurah);
    items = resolveQuery(q, meta, quran.bySurah, searchIndex, { limit: 30 });
  }
  const rows = items.map(resultRow);
  if (q && !items.length) rows.push(tag('li', { className: 'n-none', textContent: 'Nothing found. Try “kahfi”, “juz 30”, “2:255”, “hal 50” or a few Arabic words.' }));
  const full = tag('button', { type: 'button', className: 'n-result' }, tag('span', { className: 'n-rnum', textContent: '⤢' }),
    tag('span', { className: 'n-rname' }, 'Browse all 114 surahs', tag('span', { className: 'n-rsub', textContent: 'in the full reader' })), '');
  full.addEventListener('click', () => post('/api/open'));
  rows.push(tag('li', {}, full));
  $('results').replaceChildren(...rows);
  $('results').scrollTop = 0;
}

function openSearch() {
  if (!quran) return;
  lastInteract = Date.now();
  if (!open) setOpen(true, 'user', { focus: true });
  else send({ type: 'open', focus: true }); // make sure the card takes the keyboard
  $('stage-wrap').hidden = true;
  $('start').hidden = true;
  $('search').hidden = false;
  $('search-q').value = '';
  renderResults();
  $('search-q').focus();
}

function closeSearch() {
  if (!searching()) return;
  $('search').hidden = true;
  $('stage-wrap').hidden = false;
  updateMore();
}

// Enter opens the first result; ↓ / ↑ move through them.
function onSearchKey(e) {
  lastInteract = Date.now();
  e.stopPropagation(); // Esc closes the search, not the whole card
  const buttons = [...$('results').querySelectorAll('button.n-result')];
  const i = buttons.indexOf(document.activeElement);
  if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
  else if (e.key === 'Enter' && e.target === $('search-q')) { e.preventDefault(); buttons[0]?.click(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); (buttons[i + 1] || buttons[0])?.focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); (i <= 0 ? $('search-q') : buttons[i - 1]).focus(); }
}

// ── Actions ─────────────────────────────────────────────────────────────────

const post = (path, body = {}) =>
  fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {});

function backToAgent() {
  post('/api/back-to-agent');
  setOpen(false);
}

// Hide (or Esc): fold back into the notch. During a turn it stays folded until
// the next one; hovering the notch still brings it back to peek.
function hide() {
  if (agent.status === 'working' || agent.status === 'needs_you') dismissed = agent.turn_started_at;
  setOpen(false);
}

// "scroll ↓" and a soft fade while more of the ayah is below.
function updateMore() {
  const s = $('stage');
  $('stage-wrap').classList.toggle('more', s.scrollHeight - s.clientHeight - s.scrollTop > 4);
}

function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (searching()) return; // the search box has its own keys (onSearchKey)
  lastInteract = Date.now();
  const k = e.key;
  const alert = $('alert').classList.contains('show');
  if ((k === ' ' || k === 'Enter') && alert && canSwitch && !e.target.closest?.('button')) {
    e.preventDefault();
    return backToAgent();
  }
  if (k === 'Escape') {
    e.preventDefault();
    return hide();
  }
  // Arabic reads right-to-left, so ← moves forward.
  if (k === 'ArrowLeft' || k === 'j' || k === ' ') { e.preventDefault(); step(1); }
  else if (k === 'ArrowRight' || k === 'k') { e.preventDefault(); step(-1); }
  else if (k === 'g' || k === '/') { e.preventDefault(); openSearch(); }
}

// After a plugin update: new page code, and a new host if its source changed.
function checkVersion(snap) {
  if (snap.notchBuild && BUILD && snap.notchBuild !== BUILD) {
    post('/api/surface/relaunch').then(() => send({ type: 'quit' }));
    return true;
  }
  if (!snap.version || snap.version === VERSION) return false;
  const key = `quran-turn:reloaded-for:${snap.version}`;
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
  } catch {}
  location.reload();
  return true;
}

function applySnapshot(snap) {
  if (checkVersion(snap)) return;
  // Switched to the window reader (`quran-turn surface window`): step aside.
  if (snap.surface && snap.surface !== 'notch') return send({ type: 'quit' });
  agent = snap.agent || agent;
  canSwitch = Boolean(snap.canSwitch);
  const p = snap.position;
  if (quran && pendingSaves === 0 && valid(p) && (p.surah !== pos.surah || p.ayah !== pos.ayah)) {
    pos = { surah: p.surah, ayah: p.ayah };
    renderAyah();
  }
  renderStatus();
  followTurn();
}

async function init() {
  const nw = Number(params.get('nw')) || 0;
  const nh = Number(params.get('nh')) || 32;
  document.documentElement.style.setProperty('--nw', `${Math.max(0, Math.min(400, nw))}px`);
  document.documentElement.style.setProperty('--nh', `${Math.max(24, Math.min(60, nh))}px`);
  if (params.get('host') === 'win') document.body.classList.add('host-win');
  // A fixed card: a fifth of the screen's height (within sensible limits).
  const cardH = Math.round(Math.max(190, Math.min(MAX_HEIGHT, (screen.height || 1000) * 0.2)));
  document.documentElement.style.setProperty('--card-h', `${cardH}px`);

  $('next').addEventListener('click', () => step(1));
  $('prev').addEventListener('click', () => step(-1));
  $('hide').addEventListener('click', hide);
  $('search-btn').addEventListener('click', () => (searching() ? closeSearch() : openSearch()));
  $('search-close').addEventListener('click', closeSearch);
  $('search-q').addEventListener('input', () => { lastInteract = Date.now(); renderResults(); });
  $('search-form').addEventListener('submit', (e) => e.preventDefault());
  $('search').addEventListener('keydown', onSearchKey);
  $('back').addEventListener('click', backToAgent);
  $('stage').addEventListener('scroll', updateMore, { passive: true });
  document.addEventListener('keydown', onKey);
  new ResizeObserver(() => { updateMore(); reportHeight(); }).observe($('card'));

  try {
    quran = await loadText();
  } catch (err) {
    return fail(err);
  }
  try {
    const snap = await (await fetch('/api/state', { cache: 'no-store' })).json();
    if (valid(snap.position)) pos = { surah: snap.position.surah, ayah: snap.position.ayah };
    agent = snap.agent;
    canSwitch = Boolean(snap.canSwitch);
    // Whatever is happening when we come up is not a change: don't drop the
    // curtain for an old finished turn, but do for one in progress.
    lastStatus = agent.status === 'done' ? 'done' : null;
    lastTurnKey = agent.status === 'done' ? agent.last_turn?.ended_at : null;
    if (!snap.position?.updated_at) showStart();
  } catch {}
  renderAyah();
  renderStatus();
  send({ type: 'ready' });
  // Keep the "4m" beside the notch current while the agent works.
  setInterval(() => { if (agent.status === 'working' || agent.status === 'needs_you') renderStatus(); }, 20_000);

  const events = new EventSource('/api/events?surface=notch');
  let lostSince = 0;
  events.onopen = () => { lostSince = 0; };
  events.onmessage = (e) => { try { applySnapshot(JSON.parse(e.data)); } catch {} };
  // The server went away for good (uninstalled, stopped): the host quits too.
  events.onerror = () => {
    lostSince ||= Date.now();
    if (Date.now() - lostSince > 120_000) send({ type: 'quit' });
  };
}

// Read by the host when QURAN_NOTCH_DEBUG=1 (see native/QuranNotch.swift).
window.__notchDebug = () => ({ open, openedBy, hovering, waitForLeave, status: agent.status, lastStatus, closing: closeTimer !== null });

// Exposed for tests: walk ayat through the same verified path.
window.__quranTurn = {
  get quran() { return quran; },
  show(surah, ayah) { pos = { surah, ayah }; renderAyah(); return $('ayah-text').textContent; },
};

init();
