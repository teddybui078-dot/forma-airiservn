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

// Matches the 6 labels in squat_features_augmented.csv
// (see "README - training-data.md" at the repo root).
export type FaultLabel =
  | "correct"
  | "shallow"
  | "forward_lean"
  | "knees_caving_in"
  | "heels_off_ground"
  | "asymmetric";

/** The 8 feature columns from squat_features_augmented.csv, computed live from a PoseFrame. */
export interface JointFeatures {
  leftKneeAngle: number;
  rightKneeAngle: number;
  leftHipAngle: number;
  rightHipAngle: number;
  leftAnkleAngle: number;
  rightAnkleAngle: number;
  spineAngle: number;
  torsoLean: number;
  leftKneeLateral: number;
  rightKneeLateral: number;
  symmetryScore: number;
  hipDepth: number;
}

export interface FormClassification {
  label: FaultLabel;
  /** 0-1 classifier confidence. */
  confidence: number;
  /** Joint names to highlight red on the ghost overlay for this label. */
  faultJoints: string[];
}
