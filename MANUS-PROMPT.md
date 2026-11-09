# CHAPTER ONE V10.10 — COMPLETE REDESIGN + IMPORT / RECOVERY / SETTINGS

I uploaded the complete Chapter One V10.10 project ZIP. Extract it and use it as the source of truth. The two reference images are in `assets/`:
- `chapter-one-ui-reference.jpg` — exact visual reference for the app design.
- `chapter-one-logo.png` — supplied Chapter One logo with transparent outer background.

## 1. Design — replace the previous UI completely

The owner explicitly rejected the previous green/sage interface and requested a fresh implementation based on the supplied editorial reading-app reference. Do not keep the V10.9 visual treatment as the design baseline. Match the reference as closely as possible:
- Warm off-white / cream paper background.
- Editorial black typography, clean whitespace, minimal borders and soft low-contrast cards.
- Home / My Favorites: small logo at top-left, notification bell at top-right, centered featured book cover, book title/author/details and black pill-shaped Continue action.
- Library: collection cards with vertical book-spine artwork and book counts, like the supplied image.
- Floating black pill bottom navigation with exactly four icons, in this order: Home, File/Library, Settings, Profile. No text labels under icons. Selected item is a white circular highlight.
- Use the supplied uploaded logo on the splash/opening page, Sign In / Sign Up page, Home, Library and other main pages. Do not substitute a letter, text wordmark or another symbol.
- Never draw a fake iPhone status bar, Dynamic Island, charging/battery/network/wifi symbols or Android/iPhone gesture bar. Those are device operating-system UI, not part of the website.
- Apply the same cream/black design language to Create, Import, Translator, Settings, Profile, Book Details, Reader and Audio pages.
- Do not insert demo books or fake ratings/review counts. User-created/imported books only.

## 2. Four primary navigation destinations

Keep only these four buttons in the bottom navigation: Home, Library/File, Settings, Profile. Create is reachable from the Home action. Import is reachable from Home and Library. Statistics can be linked from Profile or Settings, not a fifth bottom-nav button.

## 3. Book Import menu — two clear choices

Create an Import Book page that presents two separate actions:
1. **Direct Import** — select a searchable PDF, extract its selectable text and first-page cover, create an imported book, save it to the user library, and open its Book Details/Reader view. It must appear as a normal book thumbnail/collection item on Home and Library. Do not require the user to fill in the AI book-creation form.
2. **Import & Translate** — route to the existing Translator workflow. Preserve PDF, DOCX, TXT and MD file handling, language selection, ordered chunk translation and saving as a translated book. Preserve the original if a translation fails.

Image-only/scanned PDFs need OCR. Do not pretend OCR ran when it did not; display a clear message when no selectable PDF text is found.

## 4. Profile — Recently Deleted and Restore

- Deleting one book moves it to a `Recently Deleted` list in Profile; it does not immediately destroy the book.
- Each trashed book must have a working Restore action and a separate Permanently Delete action with confirmation.
- Restore returns the book to Library and Home and re-syncs it to the existing Supabase `user_books` table.
- A soft-deleted book must not reappear from Supabase on next sync. Remove the matching user's cloud row on soft-delete and filter locally trashed IDs during sync.
- The “move all books to Recently Deleted” action must use the same recovery flow.
- Include deleted books in the downloadable JSON backup and restore them when the backup includes that field.
- Explain in the interface/help that Recently Deleted is currently stored on this browser/device; do not claim it is synced across every device unless you implement and test that.

## 5. Settings and daily reading reminder

- Settings page includes a daily reminder toggle, time picker, and reader default appearance (Warm, Classic, Sage, Night). Reader theme choices must update the default reader color values for new books.
- The bell button in the page header toggles the same daily reminder on/off. Show an obvious visual on/off state and persist the choice.
- Request browser notification permission only after the user turns reminders on. Never show permission prompts automatically.
- Schedule/check reminder time while the app is open and check when the app regains focus. Keep the reminder time persistent.
- Important browser limitation: do NOT claim the website can reliably schedule notifications when Chrome/browser is fully closed. Current implementation must state that background delivery requires a Push notification service. Do not add paid push services without owner approval.

## 6. Preserve all existing working product features and security

- Preserve existing Supabase project URL/publishable key, Auth sign-in/sign-up/password reset, RLS table and user cloud library.
- Preserve AI routing: Amharic Gemini Free Tier first and exact pinned free OpenRouter backup only; Amharic must never use OpenAI/paid fallback. When free quota fails, stop and show an error. English/Arabic/non-Amharic retain the existing OpenAI route. Never run live paid tests.
- Keep provider secrets in Netlify environment variables only. Never put secrets in browser code, zip, GitHub or logs.
- Preserve book creation, Story/Movie Idea, chapters/drafts, genre propagation, local Canvas-generated four covers, PDF.js, Mammoth, translation, reader pagination/progress, audio narration, PWA and existing Netlify function routes.
- Keep all user-created data. Do not reset Supabase, change table schema or clear localStorage during the redesign.

## 7. Existing deployment targets

Use the connected GitHub and Netlify accounts only after confirming authorization.
- GitHub: existing private repository `chapter-one`, branch `main`. Use that repository if it is the correct Chapter One project. Do not create a duplicate repo if it exists.
- Netlify site: existing site `one-chapter`, URL `https://one-chapter.netlify.app`. Do not create a second site.
- Netlify publish directory `.`; functions directory `netlify/functions`; no build command unless the existing site requires one.
- Preserve all existing Netlify environment variables. Do not replace them with blank values from `.env.example`.
- Required existing provider variables remain: `GEMINI_API_KEY`, optional free-only `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, and existing `OPENAI_TEXT_MODEL`; public Supabase overrides are optional. Never ask the owner to paste secrets into Manus chat.

## 8. Verify before pushing/deploying

Run:
- `node --check netlify/functions/ai.mjs`
- `node --check netlify/functions/covers.mjs`
- Extract inline JavaScript from `index.html` and run `node --check` on it.
- `node --test tests/ai-routing.test.mjs`
- Check that bottom nav has exactly four tabs in requested order; logo references exist; no fake status-bar elements were introduced; import, restore, trash, reminder and settings controls are connected.
- Confirm `netlify.toml`, Supabase URL/key and AI route security remain unchanged.
- Use static/mocked tests only. No live Gemini, OpenRouter or OpenAI requests.
- If feasible, preview on a mobile viewport. Do not claim device testing unless done.

Then commit and push to `main` with message:
`Apply Chapter One editorial redesign and library recovery features`

Deploy to the existing Netlify site. Report actual repository URL, commit SHA, Netlify deploy status/URL, tests passed, tests not performed, and any UI limitations. Do not claim success for steps that were not completed.
