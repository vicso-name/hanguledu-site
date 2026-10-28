# hanguledu.com: working notes

Site for the Hangul Hero app (learn Korean). The owner speaks Russian: reply in Russian, keep site copy in English.
Setup and commands: README.md.

## State (2026-10-28)
- Live at https://hanguledu.com on GitHub Pages. Public repo vicso-name/hanguledu-site; every push to `main`
  deploys (.github/workflows/deploy.yml; the build runs the X-Ray engine test and scripts/check-build.mjs).
  DNS at GoDaddy (4 GitHub A records + `www` CNAME to vicso-name.github.io), HTTPS enforced.
- Branches: `sprint/1-alphabet`, `sprint/2-phrases`, `design/fixes`, `main`. 23 pages: home, alphabet hub, chart,
  consonants, vowels, /phrases/ hub (240 app phrases, filters), k-drama, love, basic-korean-phrases,
  10 `/phrases/{phrase}-in-korean/` pages, privacy, terms, support, 404.
- Android app is live on Google Play (`com.vicsothemes.hangulhero`). iOS ships within days of 2026-10-28:
  then set the App Store `url` in src/data/site.ts (now `null`, badge hidden).
- Design pass (in progress, page by page): each fix is one commit on `design/fixes`, pushed, then `main` is
  fast-forwarded and pushed (the owner approved deploying every fix). Done so far: #f2f4f1 background with white
  cards; one accent #0369a1 (no violet); header without the letters counter, with a rule under it; roomier page
  heads; Material Symbols via `src/components/Icon.astro` (no emoji anywhere); new app icon, favicon and
  apple-touch-icon; register as quiet grey text; FAQ full width. /phrases/ hub closed by the owner; /support/ rebuilt.
- Next: ask the owner which page to rework next.
- tokens.css no longer matches the "HangulEdu Web" design system (background, cards, accent); update it there.
- Postponed by the owner: Google Search Console (only after the design fixes), og:image, analytics (undecided).
- Before launch: a native speaker reviews the Korean facts (register advice, FAQ etiquette).

## Semantic core (SEO research)
Stored in the vicsotheme-site repo, `docs/seo/research/hangulhero/`, on the local branch `seo/semantic-core`.
That branch is not pushed and the vicsotheme-site repo is public, so ask before pushing it.
- `site-structure-v2.md`: modules, URL tree and waves (W1 first).
- `pages-v2.csv`: one row per URL (`primary_keyword`, `primary_volume`, `wave`, `secondary_keywords`).
- `url-map-v2.csv`: every keyword mapped to a URL.
- Coverage: the built URLs take about 42% of the mapped volume (2.56M of 6.08M).
  Largest unbuilt: /learn-korean/, /korean-words/family/, /phrases/korean-swear-words/ (brand risk, owner decides),
  /korean-honorifics/oppa/, /korean-names/, /korean-numbers/, /phrases/holiday-greetings/, /korean-nicknames/,
  /korean-keyboard/, /hangul-writing-practice/.
- Keyword gaps on built pages (titles were written from the URL topic; `primary_keyword` was not
  checked before building):
  - fixed in title, description and lead: home now targets the app queries ("app for learning korean
    language", 9.9K); /phrases/ uses "how do you say it in korean" (6.6K). The home H1 stays the hook
    "Read Korean in an afternoon." on purpose;
  - cosmetic: vowels ("korean language vowels"), basic-korean-phrases ("basic korean expressions");
  - wrong pick in the core: /phrases/k-drama/ ("what is a kdrama"), /phrases/love/ ("i love u in korean word").
- From now on: before building a page, take its `primary_keyword` and `secondary_keywords` from pages-v2.csv
  and put them into the title, H1, description and lead.

## How the owner wants pages
- Value first: every page needs a signature interactive element and real learner value, not text.
  Phrase pages, for example, have a "who are you talking to?" picker, a sound X-Ray and a one-question check.
- Mobile first (check at 390px), light and dark themes, a clean background (no gradients), no generic AI-looking copy.
- Design sources (claude.ai artifacts): canvas "hanguledu.com templates" https://claude.ai/artifact/6tMSKrXBiEAh2AByvJdPej,
  design system "HangulEdu Web" https://claude.ai/artifact/HRiQoNFEtokorB89VTe2fX.

## Audio
- All audio is Google Cloud TTS (ko-KR-Chirp3-HD-Aoede), not a native speaker.
  Never write "native audio" / "native speaker" in copy.
- New forms: feed the voice the pronounced form from the X-Ray (감사합니다 → 감사함니다). Read from the spelling,
  the voice swallows the last syllables. The voice varies between runs: the owner listens to every clip before it
  is copied in. Process: README.md, `scripts/tts/web_forms.json`.
- Run TTS (a paid API) only with the owner's OK. Never read, print or commit
  `~/Developer/android/hangul_hero/tools/korean_tts/gcloud-key.json`.
- The app's own 240 phrase clips were made from the spelling and may swallow endings too; not checked yet.

## Rules
- Commit only when the owner asks, on a branch; pushing `main` deploys the live site.
  Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Paid APIs (YepAPI, DataForSEO, Google TTS) only with the owner's approval and a spend cap.
- App content (phrases, letter clips) comes from the app via `npm run sync:app`; fix content in the app, not here.
- Screenshots: playwright-core + system Chrome against `npm run preview`. The old helper lived in a temp folder
  and is gone; write a new one if needed.

## Open items elsewhere
- Canvas templates still say "native audio at two speeds"; the Play listing may say the same.
- vicsotheme-site `src/pages/apps.astro` links to a wrong Play id (`com.VicsoTheme.hangulhero`).
