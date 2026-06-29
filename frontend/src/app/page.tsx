"use client";

import { useEffect, useState } from "react";

import { BusinessIntroWizard } from "@/components/business-intro/BusinessIntroWizard";
import { WelcomeBack } from "@/components/welcome-back/WelcomeBack";
import { getLatestBusinessProfile, type LatestBusinessProfile } from "@/lib/api";

export default function HomePage() {
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {loading ? null : profile ? (
          <WelcomeBack profile={profile} />
        ) : (
          <BusinessIntroWizard />
        )}
      </div>
    </main>
  );
}
