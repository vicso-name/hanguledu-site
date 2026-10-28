# hanguledu.com

Marketing and learning site for the Hangul Hero app. Astro, static output.

```sh
npm install
npm run dev          # http://localhost:4321
npm run build        # builds dist/ and runs scripts/check-build.mjs
npm run sync:app     # re-copy content and clips from the Android app (APP_ASSETS=… to override)
npm run test:engine  # X-Ray engine port vs the app's golden set (also runs before build)
```

- Styles: `src/styles/tokens.css` and `components.css` come from the "HangulEdu Web" design system;
  `site.css` is the page layer from the hanguledu.com canvas templates. One breakpoint at 760px.
- Letters and examples: `src/data/hangul.ts`. Every Korean string with a play button must have a clip in
  `public/audio/ko/` (file name = code points in hex joined by `_`); the build check fails otherwise.
- Phrases: `src/data/phrases.ts` (app phrases, synced) and `src/data/phrase-pages.ts` (the
  `/phrases/{phrase}-in-korean/` pages). Forms the app does not have are voiced with the app's TTS tool,
  same voice (Google Cloud, ko-KR-Chirp3-HD-Aoede): add the form to `scripts/tts/web_forms.json`
  with `written` (the spelling), `text` = how it is said, from the X-Ray (감사합니다 → 감사함니다; read from
  the spelling, the voice swallows the last syllables) and `audio` = hex file name of `written`. The voice
  varies between runs, so listen to every new clip before copying it. Then
  `cd ~/Developer/android/hangul_hero/tools/korean_tts && .venv/bin/python generate.py ~/Developer/web/hanguledu-site/scripts/tts/web_forms.json`
  and copy `out/web_forms/*.mp3` into `public/audio/ko/`. Only new lines are synthesized (`--force --only <id>` redoes one).
- "Your 40 letters" progress lives in `localStorage` (`hanguledu.letters.v1`), see `src/lib/progress.ts`.
  Any element with `data-jamo="ㄱㅏ"` gets `.known` once all its letters are learned.
- Korean facts and example words still need a native-speaker review before launch.
