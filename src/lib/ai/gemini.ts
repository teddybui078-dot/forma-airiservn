// Stage 5-6: Gemini 2.5 Flash API.
// Two-stage split: the Analysis Brain reads joint angle deltas for a root
// cause, then the Voice Coach distills that root cause into a 5-word cue.
// System instructions are prototyped/benchmarked in Google AI Studio - see
// src/lib/ai/prompts.ts.

import type { JointAngleDelta } from "@/types/analysis";
import { ANALYSIS_SYSTEM_PROMPT, COACH_SYSTEM_PROMPT } from "./prompts";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(systemInstruction: string, userContent: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
    }),
  });

  if (!res.ok) throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

/** Stage 5: biomechanical root-cause analysis from joint angle deltas. */
export async function analyzeForm(deltas: JointAngleDelta[]): Promise<string> {
  return callGemini(ANALYSIS_SYSTEM_PROMPT, JSON.stringify(deltas));
}

/** Stage 6: distill the root cause into a ~5-word spoken coaching cue. */
export async function generateCoachingCue(rootCause: string): Promise<string> {
  return callGemini(COACH_SYSTEM_PROMPT, rootCause);
}
