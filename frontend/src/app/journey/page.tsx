"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { DailyRecommendation } from "@/components/daily-recommendation/DailyRecommendation";
import { PRIMARY_GOALS } from "@/types/businessProfile";

function JourneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = Number(searchParams.get("profileId"));
  const goal = searchParams.get("goal");
  const primaryGoal = PRIMARY_GOALS.find((candidate) => candidate === goal);

  if (!profileId || !primaryGoal) {
    return (
      <div className="flex w-full flex-col gap-6 text-center">
        <p className="text-lg text-red-600" role="alert">
          We couldn&apos;t find your business profile.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
        >
          Return Home
        </button>
      </div>
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
