import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { PHRASE_PAGES } from '../data/phrase-pages';

// Every indexable page with the date its content last changed.
const PAGES: [string, string][] = [
  ['/', '2026-10-28'],
  ['/korean-alphabet/', '2026-10-28'],
  ['/korean-alphabet/chart/', '2026-10-28'],
  ['/korean-alphabet/consonants/', '2026-10-28'],
  ['/korean-alphabet/vowels/', '2026-10-28'],
  ['/phrases/', '2026-10-28'],
  ['/phrases/basic-korean-phrases/', '2026-10-28'],
  ['/phrases/k-drama/', '2026-10-28'],
  ['/phrases/love/', '2026-10-28'],
  ...PHRASE_PAGES.map((p): [string, string] => [`/phrases/${p.slug}/`, '2026-10-28']),
  ['/privacy/', '2026-10-28'],
  ['/terms/', '2026-10-28'],
];

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map(([p, d]) => `  <url><loc>${site.url}${p}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
