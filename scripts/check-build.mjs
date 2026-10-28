// Post-build guardrails: every page has one h1, a title and a description;
// every internal link and every audio clip it references exists in dist/;
// every page is in the sitemap (except 404).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(dist);

const errors = [];
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const clipName = (ko) => [...ko].map((c) => c.codePointAt(0).toString(16).padStart(4, '0')).join('_') + '.mp3';

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const url = '/' + file.slice(dist.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '/');
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) errors.push(`${url}: ${h1} <h1>`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${url}: missing title`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) errors.push(`${url}: missing description`);
  if (!file.endsWith('404.html') && !sitemap.includes(`<loc>https://hanguledu.com${url}</loc>`)) errors.push(`${url}: not in sitemap`);
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = href.endsWith('/') ? join(dist, href, 'index.html') : join(dist, href);
    if (!existsSync(target)) errors.push(`${url}: broken link ${href}`);
  }
  for (const [, ko] of html.matchAll(/data-say="([^"]+)"/g)) {
    if (!existsSync(join(dist, 'audio/ko', clipName(ko)))) errors.push(`${url}: no clip for ${ko}`);
  }
  // Clips the chart switches to at runtime: each letter's syllable and example word.
  for (const m of html.matchAll(/"syl":"([^"]+)"|"ex":\{"ko":"([^"]+)"/g)) {
    const ko = m[1] ?? m[2];
    if (!existsSync(join(dist, 'audio/ko', clipName(ko)))) errors.push(`${url}: no clip for ${ko}`);
  }
  for (const [, src] of html.matchAll(/data-src="([^"]+)"/g)) {
    if (!existsSync(join(dist, src))) errors.push(`${url}: missing audio ${src}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`check-build: ${pages.length} pages ok`);
