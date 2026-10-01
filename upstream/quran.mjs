import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parseTanzil } from '../app/quran-core.js';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const TEXT_PATH = `${ROOT}data/quran-uthmani.txt`;
export const META_PATH = `${ROOT}data/quran-data.js`;
// The installed plugin's version (package.json), shared by the CLI, hooks and server.
export const VERSION = JSON.parse(readFileSync(`${ROOT}package.json`, 'utf8')).version;

// "0.7.5" vs "0.7.1" → positive when a is newer. Anything unparseable counts as oldest.
export function compareVersions(a, b) {
  const parse = (v) => (/^\d+\.\d+\.\d+$/.test(String(v)) ? String(v).split('.').map(Number) : [-1, -1, -1]);
  const x = parse(a), y = parse(b);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

// Tanzil metadata is a browser script (`var QuranData = {...}`); run it in a sandbox.
export function loadMeta() {
  const ctx = {};
  vm.runInNewContext(readFileSync(META_PATH, 'utf8'), ctx);
  return ctx.QuranData;
}

export function loadQuran() {
  return parseTanzil(readFileSync(TEXT_PATH, 'utf8'));
}

// "Al-Baqara 2:157"
export function formatRef(meta, surah, ayah) {
  return `${meta.Sura[surah][5]} ${surah}:${ayah}`;
}
