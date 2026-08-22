// Stage 4c: combines joint angle deltas + DTW timing offset into the
// FormAnalysis handed off to the Gemini Analysis Brain (stage 5).

import type { PoseFrame } from "@/types/pose";
import type { JointAngleDelta } from "@/types/analysis";
import { computeJointAngles } from "./jointAngles";

const ERROR_THRESHOLD_DEG = 15;

export function computeAngleDeltas(userFrame: PoseFrame, referenceFrame: PoseFrame): JointAngleDelta[] {
  const userAngles = computeJointAngles(userFrame);
  const referenceAngles = computeJointAngles(referenceFrame);

  return Object.keys(userAngles).map((joint) => {
    const userAngleDeg = userAngles[joint as keyof typeof userAngles];
    const referenceAngleDeg = referenceAngles[joint as keyof typeof referenceAngles];
    return { joint, userAngleDeg, referenceAngleDeg, deltaDeg: userAngleDeg - referenceAngleDeg };
  });
}

export function jointsOutOfAlignment(deltas: JointAngleDelta[]): Set<string> {
  return new Set(deltas.filter((d) => Math.abs(d.deltaDeg) > ERROR_THRESHOLD_DEG).map((d) => d.joint));
}
