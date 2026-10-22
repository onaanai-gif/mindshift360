import { NextResponse } from "next/server";
import { buildReviewedPlan, type Plan } from "@/lib/planner";
import { assessSafety, type SafetyAssessment } from "@/lib/safety";
import { MAX_BODY_BYTES, parsePlanInput } from "@/lib/validation";
import { allowRequest, clientKey } from "@/lib/rateLimit";
import { generateAiPlan } from "@/lib/ai/provider";

export const dynamic = "force-dynamic";

export interface PlanResponse {
  plan: Plan;
  safety: Pick<SafetyAssessment, "categories" | "urgent">;
  /** Why the reviewed plan was used, if live AI did not answer. No user text. */
  fallbackReason?: string;
}

function error(status: number, code: string) {
  // Deliberately generic: never echo the request back.
  return NextResponse.json({ error: code }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return error(413, "too_large");

  if (!allowRequest(clientKey(request.headers))) return error(429, "rate_limited");

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return error(400, "bad_request");
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return error(413, "too_large");

  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return error(400, "bad_request");
  }

  const input = parsePlanInput(body);
  if (!input) return error(400, "bad_request");

  const safety = assessSafety(input.text, { under18: input.under18 });
  const reviewed = buildReviewedPlan(input, safety);
  const under18 = safety.categories.includes("under_18");
  const safetySummary = { categories: safety.categories, urgent: safety.urgent };

  // Crisis disclosures, betting-help requests and attempts to change the
  // instructions never reach the AI provider.
  if (safety.urgent || safety.asksForBettingHelp || safety.looksLikeInjection) {
    return NextResponse.json<PlanResponse>({ plan: reviewed, safety: safetySummary, fallbackReason: "screened" });
  }

  const ai = await generateAiPlan(input, reviewed, under18);
  if (ai.ok) {
    return NextResponse.json<PlanResponse>({ plan: ai.plan, safety: safetySummary });
  }
  return NextResponse.json<PlanResponse>({ plan: reviewed, safety: safetySummary, fallbackReason: ai.reason });
}
