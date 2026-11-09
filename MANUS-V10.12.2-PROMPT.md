# Copy-paste prompt for Manus AI

Deploy the attached Chapter One project (V10.12.2) to Netlify exactly as it is. Do NOT redesign, restyle or "improve" anything. Only keep these behaviours:

1. The app opens on the Library page (folder icon) by default, also right after sign-in. Home page still exists in the bottom navigation (Home, Library, Settings, Profile).
2. Library: each collection card shows its books (with covers) in one horizontal swipe row. No tap-to-expand grid. The only action icons in the Library header are Search and Import & Translate (upload icon). There are no Create Book / Story & Movie / Translator options anywhere.
3. Import & Translate page: import a PDF (cover + reading structure kept) or import and translate it. Translation must keep the book's structure and genre style (headings, paragraphs, dialogue, verse line breaks) and must not turn the book into one block of prose. The prompt for this lives in `netlify/functions/ai.mjs` (translate mode) and the PDF text/paragraph reconstruction is in `index.html` (`pdfItemsToLines`, `pdfLinesToParagraphs`, `extractPdf`). Do not simplify them.
4. The logo (`assets/chapter-one-logo.png`, `icons/*`) is the new book-and-"1" mark, used on the loading screen, Sign In page and the top bar with the text "Chapter One" beside it. Do not replace it.
5. The bell icon in the top bar toggles the daily reminder: OFF = grey bell with a slash, ON = black circle with white bell and a green dot. The "AI connection" row was removed from Settings on purpose.
6. Keep `.env` variables, Supabase and AI routing unchanged. Run `node --test tests/ai-routing.test.mjs` before deploying.

After deploying, check on a phone: (a) open the app, it lands on Library; (b) import a real Amharic PDF and open it in the reader: headings and paragraphs must be separate; (c) Import & Translate the same PDF to English: the result must keep the same headings/paragraphs; (d) tap the bell: the icon visibly changes.
