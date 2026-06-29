"use client";

import { useRouter } from "next/navigation";

import type { RecommendationHistoryItem } from "@/lib/api";

interface RecommendationHistoryProps {
  items: RecommendationHistoryItem[];
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800",
  },
  need_help_attempt: {
    label: "Need Help",
    className: "bg-amber-100 text-amber-800",
  },
  later: {
    label: "Later",
    className: "bg-gray-100 text-gray-700",
  },
};

export function RecommendationHistory({ items }: RecommendationHistoryProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Your Growth Journey</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg text-gray-700">
            You haven&apos;t completed any Growth Steps yet.
          </p>
          <p className="mt-2 text-lg text-gray-700">
            Every small action moves your business forward.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => {
            const badge = STATUS_BADGE[item.status] ?? {
              label: item.status,
              className: "bg-gray-100 text-gray-700",
            };
            return (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="text-base font-semibold text-gray-900">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
