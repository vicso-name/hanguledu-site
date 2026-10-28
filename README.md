# hanguledu.com

Marketing and learning site for the Hangul Hero app. Astro, static output.

```sh
npm install
npm run dev          # http://localhost:4321
npm run build        # builds dist/ and runs scripts/check-build.mjs
npm run sync:audio   # re-copy native clips from the Android app (APP_ASSETS=… to override)
```

- Styles: `src/styles/tokens.css` and `components.css` come from the "HangulEdu Web" design system;
  `site.css` is the page layer from the hanguledu.com canvas templates. One breakpoint at 760px.
- Letters and examples: `src/data/hangul.ts`. Every Korean string with a play button must have a clip in
  `public/audio/ko/` (file name = code points in hex joined by `_`); the build check fails otherwise.
- "Your 40 letters" progress lives in `localStorage` (`hanguledu.letters.v1`), see `src/lib/progress.ts`.
  Any element with `data-jamo="ㄱㅏ"` gets `.known` once all its letters are learned.
- Korean facts and example words still need a native-speaker review before launch.
