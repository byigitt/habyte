import { Suspense } from "react";
import { SessionRunner } from "@/components/SessionRunner";

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="board-panel h-[420px]" aria-label="Pano yükleniyor" />
      }
    >
      <SessionRunner />
    </Suspense>
  );
}
