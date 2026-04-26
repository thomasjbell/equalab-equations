import { Suspense } from "react";
import EnhancedEquationGrid from "@/components/EnhancedEquationGrid";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground text-lg">Loading equations…</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        <Suspense fallback={<LoadingFallback />}>
          <EnhancedEquationGrid />
        </Suspense>
      </div>
    </div>
  );
}
