import assert from "node:assert/strict";
process.env.AZURE_SPEECH_KEY = "k"; process.env.AZURE_SPEECH_REGION = "westeurope";
const { handler, buildSsml, escapeXml } = await import("../netlify/functions/tts.mjs");
const real = globalThis.fetch; const calls = [];
globalThis.fetch = async (url, opts) => {
  calls.push({ url: String(url), opts });
  if (String(url).includes("/auth/v1/user")) return opts.headers.Authorization === "Bearer good" ? new Response(JSON.stringify({ id: "u1" })) : new Response("{}", { status: 401 });
  return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
};
const post = (body, token = "good") => handler({ httpMethod: "POST", headers: token ? { authorization: `Bearer ${token}` } : {}, body: JSON.stringify(body) });
// SSML + voice mapping
assert.match(buildSsml("ሰላም", "am", "male"), /am-ET-AmehaNeural/);
assert.match(buildSsml("ሰላም", "am", "female"), /am-ET-MekdesNeural/);
assert.match(buildSsml("hi", "en", "male"), /en-US-GuyNeural/);
assert.equal(escapeXml('<a&"b">'), "&lt;a&amp;&quot;b&quot;&gt;");
// status
assert.equal(JSON.parse((await handler({ httpMethod: "GET", headers: {} })).body).ready, true);
// auth required, bad token rejected, no Azure call made
assert.equal((await post({ text: "x" }, null)).statusCode, 401);
assert.equal((await post({ text: "x" }, "bad")).statusCode, 401);
assert.ok(!calls.some(c => c.url.includes("tts.speech.microsoft.com")));
// validation
assert.equal((await post({ text: "" })).statusCode, 400);
assert.equal((await post({ text: "a".repeat(1501) })).statusCode, 413);
// happy path
const r = await post({ text: "ሰላም ለዓለም", language: "am", gender: "male" });
assert.equal(r.statusCode, 200); assert.equal(r.isBase64Encoded, true); assert.equal(r.headers["Content-Type"], "audio/mpeg");
const azure = calls.find(c => c.url.includes("tts.speech.microsoft.com"));
assert.equal(azure.url, "https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1");
assert.equal(azure.opts.headers["Ocp-Apim-Subscription-Key"], "k");
assert.match(azure.opts.body, /am-ET-AmehaNeural/);
// the key is never returned to the browser
assert.ok(!JSON.stringify(r).includes('"k"'));
// not configured -> ready:false
delete process.env.AZURE_SPEECH_KEY;
assert.equal(JSON.parse((await handler({ httpMethod: "GET", headers: {} })).body).ready, false);
globalThis.fetch = real;
console.log("PASS: cloud voice — auth, validation, Amharic/English male+female voices, key never exposed.");
