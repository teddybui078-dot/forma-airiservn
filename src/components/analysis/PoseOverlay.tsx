"use client";

/**
 * Integration point (coaching-loop track): composes the camera feed,
 * ghost render, and top status bar. Wires CameraFeed's onFrame into the
 * motion/classifier pipeline once that track lands - for now, renders the
 * two layers with no data flowing between them yet.
 */

import { CameraFeed } from "./CameraFeed";
import { GhostCanvas } from "./GhostCanvas";

export function PoseOverlay({ source }: { source: "live" | "upload" }) {
  return (
    <div className="absolute inset-0">
      <CameraFeed source={source} />
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
