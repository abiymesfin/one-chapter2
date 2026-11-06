# Chapter One — V10 Final Branding & Clean Release

A mobile-first book creation, translation, reading and audiobook web app, with the finalized Chapter One visual identity.

## Current release contents

- The approved **Chapter One Reading App Icon** is used on the splash screen and Home header. Matching favicon, Apple touch icon, Android/PWA 192px and 512px icons, a maskable icon, and `manifest.webmanifest` are included.
- No demo/sample books are seeded. The English sample book and Amharic audio test-book action have been removed from the product UI and runtime code.
- On startup, the app removes only legacy sample records (`demo`, `testAmharic`, or the known sample ID) from this browser's saved library. All other user-created, imported and translated books are preserved. The same filter applies to restored backups and downloaded cloud records.
- Existing layouts and features from V9 are retained: Home, Library, Create a Book, Story / Movie Idea, Translator, PDF import/translation, Book Details, Reader, Audiobook, Stats, local backup and account screens.
- Netlify AI functions remain in `netlify/functions/ai.mjs` and `netlify/functions/covers.mjs`.
- Supabase database schema and row-level security policies are included in `supabase-schema.sql`.

## Preview

Open `index.html` in Chrome for a local interface preview. The logo assets and manifest are stored in `/assets`, `/icons`, and the project root. For production behavior, deploy over HTTPS using Netlify; local `file://` previews cannot exercise the `/api/ai` and `/api/covers` serverless endpoints.

## Connect AI before Android packaging

1. Deploy this web project to Netlify as a live staging site.
2. In Netlify Site configuration → Environment variables, add `OPENAI_API_KEY` for book generation, translation, and optional AI cover images. Set the variables for the Functions runtime scope, keep them secret, and redeploy after changing them.
3. Test the AI health response, book outline/chapter writing, story generation, text/PDF translation and four-cover selection on the live HTTPS site.

Do not put an OpenAI API key in `index.html`, a browser bundle, a PWA manifest, or an Android APK. The AI calls must continue to go through the Netlify serverless functions.

## Connect Supabase before Android packaging

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL Editor. It creates `public.user_books` and enables row-level security with per-user read/insert/update/delete policies.
3. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the marked configuration constants in `index.html` using the project URL and public publishable/anon key. The publishable key may be present in a frontend app only when RLS policies are enabled and correctly restrict each user's rows. Never put a Supabase `service_role` or secret key in the browser or mobile app.
4. Configure Supabase Auth's site URL, allowed redirect URLs, and email confirmation settings for the live Netlify domain.
5. Verify sign-up, confirmation, sign-in, sign-out, password reset, new-book save, reload, and a second-device login before treating account storage as live. Verify deletion and offline-to-cloud migration before promising complete multi-device backup.

The current code includes a Supabase auth and basic cloud-book sync pathway, but it is intentionally not considered live until real project credentials are configured and the above tests pass. Reading activity statistics are still local to the browser; complete cloud history sync is not included in this release.

## Then convert to Android with Manus

Only after the Netlify AI functions and Supabase account/database behavior are verified on the live staging website should Manus package the project as an Android app. Keep the same Netlify backend and Supabase project. If Manus wraps the hosted HTTPS site, the existing `/api/ai` and `/api/covers` routes remain same-origin. If it packages a local WebView build, configure an explicit production API base URL and auth redirect handling; relative `/api/...` paths will not resolve from a local `file://` app asset. Keep all provider secrets server-side.

Use `assets/chapter-one-logo.png` as the source brand artwork and `icons/icon-512.png` as the launcher icon source. Do not create new branding, replace the logo, redesign screens, add demo/sample books, or remove existing features. This task is a packaging and integration handoff, not a redesign.

## Technical notes

- PDF import extracts selectable text and a first-page thumbnail in the browser. Scanned/image-only PDFs still need OCR, which is not included.
- AI generation, translation and image generation require network connectivity and configured credentials; usage may incur provider charges.
- Audiobook playback uses browser/device Text-to-Speech. Voice availability, especially Amharic, depends on the installed Android voice packages.
- The PWA manifest is included. Install from the HTTPS deployment in Android Chrome to use the branded home-screen icon; Android APK/AAB packaging remains the next Manus step.
- Only upload, translate or distribute books the user owns or has permission to use.

## Chapter One V4 updates

- Branded 3-second splash screen using the app's cream / sage-green palette and a custom `O–1–E` monogram with Chapter One identity.
- PDF import renders the first PDF page into a compact cover thumbnail when possible. A user-uploaded JPG/PNG/WebP cover can override it.
- Four selectable cover design presets (Botanical, Luxury, Artistic, Classic) are available when importing or creating a book. These are locally rendered cover styles, not AI-generated image files.
- `Import & Translate` translates a searchable PDF in sequential text sections using the configured AI provider, then saves both the original edition and translated edition in My Library with links between them.
- Historical V4 test-only Amharic sample action (removed from the V10 production release).
- Narrator options now expose actual installed voices for the book language, in addition to Female/Male preference. A Test selected voice action speaks a short sample. Male voice selection does not silently substitute a known female voice; availability depends on the installed device voices.

### PDF translation notes

PDF translation requires a searchable PDF (scanned image-only PDFs need OCR, which is not included in this build), an internet connection, a deployed Netlify function, and a configured `OPENAI_API_KEY`. Translation is sent in short sequential requests to stay under the existing per-request limit. Long PDFs can take time and may incur AI-provider charges. The extracted PDF cover is a thumbnail of page 1; it is not an AI-generated illustration. The four cover styles are designed templates. The original and translated text editions are saved separately.

### Audio notes

The app enumerates installed browser/device voices and lets the user test the chosen voice. It cannot create a missing Amharic or male voice. For Amharic narration, install an Amharic voice in Android Text-to-speech settings if one is available. If the device has no Amharic voice, a hosted TTS provider with Amharic support is required.


## Chapter One V5 updates

- Added an optional **Generate 4 AI cover options** action in the book creation/import form. It calls the new Netlify `covers` function and lets the user select one of four generated cover images; the selected cover is saved with imported/translated books and newly generated books.
- AI cover generation uses OpenAI Images (`gpt-image-2.5-flare` by default). Configure `OPENAI_API_KEY` in Netlify environment variables; `OPENAI_IMAGE_MODEL` can override the image model. This is a separate image-generation service and may incur charges.
- Narrator gender filtering is stricter: choosing Male or Female no longer populates the voice picker with unidentified/opposite-gender voices as fallback. If no clearly identified male voice exists for the book language, playback reports that instead of silently playing another voice. Device voice naming is not standardized, so some valid voices may remain unclassified.
- Existing PDF translation behavior remains unchanged: it translates extracted selectable text in sections, not scanned/image-only PDFs; OCR is not included.

## Historical V9 source notes

Upload the complete folder to Netlify and set `OPENAI_API_KEY` for book generation and translation. The default text model is `gpt-6-luna`; optionally set `OPENAI_TEXT_MODEL` to another model enabled for your API project. The same key is used for optional AI cover generation; the default image model is `gpt-image-2.5-flare`, optionally overridden by `OPENAI_IMAGE_MODEL`. Redeploy after setting environment variables. Do not put secret keys in `index.html`. ChatGPT subscriptions and API billing are separate; API usage may incur charges.


## Chapter One V7 fixes (2026-11-06)

- Added an animated loader to the 3-second branded splash screen: a rotating ring and animated progress line.
- Improved Home recent-book title contrast and weight so Amharic and English titles are easier to read. Book-cover lettering now uses white contrast rather than borrowing the reading-page text color.
- Replaced re-attached per-render book click listeners with one capture-phase delegated handler. This covers Home, Library grid, and Library list cards after every re-render.
- Added a clear message for missing book records, browser storage failures, and unexpected runtime errors; detailed errors are written to the browser console.
- Optimized uploaded and AI-selected cover images before saving, reducing the chance of exceeding mobile-browser local storage limits.
- Added serverless request-size checks and timeouts for AI text and image requests.
- Updated the text model default to `gpt-6-luna` and the image model default to `gpt-image-2.5-flare`; the prior defaults were deprecated/shut down according to current OpenAI API documentation.
- Added safer book-word-count handling for books with incomplete chapter data.

## Validation

- JavaScript syntax checked for `index.html`, `netlify/functions/ai.mjs`, and `netlify/functions/covers.mjs`.
- Deployment ZIP includes the full Netlify frontend, both serverless functions, Netlify redirects, Supabase schema, and this README.
- Live AI generation, OpenAI cover generation, Supabase authentication/sync, and Android-device voice output require the user's own service configuration and must be tested after deployment. They cannot be confirmed from a local source-only check.


## Chapter One V8 updates (2026-11-06)

- Rebuilt Home and Library book cards with a fixed cover height, a fixed two-line title area and a fixed metadata row. A short book and a long book now occupy the same card size; title and word-count text no longer change the card dimensions.
- Improved title readability across Amharic and English: titles are rendered as actual HTML text over a high-contrast cover panel, including when a user selects an AI cover image. This avoids relying on blurry or misspelled lettering embedded inside generated cover artwork. The text below each cover also uses a dark, high-contrast style with no blur or text shadow.
- Added a third Create-page mode, **Story / Movie Idea**, without removing or changing the existing Create a Book and Translator forms. Users can describe a film/story idea in their own words, choose English, Amharic, or another supported/custom language, set chapters/pages, and optionally specify genre, style and audience.
- The new AI story workflow creates an original title, description, genre, setting, cast, premise, story arc, twists and chapter plan; users can write the next chapter or all remaining chapters from that plan. The story result stays visible and refreshes its chapter progress as writing continues.
- Added server-side originality guidance: when an existing title such as Money Heist is named as inspiration, the AI may use only broad genre/mood/pacing cues and must invent new characters, setting, target/problem, method, scenes and plot. It must not recreate the original work or its recognizable elements.
- Fixed a failure path in Write remaining so a failed AI request stops the loop instead of retrying the same chapter indefinitely.

### V8 validation

- `node --check` passed for the inline frontend JavaScript and both Netlify function modules.
- HTML structure check found no duplicate element IDs; all three forms and the three Create modes were detected.
- Browser UI test with mocked AI responses passed for switching between forms, generating a story outline, writing the first chapter, updating story progress and returning to Home. No browser JavaScript page errors were reported.
- Home card titles were confirmed as fully opaque, with no CSS filter or text shadow. English and Amharic titles were inspected, and three different books (including varying title lengths and word counts) measured at the same card height (242 CSS px at the 390 px viewport).
- The AI story-outline serverless branch was exercised with a mocked upstream response. This verifies request parsing and response handling, not real paid model availability.
- Live Netlify deployment, real AI credentials, Amharic output quality, and Android-device rendering still require deployment/device testing.


## Chapter One V9 final cover updates (2026-11-06)

- Removed the dark rectangular background behind Home/Library cover-title text. Book titles remain as crisp HTML overlays directly over the artwork, with a soft text shadow only; the cover image itself is not dimmed by a heavy black bottom gradient.
- Reworked Book Details cover rendering: the cover is now a dedicated responsive `img` element using the saved `coverImage`, with the book title as live DOM text on top. This makes imported PDF covers and AI-generated cover thumbnails visibly appear when a book is opened.
- Added a reusable four-option cover picker modal. The app can generate four portrait cover-art images, let the user select one, optimize it to JPEG for storage, and save it with the book. If image generation is unavailable, the user can retry or continue with the standard designed cover without losing the translation/book draft.
- Integrated the chooser into the standard Create a Book flow, Story / Movie Idea flow, text Translator flow, and searchable-PDF Import & Translate flow. The original PDF edition keeps its extracted first-page thumbnail; the translated edition can receive the newly selected AI cover.
- Existing pre-generation cover gallery remains supported. If a user already selected a cover for the exact matching book title, the form reuses it instead of generating a second set.
- Updated `netlify/functions/covers.mjs` to request artwork-only images with no embedded text, because the app displays the title as sharp HTML. The function requests four 2:3 JPEG outputs and compresses them to reduce data transfer/storage size.
- Image generation uses the current documented GPT Image model `gpt-image-2.5-flare` by default (`OPENAI_IMAGE_MODEL` override supported). The Images API supports `n` for multiple results, and JPEG output/compression options. Image generation requires a configured OpenAI API key and may incur usage charges.

### V9 validation

- Frontend inline JavaScript and both Netlify function modules are syntax-checked.
- Automated browser tests cover the no-black-background Home cover titles, Details-page cover thumbnail, standard book creation, Story / Movie Idea creation, text translation and the four-choice cover selector using mocked AI/image responses. These tests verify the client workflow, not actual provider quality or billing.
- Real OpenAI cover generation, real translation/generation, Netlify deployment, persistent device storage and Android rendering still require deployment with credentials and device-level verification.


## Chapter One V10 final release (2026-11-06)

- Added the selected Chapter One logo to the splash screen and Home brand lockup. Added a favicon, Apple touch icon, PWA manifest, standard Android/PWA launcher icons (192px/512px), and a maskable icon.
- Removed the built-in English sample book and removed the Amharic test-book creation button and sample text. No book is inserted automatically into a fresh library.
- Added safe legacy cleanup at startup and during backup restore/cloud merge. Only records marked as demo/test or the exact old sample ID are removed; normal user-created books are kept.
- Kept the V9 screens, app structure, creation/translation workflows, Netlify functions and Supabase schema.
- Verified syntax for the inline application script and both Netlify function modules. Verified that no demo seed function or test-book UI remains, and that the PWA manifest references the included icon assets.
- Live AI, real Supabase authentication/cloud persistence, and Android packaging require owner credentials and production testing; they are not represented as already connected.


## V10.2 Supabase connection update

- The supplied Supabase Project URL and public publishable key are preconfigured in `index.html`.
- First sign-in now reconciles the local library with cloud books and uploads local-only/newer books to the signed-in user's cloud library.
- Run `supabase-schema.sql` in Supabase SQL Editor, configure Auth Site URL / Redirect URLs, and follow `SUPABASE-OPENAI-SETUP.md` before testing.
- OpenAI text generation requires `OPENAI_API_KEY` in Netlify Functions environment variables. Supabase signup does not provision an AI API key.

The V10.2 SQL also grants the table Data API permissions to the `authenticated` role only and revokes anonymous/public table privileges; RLS then restricts each row to its owner.


## V10.3 branding and account entry
- Updated the Chapter One logo using the owner-supplied artwork.
- App launch now shows a dedicated Sign In / Create Account screen until a Supabase session is active.
- Added clearer handling for Supabase email sending limits. A custom SMTP provider is needed for public registration at scale.

## V10.4 AI provider 429 update

See `AI-429-DIAGNOSTICS.md`. OpenAI powers book text generation, translation, and optional cover artwork. Configure `OPENAI_API_KEY` in Netlify. The standard cover remains available when image generation is not configured or is rate-limited.


## V10.6 full-book and cover fixes

See `V10.6-FIX-NOTES.md`. Book creation now writes the full chapter set automatically after saving the outline, with resumable progress. AI cover generation requests four smaller portrait thumbnails to reduce function response size.
