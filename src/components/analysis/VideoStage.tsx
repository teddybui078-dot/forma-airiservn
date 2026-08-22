"use client";

import { useState } from "react";
import { Square, RectangleVertical } from "lucide-react";
import { PoseOverlay } from "./PoseOverlay";
import { CoachingBar } from "./CoachingBar";
import type { CoachingCue } from "@/types/coaching";

const ASPECTS = ["16:9", "9:16"] as const;

export function VideoStage() {
  const [source, setSource] = useState<"live" | "upload">("live");
  const [aspect, setAspect] = useState<(typeof ASPECTS)[number]>("16:9");
  const [cue, setCue] = useState<CoachingCue>();

  return (
    <div className="flex-1 relative flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl border border-outline-variant/20">
          {(["live", "upload"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSource(mode)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                source === mode
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {mode === "live" ? "Live Camera" : "Upload"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl border border-outline-variant/20">
          {ASPECTS.map((option) => (
            <button
              key={option}
              onClick={() => setAspect(option)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                aspect === option
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {option === "16:9" ? <Square size={16} /> : <RectangleVertical size={16} />}
              {option}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative w-full rounded-[20px] bg-surface-container overflow-hidden shadow-sm border border-outline-variant/20 flex-shrink-0 ${
          aspect === "16:9" ? "aspect-[16/10]" : "aspect-[9/16] max-w-[500px] mx-auto"
        }`}
      >
        {/* Stage 1: raw webcam/upload frame goes here (getUserMedia -> <video>). */}
        <PoseOverlay source={source} onCueChange={setCue} />
        <CoachingBar cue={cue} />
      </div>
    </div>
  );
}
