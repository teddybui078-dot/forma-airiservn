// Stage 7: OpenAI TTS.
// Converts the distilled coaching cue into low-latency, natural speech.
// Replaces Fish Audio - same signature, same consumer (playCue.ts, /api/speak).

const OPENAI_TTS_ENDPOINT = "https://api.openai.com/v1/audio/speech";
const DEFAULT_VOICE = "alloy";

/** Synthesizes `text` and returns the raw audio bytes (mp3). */
export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch(OPENAI_TTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || DEFAULT_VOICE,
      input: text,
      response_format: "mp3",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`OpenAI TTS request failed: ${res.status} ${errorBody}`);
  }

  return res.arrayBuffer();
}
