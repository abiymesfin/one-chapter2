# Chapter One — OpenAI API setup and HTTP 429 guide

Book outlines, story outlines, chapter writing, and translation now use the OpenAI API. The same OpenAI API key can also be used for optional AI cover images.

## Netlify environment variables

- `OPENAI_API_KEY` = your OpenAI API key (secret).
- `OPENAI_TEXT_MODEL` = `gpt-6-luna` (optional; default text model).
- `OPENAI_IMAGE_MODEL` = `gpt-image-2.5-flare` (optional; cover model).

Do not add the key to `index.html`, GitHub, or any public file. Add it in Netlify Site configuration → Environment variables, enable it for Functions, then redeploy.

## If OpenAI returns HTTP 429

- If the error says `insufficient_quota`, check API billing, available credits, and the project's usage limit in the OpenAI Platform.
- If it says rate limit, wait for the indicated retry interval and reduce repeated requests.
- ChatGPT Free/Plus subscriptions are separate from API billing and do not provide API credits.
- Do not repeatedly click Book Create while a request is still processing.

## Supabase is separate

Supabase handles account sign-in and cloud book storage. OpenAI handles book generation and translation. A successful sign-in does not guarantee the OpenAI API key or billing is configured.

AI cover generation is optional. If image generation is unavailable or rate-limited, choose the standard cover and continue saving the book.
