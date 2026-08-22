// Stage 4b owner (motion-classifier track): classifies live joint-angle
// features into one of the 6 labels from the Kaggle squat-features dataset
// (see ../../../README - training-data.md). Fill in the decision boundaries
// once they're trained/derived from squat_features_augmented.csv - this
// stub always returns "correct" so downstream stages have a shape to build
// against.

import type { FaultLabel, FormClassification, JointFeatures } from "@/types/analysis";

const FAULT_JOINTS: Record<FaultLabel, string[]> = {
  correct: [],
  shallow: ["leftHip", "rightHip"],
  forward_lean: ["spine"],
  knees_caving_in: ["leftKnee", "rightKnee"],
  heels_off_ground: ["leftAnkle", "rightAnkle"],
  asymmetric: ["leftKnee", "rightKnee"],
};

/**
 * TODO(motion-classifier): replace with the trained decision boundaries.
 * Keep this synchronous and dependency-free - it runs once per frame in
 * the browser, not server-side.
 */
export function classifyForm(features: JointFeatures): FormClassification {
  const label: FaultLabel = "correct";
  return { label, confidence: 1, faultJoints: FAULT_JOINTS[label] };
}
