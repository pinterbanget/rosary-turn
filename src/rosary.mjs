import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version;
export function compareVersions(a, b) {
  const parse = v => /^\d+\.\d+\.\d+$/.test(String(v)) ? String(v).split('.').map(Number) : [-1, -1, -1];
  const x = parse(a), y = parse(b);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}
