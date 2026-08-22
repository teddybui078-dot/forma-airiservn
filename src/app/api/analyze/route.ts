// Stage 5 endpoint: joint angle deltas in, biomechanical root cause out.

import { NextRequest, NextResponse } from "next/server";
import { analyzeForm } from "@/lib/ai/gemini";
import type { JointAngleDelta } from "@/types/analysis";

export async function POST(req: NextRequest) {
  const { deltas } = (await req.json()) as { deltas: JointAngleDelta[] };
  const rootCause = await analyzeForm(deltas);
  return NextResponse.json({ rootCause });
}
