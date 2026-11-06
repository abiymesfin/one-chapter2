# Chapter One — V10.6 Manus AI Handoff

## Source of truth

Use the full V10.6 project ZIP as the only source of truth. This is the approved Chapter One web app with full-book generation and cover-preview fixes. The assignment is to connect the real backend and package the existing product for Android, not to redesign or rebuild the UI.

## Product lock — do not change

- Product name: **Chapter One**.
- Use `assets/chapter-one-logo.png` as the brand logo and `icons/icon-512.png` as the launcher-icon source. The PWA manifest and icons are already included.
- Do not change screens, page structure, layout, colors, copy, typography, navigation or features.
- Do not add any demo, sample or fake books/data. New users must see an empty library until they create/import/translate a real book.
- Do not remove the existing Create a Book, Story / Movie Idea, Translator, PDF import/translate, Library, Home, Reader, Audiobook, Stats, Profile, backup/restore or settings flows.
- Do not create XML files unless a specific native Android implementation truly requires them; prefer the existing web UI in a secure Android wrapper.
- Do not put OpenAI keys, Supabase service-role keys or any other secret in client-side code or the APK.

## First: make the web app genuinely live

1. Deploy the complete project to a Netlify staging URL over HTTPS.
2. Configure `OPENAI_API_KEY` for both `netlify/functions/ai.mjs` and `netlify/functions/covers.mjs` in Netlify Environment Variables with Functions runtime scope. Redeploy after setting them.
3. Test `/api/ai` health and real calls for book outline, chapter, story outline, text translation and searchable PDF translation. Test four-cover generation and selection (four 640 × 960 JPEG thumbnail choices). Confirm failures are reported without losing the saved outline or completed chapters.
4. Create the Supabase project and run `supabase-schema.sql`.
5. Set `SUPABASE_URL` and the public `SUPABASE_ANON_KEY` / publishable key in the marked constants in `index.html`. Configure Supabase Auth site/redirect URLs and email confirmation for the Netlify site.
6. Test sign-up, confirmation, sign-in, sign-out, password reset, save/reload, and login from a second browser/device. Validate RLS by confirming one user cannot read or modify another user's `user_books` records. Test deletion and offline-to-cloud upload semantics before claiming full multi-device sync.
7. Do not call the app production-ready until these live tests pass. This source package does not contain the owner's API or Supabase credentials.

## Second: Android packaging

After the live web backend and accounts work:

- Prefer a Trusted Web Activity or secure WebView/Capacitor-style wrapper around the deployed HTTPS app, keeping the same Netlify backend and Supabase project.
- If the app loads the hosted HTTPS site, preserve same-origin `/api/ai` and `/api/covers` calls. If assets are bundled locally, add an explicit HTTPS API base URL; relative `/api/...` paths do not work from `file://`.
- Preserve Supabase session handling, redirect/callback behavior, password recovery and email confirmation on Android.
- Use the included Chapter One icon assets for Android launcher and splash branding. Do not redraw the logo.
- Verify on Android: launch icon, splash, empty first-run library, sign-up/sign-in, AI book creation (automatic full chapter writing to the requested page target), story generation, text/PDF translation, all four cover thumbnails and selection, reader, audiobook, local progress and cloud sync.
- Return a complete updated ZIP, APK/AAB when supported, and installation instructions. Do not invent test results or mark any feature passed unless executed.

## Important current limitations to disclose

- The app includes Netlify AI endpoints but they will not work until environment variables are configured and the site is redeployed.
- Supabase code/schema are present but the URL/public key are blank in this source. Auth and cloud sync are inactive until configured and tested.
- Activity statistics remain local; complete cloud sync of reading history is not part of the current release.
- Device TTS voices, including Amharic, vary by Android device and installed voices.
- The V10 code removes legacy demo/test entries on startup while preserving all other local books.
