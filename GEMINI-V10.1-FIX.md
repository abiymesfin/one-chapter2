# Chapter One V10.1 — Gemini API compatibility fix

This patch retains the V10 app and fixes the Netlify AI function for Gemini 3 OpenAI-compatible requests:

- Omits `reasoning_effort: "none"` for Gemini 3 models. Gemini 3 cannot disable reasoning.
- Leaves Gemini 3 sampling settings at provider defaults.
- Retries transient 500/502/503/504 provider responses up to two additional times with a short backoff.
- Logs provider status and message in Netlify function logs without logging the API key.

Netlify environment variables for Gemini text generation:
- `AI_API_KEY`: the Gemini API key from Google AI Studio.
- `AI_BASE_URL`: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
- `AI_MODEL`: `gemini-3.8-flash`

Do not put the key in frontend files or send it in chat. This patch does not alter the app UI, database, cover-image function, or user book data.
