export interface Store {
  /** Stable key, exposed as data-store on store links. */
  id: 'google_play' | 'app_store';
  /** null until the app is live in that store: the badge is not rendered. */
  url: string | null;
  label: string;
  badge: string;
}

const googlePlay: Store = {
  id: 'google_play',
  url: 'https://play.google.com/store/apps/details?id=com.vicsothemes.hangulhero',
  label: 'Get it on Google Play',
  badge: '/googleplay-badge.svg',
};

const appStore: Store = {
  id: 'app_store',
  url: null,
  label: 'Download on the App Store',
  badge: '/appstore-badge.svg',
};

/** Store link tagged with the page it was tapped on, so installs can be traced to pages. */
export function storeHref(store: Store, page: string): string | null {
  if (!store.url) return null;
  if (store.id !== 'google_play') return store.url;
  const campaign = page.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';
  const referrer = `utm_source=hanguledu&utm_medium=web&utm_campaign=${campaign}`;
  return `${store.url}&referrer=${encodeURIComponent(referrer)}`;
}

export const site = {
  name: 'HangulEdu',
  url: 'https://hanguledu.com',
  title: 'Learn the Korean Alphabet (Hangul) with Audio | HangulEdu',
  description: 'Learn to read Korean: all 40 Hangul letters with audio, a sound chart of every syllable, and quizzes that remember what you know. Free, no sign-up.',
  stores: [googlePlay, appStore],
  // glyph, sub and tone dress the tiles of the mobile menu; the desktop bar shows the label only.
  nav: [
    { href: '/korean-alphabet/', label: 'Alphabet', sub: 'How Hangul works', glyph: '한', tone: 'a' },
    { href: '/korean-alphabet/chart/', label: 'Chart', sub: 'All 40 letters, with sound', glyph: '가', tone: 'n' },
    { href: '/korean-alphabet/consonants/', label: 'Consonants', sub: '가, 카 or 까?', glyph: 'ㄲ', tone: 'c' },
    { href: '/korean-alphabet/vowels/', label: 'Vowels', sub: '21 vowels, three strokes', glyph: 'ㅏ', tone: 'v' },
    { href: '/phrases/', label: 'Phrases', sub: '240 everyday phrases with audio', glyph: '안녕', tone: 'p' },
  ],
};
