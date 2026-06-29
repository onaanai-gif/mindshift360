"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { RecommendationHistory } from "@/components/recommendation-history/RecommendationHistory";
import { getRecommendationHistory, type RecommendationHistoryItem } from "@/lib/api";

function HistoryContent() {
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

  if (loading) return null;

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
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
