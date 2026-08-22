"use client";

/**
 * Integration point (coaching-loop track): composes the camera feed,
 * ghost render, and top status bar. Wires CameraFeed's onFrame into the
 * motion/classifier pipeline once that track lands - for now, polls
 * POST /api/coach on a fixed interval with a hardcoded root cause so the
 * live coaching loop's plumbing runs end-to-end before that track lands.
 */

import { useEffect, useRef, useState } from "react";
import { CameraFeed } from "./CameraFeed";
import { GhostCanvas } from "./GhostCanvas";
import type { PoseFrame } from "@/types/pose";
import type { CoachingCue } from "@/types/coaching";

// Stand-in for stage 3-4 output until motion-classifier/analysisBrain land.
const STUB_ROOT_CAUSE =
  "Left knee valgus detected during the concentric phase, likely from weak gluteus medius.";
const COACH_POLL_MS = 3000;

export function PoseOverlay({
  source,
  onCueChange,
}: {
  source: "live" | "upload";
  onCueChange?: (cue: CoachingCue) => void;
}) {
  const [cue, setCue] = useState<CoachingCue>();
  const latestFrame = useRef<PoseFrame | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCue() {
      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rootCause: STUB_ROOT_CAUSE }),
        });
        if (!res.ok) throw new Error(`/api/coach responded ${res.status}`);
        const nextCue = (await res.json()) as CoachingCue;
        if (cancelled) return;
        setCue(nextCue);
        onCueChange?.(nextCue);
      } catch (err) {
        console.error("[PoseOverlay] coaching cue fetch failed", err);
      }
    }

    fetchCue();
    const interval = setInterval(fetchCue, COACH_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [onCueChange]);

  return (
    <div className="absolute inset-0">
      <CameraFeed
        source={source}
        onFrame={(frame) => {
          latestFrame.current = frame;
        }}
      />
      <GhostCanvas />

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
