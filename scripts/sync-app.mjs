// Copies content and audio from the Hangul Hero Android app into the site.
//   APP_ASSETS=/path/to/app/src/main/assets npm run sync:app
//
// - alphabet clips → public/audio/ko/, keeping the app's names: the text's code
//   points in hex joined by "_" (가 → ac00.mp3), so src/lib/audio.ts can derive a
//   URL from any Korean string;
// - phrases.json (240 phrases, 8 packs) → src/data/app/phrases.json, unchanged;
// - phrase clips → public/audio/phrases/<phrase id>.mp3.
// The site never edits these files: fix content in the app, then sync.
import { cpSync, mkdirSync, readdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const assets = process.env.APP_ASSETS ?? join(homedir(), 'Developer/android/hangul_hero/app/src/main/assets');
if (!existsSync(assets)) throw new Error(`App assets not found: ${assets}`);

const ko = 'public/audio/ko';
mkdirSync(ko, { recursive: true });
const letters = readdirSync(join(assets, 'alphabet/audio')).filter((f) => f.endsWith('.mp3'));
for (const f of letters) cpSync(join(assets, 'alphabet/audio', f), join(ko, f));

mkdirSync('src/data/app', { recursive: true });
cpSync(join(assets, 'phrases/phrases.json'), 'src/data/app/phrases.json');
const { phrases } = JSON.parse(readFileSync('src/data/app/phrases.json', 'utf8'));

const ph = 'public/audio/phrases';
rmSync(ph, { recursive: true, force: true });
mkdirSync(ph, { recursive: true });
let missing = 0;
for (const p of phrases) {
  const src = join(assets, p.audio);
  if (!existsSync(src)) { missing++; console.warn(`no audio for ${p.id}: ${p.audio}`); continue; }
  cpSync(src, join(ph, `${p.id}.mp3`));
  if (basename(p.audio, '.mp3') !== p.id) console.warn(`audio name differs from id: ${p.id} → ${p.audio}`);
}
console.log(`sync: ${letters.length} letter clips, ${phrases.length} phrases, ${phrases.length - missing} phrase clips`);
