// Copies native audio from the Hangul Hero Android app into public/audio/.
// Alphabet clips keep the app's file names: the syllable's code points in hex,
// joined by "_" (가 → ac00.mp3, 기역 → ae30_c5ed.mp3), so src/lib/audio.ts can
// derive a URL from any Korean string. Phrase clips are copied by id.
//   APP_ASSETS=/path/to/app/src/main/assets npm run sync:audio
import { cpSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const assets = process.env.APP_ASSETS ?? join(homedir(), 'Developer/android/hangul_hero/app/src/main/assets');
if (!existsSync(assets)) throw new Error(`App assets not found: ${assets}`);

const PHRASES = ['kdrama/kd_jikyeo_julge', 'love/lv_gobaek', 'work/wk_silsu'];

const ko = 'public/audio/ko';
mkdirSync(ko, { recursive: true });
const src = join(assets, 'alphabet/audio');
const files = readdirSync(src).filter((f) => f.endsWith('.mp3'));
for (const f of files) cpSync(join(src, f), join(ko, f));

const ph = 'public/audio/phrases';
mkdirSync(ph, { recursive: true });
for (const p of PHRASES) cpSync(join(assets, 'phrases/audio', `${p}.mp3`), join(ph, `${p.split('/')[1]}.mp3`));

console.log(`audio: ${files.length} alphabet clips, ${PHRASES.length} phrases`);
