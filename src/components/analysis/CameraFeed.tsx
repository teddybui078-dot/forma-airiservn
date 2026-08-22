"use client";

/**
 * Stage 1-2 owner (pose-tracking track): the <video> element for live
 * camera / uploaded clips, plus the MediaPipe detection loop
 * (src/lib/pose/landmarker.ts). Reports each detected frame upward via
 * onFrame - it does not know about rendering or scoring.
 */

import { useEffect, useRef } from "react";
import type { PoseFrame } from "@/types/pose";
import { createPoseLandmarker, type PoseLandmarkerHandle } from "@/lib/pose/landmarker";

export function CameraFeed({
  source,
  onFrame,
}: {
  source: "live" | "upload";
  onFrame?: (frame: PoseFrame) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (source !== "live") return;

    let cancelled = false;
    let stream: MediaStream | null = null;
    let handle: PoseLandmarkerHandle | null = null;
    let rafId: number | null = null;

    async function start() {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      handle = await createPoseLandmarker();
      if (cancelled) {
        handle.close();
        return;
      }

      const loop = () => {
        if (cancelled || !handle || !video) return;
        const frame = handle.detectForVideo(video, performance.now());
        if (frame) {
          console.log("[CameraFeed] detected PoseFrame", frame);
          onFrame?.(frame);
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    start();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      handle?.close();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [source, onFrame]);

  return (
    <div className="absolute inset-0">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high/80 text-on-surface-variant text-[13px]">
        {source === "live" ? "Camera feed will render here" : "Upload a clip to analyze"}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 mix-blend-multiply pointer-events-none" />
    </div>
  );
}
