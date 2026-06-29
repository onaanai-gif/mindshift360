"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { submitRecommendationProgress, type RecommendationStatus } from "@/lib/api";
import { RECOMMENDATIONS } from "@/lib/recommendations";
import type { PrimaryGoal } from "@/types/businessProfile";

interface DailyRecommendationProps {
  businessProfileId: number;
  primaryGoal: PrimaryGoal;
}

const CONFIRMATION_MESSAGE: Record<RecommendationStatus, string[]> = {
  completed: [
    "Excellent.",
    "Small improvements build strong businesses.",
    "Thank you for taking action today.",
  ],
  need_help: [
    "That's completely fine.",
    "We'll break this into smaller steps in the next version.",
    "For now, thank you for letting us know.",
  ],
  later: ["No problem.", "Come back when you're ready.", "We'll continue from where you stopped."],
};

export function DailyRecommendation({ businessProfileId, primaryGoal }: DailyRecommendationProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RecommendationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommendation = RECOMMENDATIONS[primaryGoal];

  const handleSelect = async (selectedStatus: RecommendationStatus) => {
    setError(null);
    try {
      await submitRecommendationProgress(businessProfileId, recommendation.key, selectedStatus);
      setStatus(selectedStatus);
    } catch {
      setError("Something went wrong while saving your selection.");
    }
  };

  if (status) {
    return (
      <div className="flex w-full flex-col gap-8 text-center">
        {CONFIRMATION_MESSAGE[status].map((line) => (
          <p key={line} className="text-lg text-gray-700">
            {line}
          </p>
        ))}

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">{recommendation.title}</h1>

      <div className="flex flex-col gap-4 text-left">
        <p className="text-lg text-gray-700">{recommendation.recommendation}</p>
        {recommendation.checklistItems && (
          <ul className="list-disc pl-6 text-lg text-gray-700">
            {recommendation.checklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm font-medium text-gray-500">
        Estimated Time: {recommendation.estimatedTime}
      </p>

      {error && <p className="text-lg text-red-600">{error}</p>}

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => handleSelect("completed")}
          className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          I&apos;ve Completed This
        </button>
        <button
          type="button"
          onClick={() => handleSelect("need_help")}
          className="w-full rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
        >
          I Need Help
        </button>
        <button
          type="button"
          onClick={() => handleSelect("later")}
          className="w-full rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
        >
          I&apos;ll Do This Later
        </button>
      </div>
    </div>
  );
}
