// The 40 letters of Hangul, in chart order. Example words come from the
// Hangul Hero app (assets/alphabet/*.json) and every one has a clip in
// public/audio/ko/. Facts here need a native-speaker review before launch.

export type Role = 'consonant' | 'vowel';
export type Group = 'basicC' | 'double' | 'basicV' | 'combV';

export interface Example { ko: string; rom: string; en: string }

export interface Letter {
  g: string;
  /** Revised Romanization; consonants give initial / final where they differ. */
  rom: string;
  role: Role;
  group: Group;
  /** The letter's Korean name; a vowel is named by its own syllable (아). */
  name: string;
  nameRom: string;
  say: string;
  ex: Example;
}

const C: [string, string, string, string, string, Example][] = [
  ['ㄱ', 'g / k', '기역', 'giyeok', 'g in "go"; k at the end of a block.', { ko: '고기', rom: 'gogi', en: 'meat' }],
  ['ㄴ', 'n', '니은', 'nieun', 'n in "no".', { ko: '눈', rom: 'nun', en: 'eye' }],
  ['ㄷ', 'd / t', '디귿', 'digeut', 'd in "do"; t at the end of a block.', { ko: '다리', rom: 'dari', en: 'leg' }],
  ['ㄹ', 'r / l', '리을', 'rieul', 'A light flap between r and l, like the tt in American "butter"; l at the end of a block.', { ko: '물', rom: 'mul', en: 'water' }],
  ['ㅁ', 'm', '미음', 'mieum', 'm in "me".', { ko: '마음', rom: 'maeum', en: 'heart, mind' }],
  ['ㅂ', 'b / p', '비읍', 'bieup', 'b in "boy"; p at the end of a block.', { ko: '바지', rom: 'baji', en: 'trousers' }],
  ['ㅅ', 's', '시옷', 'siot', 's in "sun"; before ㅣ it turns into sh.', { ko: '손', rom: 'son', en: 'hand' }],
  ['ㅇ', '– / ng', '이응', 'ieung', 'Silent at the start of a block; ng in "sing" at the end.', { ko: '아이', rom: 'ai', en: 'child' }],
  ['ㅈ', 'j', '지읒', 'jieut', 'j in "jam".', { ko: '지도', rom: 'jido', en: 'map' }],
  ['ㅊ', 'ch', '치읓', 'chieut', 'ch in "church", with a puff of air.', { ko: '차', rom: 'cha', en: 'car; tea' }],
  ['ㅋ', 'k', '키읔', 'kieuk', 'k in "kite", with a puff of air.', { ko: '코', rom: 'ko', en: 'nose' }],
  ['ㅌ', 't', '티읕', 'tieut', 't in "top", with a puff of air.', { ko: '토끼', rom: 'tokki', en: 'rabbit' }],
  ['ㅍ', 'p', '피읖', 'pieup', 'p in "pie", with a puff of air.', { ko: '팔', rom: 'pal', en: 'arm' }],
  ['ㅎ', 'h', '히읗', 'hieut', 'h in "hat".', { ko: '하나', rom: 'hana', en: 'one' }],
];

const D: typeof C = [
  ['ㄲ', 'kk', '쌍기역', 'ssanggiyeok', 'A tight k with no puff of air, like the k in "sky".', { ko: '토끼', rom: 'tokki', en: 'rabbit' }],
  ['ㄸ', 'tt', '쌍디귿', 'ssangdigeut', 'A tight t with no puff of air, like the t in "stop".', { ko: '땅', rom: 'ttang', en: 'land, ground' }],
  ['ㅃ', 'pp', '쌍비읍', 'ssangbieup', 'A tight p with no puff of air, like the p in "spin".', { ko: '빵', rom: 'ppang', en: 'bread' }],
  ['ㅆ', 'ss', '쌍시옷', 'ssangsiot', 'A sharp, hissed s.', { ko: '쌀', rom: 'ssal', en: 'rice (uncooked)' }],
  ['ㅉ', 'jj', '쌍지읒', 'ssangjieut', 'A tight j with no puff of air.', { ko: '짜다', rom: 'jjada', en: 'to be salty' }],
];

const V: [string, string, string, Example][] = [
  ['ㅏ', 'a', 'a in "father".', { ko: '사과', rom: 'sagwa', en: 'apple' }],
  ['ㅑ', 'ya', 'ya in "yard".', { ko: '야구', rom: 'yagu', en: 'baseball' }],
  ['ㅓ', 'eo', 'u in "up", with the mouth open.', { ko: '버스', rom: 'beoseu', en: 'bus' }],
  ['ㅕ', 'yeo', 'yu in "young".', { ko: '여자', rom: 'yeoja', en: 'woman' }],
  ['ㅗ', 'o', 'o in "go", lips rounded.', { ko: '오리', rom: 'ori', en: 'duck' }],
  ['ㅛ', 'yo', 'yo in "yoga".', { ko: '요리', rom: 'yori', en: 'cooking' }],
  ['ㅜ', 'u', 'oo in "moon".', { ko: '우유', rom: 'uyu', en: 'milk' }],
  ['ㅠ', 'yu', '"you".', { ko: '휴지', rom: 'hyuji', en: 'tissue' }],
  ['ㅡ', 'eu', 'oo in "book", but with the lips spread in a smile.', { ko: '음악', rom: 'eumak', en: 'music' }],
  ['ㅣ', 'i', 'ee in "see".', { ko: '이름', rom: 'ireum', en: 'name' }],
];

const W: typeof V = [
  ['ㅐ', 'ae', 'e in "bed".', { ko: '배', rom: 'bae', en: 'pear; ship; belly' }],
  ['ㅒ', 'yae', 'ye in "yes".', { ko: '얘기', rom: 'yaegi', en: 'talk, story' }],
  ['ㅔ', 'e', 'e in "bed". Most speakers today say ㅐ and ㅔ the same.', { ko: '메뉴', rom: 'menyu', en: 'menu' }],
  ['ㅖ', 'ye', 'ye in "yes".', { ko: '예', rom: 'ye', en: 'yes (polite)' }],
  ['ㅘ', 'wa', 'wa in "wand".', { ko: '과자', rom: 'gwaja', en: 'snack' }],
  ['ㅙ', 'wae', 'we in "wet".', { ko: '왜', rom: 'wae', en: 'why' }],
  ['ㅚ', 'oe', 'we in "wet". Today ㅙ, ㅚ and ㅞ sound almost the same.', { ko: '회사', rom: 'hoesa', en: 'company' }],
  ['ㅝ', 'wo', 'wo in "won".', { ko: '뭐', rom: 'mwo', en: 'what' }],
  ['ㅞ', 'we', 'we in "wet".', { ko: '웨이터', rom: 'weiteo', en: 'waiter' }],
  ['ㅟ', 'wi', '"we".', { ko: '귀', rom: 'gwi', en: 'ear' }],
  ['ㅢ', 'ui', 'ㅡ glided quickly into ㅣ.', { ko: '의사', rom: 'uisa', en: 'doctor' }],
];

export const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
export const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
export const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

/** Builds a syllable block from its letters: block('ㅎ', 'ㅏ', 'ㄴ') → 한. */
export function block(c: string, v: string, b = ''): string {
  return String.fromCharCode(0xac00 + (CHO.indexOf(c) * 21 + JUNG.indexOf(v)) * 28 + JONG.indexOf(b));
}

/** Splits a syllable into its letters: jamo('한') → ['ㅎ', 'ㅏ', 'ㄴ']. */
export function jamo(s: string): string[] {
  const n = s.charCodeAt(0) - 0xac00;
  if (n < 0 || n > 11171) return [s];
  const b = JONG[n % 28];
  return [CHO[Math.floor(n / 588)], JUNG[Math.floor((n % 588) / 28)], ...(b ? [b] : [])];
}

export const LETTERS: Letter[] = [
  ...C.map(([g, rom, name, nameRom, say, ex]) => ({ g, rom, role: 'consonant' as const, group: 'basicC' as const, name, nameRom, say, ex })),
  ...D.map(([g, rom, name, nameRom, say, ex]) => ({ g, rom, role: 'consonant' as const, group: 'double' as const, name, nameRom, say, ex })),
  ...V.map(([g, rom, say, ex]) => ({ g, rom, role: 'vowel' as const, group: 'basicV' as const, name: block('ㅇ', g), nameRom: rom, say, ex })),
  ...W.map(([g, rom, say, ex]) => ({ g, rom, role: 'vowel' as const, group: 'combV' as const, name: block('ㅇ', g), nameRom: rom, say, ex })),
];

export const BY = Object.fromEntries(LETTERS.map((l) => [l.g, l])) as Record<string, Letter>;

export const GROUPS: { key: Group; title: string; sub: string }[] = [
  { key: 'basicC', title: 'Basic consonants', sub: '14 letters' },
  { key: 'double', title: 'Double consonants', sub: '5 tense letters, each a base letter doubled' },
  { key: 'basicV', title: 'Basic vowels', sub: '10 letters' },
  { key: 'combV', title: 'Combined vowels', sub: '11 letters, each built from two' },
];

export const ofGroup = (k: Group) => LETTERS.filter((l) => l.group === k);

/** First romanization of a consonant at the start of a block ('g / k' → 'g', 'ㅇ' → ''). */
export const initialRom = (l: Letter) => (l.role === 'vowel' ? l.rom : l.rom.split(' / ')[0].replace('–', ''));

/** The clip that best says a letter on its own: a consonant before ㅏ (가), a vowel after silent ㅇ (아). */
export const letterSyllable = (l: Letter) => (l.role === 'vowel' ? block('ㅇ', l.g) : block(l.g, 'ㅏ'));

/** Vowels that stand to the right of the consonant; the rest sit below it. */
export const VERTICAL = 'ㅏㅑㅓㅕㅣㅐㅒㅔㅖ';
export const HORIZONTAL = 'ㅗㅛㅜㅠㅡ';

/** Vowels most speakers no longer tell apart; a listening quiz never offers two of one group. */
export const SAME_SOUND = ['ㅐㅔ', 'ㅒㅖ', 'ㅙㅚㅞ'];

/** Mouth families: base letter, then letters made from it. */
export const FAMILIES = [
  { title: 'Back of the tongue', desc: 'ㄱ draws the back of the tongue lifting to the roof of the mouth.', items: [['ㄱ', ''], ['ㅋ', '+ stroke'], ['ㄲ', 'doubled']] },
  { title: 'Tip of the tongue', desc: 'ㄴ draws the tongue tip touching the ridge behind the top teeth.', items: [['ㄴ', ''], ['ㄷ', '+ stroke'], ['ㅌ', '+ stroke'], ['ㄸ', 'doubled'], ['ㄹ', 'variant']] },
  { title: 'Lips', desc: 'ㅁ draws the closed lips.', items: [['ㅁ', ''], ['ㅂ', '+ strokes'], ['ㅍ', '+ strokes'], ['ㅃ', 'doubled']] },
  { title: 'Teeth', desc: 'ㅅ draws a tooth: air hisses past it.', items: [['ㅅ', ''], ['ㅈ', '+ stroke'], ['ㅊ', '+ stroke'], ['ㅆ', 'doubled'], ['ㅉ', 'doubled']] },
  { title: 'Throat', desc: 'ㅇ draws the open throat.', items: [['ㅇ', ''], ['ㅎ', '+ strokes']] },
] as const;

/** Plain / aspirated / tense: the three-way contrast English does not have. */
export const TRIPLETS = [
  ['ㄱ', 'ㅋ', 'ㄲ'],
  ['ㄷ', 'ㅌ', 'ㄸ'],
  ['ㅂ', 'ㅍ', 'ㅃ'],
  ['ㅈ', 'ㅊ', 'ㅉ'],
  ['ㅅ', '', 'ㅆ'],
] as const;

/** At the bottom of a block every consonant collapses into one of seven sounds. */
export const FINALS = [
  { sound: 'k', letters: 'ㄱㅋㄲ', ex: { ko: '박', rom: 'bak', en: 'gourd' } },
  { sound: 'n', letters: 'ㄴ', ex: { ko: '눈', rom: 'nun', en: 'eye; snow' } },
  { sound: 't', letters: 'ㄷㅌㅅㅆㅈㅊㅎ', ex: { ko: '옷', rom: 'ot', en: 'clothes' } },
  { sound: 'l', letters: 'ㄹ', ex: { ko: '물', rom: 'mul', en: 'water' } },
  { sound: 'm', letters: 'ㅁ', ex: { ko: '김', rom: 'gim', en: 'seaweed' } },
  { sound: 'p', letters: 'ㅂㅍ', ex: { ko: '밥', rom: 'bap', en: 'cooked rice; a meal' } },
  { sound: 'ng', letters: 'ㅇ', ex: { ko: '빵', rom: 'ppang', en: 'bread' } },
] as const;
