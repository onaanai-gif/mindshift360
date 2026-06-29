"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getBusinessProfile } from "@/lib/api";
import { GOAL_SUMMARY } from "@/lib/goalSummaries";
import type { BusinessProfile } from "@/types/businessProfile";

interface BusinessSummaryProps {
  profileId: string;
}

export function BusinessSummary({ profileId }: BusinessSummaryProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getBusinessProfile(profileId)
      .then((result) => {
        if (isMounted) setProfile(result);
      })
      .catch(() => {
        if (isMounted) setError("We couldn't find that business profile.");
      });

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center text-lg text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-8 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Here&apos;s what I&apos;ve learned about your business.
      </h1>

      <dl className="flex flex-col gap-4 text-left">
        <div>
          <dt className="text-sm font-medium text-gray-500">Business Name</dt>
          <dd className="text-lg text-gray-900">{profile.businessName}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Business Type</dt>
          <dd className="text-lg text-gray-900">{profile.businessType}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Town/City</dt>
          <dd className="text-lg text-gray-900">{profile.townCity}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Primary Business Goal</dt>
          <dd className="text-lg text-gray-900">{profile.primaryGoal}</dd>
        </div>
      </dl>

      <p className="text-lg text-gray-700">{GOAL_SUMMARY[profile.primaryGoal]}</p>

      <p className="text-lg text-gray-700">
        We&apos;ll work together one practical step at a time.
      </p>

      <button
        type="button"
        onClick={() => router.push("/journey")}
        className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        Start My Growth Journey
      </button>
    </div>
  );
}
