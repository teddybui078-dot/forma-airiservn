// Client-side playback for stage 7: sends a coaching cue to /api/speak and
// plays back the mp3 response.

/** POSTs `text` to /api/speak and plays the returned audio. Resolves when playback ends. */
export async function playCue(text: string): Promise<void> {
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`/api/speak failed: ${res.status} ${await res.text()}`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  try {
    await new Promise<void>((resolve, reject) => {
      audio.addEventListener("ended", () => resolve(), { once: true });
      audio.addEventListener("error", () => reject(audio.error), { once: true });
      audio.play().catch(reject);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
