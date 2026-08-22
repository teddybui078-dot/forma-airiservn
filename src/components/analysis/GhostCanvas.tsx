"use client";

/**
 * Stage 3 owner (ghost-overlay track): mounts the Three.js ghost scene
 * (src/lib/render/ghostScene.ts) on a <canvas> layered over the camera
 * feed. Purely a renderer - takes the reference frame and the set of
 * out-of-alignment joints as props, doesn't compute either.
 */

import { useEffect, useRef } from "react";
import type { PoseFrame } from "@/types/pose";
import { createGhostScene, type GhostScene } from "@/lib/render/ghostScene";

export function GhostCanvas({
  referenceFrame,
  errorJoints,
}: {
  referenceFrame?: PoseFrame;
  errorJoints?: Set<string>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GhostScene | null>(null);

  useEffect(() => {
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !referenceFrame) return;
    if (!sceneRef.current) {
      sceneRef.current = createGhostScene(canvasRef.current);
    }
    sceneRef.current.update(referenceFrame, errorJoints ?? new Set());
  }, [referenceFrame, errorJoints]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
