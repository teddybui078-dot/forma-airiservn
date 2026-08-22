// Stage 4a: joint angle math.
// Runs vector dot-products on MediaPipe landmarks to derive joint angles.

import type { Landmark, PoseFrame } from "@/types/pose";
import type { JointFeatures } from "@/types/analysis";

/** Angle (degrees) at vertex `b`, formed by rays b->a and b->c. */
export function angleBetween(a: Landmark, b: Landmark, c: Landmark): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.hypot(v1.x, v1.y, v1.z);
  const mag2 = Math.hypot(v2.x, v2.y, v2.z);
  if (mag1 === 0 || mag2 === 0) return 0;

  const cos = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

// MediaPipe Pose Landmarker indices for the joints we track for squats.
// https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
export const JOINTS = {
  leftKnee: [23, 25, 27], // left hip -> left knee -> left ankle
  rightKnee: [24, 26, 28],
  leftHip: [11, 23, 25], // left shoulder -> left hip -> left knee
  rightHip: [12, 24, 26],
} as const;

export function computeJointAngles(frame: PoseFrame): Record<keyof typeof JOINTS, number> {
  const { landmarks } = frame;
  const result = {} as Record<keyof typeof JOINTS, number>;

  for (const name of Object.keys(JOINTS) as (keyof typeof JOINTS)[]) {
    const [a, b, c] = JOINTS[name];
    result[name] = angleBetween(landmarks[a], landmarks[b], landmarks[c]);
  }

  return result;
}

// Additional MediaPipe landmark indices needed for the full feature set.
const LANDMARK = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  leftFootIndex: 31,
  rightFootIndex: 32,
} as const;

function midpoint(a: Landmark, b: Landmark): Landmark {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
}

/**
 * Perpendicular horizontal (x) distance of the knee from the straight line
 * connecting hip and ankle, interpolated by vertical (y) position - this is
 * the standard knee-valgus/caving measurement.
 */
function kneeLateralDeviation(hip: Landmark, knee: Landmark, ankle: Landmark): number {
  const t = ankle.y === hip.y ? 0 : (knee.y - hip.y) / (ankle.y - hip.y);
  const expectedX = hip.x + t * (ankle.x - hip.x);
  return Math.abs(knee.x - expectedX);
}

/** All 12 JointFeatures columns from squat_features_augmented.csv, computed live from a PoseFrame. */
export function computeJointFeatures(frame: PoseFrame): JointFeatures {
  const { landmarks } = frame;
  const l = LANDMARK;

  const legAngles = computeJointAngles(frame);
  const leftKneeAngle = legAngles.leftKnee;
  const rightKneeAngle = legAngles.rightKnee;
  const leftHipAngle = legAngles.leftHip;
  const rightHipAngle = legAngles.rightHip;

  const leftAnkleAngle = angleBetween(landmarks[l.leftKnee], landmarks[l.leftAnkle], landmarks[l.leftFootIndex]);
  const rightAnkleAngle = angleBetween(landmarks[l.rightKnee], landmarks[l.rightAnkle], landmarks[l.rightFootIndex]);

  const shoulderMid = midpoint(landmarks[l.leftShoulder], landmarks[l.rightShoulder]);
  const hipMid = midpoint(landmarks[l.leftHip], landmarks[l.rightHip]);
  const kneeMid = midpoint(landmarks[l.leftKnee], landmarks[l.rightKnee]);
  // Synthetic point directly "above" the hip (MediaPipe y grows downward) to use as a vertical reference.
  const verticalAboveHip: Landmark = { x: hipMid.x, y: hipMid.y - 1, z: hipMid.z };

  const spineAngle = angleBetween(shoulderMid, hipMid, kneeMid);
  const torsoLean = angleBetween(shoulderMid, hipMid, verticalAboveHip);

  const leftKneeLateral = kneeLateralDeviation(landmarks[l.leftHip], landmarks[l.leftKnee], landmarks[l.leftAnkle]);
  const rightKneeLateral = kneeLateralDeviation(landmarks[l.rightHip], landmarks[l.rightKnee], landmarks[l.rightAnkle]);

  const symmetryScore =
    Math.abs(leftKneeAngle - rightKneeAngle) +
    Math.abs(leftHipAngle - rightHipAngle) +
    Math.abs(leftAnkleAngle - rightAnkleAngle);

  const hipDepth = hipMid.y;

  return {
    leftKneeAngle,
    rightKneeAngle,
    leftHipAngle,
    rightHipAngle,
    leftAnkleAngle,
    rightAnkleAngle,
    spineAngle,
    torsoLean,
    leftKneeLateral,
    rightKneeLateral,
    symmetryScore,
    hipDepth,
  };
}
