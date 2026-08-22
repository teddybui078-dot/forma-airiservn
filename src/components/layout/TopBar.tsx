import { Zap } from "lucide-react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-20 bg-surface-container-lowest z-40 px-8 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-md">
        <h1 className="font-headline-md text-on-surface tracking-tight text-2xl">{title}</h1>
      </div>
      {subtitle ? (
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-outline-variant/30">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-label-caps text-on-surface-variant uppercase tracking-widest text-[11px]">
              {subtitle}
            </span>
          </div>
          <div className="flex items-center gap-xs bg-background px-3 py-2 rounded-lg border border-outline-variant/30">
            <Zap size={14} className="text-tertiary" />
            <span className="font-data-mono text-[11px] text-on-surface-variant">WASM 60 FPS</span>
          </div>
        </div>
      ) : null}
    </header>
  );
}
