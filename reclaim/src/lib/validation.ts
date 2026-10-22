import {
  GOAL_OPTIONS,
  MAX_TEXT_LENGTH,
  TRIGGER_OPTIONS,
  type GoalId,
  type TriggerId,
} from "@/content/supportContent";
import { sanitiseText, type PlanInput } from "@/lib/planner";

const TRIGGER_IDS = new Set<string>(TRIGGER_OPTIONS.map((o) => o.id));
const GOAL_IDS = new Set<string>(GOAL_OPTIONS.map((o) => o.id));

export const MAX_BODY_BYTES = 4096;

/** Parses untrusted request JSON into a PlanInput, or returns null. */
export function parsePlanInput(body: unknown): PlanInput | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;

  const text = b.text === undefined ? "" : b.text;
  if (typeof text !== "string" || text.length > MAX_TEXT_LENGTH) return null;

  const rawTriggers = b.triggers === undefined ? [] : b.triggers;
  if (!Array.isArray(rawTriggers) || rawTriggers.length > TRIGGER_OPTIONS.length) return null;
  if (!rawTriggers.every((t) => typeof t === "string" && TRIGGER_IDS.has(t))) return null;

  const goal = b.goal === undefined || b.goal === null ? null : b.goal;
  if (goal !== null && (typeof goal !== "string" || !GOAL_IDS.has(goal))) return null;

  const under18 = b.under18 === undefined ? false : b.under18;
  if (typeof under18 !== "boolean") return null;

  return {
    text: sanitiseText(text),
    triggers: Array.from(new Set(rawTriggers as TriggerId[])),
    goal: goal as GoalId | null,
    under18,
  };
}
