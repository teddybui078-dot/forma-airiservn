// Stage 5 owner (motion-classifier track): explains a classified fault in
// plain language. Fed a FormClassification (from src/lib/motion/classifyForm.ts)
// rather than raw deltas, since the fault type is already known from the
// trained classifier - Gemini's job is narrating the "why", not detecting
// the "what".

import { callGemini } from "./geminiClient";
import type { FormClassification } from "@/types/analysis";

export const ANALYSIS_SYSTEM_PROMPT = `You are a biomechanics expert explaining a squat form fault to an athlete.
You receive the classified fault type and the joint-angle features that produced it.
Explain the likely root cause (e.g. muscle weakness, mobility limitation) in 1-2 concise sentences.`;

export async function analyzeForm(classification: FormClassification): Promise<string> {
  return callGemini(ANALYSIS_SYSTEM_PROMPT, JSON.stringify(classification));
}
