"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { submitRecommendationProgress, type RecommendationStatus } from "@/lib/api";
import { RECOMMENDATIONS } from "@/lib/recommendations";
import { RECOMMENDATION_HELP } from "@/lib/recommendationHelp";
import type { PrimaryGoal } from "@/types/businessProfile";

interface DailyRecommendationProps {
  businessProfileId: number;
  primaryGoal: PrimaryGoal;
}

type ConfirmationStatus = "completed" | "later" | "need_help_attempt";

type View = "recommendation" | "help" | "confirmation";

const CONFIRMATION_MESSAGE: Record<ConfirmationStatus, string[]> = {
  completed: [
    "Excellent.",
    "Small improvements build strong businesses.",
    "Thank you for taking action today.",
  ],
  later: ["No problem.", "Come back when you're ready.", "We'll continue from where you stopped."],
  need_help_attempt: [
    "Excellent.",
    "Small steps are still progress.",
    "Come back after you've tried it.",
  ],
};

export function DailyRecommendation({ businessProfileId, primaryGoal }: DailyRecommendationProps) {
  const router = useRouter();
  const [view, setView] = useState<View>("recommendation");
  const [confirmationStatus, setConfirmationStatus] = useState<ConfirmationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommendation = RECOMMENDATIONS[primaryGoal];
  const help = RECOMMENDATION_HELP[primaryGoal];

  const saveStatus = async (status: RecommendationStatus): Promise<boolean> => {
    setError(null);
    try {
      await submitRecommendationProgress(businessProfileId, recommendation.key, status);
      return true;
    } catch {
      setError("Something went wrong while saving your selection.");
      return false;
    }
  };

  const handleSelect = async (selectedStatus: ConfirmationStatus) => {
    if (await saveStatus(selectedStatus)) {
      setConfirmationStatus(selectedStatus);
      setView("confirmation");
    }
  };

  if (view === "confirmation" && confirmationStatus) {
    return (
      <div className="flex w-full flex-col gap-8 text-center">
        {CONFIRMATION_MESSAGE[confirmationStatus].map((line) => (
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

  if (view === "help") {
    return (
      <div className="flex w-full flex-col gap-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Need a little help?</h1>

        <div className="flex flex-col gap-4 text-left">
          {help.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg text-gray-700">
              {paragraph}
            </p>
          ))}
          {help.bulletItems && (
            <ul className="list-disc pl-6 text-lg text-gray-700">
              {help.bulletItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {help.footer && <p className="text-lg text-gray-700">{help.footer}</p>}
        </div>

        {error && <p className="text-lg text-red-600">{error}</p>}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => handleSelect("need_help_attempt")}
            className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            I&apos;ll Try This
          </button>
          <button
            type="button"
            onClick={() => setView("recommendation")}
            className="w-full rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
          >
            Back
          </button>
        </div>
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
          onClick={() => setView("help")}
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
