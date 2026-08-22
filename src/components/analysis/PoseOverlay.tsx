"use client";

/**
 * Integration point (coaching-loop track): composes the camera feed and
 * ghost render, drives the classifier off live frames, and fires the
 * analyze -> coach -> speak chain when the detected fault changes.
 */

import { useEffect, useRef, useState } from "react";
import { CameraFeed } from "./CameraFeed";
import { GhostCanvas } from "./GhostCanvas";
import type { PoseFrame } from "@/types/pose";
import type { CoachingCue } from "@/types/coaching";
import type { FormClassification } from "@/types/analysis";
import { computeJointFeatures } from "@/lib/motion/jointAngles";
import { classifyForm } from "@/lib/motion/classifyForm";
import { getReferenceGhost } from "@/lib/reference/referenceGhost";
import { playCue } from "@/lib/tts/playCue";

export function PoseOverlay({
  source,
  onCueChange,
}: {
  source: "live" | "upload";
  onCueChange?: (cue: CoachingCue) => void;
}) {
  const [referenceFrame, setReferenceFrame] = useState<PoseFrame>();
  const [errorJoints, setErrorJoints] = useState<Set<string>>(new Set());
  const lastLabelRef = useRef<FormClassification["label"]>("correct");
  const inFlightRef = useRef(false);

  useEffect(() => {
    getReferenceGhost("squat").then((ghost) => {
      if (ghost?.frames?.[0]) setReferenceFrame(ghost.frames[0]);
    });
  }, []);

  async function handleFault(classification: FormClassification) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classification),
      });
      if (!analyzeRes.ok) throw new Error(`/api/analyze responded ${analyzeRes.status}`);
      const { rootCause } = (await analyzeRes.json()) as { rootCause: string };

      const coachRes = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rootCause }),
      });
      if (!coachRes.ok) throw new Error(`/api/coach responded ${coachRes.status}`);
      const cue = (await coachRes.json()) as CoachingCue;

      onCueChange?.(cue);
      playCue(cue.text).catch((err) => console.error("[PoseOverlay] playback failed", err));
    } catch (err) {
      console.error("[PoseOverlay] coaching chain failed", err);
    } finally {
      inFlightRef.current = false;
    }
  }

  function handleFrame(frame: PoseFrame) {
    const features = computeJointFeatures(frame);
    const classification = classifyForm(features);

    setErrorJoints(new Set(classification.faultJoints));

    if (classification.label !== lastLabelRef.current) {
      lastLabelRef.current = classification.label;
      if (classification.label !== "correct") handleFault(classification);
    }
  }

  return (
    <div className="absolute inset-0">
      <CameraFeed source={source} onFrame={handleFrame} />
      <GhostCanvas referenceFrame={referenceFrame} errorJoints={errorJoints} />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="bg-background/90 backdrop-blur-md text-on-surface px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-outline-variant/20">
          <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="font-label-caps tracking-widest text-[10px]">LIVE TRK</span>
        </div>
        <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex flex-col items-end shadow-sm border border-outline-variant/20">
          <span className="font-data-mono text-primary font-bold text-[12px]">60 FPS</span>
          <span className="font-data-mono text-on-surface-variant text-[10px]">12ms latency</span>
        </div>
      </div>
    </div>
  );
}
