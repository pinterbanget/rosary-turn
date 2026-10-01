import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { sequence, MYSTERIES } from '../app/rosary-core.js';
const root = new URL('..', import.meta.url);
const checksums = JSON.parse(readFileSync(new URL('vendor/openrosary/checksums.json', root)));
for (const [path, expected] of Object.entries(checksums)) {
  const bytes = readFileSync(new URL(path, root));
  const content = path.endsWith('.woff2') ? bytes : bytes.toString('utf8').replaceAll('\r\n', '\n');
  const actual = createHash('sha256').update(content).digest('hex');
  assert.equal(actual, expected, `Source snapshot changed: ${path}`);
}
for (const mystery of MYSTERIES) for (const language of ['en', 'id']) {
  const state = sequence({ mystery, language, prayerLanguage: language, step: 0 });
  let count = 0;
  while (!state.isComplete()) { assert.ok(state.getCurrentPrayerText().length > 0); state.advance(); count++; }
  assert.equal(count, language === 'id' ? 81 : 80);
}
assert.equal(readFileSync(new URL('app/index.html', root), 'utf8'), readFileSync(new URL('app/notch.html', root), 'utf8'));
console.log('OpenRosary source checksums, complete prayer sequences, and curtain entry verified.');
