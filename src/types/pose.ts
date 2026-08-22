// Stage 1-2: raw camera + MediaPipe landmark output.

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

/** One frame of the 33 MediaPipe Pose Landmarker keypoints. */
export interface PoseFrame {
  timestampMs: number;
  landmarks: Landmark[];
}
