// Astro integration: after the build, every page gets <link rel="modulepreload"> for the
// chunks its module scripts import (audio.js, progress.js, ...). Without it the browser finds
// them only after the first script arrives, one round trip later.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const IMPORT = /(?:\bfrom|\bimport)\s*["']\.\/([^"']+\.js)["']/g;

export default function modulepreload() {
  return {
    name: 'hanguledu:modulepreload',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const deps = new Map(); // "/_astro/x.js" -> its static imports, as URLs

        const importsOf = (url) => {
          if (!deps.has(url)) {
            deps.set(url, []);
            const js = readFileSync(join(root, url), 'utf8');
            const found = [...js.matchAll(IMPORT)].map((m) => `${dirname(url)}/${m[1]}`);
            deps.set(url, found);
            found.forEach(importsOf);
          }
          return deps.get(url);
        };

        (function walk(d) {
          for (const f of readdirSync(d)) {
            const p = join(d, f);
            if (statSync(p).isDirectory()) { walk(p); continue; }
            if (!f.endsWith('.html')) continue;
            const html = readFileSync(p, 'utf8');
            const entries = [...html.matchAll(/<script type="module" src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]);
            const want = new Set();
            const add = (url) => importsOf(url).forEach((dep) => { if (!want.has(dep)) { want.add(dep); add(dep); } });
            entries.forEach(add);
            entries.forEach((e) => want.delete(e));
            if (!want.size) continue;
            const links = [...want].map((u) => `<link rel="modulepreload" href="${u}">`).join('');
            writeFileSync(p, html.replace('</head>', `${links}</head>`));
          }
        })(root);
      },
    },
  };
}
