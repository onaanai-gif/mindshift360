"use client";

import { useRouter } from "next/navigation";

import type { LatestBusinessProfile } from "@/lib/api";

interface WelcomeBackProps {
  profile: LatestBusinessProfile;
}

const STATUS_MESSAGE: Record<string, string> = {
  completed: "Great work. You completed your last recommendation.",
  later: "You chose to continue later. Let's pick up where you stopped.",
  need_help_attempt: "You asked for help last time. Let's continue together.",
};

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  later: "Later",
  need_help_attempt: "Need Help",
};

export function WelcomeBack({ profile }: WelcomeBackProps) {
  const router = useRouter();

  const statusMessage = profile.latestRecommendationStatus
    ? STATUS_MESSAGE[profile.latestRecommendationStatus]
    : "You're ready to begin your Growth Journey.";

  const buttonLabel = profile.latestRecommendationStatus
    ? "Continue My Journey"
    : "Start My Growth Journey";

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex w-full flex-col gap-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {profile.businessName}
        </h1>
        <p className="mt-2 text-lg text-gray-700">Let&apos;s continue growing your business.</p>
      </div>

      <dl className="flex flex-col gap-2 text-left text-lg text-gray-700">
        <div>
          <dt className="inline font-semibold">Business Name: </dt>
          <dd className="inline">{profile.businessName}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Business Goal: </dt>
          <dd className="inline">{profile.primaryGoal}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Last Activity: </dt>
          <dd className="inline">{new Date(profile.lastUpdated).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Current Progress Status: </dt>
          <dd className="inline">
            {profile.latestRecommendationStatus
              ? (STATUS_LABEL[profile.latestRecommendationStatus] ??
                profile.latestRecommendationStatus)
              : "Not started"}
          </dd>
        </div>
      </dl>

      <p className="text-lg text-gray-700">{statusMessage}</p>

      <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Your Progress</h2>
        <dl className="flex flex-col gap-2 text-base text-gray-700">
          <div className="flex justify-between">
            <dt>Recommendations Completed</dt>
            <dd className="font-semibold text-green-700">{profile.recommendationsCompleted}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Recommendations Needing Help</dt>
            <dd className="font-semibold text-amber-700">{profile.recommendationsNeedHelp}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Recommendations Saved For Later</dt>
            <dd className="font-semibold text-gray-500">{profile.recommendationsLater}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          {buttonLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/history?profileId=${profile.id}`)}
          className="w-full rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
        >
          View My Progress
        </button>
      </div>
    </div>
  );
}
