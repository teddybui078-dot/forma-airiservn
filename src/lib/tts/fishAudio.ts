// Stage 7: Fish Audio API.
// Converts the distilled coaching cue into low-latency, natural speech.
//
// Verified against https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech
// (2026-08-22): POST /v1/tts, Bearer auth, JSON body, optional `model` header
// to pick the TTS model, optional `reference_id` body field to pick a voice.
//
// TODO: FISH_AUDIO_API_KEY is not yet set in this environment - the request
// shape below is correct per the docs but has not been exercised against a
// real key. Set FISH_AUDIO_API_KEY (and optionally FISH_AUDIO_VOICE_ID) and
// smoke-test before relying on this in the coaching loop.

const FISH_AUDIO_ENDPOINT = "https://api.fish.audio/v1/tts";

/** Synthesizes `text` and returns the raw audio bytes (mp3). */
export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) throw new Error("FISH_AUDIO_API_KEY is not set");

  const voiceId = process.env.FISH_AUDIO_VOICE_ID;

  const res = await fetch(FISH_AUDIO_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Selects the TTS model; free tier default. See docs for other tiers.
      model: "s2.1-pro-free",
    },
    body: JSON.stringify({
      text,
      format: "mp3",
      ...(voiceId ? { reference_id: voiceId } : {}),
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Fish Audio request failed: ${res.status} ${errorBody}`);
  }

  return res.arrayBuffer();
}
