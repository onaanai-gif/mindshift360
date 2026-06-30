"use client";

import { useRouter } from "next/navigation";

import type { LatestBusinessProfile } from "@/lib/api";

interface DashboardProps {
  profile: LatestBusinessProfile;
}

const FOCUS_MESSAGE: Record<string, string> = {
  completed: "You've completed today's recommendation.",
  later: "You chose to continue later.",
  need_help_attempt: "Let's continue working on this together.",
};

export function Dashboard({ profile }: DashboardProps) {
  const router = useRouter();

  const journeyUrl = `/journey?profileId=${profile.id}&goal=${encodeURIComponent(profile.primaryGoal)}`;
  const historyUrl = `/history?profileId=${profile.id}`;

  const focusMessage = profile.latestRecommendationStatus
    ? FOCUS_MESSAGE[profile.latestRecommendationStatus]
    : "Let's begin your Growth Journey.";

  const focusButtonLabel =
    profile.latestRecommendationStatus === "completed"
      ? "View Progress"
      : profile.latestRecommendationStatus
        ? "Continue Recommendation"
        : "Start My Growth Journey";

  const handleFocusAction = () => {
    if (profile.latestRecommendationStatus === "completed") {
      router.push(historyUrl);
    } else {
      router.push(journeyUrl);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Good to see you again, {profile.businessName}
        </h1>
        <dl className="mt-4 flex flex-col gap-1 text-base text-gray-700">
          <div>
            <dt className="inline font-semibold">Business Type: </dt>
            <dd className="inline">{profile.businessType}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Town/City: </dt>
            <dd className="inline">{profile.townCity}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Primary Business Goal: </dt>
            <dd className="inline">{profile.primaryGoal}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Today&apos;s Focus</h2>
        <p className="mb-4 text-base text-gray-700">{focusMessage}</p>
        <button
          type="button"
          onClick={handleFocusAction}
          className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          {focusButtonLabel}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Progress Snapshot</h2>
        <dl className="flex flex-col gap-2 text-base text-gray-700">
          <div className="flex justify-between">
            <dt>Completed</dt>
            <dd className="font-semibold text-green-700">{profile.recommendationsCompleted}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Need Help</dt>
            <dd className="font-semibold text-amber-700">{profile.recommendationsNeedHelp}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Later</dt>
            <dd className="font-semibold text-gray-500">{profile.recommendationsLater}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => router.push(journeyUrl)}
            className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Continue Recommendation
          </button>
          <button
            type="button"
            onClick={() => router.push(historyUrl)}
            className="w-full rounded-lg bg-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
          >
            View Progress
          </button>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-gray-100 px-6 py-4 text-lg font-semibold text-gray-400"
          >
            Edit Business Profile (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
