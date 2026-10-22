import type { SafetyCategory } from "@/content/supportContent";
import { buildReviewedPlan, isValidPlanShape, sanitiseText, type Plan, type PlanInput } from "@/lib/planner";
import { assessSafety } from "@/lib/safety";

export interface PlanOutcome {
  plan: Plan;
  /** True when reviewed fallback content is shown instead of a live AI response. */
  usedFallback: boolean;
  safetyCategories: SafetyCategory[];
  urgent: boolean;
}

const CLIENT_TIMEOUT_MS = 15000;
const KNOWN_CATEGORIES: SafetyCategory[] = ["self_harm", "danger", "debt_threat", "under_18"];

function isPlan(value: unknown): value is Plan {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Plan;
  return (
    typeof p.acknowledgement === "string" &&
    p.acknowledgement.length > 0 &&
    p.acknowledgement.length <= 400 &&
    (p.source === "ai" || p.source === "reviewed") &&
    (p.todayNote === undefined || (typeof p.todayNote === "string" && p.todayNote.length <= 240)) &&
    isValidPlanShape(p)
  );
}

/**
 * Gets a plan. Safety screening and the reviewed plan are computed on the
 * device first, so a crisis disclosure is never sent anywhere and a network
 * failure still leaves the person with useful steps.
 */
export async function requestPlan(
  rawInput: PlanInput,
  aiEnabled: boolean,
  fetchImpl: typeof fetch = fetch,
): Promise<PlanOutcome> {
  const input: PlanInput = { ...rawInput, text: sanitiseText(rawInput.text) };
  const safety = assessSafety(input.text, { under18: input.under18 });
  const reviewed = buildReviewedPlan(input, safety);
  const local: PlanOutcome = {
    plan: reviewed,
    usedFallback: aiEnabled,
    safetyCategories: safety.categories,
    urgent: safety.urgent,
  };

  // Without live AI, or when the text should not leave the device, stop here.
  if (!aiEnabled || safety.urgent || safety.asksForBettingHelp || safety.looksLikeInjection) {
    return { ...local, usedFallback: aiEnabled && !safety.urgent };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  try {
    const res = await fetchImpl("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
      cache: "no-store",
      credentials: "omit",
    });
    if (!res.ok) return local;
    const data: unknown = await res.json();
    const plan = (data as { plan?: unknown })?.plan;
    if (!isPlan(plan)) return local;
    const serverSafety = (data as { safety?: { categories?: unknown; urgent?: unknown } }).safety;
    const categories = Array.isArray(serverSafety?.categories)
      ? (serverSafety!.categories as unknown[]).filter((c): c is SafetyCategory =>
          KNOWN_CATEGORIES.includes(c as SafetyCategory),
        )
      : [];
    return {
      plan,
      usedFallback: plan.source !== "ai",
      safetyCategories: Array.from(new Set([...safety.categories, ...categories])),
      urgent: safety.urgent || serverSafety?.urgent === true,
    };
  } catch {
    return local;
  } finally {
    clearTimeout(timer);
  }
}
