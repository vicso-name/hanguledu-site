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
  title: 'Learn the Korean Alphabet (Hangul) with Native Audio | HangulEdu',
  description: 'Learn to read Korean: all 40 Hangul letters with native audio, a sound chart of every syllable, and quizzes that remember what you know. Free, no sign-up.',
  stores: [googlePlay, appStore],
  nav: [
    { href: '/korean-alphabet/', label: 'Alphabet' },
    { href: '/korean-alphabet/chart/', label: 'Chart' },
    { href: '/korean-alphabet/consonants/', label: 'Consonants' },
    { href: '/korean-alphabet/vowels/', label: 'Vowels' },
  ],
};
