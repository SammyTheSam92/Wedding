# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page wedding website for Vivi & Sam (08.10.2026). Everything the browser
needs is in **`index.html`** — HTML, all CSS (one `<style>`), and all JS (`<script>`
blocks). There is **no build system, no bundler, no package.json, no tests, no lint**.
You edit `index.html` and push; that is the whole workflow.

Supporting files:
- `fonts/` — self-hosted `.woff2` (Cormorant Garamond, Marcellus, Herr Von Muellerhoff)
- `assets/lenis.min.js` — smooth-scroll library, self-hosted
- `apps-script/Code.gs` — Google Apps Script that receives RSVPs (see RSVP section)
- `firebase/storage.rules` — Firebase Storage security rules for the guest photo/video uploads
- `CNAME`, `.nojekyll` — GitHub Pages custom-domain + no-Jekyll markers
- `SETUP.md` — the human-facing setup guide (make repo public, deploy Apps Script, DNS, Firebase)

## Critical gotchas

- **`index.html` is ~470 KB because the hero and finale photos are embedded as base64
  data-URIs on two single ~200 KB lines.** Reading the whole file, or a range that spans
  those lines, will blow the token limit and fail. Always read/edit *around* them: work in
  small line ranges, or match short unique strings with Edit. `grep -n` to find anchors first.
- **Entrance animations are gated behind the password gate.** Anything that should animate
  when the visitor arrives must key off `body.entered` (added in the gate's success handler),
  **not** page load — otherwise it plays while the gate still covers the screen and is never
  seen. See the `#hero .hero-photo` / `heroPhotoIn` rules.
- **Do not re-introduce Google Fonts via `<link>`/`@import`.** Fonts are self-hosted on
  purpose (GDPR — German site). Add new weights by dropping a `.woff2` in `fonts/` and adding
  an `@font-face` at the top of the `<style>` block.
- The password gate (`ACCESS_CODE` in the JS) is **client-side and cosmetic** — the content
  ships in page source. It only keeps out search engines (`noindex`) and casual snoopers.

## RSVP data flow

The form POSTs (`fetch`, `mode:'no-cors'`, `text/plain`) to a Google Apps Script web app URL
held in `SHEET_ENDPOINT` (top of the main `<script>`). That script (`apps-script/Code.gs`,
container-bound to the "Hochzeit" spreadsheet, deployed manually by the owner) appends a row to
an auto-created `RSVP` sheet. Because the request is `no-cors`, the response is opaque — the UI
always shows success and cannot detect a server error.

**The radio `value=` attributes are intentionally German** (`Vegetarisch`/`Fleisch`/`Fisch`,
`Zusage`/`Absage`, etc.) so the spreadsheet stays consistent no matter the display language.
Only the visible `<label>` text is translated. Keep it that way.

## Guest photo/video uploads (`#fotos` section)

Firebase Storage, guests upload directly from the browser. The whole feature is **gated**:
the section (`<section id="fotos" hidden>`) and its nav link (`#nav-fotos`) stay hidden and
the Firebase SDK is **never loaded** unless `uploadLive` is true — auto-unlocks on
**2026-10-08**, or force it any time with `?fotos=1` for testing. Config lives in
`FIREBASE_CONFIG` (top of the last `<script>`; the web config is **not** secret — security is
in `firebase/storage.rules`). On unlock the code lazy-loads the Firebase **compat** SDK from
gstatic, does **anonymous auth**, and `uploadBytesResumable`s each file to
`gaeste-uploads/<name?>/…` (resumable → large videos survive). Security rules allow
anonymous **write-only** (no read/list), image/* or video/*, < 2 GB. Owner needs the Blaze
plan + an EU-region bucket; see SETUP.md §4.

## Internationalisation (DE / EN / ES)

Runtime string-swap, no framework. Translatable nodes carry `data-i18n="key"`
(`textContent`), `data-i18n-html="key"` (`innerHTML`, e.g. the finale line with a `<br>`), or
`data-i18n-ph="key"` (input `placeholder`). The dictionary `T` and the switcher logic live in
the `<script>` injected right **after `</main>`**; it exposes `window.__setLang(lang)` and
`window.__t(key)`, persists to `localStorage`, and sets `<html lang>`.

To add/translate a string: give the element a `data-i18n*` attribute and add a
`{de,en,es}` entry to `T` under the same key. RSVP status/validation strings are set from JS
via `window.__t('key')` (e.g. `done_yes`, `val_name`), so those keys must exist in `T` with a
`de` value too.

## Motion / "haptics"

- Smooth momentum scrolling via **Lenis**, initialised only on desktop/fine-pointer and only
  after gate unlock (guarded by `prefers-reduced-motion`). Nav clicks route through
  `window.__lenis.scrollTo`.
- Scroll reveals: elements with class `reveal` get `.in` from an IntersectionObserver.
- Extra flourishes (scroll-progress bar, timeline line draw-in, hero parallax) are in the last
  `<script>` before `</body>`.
- Every motion feature has a `@media (prefers-reduced-motion: reduce)` fallback — preserve it.

## Deploy model

GitHub Pages is set to **"Deploy from a branch"** pointing at the working branch itself
(`claude/wedding-website-rebuild-wup7kv`), so **every push to that branch auto-publishes** (the
"pages build and deployment" run). There is no Actions build. Do all work on that branch. The
custom domain `www.vivi-sam.com` comes from the `CNAME` file; `.nojekyll` keeps Pages from
mangling paths. Asset paths are relative (`fonts/…`, `assets/…`) so they resolve both under the
`…github.io/Wedding/` path and at the domain root.

## Previewing changes

There is no dev server — `index.html` opens directly in a browser. When iterating on visuals
without a browser (e.g. verifying fonts, layout, or a language), the established approach is to
render locally with headless Chromium (`playwright-core`, browser at
`/opt/pw-browsers/chromium`, launched with the `HTTPS_PROXY` so Google-hosted resources resolve)
and screenshot each section — typically hiding `#gate`, force-adding `.in` to `.reveal`
elements, and calling `window.__setLang(...)` to check a specific language.
