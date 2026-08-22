import { AudioWaveform } from "lucide-react";
import type { CoachingCue } from "@/types/coaching";

export function CoachingBar({ cue }: { cue?: CoachingCue }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[600px] bg-background/70 backdrop-blur-xl rounded-[16px] px-6 py-4 shadow-sm flex items-center justify-between border border-surface-variant">
      <div className="flex items-center gap-1 h-6 w-16">
        {[1, 0.66, 0.25, 0.8, 0.5, 1].map((h, i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded-full animate-pulse"
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>
      <div className="flex-1 text-center px-4">
        <span className="font-body-lg text-on-surface font-medium truncate block w-full">
          {cue?.text ?? "Waiting for a rep..."}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20">
        <AudioWaveform size={14} className="text-on-surface-variant" />
        <span className="font-data-mono text-on-surface-variant text-[11px]">Fish Audio</span>
      </div>
    </div>
  );
}
