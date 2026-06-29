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

export function WelcomeBack({ profile }: WelcomeBackProps) {
  const router = useRouter();

  const statusMessage = profile.latestRecommendationStatus
    ? STATUS_MESSAGE[profile.latestRecommendationStatus]
    : "You're ready to begin your Growth Journey.";

  const buttonLabel = profile.latestRecommendationStatus
    ? "Continue My Journey"
    : "Start My Growth Journey";

  const handleContinue = () => {
    router.push(
      `/journey?profileId=${profile.id}&goal=${encodeURIComponent(profile.primaryGoal)}`,
    );
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
          <dd className="inline">{profile.latestRecommendationStatus ?? "Not started"}</dd>
        </div>
      </dl>

      <p className="text-lg text-gray-700">{statusMessage}</p>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
