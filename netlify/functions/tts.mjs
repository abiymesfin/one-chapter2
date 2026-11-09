// Chapter One — cloud narration (text-to-speech) for the Listen page.
// Why this exists: phone browsers only offer the voices installed on the phone. Android has no Amharic
// voice and does not label voices as male/female, so Amharic and "Male" fail there. This function asks
// Microsoft Azure AI Speech for a real Amharic (and English etc.) male/female neural voice instead.
//
// Netlify environment variables (Site configuration -> Environment variables):
//   AZURE_SPEECH_KEY     the "KEY 1" of your Azure AI Speech resource
//   AZURE_SPEECH_REGION  the resource region, e.g. westeurope, eastus, southafricanorth
// Azure's free F0 tier gives about 500,000 characters of neural voice per month.

const SUPABASE_URL = process.env.SUPABASE_URL || "https://fahphfzhjfygmghfknpb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Tsl4IfdXZaliJauPDC7rOA_4SfWFiH5";

// language code -> [BCP-47 locale, female voice, male voice]
export const VOICES = {
  am: ["am-ET", "am-ET-MekdesNeural", "am-ET-AmehaNeural"],
  en: ["en-US", "en-US-JennyNeural", "en-US-GuyNeural"],
  ar: ["ar-EG", "ar-EG-SalmaNeural", "ar-EG-ShakirNeural"],
  fr: ["fr-FR", "fr-FR-DeniseNeural", "fr-FR-HenriNeural"],
  es: ["es-ES", "es-ES-ElviraNeural", "es-ES-AlvaroNeural"],
  de: ["de-DE", "de-DE-KatjaNeural", "de-DE-ConradNeural"],
  it: ["it-IT", "it-IT-ElsaNeural", "it-IT-DiegoNeural"],
  pt: ["pt-BR", "pt-BR-FranciscaNeural", "pt-BR-AntonioNeural"],
  ja: ["ja-JP", "ja-JP-NanamiNeural", "ja-JP-KeitaNeural"],
  zh: ["zh-CN", "zh-CN-XiaoxiaoNeural", "zh-CN-YunxiNeural"]
};

const MAX_CHARS = 1500;

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "https://one-chapter.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  },
  body: JSON.stringify(body)
});

export function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
}

export function buildSsml(text, language, gender) {
  const entry = VOICES[language] || VOICES.en;
  const voice = gender === "male" ? entry[2] : entry[1];
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${entry[0]}"><voice name="${voice}">${escapeXml(text)}</voice></speak>`;
}

async function verifySignedInUser(event) {
  const headers = event.headers || {};
  const authHeader = headers.authorization || headers.Authorization || "";
  const match = String(authHeader).match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, status: 401, message: "Please sign in to use cloud narration." };
  try {
    const check = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${match[1]}` },
      signal: AbortSignal.timeout(12000)
    });
    if (!check.ok) return { ok: false, status: 401, message: "Your sign-in session expired. Sign in again, then retry." };
    const user = await check.json().catch(() => null);
    if (!user?.id) return { ok: false, status: 401, message: "Your sign-in session could not be verified." };
    return { ok: true, userId: user.id };
  } catch {
    return { ok: false, status: 503, message: "Could not verify your sign-in session. Check your internet connection." };
  }
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(204, {});
  const key = process.env.AZURE_SPEECH_KEY;
  const region = String(process.env.AZURE_SPEECH_REGION || "").trim().toLowerCase();
  const configured = Boolean(key && /^[a-z0-9-]+$/.test(region));

  // GET tells the app whether cloud voices are switched on (never reveals the key).
  if (event.httpMethod === "GET") return json(200, { ready: configured, languages: Object.keys(VOICES) });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });
  if (!configured) return json(503, { error: "Cloud voice is not set up yet (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION)." });

  const auth = await verifySignedInUser(event);
  if (!auth.ok) return json(auth.status, { error: auth.message });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Invalid request." }); }
  const text = String(body.text || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ").trim();
  const language = Object.prototype.hasOwnProperty.call(VOICES, body.language) ? body.language : "en";
  const gender = body.gender === "male" ? "male" : "female";
  if (!text) return json(400, { error: "No text to read." });
  if (text.length > MAX_CHARS) return json(413, { error: `Text is too long (max ${MAX_CHARS} characters per request).` });

  try {
    const upstream = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "ChapterOne"
      },
      body: buildSsml(text, language, gender),
      signal: AbortSignal.timeout(25000)
    });
    if (!upstream.ok) {
      const status = upstream.status;
      const message = status === 401 || status === 403 ? "Azure Speech key or region is wrong. Check AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in Netlify."
        : status === 429 ? "Azure Speech free limit or rate limit reached. Try again later."
        : `Azure Speech returned HTTP ${status}.`;
      return json(status === 429 ? 429 : 502, { error: message });
    }
    const audio = Buffer.from(await upstream.arrayBuffer());
    if (!audio.length) return json(502, { error: "Azure Speech returned no audio." });
    return {
      statusCode: 200,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "https://one-chapter.netlify.app" },
      body: audio.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") return json(504, { error: "Voice request took too long. Try again." });
    return json(502, { error: "Could not reach the voice service." });
  }
};
