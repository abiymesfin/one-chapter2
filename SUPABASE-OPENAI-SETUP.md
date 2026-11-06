# Chapter One — Supabase + OpenAI setup

## Supabase values already added

The project URL and public publishable key provided by the owner are prefilled in `index.html`.
The key is a Supabase **publishable** key (safe for a browser when Row Level Security is enabled). Never replace it with a `service_role` or secret key.

## 1. Create the database table

1. Open the Supabase project dashboard for project `fahphfzhjfygmghfknpb`.
2. Open **SQL Editor** → **New query**.
3. Paste the complete contents of `supabase-schema.sql` and click **Run**.
4. Confirm that `public.user_books` exists and Row Level Security is enabled.

The app uses this table for per-user cloud book storage. The policies restrict each signed-in user to rows whose `user_id` equals `auth.uid()`.

## 2. Configure Supabase Auth redirects

In Supabase, open **Authentication** → **URL Configuration**:

- Site URL: `https://YOUR-REAL-NETLIFY-SITE.netlify.app`
- Add these Redirect URLs: `https://YOUR-REAL-NETLIFY-SITE.netlify.app` and `https://YOUR-REAL-NETLIFY-SITE.netlify.app/**`

If the production domain changes, update these values to the exact live domain. Under **Authentication** → **Providers** → **Email**, keep Email enabled. With email confirmation enabled, users must click the confirmation email before signing in.

## 3. Supabase email delivery (important)

The built-in Supabase email provider is for development and testing. Its current documented limit is 2 emails per hour for the entire project, and with the built-in provider it only delivers to authorized team addresses. This is the cause of `Email rate limit exceeded` during repeated sign-up or password-reset testing.

For public sign-ups, configure a custom SMTP provider in Supabase → Authentication → Emails → SMTP Settings. Supabase supports SMTP services such as Resend, Brevo, Postmark, AWS SES and SendGrid. After SMTP is working, review Authentication → Rate Limits to set the email limit appropriate for the provider. Do not repeatedly retry sign-up while rate-limited.

For a temporary test, you can disable email confirmation in Authentication → Providers → Email, but this is not the recommended public-production setup. Re-enable confirmation and configure SMTP before launching to other users.

## 4. Keep OpenAI server-side in Netlify

In Netlify → Project configuration → Environment variables, set these for the Functions runtime:

- `OPENAI_API_KEY` = your OpenAI API key (secret; never put it in `index.html`)
- `OPENAI_TEXT_MODEL` = `gpt-6-luna` (optional; this is the default)

The OpenAI API key is separate from Supabase. Signing up creates an app account and enables per-user cloud library sync; it does not create or replace the OpenAI API key. The same Netlify serverless function handles book outlines, chapters and text translation. ChatGPT subscriptions do not include API credits; API usage is billed separately.

After setting or changing Netlify variables, redeploy the site. A GET request to `https://YOUR-REAL-NETLIFY-SITE.netlify.app/api/ai` should return JSON with `configured: true` and the configured model; it does not reveal the API key.

## 5. Deploy and test

1. Deploy this complete V10.2 ZIP to the existing Netlify project (not just `index.html`).
2. Open `https://YOUR-REAL-NETLIFY-SITE.netlify.app` and create an account.
3. If email confirmation is enabled, confirm from the email, return to the site and sign in.
4. Create a small test book. Confirm it appears in the Library and, in Supabase Table Editor → `user_books`, a row exists for that signed-in user.
5. Sign in from another device/browser to check that the cloud book is restored.
6. Test book generation and text translation separately to verify OpenAI.

## Important limits

- This ZIP configures the supplied Supabase project URL and publishable key and improves initial local-to-cloud book migration. The database table must still be created by running `supabase-schema.sql` in the Supabase SQL Editor; I cannot execute that action inside the owner's dashboard from this ZIP build.
- OpenAI is independent of Supabase. Keep the OpenAI API key only in Netlify environment variables.
- AI cover image generation remains a separate provider integration; the existing cover function expects its own configured image-provider key.
- Local reading activity statistics are not fully synchronized to Supabase in this release.


## V10.3 account entry screen

The V10.3 build displays a dedicated Sign In / Create Account screen on app launch whenever there is no authenticated Supabase session. A signed-in session enters the library. The supplied logo is used for the splash screen, authentication screen, home header and installed-app icons.

## 6. V10.4 AI provider 429 notes

- An OpenAI HTTP 429 is a provider quota/rate-limit response, not a Supabase authentication failure. Check API billing, usage limits, and rate limits in the OpenAI Platform.
- The V10.4 function surfaces the quota metric and any retry delay Google returns. It does not blindly retry 429 because a daily quota or project/billing quota cannot be fixed by immediate retries.
- AI cover images also use OpenAI through `OPENAI_API_KEY`. The cover is optional; choose **Use standard cover** to save the book without AI-generated artwork.
- See `AI-429-DIAGNOSTICS.md` for the full diagnostic steps.
