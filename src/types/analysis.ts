// Stage 4-5: joint math + DTW output, and Gemini's biomechanical read of it.

export type JointStatus = "optimal" | "warning" | "error";

export interface JointReading {
  joint: string;
  status: JointStatus;
  label: string;
  /** 0-100 confidence/severity used to size the status bar. */
  value: number;
}

export interface JointAngleDelta {
  joint: string;
  userAngleDeg: number;
  referenceAngleDeg: number;
  deltaDeg: number;
}

export interface FormAnalysis {
  formScore: number;
  trend: "up" | "down" | "flat";
  joints: JointReading[];
  /** DTW-aligned timing offset between the user's rep and the reference ghost, in ms. */
  timingOffsetMs: number;
  rootCause: string;
}
