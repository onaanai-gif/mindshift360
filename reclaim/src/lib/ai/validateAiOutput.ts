import { ACTIONS, type ActionId } from "@/content/supportContent";
import type { Plan } from "@/lib/planner";
import { countWords, isSafeAiText, tidyAiText } from "@/lib/outputFilter";

const MAX_ACK_WORDS = 45;
const MAX_ACK_CHARS = 320;
const MAX_NOTE_WORDS = 30;
const MAX_NOTE_CHARS = 200;

function isActionInSlot(id: unknown, slot: "immediate" | "today" | "human"): id is ActionId {
  return typeof id === "string" && Object.prototype.hasOwnProperty.call(ACTIONS, id) && ACTIONS[id as ActionId].slot === slot;
}

/**
 * Turns raw model output into a Plan, or returns null if anything about it
 * is missing, unexpected, too long or unsafe. Callers fall back to the
 * reviewed plan on null.
 */
export function validateAiOutput(raw: unknown, opts: { under18: boolean }): Plan | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const allowedKeys = new Set(["acknowledgement", "immediate_action", "today_action", "human_action", "today_note"]);
  if (Object.keys(o).some((k) => !allowedKeys.has(k))) return null;

  if (typeof o.acknowledgement !== "string" || typeof o.today_note !== "string") return null;
  if (!isActionInSlot(o.immediate_action, "immediate")) return null;
  if (!isActionInSlot(o.today_action, "today")) return null;
  if (!isActionInSlot(o.human_action, "human")) return null;

  const acknowledgement = tidyAiText(o.acknowledgement);
  const todayNote = tidyAiText(o.today_note);

  if (!acknowledgement || acknowledgement.length > MAX_ACK_CHARS || countWords(acknowledgement) > MAX_ACK_WORDS) return null;
  if (todayNote.length > MAX_NOTE_CHARS || countWords(todayNote) > MAX_NOTE_WORDS) return null;
  if (!isSafeAiText(acknowledgement) || (todayNote && !isSafeAiText(todayNote))) return null;

  // Under-18s are always pointed to a trusted adult, never to the adult community.
  const human: ActionId = opts.under18 ? "trusted_adult" : o.human_action;
  if (!opts.under18 && human === "trusted_adult") return null;

  return {
    acknowledgement,
    immediate: o.immediate_action,
    today: o.today_action,
    human,
    todayNote: todayNote || undefined,
    source: "ai",
  };
}
