"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { DailyRecommendation } from "@/components/daily-recommendation/DailyRecommendation";
import { PRIMARY_GOALS } from "@/types/businessProfile";

function JourneyContent() {
  const searchParams = useSearchParams();
  const profileId = Number(searchParams.get("profileId"));
  const goal = searchParams.get("goal");
  const primaryGoal = PRIMARY_GOALS.find((candidate) => candidate === goal);

  if (!profileId || !primaryGoal) {
    return (
      <p className="text-center text-lg text-red-600">
        We couldn&apos;t find your business profile.
      </p>
    );
  }

  return <DailyRecommendation businessProfileId={profileId} primaryGoal={primaryGoal} />;
}

export default function JourneyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <JourneyContent />
        </Suspense>
      </div>
    </main>
  );
}
