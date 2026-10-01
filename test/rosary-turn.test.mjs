import assert from 'node:assert/strict';
import { test, beforeEach, after } from 'node:test';
import { mkdtempSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { MYSTERIES, calendarDay, changeLanguage, sequence, suggestedMystery, validPosition } from '../app/rosary-core.js';
import { getPrayers, getMysteries } from '../app/prayers.js';
import { applyHook, ensureDailyPosition, readJson, readSessions, setPosition, writeJson } from '../src/state.mjs';
import { startServer } from '../src/server.mjs';

const originalHome = process.env.ROSARY_TURN_HOME;
const folders = [];
beforeEach(() => {
  const folder = mkdtempSync(join(tmpdir(), 'rosary-turn-test-'));
  folders.push(folder); process.env.ROSARY_TURN_HOME = folder;
  writeJson('config.json', { enabled: true, autoOpen: false, autoSwitch: false, surface: 'window', timeZone: 'Asia/Bangkok' });
});
after(() => {
  if (originalHome === undefined) delete process.env.ROSARY_TURN_HOME; else process.env.ROSARY_TURN_HOME = originalHome;
  for (const folder of folders) rmSync(folder, { recursive: true, force: true });
});
const position = (overrides = {}) => ({ mystery: 'luminous', step: 0, language: 'en', prayerLanguage: 'en', ...overrides });

test('suggested days match OpenRosary, including its seasonal Sunday rules', () => {
  const expected = ['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'];
  for (let i = 0; i < 7; i++) assert.equal(suggestedMystery(`2026-10-${String(4 + i).padStart(2, '0')}`), expected[i]);
  assert.equal(suggestedMystery('2026-12-06'), 'joyful');
  assert.equal(suggestedMystery('2026-03-01'), 'sorrowful');
});
test('calendar uses local timezone at day and DST boundaries', () => {
  assert.equal(calendarDay(new Date('2026-09-30T18:00:00Z'), 'Asia/Bangkok'), '2026-10-01');
  assert.equal(calendarDay(new Date('2026-09-30T18:00:00Z'), 'America/Los_Angeles'), '2026-09-30');
  assert.equal(calendarDay(new Date('2026-11-01T08:30:00Z'), 'America/Los_Angeles'), '2026-11-01');
});
test('all mystery sets have five real Scripture readings', () => {
  for (const mystery of MYSTERIES) for (const lang of ['en', 'id']) {
    const readings = getMysteries(mystery, lang);
    assert.equal(readings.length, 5);
    for (const reading of readings) { assert.ok(reading.title.length > 3); assert.ok(reading.description.length > 50); }
  }
});
test('full sequence has 53 Hail Marys, five decades, opening and concluding cross', () => {
  for (const lang of ['en', 'id']) for (const mystery of MYSTERIES) {
    const state = sequence(position({ mystery, language: lang, prayerLanguage: lang }));
    const labels = [], texts = [];
    while (!state.isComplete()) { labels.push(state.getCurrentPrayerLabel()); texts.push(state.getCurrentPrayerText()); state.advance(); }
    assert.equal(labels.length, lang === 'id' ? 81 : 80);
    assert.equal(labels.filter(label => label.startsWith(lang === 'id' ? 'Salam Maria' : 'Hail Mary')).length, 53);
    assert.equal(labels.filter(label => label.startsWith(lang === 'id' ? 'Peristiwa #' : 'Mystery #')).length, 5);
    assert.equal(texts[0], getPrayers(lang).signOfCross);
    assert.equal(texts.at(-1), getPrayers(lang).signOfCross);
    state.goBack(); assert.equal(state.getCurrentPrayerText(), getPrayers(lang).signOfCross);
  }
});
test('Latin changes prayer text while readings and UI stay in the selected language', () => {
  assert.equal(sequence(position({ prayerLanguage: 'la' })).getCurrentPrayerText(), getPrayers('la').signOfCross);
  const state = sequence(position({ step: 7, prayerLanguage: 'la' }));
  assert.equal(state.getCurrentPrayerText(), getMysteries('luminous', 'en')[0].description);
  assert.equal(state.getCurrentPrayerLabel(), 'Mystery #1');
});
test('language switch preserves the current bead across the Indonesian extra prayer', () => {
  const english = position({ step: 10 });
  const indonesian = changeLanguage(english, 'id');
  assert.equal(indonesian.step, 11);
  assert.equal(sequence(english).getCurrentPrayerLabel().match(/\(.*\)/)[0], sequence(indonesian).getCurrentPrayerLabel().match(/\(.*\)/)[0]);
  assert.equal(changeLanguage(indonesian, 'en').step, 10);
});
test('rejects invalid positions and conflicting vernacular language', () => {
  for (const bad of [{ step: -1 }, { step: 81 }, { step: 1.2 }, { mystery: 'other' }, { language: 'fr' }, { prayerLanguage: 'id' }]) assert.equal(validPosition(position(bad)), null);
  assert.ok(validPosition(position({ step: 81, language: 'id', prayerLanguage: 'la' })));
});
test('saved positions have increasing revisions so delayed events cannot roll them back', () => {
  const first = ensureDailyPosition();
  const second = setPosition({ ...first, step: 1 }).position;
  const third = setPosition({ ...second, prayerLanguage: 'la' }).position;
  assert.equal(second.revision, first.revision + 1);
  assert.equal(third.revision, second.revision + 1);
});
test('successive coding turns resume; the next day selects its suggested mystery', () => {
  const firstDay = new Date('2026-10-01T03:00:00Z');
  applyHook('start', { now: firstDay, session_id: 'one', agent: 'codex' });
  assert.equal(readJson('state.json').mystery, 'luminous');
  setPosition(position({ step: 4 }));
  applyHook('stop', { session_id: 'one' });
  applyHook('start', { now: firstDay, session_id: 'two' });
  assert.equal(readJson('state.json').step, 4);
  applyHook('stop', { session_id: 'two' });
  applyHook('start', { now: new Date('2026-10-02T03:00:00Z'), session_id: 'three' });
  assert.equal(readJson('state.json').mystery, 'sorrowful');
  assert.equal(readJson('state.json').step, 0);
});
test('midnight never resets an active prayer or its final saved position', () => {
  applyHook('start', { now: new Date('2026-10-01T16:00:00Z') });
  setPosition(position({ step: 24 }));
  assert.equal(ensureDailyPosition(new Date('2026-10-01T18:00:00Z')).step, 24);
  applyHook('stop');
  assert.equal(ensureDailyPosition(new Date('2026-10-01T18:00:00Z')).step, 24);
});
test('permission/resume/stop respects session IDs and writes one final log', () => {
  applyHook('start', { agent: 'codex', session_id: 'a' });
  const p = readJson('state.json');
  setPosition({ ...p, step: 1 });
  applyHook('needs-you', { session_id: 'b' }); assert.equal(readJson('agent.json').status, 'working');
  applyHook('needs-you', { session_id: 'a' }); assert.equal(readJson('agent.json').status, 'needs_you');
  applyHook('resume', { session_id: 'a' }); assert.equal(readJson('agent.json').status, 'working');
  applyHook('stop', { session_id: 'b' }); assert.equal(readSessions().length, 0);
  applyHook('stop', { session_id: 'a' }); applyHook('stop', { session_id: 'a' });
  assert.equal(readSessions().length, 1); assert.equal(readSessions()[0].prayers, 1);
});
test('disabled and malformed CLI hooks exit successfully without output', () => {
  const env = { ...process.env, ROSARY_TURN_NO_SERVER: '1', ROSARY_TURN_NO_WINDOW: '1' };
  for (const event of ['unknown', 'start', 'needs-you', 'resume', 'stop']) {
    const result = spawnSync(process.execPath, ['bin/rosary-turn', 'hook', event, '--port', '1'], { cwd: new URL('..', import.meta.url), env, input: '{bad json', encoding: 'utf8' });
    assert.equal(result.status, 0); assert.equal(result.stdout, ''); assert.equal(result.stderr, '');
  }
  writeJson('config.json', { ...readJson('config.json'), enabled: false });
  const before = readJson('agent.json'); applyHook('start'); assert.deepEqual(readJson('agent.json'), before);
});
test('a hook without stdin exits naturally after applying its event', () => {
  const env = { ...process.env, ROSARY_TURN_NO_SERVER: '1', ROSARY_TURN_NO_WINDOW: '1' };
  const result = spawnSync(process.execPath, ['bin/rosary-turn', 'hook', 'start', '--port', '1'], {
    cwd: new URL('..', import.meta.url), env, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 5000,
  });
  assert.equal(result.status, 0); assert.equal(result.stdout, ''); assert.equal(result.stderr, '');
  assert.equal(readJson('agent.json').status, 'working');
});
test('server serves offline reader on Windows paths and refuses bad writes', async () => {
  const app = await startServer({ port: 0, idleExit: false, win: { canSwitch: () => false } });
  try {
    const get = path => fetch(app.url + path);
    const post = (path, data, headers = {}) => fetch(app.url + path, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) });
    assert.match(await (await get('')).text(), /OpenRosary/);
    assert.equal((await get('reader.js')).status, 200);
    assert.equal((await get('fonts/Geist.woff2')).status, 200);
    assert.equal((await get('%2e%2e%2fpackage.json')).status, 404);
    assert.equal((await post('api/position', position({ step: -1 }))).status, 400);
    assert.equal((await post('api/position', position(), { origin: 'https://example.com' })).status, 403);
    assert.equal((await post('api/config', { timeZone: 'invalid' })).status, 400);
    assert.equal((await post('api/hook', { event: 'unknown' })).status, 400);
    assert.equal((await post('api/position', position({ step: 33 }))).status, 200);
    assert.equal((await (await get('api/state')).json()).position.step, 33);
    assert.equal((await (await get('api/health')).json()).app, 'rosary-turn');
  } finally { app.close(); }
});
test('both plugin manifests, CLI and hooks use the Rosary package', () => {
  const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const pkg = JSON.parse(read('package.json'));
  for (const path of ['.codex-plugin/plugin.json', '.claude-plugin/plugin.json']) assert.equal(JSON.parse(read(path)).version, pkg.version);
  const hooks = JSON.parse(read('hooks/hooks.json')).hooks;
  for (const event of ['UserPromptSubmit', 'PermissionRequest', 'PostToolUse', 'Stop']) assert.match(hooks[event][0].hooks[0].command, /bin\/rosary-turn/);
  assert.match(read('LICENSE'), /Copyright \(c\) 2026 Rizaldy/);
  assert.equal(read('app/notch.html'), read('app/index.html'));
});
test('live events follow hooks, report saved prayer and open only one reader', async () => {
  writeJson('config.json', { ...readJson('config.json'), autoOpen: true });
  let opens = 0;
  const app = await startServer({ port: 0, idleExit: false, win: { canSwitch: () => false, openWindow: () => { opens++; }, readerWindow: async () => null } });
  const post = async event => {
    const response = await fetch(app.url + 'api/hook', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event, session_id: 'live', agent: 'codex' }) });
    assert.equal(response.status, 200);
    return response.json();
  };
  let reader;
  try {
    await post('start');
    const response = await fetch(app.url + 'api/events');
    reader = response.body.getReader();
    const initial = new TextDecoder().decode((await reader.read()).value);
    assert.match(initial, /"status":"working"/);
    assert.equal(opens, 1);
    await post('needs-you');
    assert.match(new TextDecoder().decode((await reader.read()).value), /"status":"needs_you"/);
    await post('resume');
    assert.match(new TextDecoder().decode((await reader.read()).value), /"status":"working"/);
    const p = readJson('state.json'); setPosition({ ...p, step: 4 });
    await post('stop');
    assert.match(new TextDecoder().decode((await reader.read()).value), /"status":"done"/);
    assert.match(readSessions()[0].to, /:4\//);
    assert.equal(opens, 1);
  } finally { if (reader) await reader.cancel(); app.close(); }
});
test('installed hook commands run in the real platform shell from a path with spaces', () => {
  const pluginRoot = mkdtempSync(join(tmpdir(), 'rosary turn plugin ')); folders.push(pluginRoot);
  for (const path of ['app', 'src', 'bin', 'native', 'package.json']) cpSync(new URL(`../${path}`, import.meta.url), join(pluginRoot, path), { recursive: true });
  const hooks = JSON.parse(readFileSync(new URL('../hooks/hooks.json', import.meta.url))).hooks;
  for (const rootEnv of ['PLUGIN_ROOT', 'CLAUDE_PLUGIN_ROOT']) {
    const env = { ...process.env, ROSARY_TURN_NO_SERVER: '1', ROSARY_TURN_NO_WINDOW: '1', ROSARY_TURN_PORT: '1' };
    delete env.PLUGIN_ROOT; delete env.CLAUDE_PLUGIN_ROOT; env[rootEnv] = pluginRoot;
    for (const [event, expected] of [['UserPromptSubmit', 'working'], ['PermissionRequest', 'needs_you'], ['PostToolUse', 'working'], ['Stop', 'done']]) {
      const command = hooks[event][0].hooks[0].command;
      const shell = process.platform === 'win32' ? 'powershell.exe' : '/bin/sh';
      const args = process.platform === 'win32' ? ['-NoProfile', '-Command', command] : ['-c', command];
      const result = spawnSync(shell, args, { env, input: JSON.stringify({ session_id: 'shell-test' }), encoding: 'utf8', windowsHide: true });
      assert.equal(result.status, 0, result.stderr); assert.equal(result.stdout, ''); assert.equal(result.stderr, '');
      assert.equal(readJson('agent.json').status, expected);
    }
  }
});
