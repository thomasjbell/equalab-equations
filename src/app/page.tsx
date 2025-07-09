import { Suspense } from "react";
import EnhancedEquationGrid from "@/components/EnhancedEquationGrid";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-xl text-gray-600 dark:text-gray-400">
            Loading equations...
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <EnhancedEquationGrid />
        </Suspense>
      </div>
    </div>
  );
}