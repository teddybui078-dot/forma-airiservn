import { Brain } from "lucide-react";

export function AIInsightCard({ insight }: { insight: string }) {
  return (
    <div className="bg-background rounded-[16px] p-6 shadow-sm border border-outline-variant/20">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={18} className="text-primary" />
        <span className="font-label-caps text-primary tracking-wider">AI INSIGHT</span>
      </div>
      <p className="text-[14px] leading-relaxed text-on-surface-variant mb-5">{insight}</p>
      <div className="flex justify-end">
        <button className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-[13px] font-medium transition-colors border border-outline-variant/20">
          View Drill
        </button>
      </div>
    </div>
  );
}
