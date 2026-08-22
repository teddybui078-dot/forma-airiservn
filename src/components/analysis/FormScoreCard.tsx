import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus } as const;

export function FormScoreCard({ score, trend }: { score: number; trend: "up" | "down" | "flat" }) {
  const TrendIcon = TREND_ICON[trend];
  const isBad = trend === "down";

  return (
    <div className="bg-background rounded-[16px] p-6 flex flex-col justify-between shadow-sm border-2 border-primary h-40">
      <span className="font-label-caps text-primary tracking-wider">FORM SCORE</span>
      <div className="flex items-end justify-between mt-auto">
        <span className="font-headline-lg text-on-surface text-[40px] leading-none">
          {score}
          <span className="text-on-surface-variant/50 text-2xl font-normal">%</span>
        </span>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isBad ? "bg-error/10" : "bg-primary/10"
          }`}
        >
          <TrendIcon size={24} className={isBad ? "text-error" : "text-primary"} />
        </div>
      </div>
    </div>
  );
}
