# CHAPTER ONE V10.9 — MANUS AI IMPLEMENTATION TASK

You are updating my existing Chapter One web app. The ZIP contains the current full project in the `chapterone_work/` directory. The visual reference is `assets/chapter-one-design-reference.jpg`.

## Main task
Use the provided reference image as the design system for the ENTIRE app. The new code in `index.html` already contains the V10.9 redesign. Treat that implementation as the intended direction and finish/verify it rather than replacing it with a different design.

The design language must be consistent across every screen:
- Warm off-white / cream paper background.
- Minimal black and charcoal typography, with elegant editorial/serif headings.
- Generous whitespace and simple, restrained controls.
- Real book covers displayed prominently.
- Soft cream collection cards with book-spine artwork.
- Black floating pill bottom navigation with a white active icon circle.
- Preserve the product name and branding as **Chapter One**. Do not copy the unrelated `n.` wordmark from the sample image.

## Screens
1. Home / My Favorites: editorial header, featured real saved book with cover, title, author when available, description, Continue button, and horizontal book-cover carousel.
2. Library: collections grouped from actual book genres, visible real book counts, expandable collections, search, Create, and visible Import PDF action.
3. Create a Book, Story / Movie Idea, and Translator: keep all existing fields and working actions, restyled to the cream/black visual system.
4. PDF Import: Home and Library Import PDF actions must open the existing searchable-PDF file picker and import flow. Do not build a fake button. Imported books must be saved to the signed-in user's library, shown as real cover thumbnails, and opened in the Chapter One Reader. Reflow extracted PDF text into the app's Reader pages; do not pretend the reader preserves the PDF's exact original page layout. Keep the scanned-PDF/OCR limitation clear.
5. Book Details, Reader, Audio, Statistics, Profile, Sign In, and Sign Up: retain all existing behavior and apply the same visual theme.

## Important functional rules
- Do not add demo books, fake collections, fake ratings, example content, or hardcoded sample counts. Every book and count shown must come from actual saved user data.
- Keep the existing Supabase URL, public key, authentication flow, RLS assumptions, cloud book sync, local fallback, backup/restore, and reading progress behavior.
- Keep the existing AI backend and Netlify functions. Do not change AI provider routing, free-tier policy, model IDs, authentication checks, or API key handling unless a real blocking bug is found. Never put secret API keys in frontend code, GitHub, or this ZIP.
- Keep Amharic AI free-only with no paid fallback. English/Arabic existing OpenAI behavior must not be silently changed.
- Do not remove audiobook, cover selection, story idea, translation, stats, or any existing feature just to make the design simpler.
- Do not overwrite user books or reset storage. Keep backward compatibility with existing saved book data.
- The project is a responsive website/PWA used mainly on Android phones. Verify at narrow mobile widths and desktop widths.

## Required checks before deploy
1. Run `node --check` on the inline JavaScript (or equivalent browser syntax validation).
2. Run `node --test tests/ai-routing.test.mjs`.
3. Check all buttons and routes: Home, Library, Create, Import PDF file selection, PDF import to library, book card, Reader pagination, Continue, Search, Profile, Sign Out, and bottom navigation.
4. Confirm the new design reference is followed on all pages, without overflow or clipped controls on Android-sized screens.
5. Do not invent a successful AI/Supabase test. Clearly label anything that needs real credentials or a live provider as not tested.

## GitHub and Netlify
- Work from the supplied `chapterone_work/` project folder.
- Push to my existing private `chapter-one` GitHub repository and its `main` branch if that is the connected repository. Do not create a duplicate repo if the existing one is available.
- Deploy to my existing Netlify site `one-chapter` at `https://one-chapter.netlify.app`. Do not create a second Netlify site.
- Preserve the existing Netlify environment variables. Do not expose or print their values.
- Keep `netlify/functions` and the existing `netlify.toml` configuration.

## Final report
Return:
- GitHub repository URL and commit SHA.
- Existing Netlify site deployment status and deployed URL.
- QA results, separating tests actually run from tests not run.
- Any remaining issue that prevents PDF import or mobile UI from working.

Do not claim a push, deployment, test, or API call succeeded unless you actually verified its result.
