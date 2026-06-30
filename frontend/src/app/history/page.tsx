"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { RecommendationHistory } from "@/components/recommendation-history/RecommendationHistory";
import { getRecommendationHistory, type RecommendationHistoryItem } from "@/lib/api";

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = Number(searchParams.get("profileId"));
  const [items, setItems] = useState<RecommendationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) {
      setError("No profile found.");
      setLoading(false);
      return;
    }

    getRecommendationHistory(profileId)
      .then(setItems)
      .catch(() => setError("We couldn't load your history."))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) {
    return <p className="text-center text-lg text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <div className="flex w-full flex-col gap-6 text-center">
        <p className="text-lg text-red-600" role="alert">
          {error}
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

  return <RecommendationHistory items={items} />;
}

export default function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <HistoryContent />
        </Suspense>
      </div>
    </main>
  );
}
