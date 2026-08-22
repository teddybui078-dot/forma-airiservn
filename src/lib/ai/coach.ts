// Stage 6 owner (coaching-loop track): distills the root cause explanation
// (from analysisBrain.ts) into a short spoken cue.

import { callGemini } from "./geminiClient";

export const COACH_SYSTEM_PROMPT = `You are a strength coach giving a real-time verbal cue.
You receive a biomechanical root cause explanation.
Distill it into a single, encouraging, actionable cue of 5 words or fewer, e.g. "Push your left knee outward!"
Respond with only the cue text.`;

export async function generateCoachingCue(rootCause: string): Promise<string> {
  return callGemini(COACH_SYSTEM_PROMPT, rootCause);
}
