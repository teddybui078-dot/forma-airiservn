// Stage 4b owner (motion-classifier track): classifies live joint-angle
// features into one of the 6 labels from the Kaggle squat-features dataset
// (see ../../../README - training-data.md). Hardcoded threshold rules, not
// a trained model - see squat_features_augmented.csv for the source data.

import type { FaultLabel, FormClassification, JointFeatures } from "@/types/analysis";

const FAULT_JOINTS: Record<FaultLabel, string[]> = {
  correct: [],
  shallow: ["leftHip", "rightHip"],
  forward_lean: ["spine"],
  knees_caving_in: ["leftKnee", "rightKnee"],
  heels_off_ground: ["leftAnkle", "rightAnkle"],
  asymmetric: ["leftKnee", "rightKnee"],
};

// Rough separating values. squat_features_augmented.csv's per-label column
// averages confirm which feature moves for which fault (and which
// direction), but its raw angle scale doesn't match this file's own vector
// geometry (computeJointFeatures in jointAngles.ts), so thresholds here are
// calibrated against a correct-squat baseline vs. each perturbed fault
// instead of copied directly from the CSV numbers - see
// "README - training-data.md" for the fault definitions.
const KNEE_LATERAL_CAVING_THRESHOLD = 0.03; // correct-squat baseline ~0, caving ~0.05
const ANKLE_ANGLE_HEELS_UP_THRESHOLD = 130; // correct-squat baseline ~107, heels-off ~160
const SYMMETRY_SCORE_ASYMMETRIC_THRESHOLD = 20; // correct-squat baseline ~0, asymmetric ~48
const SPINE_ANGLE_FORWARD_LEAN_THRESHOLD = 140; // correct-squat baseline ~165, forward-lean ~110
const TORSO_LEAN_FORWARD_LEAN_THRESHOLD = 25; // correct-squat baseline ~0, forward-lean ~54
const KNEE_ANGLE_SHALLOW_THRESHOLD = 160; // correct-squat baseline ~148, shallow ~169
const HIP_ANGLE_SHALLOW_THRESHOLD = 167; // correct-squat baseline ~164, shallow ~171

/**
 * Simple hardcoded threshold classifier - not a trained model. Keep this
 * synchronous and dependency-free - it runs once per frame in the browser,
 * not server-side.
 */
export function classifyForm(features: JointFeatures): FormClassification {
  const avgKnee = (features.leftKneeAngle + features.rightKneeAngle) / 2;
  const avgHip = (features.leftHipAngle + features.rightHipAngle) / 2;
  const avgAnkle = (features.leftAnkleAngle + features.rightAnkleAngle) / 2;
  const avgKneeLateral = (features.leftKneeLateral + features.rightKneeLateral) / 2;

  let label: FaultLabel;
  let confidence: number;

  if (avgKneeLateral > KNEE_LATERAL_CAVING_THRESHOLD) {
    label = "knees_caving_in";
    confidence = 0.8;
  } else if (avgAnkle > ANKLE_ANGLE_HEELS_UP_THRESHOLD) {
    label = "heels_off_ground";
    confidence = 0.8;
  } else if (features.symmetryScore > SYMMETRY_SCORE_ASYMMETRIC_THRESHOLD) {
    label = "asymmetric";
    confidence = 0.75;
  } else if (
    features.spineAngle < SPINE_ANGLE_FORWARD_LEAN_THRESHOLD ||
    features.torsoLean > TORSO_LEAN_FORWARD_LEAN_THRESHOLD
  ) {
    label = "forward_lean";
    confidence = 0.75;
  } else if (avgKnee > KNEE_ANGLE_SHALLOW_THRESHOLD && avgHip > HIP_ANGLE_SHALLOW_THRESHOLD) {
    label = "shallow";
    confidence = 0.75;
  } else {
    label = "correct";
    confidence = 0.9;
  }

  return { label, confidence, faultJoints: FAULT_JOINTS[label] };
}
