import { defineConfig } from 'astro/config';
import modulepreload from './scripts/modulepreload.mjs';

export default defineConfig({
  site: 'https://hanguledu.com',
  output: 'static',
  trailingSlash: 'always',
  // Styles go into each page's <head>: no render-blocking stylesheet request.
  build: { inlineStylesheets: 'always' },
  integrations: [modulepreload()],
});
