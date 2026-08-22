import { TopBar } from "@/components/layout/TopBar";
import { VideoStage } from "@/components/analysis/VideoStage";
import { FormScoreCard } from "@/components/analysis/FormScoreCard";
import { FormErrorsList } from "@/components/analysis/FormErrorsList";
import { AIInsightCard } from "@/components/analysis/AIInsightCard";
import { SheetSyncStatus } from "@/components/analysis/SheetSyncStatus";
import type { FormAnalysis } from "@/types/analysis";

// Placeholder data shaped like the output of stages 4-6 of the pipeline.
// Replace with the live FormAnalysis produced by src/lib/motion once the
// pose/render/analysis pipeline is wired up.
const MOCK_ANALYSIS: FormAnalysis = {
  formScore: 72,
  trend: "down",
  timingOffsetMs: 0,
  rootCause:
    "Left knee valgus detected during the concentric phase. This indicates potential weakness in the gluteus medius or poor ankle mobility limiting dorsiflexion.",
  joints: [
    { joint: "Hip Position", status: "optimal", label: "Optimal", value: 100 },
    { joint: "Left Knee", status: "error", label: "Valgus", value: 85 },
    { joint: "Ankle Mobility", status: "optimal", label: "Stable", value: 100 },
  ],
};

export default function AnalysisPage() {
  return (
    <>
      <TopBar title="Welcome back, Athlete" subtitle="Squat Analysis Mode" />
      <div className="flex flex-1 gap-8 relative w-full items-start">
        <VideoStage />

        <div className="w-[320px] flex flex-col gap-6 flex-shrink-0">
          <FormScoreCard score={MOCK_ANALYSIS.formScore} trend={MOCK_ANALYSIS.trend} />
          <FormErrorsList joints={MOCK_ANALYSIS.joints} />
          <AIInsightCard insight={MOCK_ANALYSIS.rootCause} />
          <SheetSyncStatus />
        </div>
      </div>
    </>
  );
}
