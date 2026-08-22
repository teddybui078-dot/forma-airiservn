import { Activity } from "lucide-react";
import type { JointReading } from "@/types/analysis";

const STATUS_DOT = { optimal: "bg-outline-variant", warning: "bg-tertiary", error: "bg-error" } as const;
const STATUS_TRACK = { optimal: "bg-surface-container", warning: "bg-tertiary/20", error: "bg-error/20" } as const;
const STATUS_FILL = { optimal: "bg-on-surface", warning: "bg-tertiary", error: "bg-error" } as const;
const STATUS_TEXT = { optimal: "text-on-surface-variant", warning: "text-tertiary font-medium", error: "text-error font-medium" } as const;

export function FormErrorsList({ joints }: { joints: JointReading[] }) {
  return (
    <div className="bg-background rounded-[16px] p-6 shadow-sm border border-outline-variant/20">
      <div className="flex items-center justify-between mb-6">
        <span className="font-label-caps text-on-surface-variant tracking-wider">FORM ERRORS</span>
        <Activity size={18} className="text-on-surface-variant" />
      </div>
      <div className="flex flex-col gap-5">
        {joints.map((joint) => (
          <div key={joint.joint} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[13px]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[joint.status]}`} />
                <span className="text-on-surface font-medium">{joint.joint}</span>
              </div>
              <span className={`font-data-mono ${STATUS_TEXT[joint.status]}`}>{joint.label}</span>
            </div>
            <div className={`w-full rounded-full h-1 ${STATUS_TRACK[joint.status]}`}>
              <div
                className={`h-1 rounded-full ${STATUS_FILL[joint.status]}`}
                style={{ width: `${joint.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
