import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

// Development only; the generated JavaScript ships without a TypeScript runtime.
const require = createRequire(new URL('../../openrosary-web/package.json', import.meta.url));
const ts = require('typescript');
for (const [source, target] of [['prayers', 'prayers'], ['rosaryState', 'rosary-sequence']]) {
  const input = readFileSync(new URL(`../vendor/openrosary/${source}.ts`, import.meta.url), 'utf8');
  const output = ts.transpileModule(input, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText.replace("from './prayers'", "from './prayers.js'");
  writeFileSync(new URL(`../app/${target}.js`, import.meta.url), output);
}
