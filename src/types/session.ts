// Stage 8-9: what gets persisted to Firestore/Storage and logged to Sheets.

import type { FormAnalysis } from "./analysis";
import type { PoseFrame } from "./pose";

export interface SessionLog {
  sessionId: string;
  athleteId: string;
  exercise: string;
  startedAt: number;
  endedAt?: number;
  reps: number;
  frames: PoseFrame[];
  analyses: FormAnalysis[];
}

export interface ReferenceGhost {
  exercise: string;
  frames: PoseFrame[];
  sourceClipUrl: string;
}
