// Phrases from the Hangul Hero app (src/data/app/phrases.json, synced by
// `npm run sync:app`), with the X-Ray worked out at build time by the same
// engine as the app. Pages read phrases from here and never edit them.
import app from './app/phrases.json';
import { analyzeWithTrace, romanize, romanizePronounced, romanizeSyllables, soundChanges, RULE_LINE, RULE_SHEET, RULE_TAG, type RuleId } from '../lib/xray';
import { hasClip } from '../lib/audio-index';
import { existsSync } from 'node:fs';
import type { IconName } from './icons';

export type Register = 'casual' | 'polite' | 'formal';

export interface Pack { id: string; title: string; icon: IconName; description: string; free: boolean }

export interface Syl { k: string; hit: boolean; space: boolean; rom: string; jamo: string }

export interface XChange { n: number; before: string; after: string; tag: string; line: string; sheets: { title: string; text: string }[] }

export interface XPhrase {
  id: string;
  ko: string;
  en: string;
  register: Register;
  situation: string;
  pack?: Pack;
  parts: { ko: string; gloss: string }[];
  literal?: string;
  /** Revised Romanization of how it is said (the app's standard). */
  rom: string;
  said: string;
  written: Syl[];
  spoken: Syl[];
  changes: XChange[];
  /** The app's own note when the engine cannot see the rule (pronunciationOverride). */
  note?: string;
  /** /audio/… URL, or null when no clip exists yet. */
  audio: string | null;
}

// The app marks packs with emoji; the site draws a Material Symbol instead.
const PACK_ICON: Record<string, IconName> = {
  kdrama: 'movie', food: 'ramen_dining', around: 'directions_subway', shopping: 'shopping_bag',
  feelings: 'chat_bubble', love: 'favorite', health: 'stethoscope', work: 'work',
};
export const PACKS: Pack[] = app.packs.map((p) => ({ id: p.id, title: p.title, icon: PACK_ICON[p.id], description: p.description, free: !!p.free }));
const packBy = Object.fromEntries(PACKS.map((p) => [p.id, p]));

export const REGISTER_LABEL: Record<Register, string> = { casual: 'Casual', polite: 'Polite', formal: 'Formal' };
export const REGISTER_WHO: Record<Register, string> = {
  casual: 'Friends, partners, younger people',
  polite: 'Strangers, staff, most adults',
  formal: 'Bosses, ceremonies, announcements',
};

const COMPOUND: Record<string, string> = { ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ', ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ' };
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

/** The letters of a syllable as a visitor learns them: compound finals split (닭 → ㄷㅏㄹㄱ). */
function letters(c: string): string {
  const n = c.codePointAt(0)! - 0xac00;
  if (n < 0 || n > 11171) return '';
  const b = JONG[n % 28];
  return CHO[Math.floor(n / 588)] + JUNG[Math.floor((n % 588) / 28)] + (COMPOUND[b] ?? b);
}

function syllables(text: string, other: string, said: string): Syl[] {
  const a = [...text], o = [...other], r = romanizeSyllables(said);
  return a.map((k, i) => ({
    k,
    space: /\s/.test(k),
    hit: !/\s/.test(k) && o[i] !== undefined && o[i] !== k,
    rom: letters(k) && r.length === a.length ? r[i] : '',
    jamo: letters(k),
  }));
}

/** A clip for this text: the app's phrase clip, else a clip in public/audio/ko/ (letters, words, later TTS). */
function audioFor(id: string | undefined, ko: string): string | null {
  if (id && existsSync(`public/audio/phrases/${id}.mp3`)) return `/audio/phrases/${id}.mp3`;
  if (hasClip(ko)) return '/audio/ko/' + [...ko].map((c) => c.codePointAt(0)!.toString(16).padStart(4, '0')).join('_') + '.mp3';
  return null;
}

export interface XInput {
  id?: string;
  ko: string;
  en: string;
  register: Register;
  situation?: string;
  packId?: string;
  parts?: { ko: string; gloss: string }[];
  literal?: string | null;
  override?: string | null;
  note?: string | null;
}

/** Works out the X-Ray for any Korean phrase: app phrases and page-only forms alike. */
export function xray(p: XInput): XPhrase {
  const override = p.override?.trim() || null;
  const traced = analyzeWithTrace(p.ko);
  const said = override ?? traced.pronounced;
  let changes: XChange[] = [];
  if (!override) {
    changes = soundChanges(p.ko, said, traced.events).map((c, i) => ({
      n: i + 1,
      before: c.before,
      after: c.after,
      tag: c.rules.map((r: RuleId) => RULE_TAG[r]).join(' · '),
      line: c.rules.map((r: RuleId) => RULE_LINE[r]).join('; '),
      sheets: c.rules.map((r: RuleId) => RULE_SHEET[r]),
    }));
  }
  return {
    id: p.id ?? 'web_' + [...p.ko].map((c) => c.codePointAt(0)!.toString(16)).join(''),
    ko: p.ko,
    en: p.en,
    register: p.register,
    situation: p.situation ?? '',
    pack: p.packId ? packBy[p.packId] : undefined,
    parts: p.parts ?? [],
    literal: p.literal ?? undefined,
    rom: override ? romanizePronounced(override).replace(/\s+/g, ' ') : romanize(p.ko),
    said,
    written: syllables(p.ko, said, said),
    spoken: syllables(said, p.ko, said),
    changes,
    note: p.note ?? undefined,
    audio: audioFor(p.id, p.ko),
  };
}

export const PHRASES: XPhrase[] = app.phrases.map((p) =>
  xray({
    id: p.id,
    ko: p.text,
    en: p.translation,
    register: p.register as Register,
    situation: p.situation,
    packId: p.packId,
    parts: p.parts.map((x) => ({ ko: x.text, gloss: x.gloss })),
    literal: p.literal,
    override: p.pronunciationOverride,
    note: p.pronunciationNote,
  }),
);

const byId = Object.fromEntries(PHRASES.map((p) => [p.id, p]));
const byKo = Object.fromEntries(PHRASES.map((p) => [p.ko, p]));

/** An app phrase by id; throws at build time when the app renamed or removed it. */
export function phrase(id: string): XPhrase {
  const p = byId[id];
  if (!p) throw new Error(`No app phrase "${id}"`);
  return p;
}

/** An app phrase when the app has this exact text, else a page-only form worked out by the engine. */
export function form(f: XInput): XPhrase {
  const hit = byKo[f.ko];
  return hit ? { ...hit, en: f.en || hit.en, situation: f.situation ?? hit.situation } : xray(f);
}

export const ofPack = (id: string) => PHRASES.filter((p) => p.pack?.id === id);
