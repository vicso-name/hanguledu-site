// Build time only: which Korean strings have a clip in public/audio/ko/.
import { readdirSync } from 'node:fs';

const files = new Set(readdirSync('public/audio/ko'));

export const clipName = (ko: string) => [...ko].map((c) => c.codePointAt(0)!.toString(16).padStart(4, '0')).join('_') + '.mp3';

export const hasClip = (ko: string) => files.has(clipName(ko));
