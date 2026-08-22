// Stage 5 endpoint: a classified fault in, biomechanical root cause out.

import { NextRequest, NextResponse } from "next/server";
import { analyzeForm } from "@/lib/ai/analysisBrain";
import type { FormClassification } from "@/types/analysis";

export async function POST(req: NextRequest) {
  const classification = (await req.json()) as FormClassification;
  const rootCause = await analyzeForm(classification);
  return NextResponse.json({ rootCause });
}
