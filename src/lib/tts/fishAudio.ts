// Stage 7: Fish Audio API.
// Converts the distilled coaching cue into low-latency, natural speech.

const FISH_AUDIO_ENDPOINT = "https://api.fish.audio/v1/tts";

/** Synthesizes `text` and returns the raw audio bytes (mp3). */
export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) throw new Error("FISH_AUDIO_API_KEY is not set");

  const res = await fetch(FISH_AUDIO_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, format: "mp3" }),
  });

  if (!res.ok) throw new Error(`Fish Audio request failed: ${res.status} ${await res.text()}`);

  return res.arrayBuffer();
}
