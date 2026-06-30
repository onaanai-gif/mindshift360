"use client";

import { useEffect, useState } from "react";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { getLatestBusinessProfile, type LatestBusinessProfile } from "@/lib/api";

export default function DashboardPage() {
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
        {loading ? null : profile ? (
          <Dashboard profile={profile} />
        ) : (
          <p className="text-center text-lg text-red-600">
            We couldn&apos;t find your business profile.
          </p>
        )}
      </div>
    </main>
  );
}
