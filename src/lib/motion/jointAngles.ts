// Stage 4a: joint angle math.
// Runs vector dot-products on MediaPipe landmarks to derive joint angles.

import type { Landmark, PoseFrame } from "@/types/pose";

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

  for (const [name, [a, b, c]] of Object.entries(JOINTS) as [keyof typeof JOINTS, number[]][]) {
    result[name] = angleBetween(landmarks[a], landmarks[b], landmarks[c]);
  }

  return result;
}
