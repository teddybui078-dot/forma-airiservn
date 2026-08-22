// Stage 2: Google MediaPipe Pose Landmarker.
// Tracks 33 3D skeletal keypoints locally at 60 FPS via WebAssembly.

import type { PoseFrame } from "@/types/pose";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";

export interface PoseLandmarkerHandle {
  detectForVideo(video: HTMLVideoElement, timestampMs: number): PoseFrame | null;
  close(): void;
}

/**
 * Loads the MediaPipe Pose Landmarker WASM runtime and returns a handle for
 * per-frame detection. Call once on mount; reuse the handle across frames.
 */
export async function createPoseLandmarker(): Promise<PoseLandmarkerHandle> {
  const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  const landmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
    runningMode: "VIDEO",
    numPoses: 1,
  });

  return {
    detectForVideo(video, timestampMs) {
      const result = landmarker.detectForVideo(video, timestampMs);
      const landmarks = result.landmarks[0];
      if (!landmarks) return null;
      return { timestampMs, landmarks };
    },
    close() {
      landmarker.close();
    },
  };
}
