"use client";

/**
 * Stage 1-3 of the pipeline in one surface:
 * - a <video> element for the live camera / uploaded clip
 * - a MediaPipe-driven skeleton overlay (src/lib/pose)
 * - a Three.js ghost mesh rendered on top (src/lib/render)
 *
 * This is a static placeholder shell; the capture/tracking/render loops are
 * wired up in src/lib/pose and src/lib/render and mounted here via refs.
 */
export function PoseOverlay({ source }: { source: "live" | "upload" }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high text-on-surface-variant text-[13px]">
        {source === "live" ? "Camera feed will render here" : "Upload a clip to analyze"}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 mix-blend-multiply pointer-events-none" />

      {/* Top status bar */}
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
