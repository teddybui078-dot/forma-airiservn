// Stage 7 endpoint: coaching cue text in, spoken audio out.

import { NextRequest } from "next/server";
import { synthesizeSpeech } from "@/lib/tts/openaiVoice";

export async function POST(req: NextRequest) {
  const { text } = (await req.json()) as { text: string };
  const audio = await synthesizeSpeech(text);
  return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
}
