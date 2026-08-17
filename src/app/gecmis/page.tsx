import { Suspense } from "react";
import { HistoryView } from "@/components/HistoryView";

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="board-panel h-[420px]" aria-label="Pano yükleniyor" />
      }
    >
      <HistoryView />
    </Suspense>
  );
}
