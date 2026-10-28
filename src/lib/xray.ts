// Phrase X-Ray: how written Korean is really said, and which sound rules did it.
// A line-for-line port of the Hangul Hero app's engine
// (feature/sori/HangulDecomposer.kt, phrasexray/domain/PhraseSoundChanges.kt and
// PhrasePronunciation.kt), checked against the app's golden set by
// `npm run test:engine`. Keep the two in step: fix a rule in the app first.
//
// Out of scope, as in the app: rules that need morphology (ㄴ insertion in 꽃잎,
// lexical ㄼ exceptions like 밟다, lexical tensing like 밤길, -ㄹ게 → 께). Phrases
// that hit them carry a pronunciationOverride in the app's content.

export type RuleId =
  | 'LIAISON'
  | 'NEUTRALIZATION'
  | 'CLUSTER'
  | 'NASALIZATION'
  | 'LIQUIDIZATION'
  | 'ASPIRATION'
  | 'H_DELETION'
  | 'PALATALIZATION'
  | 'TENSIFICATION';

export interface ChangeEvent { syllableIndex: number; ruleId: RuleId; before: string; after: string }
export interface Change { range: [number, number]; rules: RuleId[]; before: string; after: string }

const LEAD_ROMAN = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWEL_ROMAN = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];

const L_G = 0, L_N = 2, L_D = 3, L_R = 5, L_M = 6, L_B = 7, L_S = 9, L_NONE = 11;
const L_J = 12, L_CH = 14, L_K = 15, L_T = 16, L_P = 17, L_H = 18;
const T_NONE = 0, T_K = 1, T_N = 4, T_NH = 6, T_D = 7, T_L = 8, T_LT = 13, T_LH = 15;
const T_M = 16, T_P = 17, T_NG = 21, T_TH = 25, T_H = 27;
const V_I = 20;

const NEUTRALIZED: number[] = (() => {
  const a = new Array<number>(28).fill(T_NONE);
  [1, 2, 3, 9, 24].forEach((i) => (a[i] = T_K));
  [4, 5, 6].forEach((i) => (a[i] = T_N));
  [7, 19, 20, 22, 23, 25, 27].forEach((i) => (a[i] = T_D));
  [8, 11, 12, 13, 15].forEach((i) => (a[i] = T_L));
  [10, 16].forEach((i) => (a[i] = T_M));
  [14, 17, 18, 26].forEach((i) => (a[i] = T_P));
  a[21] = T_NG;
  return a;
})();

const CODA_ROMAN: Record<number, string> = { [T_NONE]: '', [T_K]: 'k', [T_N]: 'n', [T_D]: 't', [T_L]: 'l', [T_M]: 'm', [T_P]: 'p', [T_NG]: 'ng' };

/** 연음: [what stays as the final, which onset the next syllable gets]. */
const LINK_SPLIT: Record<number, [number, number]> = {
  1: [T_NONE, L_G], 2: [T_NONE, 1], 3: [T_K, 9], 4: [T_NONE, L_N], 5: [T_N, L_J], 7: [T_NONE, L_D],
  8: [T_NONE, L_R], 9: [T_L, L_G], 10: [T_L, L_M], 11: [T_L, L_B], 12: [T_L, 9], 13: [T_L, L_T],
  14: [T_L, L_P], 16: [T_NONE, L_M], 17: [T_NONE, L_B], 18: [T_P, 9], 19: [T_NONE, 9], 20: [T_NONE, 10],
  22: [T_NONE, L_J], 23: [T_NONE, L_CH], 24: [T_NONE, L_K], 25: [T_NONE, L_T], 26: [T_NONE, L_P],
};

const H_ASPIRATES: Record<number, number> = { [L_G]: L_K, [L_D]: L_T, [L_B]: L_P, [L_J]: L_CH };
const H_REMAINDER: Record<number, number> = { [T_H]: T_NONE, [T_NH]: T_N, [T_LH]: T_L };

/** A stop final before onset ㅎ: [what stays, what ㅎ becomes]. Keyed by the written final. */
const CODA_ASPIRATES: Record<number, [number, number]> = {
  1: [T_NONE, L_K], 2: [T_NONE, L_K], 3: [T_NONE, L_K], 9: [T_L, L_K], 24: [T_NONE, L_K],
  7: [T_NONE, L_T], 12: [T_L, L_T], 13: [T_L, L_T], 19: [T_NONE, L_T], 20: [T_NONE, L_T], 23: [T_NONE, L_T], 25: [T_NONE, L_T],
  11: [T_L, L_P], 14: [T_L, L_P], 17: [T_NONE, L_P], 18: [T_NONE, L_P], 26: [T_NONE, L_P],
  5: [T_N, L_CH], 22: [T_NONE, L_CH],
};

const PALATALIZE: Record<number, number> = { [T_D]: L_J, [T_TH]: L_CH, [T_LT]: L_CH };
const PALATALIZE_REMAINDER: Record<number, number> = { [T_D]: T_NONE, [T_TH]: T_NONE, [T_LT]: T_L };
const NASALIZE: Record<number, number> = { [T_K]: T_NG, [T_D]: T_N, [T_P]: T_M };
const TENSIFY: Record<number, number> = { [L_G]: 1, [L_D]: 4, [L_B]: 8, [L_S]: 10, [L_J]: 13 };
const TENSE_TRIGGERS = new Set([T_K, T_D, T_P]);
/** Finals made of two different consonants (ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ). */
const COMPOUND_TAILS = new Set([3, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18]);

interface Surface {
  onset: number;
  vowel: number;
  coda: number;
  tenseOnset?: number;
  aspiratedOnset?: number;
  aspiratedCoda?: number;
}

const compose = (onset: number, vowel: number, coda: number) => String.fromCodePoint(0xac00 + (onset * 21 + vowel) * 28 + coda);
const composePronounced = (s: Surface) => compose(s.aspiratedOnset ?? s.tenseOnset ?? s.onset, s.vowel, s.aspiratedCoda ?? s.coda);

function decompose(cp: number): Surface | null {
  if (cp < 0xac00 || cp > 0xd7a3) return null;
  const o = cp - 0xac00;
  return { onset: Math.floor(o / 588), vowel: Math.floor(o / 28) % 21, coda: o % 28 };
}

type Trace = ChangeEvent[] | null;
type S = (Surface | null)[];

function record(trace: Trace, s: S, i: number, rule: RuleId, mutate: () => void) {
  if (!trace) return mutate();
  const t = s[i]!;
  const before = composePronounced(t);
  mutate();
  const after = composePronounced(t);
  if (before !== after) trace.push({ syllableIndex: i, ruleId: rule, before, after });
}

const nextAdjacent = (s: S, i: number) => (i + 1 < s.length && s[i + 1] ? i + 1 : null);
function nextAcrossSpace(units: string[], s: S, i: number) {
  let j = i + 1;
  while (j < s.length && !s[j] && units[j].trim() === '') j++;
  return j < s.length && s[j] ? j : null;
}

function applyPhonology(units: string[], s: S, trace: Trace) {
  // palatalization, before linking
  s.forEach((cur, i) => {
    if (!cur) return;
    const j = nextAdjacent(s, i);
    if (j === null) return;
    const next = s[j]!;
    const palatal = PALATALIZE[cur.coda];
    if (palatal === undefined || next.onset !== L_NONE || next.vowel !== V_I) return;
    const rem = PALATALIZE_REMAINDER[cur.coda];
    record(trace, s, i, 'PALATALIZATION', () => (cur.coda = rem));
    record(trace, s, j, 'PALATALIZATION', () => (next.onset = palatal));
  });
  // ㅎ final: aspirates the next ㄱㄷㅂㅈ, or drops before a vowel
  s.forEach((cur, i) => {
    if (!cur) return;
    const rem = H_REMAINDER[cur.coda];
    if (rem === undefined) return;
    const j = nextAdjacent(s, i);
    if (j === null) return;
    const next = s[j]!;
    const asp = H_ASPIRATES[next.onset];
    if (asp !== undefined) {
      record(trace, s, i, 'ASPIRATION', () => (cur.coda = rem));
      record(trace, s, j, 'ASPIRATION', () => (next.onset = asp));
    } else if (next.onset === L_NONE) {
      record(trace, s, i, 'H_DELETION', () => (cur.coda = rem));
    }
  });
  // stop final + onset ㅎ, pronounced form only
  s.forEach((cur, i) => {
    if (!cur) return;
    const ca = CODA_ASPIRATES[cur.coda];
    if (!ca) return;
    const j = nextAdjacent(s, i);
    if (j === null) return;
    const next = s[j]!;
    if (next.onset !== L_H) return;
    record(trace, s, i, 'ASPIRATION', () => (cur.aspiratedCoda = ca[0]));
    record(trace, s, j, 'ASPIRATION', () => (next.aspiratedOnset = ca[1]));
  });
  // linking
  s.forEach((cur, i) => {
    if (!cur || cur.coda === T_NONE || cur.coda === T_NG) return;
    const j = nextAdjacent(s, i);
    if (j === null) return;
    const next = s[j]!;
    if (next.onset !== L_NONE) return;
    const split = LINK_SPLIT[cur.coda];
    if (!split) return;
    record(trace, s, i, 'LIAISON', () => (cur.coda = split[0]));
    record(trace, s, j, 'LIAISON', () => (next.onset = split[1]));
  });
  // final simplification to seven sounds
  s.forEach((cur, i) => {
    if (!cur) return;
    const n = NEUTRALIZED[cur.coda];
    if (n === cur.coda) return;
    const rule: RuleId = COMPOUND_TAILS.has(cur.coda) ? 'CLUSTER' : 'NEUTRALIZATION';
    record(trace, s, i, rule, () => (cur.coda = n));
  });
  // ㄹ → ㄴ after a consonant other than ㄴ, ㄹ
  s.forEach((cur, i) => {
    if (!cur) return;
    const coda = NEUTRALIZED[cur.coda];
    if (coda === T_NONE || coda === T_N || coda === T_L) return;
    const j = nextAcrossSpace(units, s, i);
    if (j === null) return;
    const next = s[j]!;
    if (next.onset === L_R) record(trace, s, j, 'NASALIZATION', () => (next.onset = L_N));
  });
  // liquidization: ㄴㄹ / ㄹㄴ → ㄹㄹ
  s.forEach((cur, i) => {
    if (!cur) return;
    const j = nextAcrossSpace(units, s, i);
    if (j === null) return;
    const next = s[j]!;
    const coda = NEUTRALIZED[cur.coda];
    if (coda === T_N && next.onset === L_R) record(trace, s, i, 'LIQUIDIZATION', () => (cur.coda = T_L));
    else if (coda === T_L && next.onset === L_N) record(trace, s, j, 'LIQUIDIZATION', () => (next.onset = L_R));
  });
  // nasalization
  s.forEach((cur, i) => {
    if (!cur) return;
    const j = nextAcrossSpace(units, s, i);
    if (j === null) return;
    const next = s[j]!;
    if (next.onset !== L_N && next.onset !== L_M) return;
    const nasal = NASALIZE[NEUTRALIZED[cur.coda]];
    if (nasal !== undefined) record(trace, s, i, 'NASALIZATION', () => (cur.coda = nasal));
  });
  // tensification after a stop, pronounced form only
  s.forEach((cur, i) => {
    if (!cur || !TENSE_TRIGGERS.has(cur.coda)) return;
    const j = nextAdjacent(s, i);
    if (j === null) return;
    const next = s[j]!;
    const tense = TENSIFY[next.onset];
    if (tense !== undefined) record(trace, s, j, 'TENSIFICATION', () => (next.tenseOnset = tense));
  });
}

function prepare(text: string) {
  const units = [...text];
  const s: S = units.map((u) => decompose(u.codePointAt(0)!));
  return { units, s };
}

/** The pronounced form and the rules that produced it, in the order applied. */
export function analyzeWithTrace(text: string): { pronounced: string; events: ChangeEvent[] } {
  const { units, s } = prepare(text);
  const events: ChangeEvent[] = [];
  applyPhonology(units, s, events);
  return { pronounced: units.map((u, i) => (s[i] ? composePronounced(s[i]!) : u)).join(''), events };
}

/** Revised Romanization of how the text is said (the app's standard: no hyphens, ㄹㄹ → ll). */
export function romanize(text: string): string {
  const { units, s } = prepare(text);
  applyPhonology(units, s, null);
  return units
    .map((u, i) => {
      const cur = s[i];
      if (!cur) return u;
      let onset = LEAD_ROMAN[cur.onset];
      if (cur.onset === L_R) onset = i > 0 && s[i - 1] && NEUTRALIZED[s[i - 1]!.coda] === T_L ? 'l' : 'r';
      return onset + VOWEL_ROMAN[cur.vowel] + CODA_ROMAN[NEUTRALIZED[cur.coda]];
    })
    .join('');
}

/**
 * One label per code point of an already-pronounced form, so tensing shows
 * (학꾜 → hak, kkyo). Non-syllables (spaces, marks) pass through as they are.
 * The previous syllable matters only for ㄹㄹ → ll, as in the app's romanizeSyllable.
 */
export function romanizeSyllables(text: string): string[] {
  const chars = [...text];
  return chars.map((c, i) => {
    const w = decompose(c.codePointAt(0)!);
    if (!w) return c;
    const prev = i > 0 ? decompose(chars[i - 1].codePointAt(0)!) : null;
    const onset = w.onset === L_R && prev && NEUTRALIZED[prev.coda] === T_L ? 'l' : LEAD_ROMAN[w.onset];
    return onset + VOWEL_ROMAN[w.vowel] + CODA_ROMAN[NEUTRALIZED[w.coda]];
  });
}

/** The same labels as one string: 학꾜 → hakkkyo. */
export const romanizePronounced = (text: string) => romanizeSyllables(text).join('');

/** Groups engine events into numbered changes a card can show: 락해 → 라캐, one cause each. */
export function soundChanges(written: string, pronounced: string, events: ChangeEvent[]): Change[] {
  if (!events.length) return [];
  type Run = { range: [number, number]; rules: RuleId[]; fb: string; fa: string };
  const runs: ChangeEvent[][] = [];
  for (const e of events) {
    const cur = runs.at(-1);
    const idx = cur?.map((x) => x.syllableIndex);
    const joins = cur && cur[0].ruleId === e.ruleId && e.syllableIndex >= Math.min(...idx!) - 1 && e.syllableIndex <= Math.max(...idx!) + 1;
    if (joins) cur!.push(e);
    else runs.push([e]);
  }
  const grouped: Run[] = runs.map((run) => {
    const sorted = [...run].sort((a, b) => a.syllableIndex - b.syllableIndex);
    const byIdx = new Map<number, ChangeEvent[]>();
    sorted.forEach((e) => byIdx.set(e.syllableIndex, [...(byIdx.get(e.syllableIndex) ?? []), e]));
    return {
      range: [sorted[0].syllableIndex, sorted.at(-1)!.syllableIndex],
      rules: [run[0].ruleId],
      fb: [...byIdx.values()].map((es) => es[0].before).join(''),
      fa: [...byIdx.values()].map((es) => es.at(-1)!.after).join(''),
    };
  });
  const overlaps = (a: [number, number], b: [number, number]) => a[0] <= b[1] && b[0] <= a[1];
  const merged: Run[] = [];
  for (const r of grouped) {
    let pending = r;
    for (;;) {
      const k = merged.findIndex((m) => overlaps(m.range, pending.range));
      if (k < 0) break;
      const o = merged.splice(k, 1)[0];
      pending = { range: [Math.min(o.range[0], pending.range[0]), Math.max(o.range[1], pending.range[1])], rules: [...new Set([...o.rules, ...pending.rules])], fb: o.fb, fa: pending.fa };
    }
    merged.push(pending);
  }
  const w = [...written], p = [...pronounced];
  const slice = (a: string[], [x, y]: [number, number]) => (x >= 0 && y < a.length ? a.slice(x, y + 1).join('') : null);
  return merged
    .map((m) => ({ range: m.range, rules: m.rules, before: slice(w, m.range) ?? m.fb, after: slice(p, m.range) ?? m.fa }))
    .sort((a, b) => a.range[0] - b.range[0]);
}

/** One line per rule, as on the app's card. */
export const RULE_LINE: Record<RuleId, string> = {
  LIAISON: 'A final consonant slides onto the next syllable when that syllable starts with ㅇ',
  NEUTRALIZATION: 'At the end of a syllable, consonants collapse into one of just seven sounds',
  CLUSTER: 'A two-consonant ending keeps only one of its two consonants',
  NASALIZATION: 'ㄱ/ㄷ/ㅂ sound like ㅇ/ㄴ/ㅁ before ㄴ/ㅁ',
  LIQUIDIZATION: 'ㄴ next to ㄹ becomes ㄹ too, giving a doubled ㄹㄹ sound',
  ASPIRATION: 'ㅎ merges into ㄱ/ㄷ/ㅂ/ㅈ and turns them into breathy ㅋ/ㅌ/ㅍ/ㅊ',
  H_DELETION: 'ㅎ goes silent before a vowel',
  PALATALIZATION: 'ㄷ/ㅌ soften to ㅈ/ㅊ before 이',
  TENSIFICATION: 'After a ㄱ/ㄷ/ㅂ ending, the next ㄱㄷㅂㅅㅈ is squeezed into tense ㄲㄸㅃㅆㅉ',
};

/** The full rule, as in the app's rule sheet. */
export const RULE_SHEET: Record<RuleId, { title: string; text: string }> = {
  LIAISON: { title: 'The consonant moves forward', text: 'When a syllable ends in a consonant and the next one starts with a silent ㅇ, the consonant slides over and starts the next syllable. 먹어 is said 머거 (meo-geo).' },
  NEUTRALIZATION: { title: 'Only seven final sounds', text: 'At the end of a syllable Korean has only seven sounds: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ. ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ sound like ㄷ, ㅋ ㄲ like ㄱ, ㅍ like ㅂ. 옷 is said 옫 (ot).' },
  CLUSTER: { title: 'Two final letters, one sound', text: 'When a syllable ends in two consonants, only one is said before a consonant or at the end: 읽다 is said 익따. Before a vowel the second one moves forward: 없어 → 업써.' },
  NASALIZATION: { title: 'Sounds turn nasal', text: 'Before ㄴ or ㅁ, final ㄱ becomes ㅇ, ㄷ becomes ㄴ and ㅂ becomes ㅁ: 감사합니다 is said 감사함니다. ㄹ after these sounds is said like ㄴ: 정류장 → 정뉴장.' },
  LIQUIDIZATION: { title: 'ㄴ next to ㄹ becomes ㄹ', text: 'When ㄴ and ㄹ meet, in either order, both are said as ㄹ — a long L sound. 연락 is said 열락 (yeol-lak).' },
  ASPIRATION: { title: 'ㅎ adds a puff of air', text: 'ㅎ merges with a neighboring ㄱ ㄷ ㅂ ㅈ into ㅋ ㅌ ㅍ ㅊ. 축하해 is said 추카해 (chu-ka-hae), 좋다 is said 조타.' },
  H_DELETION: { title: 'ㅎ goes silent', text: "A final ㅎ before a vowel isn't pronounced. 좋아요 is said 조아요 (jo-a-yo)." },
  PALATALIZATION: { title: 'ㄷ ㅌ + 이 → ㅈ ㅊ', text: 'A final ㄷ or ㅌ followed by 이 turns into ㅈ or ㅊ. 같이 is said 가치 (ga-chi).' },
  TENSIFICATION: { title: 'Tense, doubled sounds', text: 'After a final ㄱ ㄷ ㅂ sound, the next ㄱ ㄷ ㅂ ㅅ ㅈ becomes tense: ㄲ ㄸ ㅃ ㅆ ㅉ. 학교 is said 학꾜 (hak-kkyo).' },
};

/** Short tag for a rule chip. */
export const RULE_TAG: Record<RuleId, string> = {
  LIAISON: 'Linking', NEUTRALIZATION: '7 final sounds', CLUSTER: 'Double final', NASALIZATION: 'Nasal',
  LIQUIDIZATION: 'ㄹㄹ', ASPIRATION: '+ㅎ', H_DELETION: 'Silent ㅎ', PALATALIZATION: '이 softens', TENSIFICATION: 'Tense',
};
