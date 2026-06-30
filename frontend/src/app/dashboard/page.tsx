"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { getLatestBusinessProfile, type LatestBusinessProfile } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LatestBusinessProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    getLatestBusinessProfile()
      .then((result) => {
        if (isMounted) {
          setProfile(result);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading...</p>
        ) : profile ? (
          <Dashboard profile={profile} />
        ) : (
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
        )}
      </div>
    </main>
  );
}
