import { TopBar } from "@/components/layout/TopBar";

export default function HistoryPage() {
  return (
    <>
      <TopBar title="History" />
      <p className="text-on-surface-variant text-[14px]">
        Past sessions logged to Firestore - coming soon.
      </p>
    </>
  );
}
