const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return response(204, {});
  if (event.httpMethod !== "POST") return response(405, { error: "Method not allowed." });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return response(503, { error: "AI cover images use a separate OpenAI API key. Add OPENAI_API_KEY in Netlify to generate AI covers, or choose Skip cover to save the book with its standard cover. The same OpenAI API key is used for text and image features." });
  const rawBody = event.body || "{}";
  if (typeof rawBody !== "string" || rawBody.length > 12000) return response(413, { error: "The cover request is too large." });
  let body;
  try { body = JSON.parse(rawBody); } catch { return response(400, { error: "Invalid request body." }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return response(400, { error: "The request body must be a JSON object." });
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-flare";
  const title = String(body.title || "").trim().slice(0, 140);
  if (!title) return response(400, { error: "Book title is required." });
  const genre = String(body.genre || "").slice(0, 80);
  const style = String(body.style || "botanical").slice(0, 40);
  const description = String(body.description || "").slice(0, 900);
  const language = String(body.language || "English").slice(0, 40);
  const prompt = `Create a premium, professional vertical 2:3 FRONT-COVER ARTWORK for an original book titled “${title}”. Genre: ${genre || "general"}. Language/context: ${language}. Book premise for visual inspiration: ${description || "Create an evocative image based on the title and genre."}. Visual direction: ${style}. Make four visually distinct cover-art directions, varying the visual metaphor, focal subject, composition and palette so the user can compare clearly different concepts. Each output should be a sophisticated publishing-house illustration with deliberate composition and professional lighting; do not make near-duplicates. This is ARTWORK ONLY: do not render any title, letters, words, numbers, author names, logos, watermarks, frames, mockups, hands, or extra text. Leave the central composition clean enough for the app to place the book title as crisp interface text.`;
  try {
    const upstream = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, n: 4, size: "640x960", quality: "low", output_format: "jpeg", output_compression: 58 }),
      signal: AbortSignal.timeout(180000)
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      if (upstream.status === 429) {
        return response(429, { error: "OpenAI image-generation quota or rate limit reached (HTTP 429). This is separate from book-text generation. Check your OpenAI API billing and usage limits, or choose the standard cover.", provider: "OpenAI Images", providerStatus: 429 });
      }
      if (upstream.status === 401) return response(401, { error: "OpenAI API key is invalid. Check OPENAI_API_KEY in Netlify environment variables.", provider: "OpenAI Images", providerStatus: 401 });
      if (upstream.status === 403) return response(403, { error: `Your OpenAI project may need image-model access or organization verification. ${payload?.error?.message || "Check API project permissions."}`, provider: "OpenAI Images", providerStatus: 403 });
      return response(502, { error: payload?.error?.message || `Image provider returned ${upstream.status}.`, provider: "OpenAI Images", providerStatus: upstream.status });
    }
    const images = (payload.data || []).map(item => item.b64_json ? `data:image/jpeg;base64,${item.b64_json}` : (item.url || "")).filter(Boolean).slice(0, 4);
    if (images.length !== 4) return response(502, { error: `OpenAI returned ${images.length} of 4 requested cover images. Please try again.`, provider: "OpenAI Images" });
    const responseSize = images.reduce((total, image) => total + image.length, 0);
    if (responseSize > 4700000) return response(502, { error: "The four cover thumbnails were too large to send safely. Please tap Generate four options again; the app now requests smaller cover images." });
    return response(200, { images, model });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") return response(504, { error: "Cover generation took too long. Please try again." });
    return response(502, { error: "Could not reach the image provider. Try again later." });
  }
};
