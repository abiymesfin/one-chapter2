# Chapter One V10.10 QA report

## Passed — static checks
- Inline JavaScript extracted from `index.html` passed `node --check`.
- `netlify/functions/ai.mjs` and `netlify/functions/covers.mjs` passed `node --check`.
- `netlify.toml` still publishes `.` and uses `netlify/functions`.
- Existing Translator PDF/DOCX/TXT/MD input code paths are retained.
- Existing Supabase URL/publishable key and `supabase-schema.sql` are unchanged from V10.9 source.
- New UI assets include the user-provided logo and reference screenshot.
- Bottom navigation now contains exactly four destinations in the requested order.
- New Import, Settings and Profile/Recently Deleted elements exist in the page markup.

## Passed — mocked endpoint tests
Run with `node --test tests/ai-routing.test.mjs`.
- AI POST without/with invalid Supabase access token is rejected before provider requests.
- Amharic route uses Gemini Free Tier first and only the exact pinned OpenRouter Gemma `:free` backup.
- Amharic never calls OpenAI, including quota failures.
- English/Arabic retain the existing OpenAI route.
- Genre is included in the Amharic book prompts.
- Public status response does not reveal provider key values.

## Not tested — report honestly
- No live Gemini, OpenRouter or OpenAI requests were made.
- No live Supabase Auth/cloud sync interaction was run.
- No full interactive Android Chrome test or actual local PDF file-picker test was run.
- No full visual screenshot comparison was completed in a real browser.
- Scanned PDFs still require OCR; only selectable text is extracted.
- Daily reminder relies on browser notifications while the app is open/regains focus. Background delivery after browser closure needs a push service and is not included.
- No GitHub push or Netlify deployment was performed by the package builder.
