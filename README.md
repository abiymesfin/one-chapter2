# Chapter One — V10.10

Mobile-first book creation, PDF import/translation, library and reader app. V10.10 applies the supplied editorial UI reference and owner-provided logo, adds two import paths, Recently Deleted recovery, and daily reading reminder settings while preserving the existing Supabase and AI backend.

## Start here
- `MANUS-START-HERE-AM.md` — Amharic instructions.
- `MANUS-PROMPT.md` — complete Manus task.
- `V10.10-RELEASE-NOTES.md` — release changes and QA status.
- `V10.11-REFERENCE-MATCH-NOTES.md` — Home/Library pixel match to the reference photo.
- `assets/chapter-one-ui-reference.jpg` — user-provided UI reference.
- `assets/chapter-one-logo.png` — processed transparent logo supplied by the owner.

## AI routing
- Amharic: existing Gemini Developer API Free Tier route first; optional fixed `:free` OpenRouter backup. Never OpenAI or paid fallback for Amharic.
- English, Arabic and other non-Amharic: existing OpenAI route. API usage may incur charges.
- Amharic free quotas fail → request stops with an error; no paid fallback.

## Security / deployment
- Supabase Auth and user book cloud sync are preserved.
- Netlify Functions: `netlify/functions`; publish directory `.`.
- Provider keys must be set in Netlify Environment Variables only. Never commit keys.
- Existing site: https://one-chapter.netlify.app. No deployment is claimed by this local package.

## Checks
Run `node --test tests/ai-routing.test.mjs`. See `V10.10-RELEASE-NOTES.md` for checks performed and items not tested.

## V10.13
See V10.13-NOTES.md (clean slate, restore fixes, online Amharic/male voice).
