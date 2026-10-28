// Checks the X-Ray engine port against the app's own golden set
// (scripts/fixtures/engine-golden.json, extracted from the app's unit tests).
import { readFileSync } from 'node:fs';
import { analyzeWithTrace, romanize } from '../src/lib/xray.ts';

const g = JSON.parse(readFileSync(new URL('./fixtures/engine-golden.json', import.meta.url), 'utf8'));
const fails: string[] = [];
for (const c of g.romanization) {
  const r = romanize(c.ko);
  if (r !== c.rom) fails.push(`romanize ${c.ko}: ${r}, expected ${c.rom}`);
}
for (const c of g.pronounced) {
  const p = analyzeWithTrace(c.ko).pronounced;
  if (p !== c.said) fails.push(`pronounce ${c.ko}: ${p}, expected ${c.said}`);
}
if (fails.length) {
  console.error(fails.join('\n'));
  process.exit(1);
}
console.log(`engine: ${g.romanization.length} romanizations and ${g.pronounced.length} pronunciations match the app`);
