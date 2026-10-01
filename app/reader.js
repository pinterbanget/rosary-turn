import { MYSTERIES, changeLanguage, sequence, suggestedMystery, calendarDay } from './rosary-core.js';

const $ = id => document.getElementById(id);
const notch = location.pathname === '/notch.html';
if (notch) { document.documentElement.dataset.surface = 'notch'; document.title = 'Rosary Turn notch'; }
let position, agent = { status: 'idle' }, canSwitch = false;
let saving = Promise.resolve(), pending = 0, dirty = false, lastStatus, lastTurn, open = false, hovered = false, dismissed, closeTimer;
let snapshotVersion, hostBuild, connected = true;
const native = window.webkit?.messageHandlers?.notch;
const names = { claude: 'Claude', codex: 'Codex' };
const idNames = { joyful: 'gembira', luminous: 'terang', sorrowful: 'sedih', glorious: 'mulia' };
async function post(path, body) {
  const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function send(message) {
  if (!notch) return;
  if (native) native.postMessage(message);
  else post('/api/surface', message).catch(() => {});
}
function setOpen(on, focus = false) {
  clearTimeout(closeTimer);
  if (on) {
    send({ type: 'height', value: 420, chrome: Math.max(0, window.outerHeight - window.innerHeight) });
    if (!open || focus) send({ type: 'open', focus });
  } else if (open) send({ type: 'close' });
  open = on;
}
window.__notch = event => {
  if (event === 'hover-in') { hovered = true; setOpen(true); }
  if (event === 'hover-out') { hovered = false; if (agent.status === 'done' || agent.status === 'idle') closeTimer = setTimeout(() => setOpen(false), 700); }
  if (event === 'click') setOpen(true, true);
};
document.documentElement.addEventListener('mouseenter', () => { hovered = true; clearTimeout(closeTimer); });
document.documentElement.addEventListener('mouseleave', () => { hovered = false; if (notch && ['done', 'idle'].includes(agent.status)) closeTimer = setTimeout(() => setOpen(false), 700); });
function statusText() {
  if (!connected) return 'session disconnected · reconnecting…';
  const name = names[agent.agent] || 'Agent';
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(agent.turn_started_at)) / 60000));
  if (agent.status === 'working') return `${name} is working · ${minutes < 1 ? '<1 min' : `${minutes} min`}`;
  if (agent.status === 'needs_you') return `${name} needs you · your prayer is saved`;
  if (agent.status === 'done') return `${name} finished · saved at ${agent.last_turn?.to || position?.mystery}`;
  return 'ready for your next coding session';
}
function renderStatus() {
  $('agent-status').textContent = statusText();
  document.querySelector('.agent-strip').dataset.status = agent.status;
  $('back-agent').hidden = !canSwitch;
  $('back-agent').textContent = `back to ${names[agent.agent] || 'agent'}`;
  $('dismiss').hidden = !notch;
  if (!notch) return;
  send({ type: 'status', value: agent.status });
  const turn = agent.turn_started_at || agent.last_turn?.ended_at;
  if (lastStatus !== agent.status || lastTurn !== turn) {
    if (['working', 'needs_you'].includes(agent.status) && dismissed !== agent.turn_started_at) setOpen(true);
    else if (agent.status === 'done' && !hovered) closeTimer = setTimeout(() => setOpen(false), 1800);
    lastStatus = agent.status; lastTurn = turn;
  }
}
function render() {
  if (!position) return;
  const state = sequence(position), id = position.language === 'id';
  document.documentElement.lang = position.language;
  $('language-en').setAttribute('aria-pressed', String(!id));
  $('language-id').setAttribute('aria-pressed', String(id));
  $('latin').checked = position.prayerLanguage === 'la';
  $('options-label').textContent = id ? 'opsi' : 'options';
  $('language-label').textContent = id ? 'bahasa' : 'language';
  $('latin-label').textContent = id ? 'doa Latin' : 'Latin prayers';
  $('theme-label').textContent = id ? 'tema' : 'theme';
  $('mystery-title').textContent = state.getCurrentMysteryTitle() || (id ? 'Peristiwa ' : '') + state.getMysteryType() + (id ? '' : ' Mysteries');
  $('prayer-label').textContent = state.getCurrentPrayerLabel();
  $('prayer-text').textContent = state.getCurrentPrayerText();
  $('prayer-text').lang = state.getCurrentPrayerLabel().startsWith(id ? 'Peristiwa #' : 'Mystery #') ? position.language : position.prayerLanguage;
  $('progress-fill').style.transform = `scaleX(${position.step / state.getMaxCount()})`;
  $('progress-text').textContent = `${position.step}/${state.getMaxCount()}`;
  $('progress').setAttribute('aria-valuemax', state.getMaxCount());
  $('progress').setAttribute('aria-valuenow', position.step);
  $('prev').disabled = position.step === 0;
  $('next').disabled = state.isComplete();
  $('prev').textContent = id ? 'kembali' : 'previous';
  $('next').textContent = id ? 'lanjut' : 'next';
  $('choose').textContent = id ? '← peristiwa' : '← mysteries';
  $('instructions').textContent = id ? 'kiri/kanan: navigasi · atas/bawah: gulir' : 'left/right: navigate · up/down: scroll';
  $('completion').hidden = !state.isComplete();
  $('completion-text').textContent = id ? 'Rosario selesai. Tuhan memberkati Anda.' : 'Rosary complete. God bless you.';
  $('restart').textContent = id ? 'berdoa lagi' : 'pray again';
  $('resume').textContent = id ? 'lanjutkan doa' : 'resume prayer';
  $('tagline').textContent = id ? 'alat doa rosario sederhana berbasis web.' : 'a simple web-based rosary tool.';
  $('theme').textContent = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  const today = suggestedMystery(calendarDay());
  $('suggestion').replaceChildren(document.createTextNode(id ? 'saran hari ini: ' : "today's suggestion: "));
  const accent = document.createElement('span'); accent.className = 'accent'; accent.textContent = id ? idNames[today] : today; $('suggestion').append(accent);
  $('mysteries').replaceChildren(...MYSTERIES.map(mystery => {
    const button = document.createElement('button'); button.className = `mystery-btn${today === mystery ? ' suggested' : ''}`;
    button.textContent = id ? idNames[mystery] : mystery;
    button.addEventListener('click', () => { go({ ...position, mystery, step: 0 }); showReader(); });
    return button;
  }));
  renderStatus();
}
function showError(message) { $('error-text').textContent = message; $('save-error').hidden = false; }
function save(next) {
  dirty = true; pending++;
  saving = saving.catch(() => {}).then(() => post('/api/position', next)).then(snap => {
    agent = snap.agent;
    if (pending === 1) { position = snap.position; dirty = false; $('save-error').hidden = true; render(); }
    renderStatus();
  }).catch(() => { showError('Your place could not be saved. Keep this window open and retry.'); }).finally(() => { pending--; });
}
function go(next) { position = { ...next, revision: (position?.revision || 0) + 1 }; render(); $('prayer-pane').scrollTop = 0; save({ ...position }); }
function step(delta) {
  if (!position || !$('selection').hidden) return;
  const max = sequence(position).getMaxCount();
  const next = Math.max(0, Math.min(max, position.step + delta));
  if (next === position.step) return;
  go({ ...position, step: next });
  if (navigator.vibrate) navigator.vibrate(delta < 0 ? [30, 50, 30] : 30);
}
function showReader() { $('preferences').open = false; $('selection').hidden = true; $('reader').hidden = false; $('choose').focus(); }
$('prev').addEventListener('click', () => step(-1));
$('next').addEventListener('click', () => step(1));
$('restart').addEventListener('click', () => { go({ ...position, step: 0 }); $('next').focus(); });
$('choose').addEventListener('click', () => { $('preferences').open = false; $('reader').hidden = true; $('selection').hidden = false; $('mysteries').firstElementChild?.focus(); });
$('resume').addEventListener('click', showReader);
for (const language of ['en', 'id']) $('language-' + language).addEventListener('click', () => { if (position) go(changeLanguage(position, language)); });
$('latin').addEventListener('change', event => { if (position) go({ ...position, prayerLanguage: event.target.checked ? 'la' : position.language }); });
$('retry').addEventListener('click', () => { if (position) save({ ...position }); else location.reload(); });
$('theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  const apply = () => { document.documentElement.dataset.theme = next; render(); };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply); else apply();
  try { localStorage.setItem('openrosary-theme', next); } catch {}
});
async function backToAgent() { await saving; await post('/api/back-to-agent', {}); setOpen(false); }
$('back-agent').addEventListener('click', () => backToAgent().catch(() => showError('Could not switch apps. Return to your agent manually.')));
$('dismiss').addEventListener('click', () => { dismissed = agent.turn_started_at; setOpen(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && $('preferences').open) { event.preventDefault(); $('preferences').open = false; $('preferences-toggle').focus(); return; }
  if (event.target.closest('textarea,input:not([type="checkbox"])')) return;
  if (event.key === 'Escape' && notch) { dismissed = agent.turn_started_at; setOpen(false); }
  if (event.code === 'Space' && !event.target.closest('button,a') && canSwitch && ['needs_you', 'done'].includes(agent.status)) { event.preventDefault(); backToAgent().catch(() => {}); return; }
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
  if (['ArrowUp', 'ArrowDown'].includes(event.key) && $('selection').hidden) {
    event.preventDefault();
    $('prayer-pane').scrollBy({ top: event.key === 'ArrowDown' ? 60 : -60, behavior: 'instant' });
  }
});
document.addEventListener('click', event => { if (!$('preferences').contains(event.target)) $('preferences').open = false; });
document.addEventListener('focusin', event => { if (!$('preferences').contains(event.target)) $('preferences').open = false; });
let touchStart;
$('reader').addEventListener('touchstart', event => { touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }, { passive: true });
$('reader').addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = touchStart.x - event.changedTouches[0].clientX, dy = touchStart.y - event.changedTouches[0].clientY;
  touchStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? 1 : -1);
}, { passive: true });
function accept(snap) {
  if (snapshotVersion && snap.version !== snapshotVersion && !pending && !dirty) location.reload();
  if (notch && hostBuild && snap.notchBuild !== hostBuild) { send({ type: 'quit' }); post('/api/surface/relaunch', {}).catch(() => {}); }
  snapshotVersion = snap.version; hostBuild = snap.notchBuild;
  agent = snap.agent; canSwitch = snap.canSwitch;
  if (!pending && !dirty && (!position || (snap.position.revision || 0) >= (position.revision || 0))) { const changed = !position || position.step !== snap.position.step || position.mystery !== snap.position.mystery; position = snap.position; render(); if (changed) $('prayer-pane').scrollTop = 0; }
  else renderStatus();
}
try {
  const initial = await fetch('/api/state');
  if (!initial.ok) throw new Error('state unavailable');
  accept(await initial.json());
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  await post('/api/config', { timeZone });
  const events = new EventSource(`/api/events${notch ? '?surface=notch' : ''}`);
  events.onmessage = event => { try { connected = true; accept(JSON.parse(event.data)); } catch { showError('Could not load your prayer. Reload this window.'); } };
  events.onerror = () => { connected = false; renderStatus(); };
} catch { showError('Could not connect to Rosary Turn. Start the local server and retry.'); }
setInterval(renderStatus, 15000);
window.addEventListener('beforeunload', event => { if (dirty || pending) { event.preventDefault(); event.returnValue = ''; } });
