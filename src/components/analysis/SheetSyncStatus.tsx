import { Table2, CheckCircle2 } from "lucide-react";

export function SheetSyncStatus({ status = "Updated just now" }: { status?: string }) {
  return (
    <div className="bg-background rounded-[16px] p-4 shadow-sm border border-outline-variant/20 flex items-center justify-between mt-auto">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
          <Table2 size={18} className="text-on-surface-variant" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-on-surface">Sheet Sync</span>
          <span className="text-[11px] text-on-surface-variant">{status}</span>
        </div>
      </div>
      <CheckCircle2 size={16} className="text-primary" />
    </div>
  );
}
