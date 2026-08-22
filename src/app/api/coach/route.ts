// Stage 6 endpoint: root cause in, 5-word coaching cue out.

import { NextRequest, NextResponse } from "next/server";
import { generateCoachingCue } from "@/lib/ai/coach";

export async function POST(req: NextRequest) {
  const { rootCause } = (await req.json()) as { rootCause: string };
  const text = await generateCoachingCue(rootCause);
  return NextResponse.json({ text, createdAt: Date.now() });
}
