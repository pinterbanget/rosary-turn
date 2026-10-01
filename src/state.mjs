import { appendFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { calendarDay, reference, suggestedMystery, validPosition } from '../app/rosary-core.js';

export const home = () => process.env.ROSARY_TURN_HOME || join(homedir(), '.rosary-turn');
const DEFAULTS = {
  'state.json': { mystery: null, step: 0, language: 'en', prayerLanguage: 'en', day: null, updated_at: null, revision: 0 },
  'agent.json': { status: 'idle' },
  'config.json': { enabled: true, autoOpen: true, autoSwitch: true, surface: 'auto', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
};
export function readJson(name) {
  try { return { ...DEFAULTS[name], ...JSON.parse(readFileSync(join(home(), name), 'utf8')) }; }
  catch { return { ...DEFAULTS[name] }; }
}
export function writeJson(name, value) {
  mkdirSync(home(), { recursive: true });
  const path = join(home(), name), tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  renameSync(tmp, path);
}
export function readSessions() {
  try { return readFileSync(join(home(), 'sessions.jsonl'), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)); }
  catch { return []; }
}
export function logError(error) {
  try {
    mkdirSync(home(), { recursive: true });
    appendFileSync(join(home(), 'error.log'), `${new Date().toISOString()} ${error?.stack || error}\n`);
  } catch {}
}
// Change days at the start of a turn, never halfway through an active Rosary.
export function ensureDailyPosition(now = new Date(), { startTurn = false } = {}) {
  const saved = readJson('state.json');
  const day = calendarDay(now, readJson('config.json').timeZone);
  if (validPosition(saved) && (saved.day === day || !startTurn)) return saved;
  const language = saved.language === 'id' ? 'id' : 'en';
  const position = { mystery: suggestedMystery(day), step: 0, language, prayerLanguage: saved.prayerLanguage === 'la' ? 'la' : language, day, updated_at: null, revision: (saved.revision || 0) + 1 };
  writeJson('state.json', position);
  return position;
}
export function setPosition(input) {
  const next = validPosition(input);
  if (!next) throw new Error('invalid Rosary position');
  const prev = ensureDailyPosition();
  const position = { ...next, day: prev.day, updated_at: new Date().toISOString(), revision: (prev.revision || 0) + 1 };
  writeJson('state.json', position);
  const agent = readJson('agent.json');
  if (agent.status === 'working' && next.mystery === prev.mystery && next.language === prev.language && next.step === prev.step + 1) {
    agent.prayers = (agent.prayers || 0) + 1;
    writeJson('agent.json', agent);
  }
  return { position, agent };
}
function finishTurn(agent, interrupted = false) {
  const entry = { started_at: agent.turn_started_at, ended_at: new Date().toISOString(), from: agent.turn_from, to: reference(readJson('state.json')), prayers: agent.prayers || 0, agent: agent.agent };
  if (interrupted) entry.interrupted = true;
  mkdirSync(home(), { recursive: true });
  appendFileSync(join(home(), 'sessions.jsonl'), JSON.stringify(entry) + '\n');
  return entry;
}
export function applyHook(event, { agent: name = 'claude', session_id = null, host = null, now = new Date() } = {}) {
  let agent = readJson('agent.json');
  if (!readJson('config.json').enabled) return agent;
  const active = ['working', 'needs_you'].includes(agent.status);
  const sameSession = !session_id || !agent.session_id || agent.session_id === session_id;
  if (event === 'start') {
    if (!readJson('config.json').enabled) return agent;
    const last_turn = active ? finishTurn(agent, true) : agent.last_turn;
    const position = ensureDailyPosition(now, { startTurn: true });
    agent = { status: 'working', agent: name, host, session_id, turn_started_at: now.toISOString(), turn_from: reference(position), prayers: 0, last_turn };
  } else if (event === 'needs-you') {
    if (agent.status !== 'working' || !sameSession) return agent;
    agent = { ...agent, status: 'needs_you' };
  } else if (event === 'resume') {
    if (agent.status !== 'needs_you' || !sameSession) return agent;
    agent = { ...agent, status: 'working' };
  } else if (event === 'stop') {
    if (!active || !sameSession) return agent;
    agent = { status: 'done', agent: agent.agent, host: agent.host, last_turn: finishTurn(agent) };
  } else throw new Error(`Unknown hook event: ${event}`);
  writeJson('agent.json', agent);
  return agent;
}
