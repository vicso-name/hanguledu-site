export interface Store {
  /** Stable key, exposed as data-store on store links. */
  id: 'google_play' | 'app_store';
  /** null until the app is live in that store: the badge is not rendered. */
  url: string | null;
  label: string;
  badge: string;
  /** Badge artwork size in CSS px at 44px high, so the layout holds before it loads. */
  width: number;
}

const googlePlay: Store = {
  id: 'google_play',
  url: 'https://play.google.com/store/apps/details?id=com.vicsothemes.hangulhero',
  label: 'Get it on Google Play',
  badge: '/googleplay-badge.svg',
  width: 148,
};

const appStore: Store = {
  id: 'app_store',
  url: 'https://apps.apple.com/us/app/korean-alphabet-phrases/id6827157088',
  label: 'Download on the App Store',
  badge: '/appstore-badge.svg',
  width: 132,
};

/** The campaign name for a page: '/phrases/love/' → 'phrases_love'. */
export const campaignOf = (page: string) => page.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';

/** Google Play link tagged with a campaign, so installs can be traced to pages. */
export const playHref = (url: string, campaign: string) =>
  `${url}&referrer=${encodeURIComponent(`utm_source=hanguledu&utm_medium=web&utm_campaign=${campaign}`)}`;

/** Store link tagged with the page it was tapped on (Google Play only; the App Store link is plain). */
export function storeHref(store: Store, page: string): string | null {
  if (!store.url) return null;
  return store.id === 'google_play' ? playHref(store.url, campaignOf(page)) : store.url;
}

/** What a QR code opens: /app/ sends the phone to its own store and keeps the campaign. */
export const appQrHref = (page: string) => `${site.url}/app/?from=${campaignOf(page)}`;

export const site = {
  name: 'HangulEdu',
  url: 'https://hanguledu.com',
  title: 'Learn the Korean Alphabet (Hangul) with Audio | HangulEdu',
  description: 'Learn to read Korean: all 40 Hangul letters with audio, a sound chart of every syllable, and quizzes that remember what you know. Free, no sign-up.',
  stores: [googlePlay, appStore],
  // glyph and tone dress the menu tiles.
  nav: [
    { href: '/korean-alphabet/', label: 'Alphabet', glyph: '한', tone: 'a' },
    { href: '/korean-alphabet/chart/', label: 'Chart', glyph: '가', tone: 'n' },
    { href: '/korean-alphabet/consonants/', label: 'Consonants', glyph: 'ㄲ', tone: 'c' },
    { href: '/korean-alphabet/vowels/', label: 'Vowels', glyph: 'ㅏ', tone: 'v' },
    { href: '/phrases/', label: 'Phrases', glyph: '안녕', tone: 'p' },
  ],
};
