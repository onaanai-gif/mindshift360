/**
 * Deterministic planner.
 *
 * Builds a plan from reviewed content only. Used whenever live AI is off,
 * fails, times out or returns something invalid, and as the starting point
 * the AI is allowed to adjust.
 */
import {
  ACKNOWLEDGEMENTS,
  ACTIONS,
  MAX_TEXT_LENGTH,
  type AcknowledgementKey,
  type ActionId,
  type GoalId,
  type TriggerId,
} from "@/content/supportContent";
import type { SafetyAssessment } from "@/lib/safety";

export interface PlanInput {
  text: string;
  triggers: TriggerId[];
  goal: GoalId | null;
  under18: boolean;
}

export interface Plan {
  acknowledgement: string;
  immediate: ActionId;
  today: ActionId;
  human: ActionId;
  /** Optional short note from the AI tied to the "today" step. */
  todayNote?: string;
  source: "reviewed" | "ai";
}

interface Signals {
  chasing: boolean;
  money: boolean;
  restart: boolean;
  urge: boolean;
  groups: boolean;
  lonely: boolean;
  stressed: boolean;
}

function readSignals(input: PlanInput): Signals {
  const t = input.text.toLowerCase();
  const has = (id: TriggerId) => input.triggers.includes(id);
  return {
    chasing:
      has("win_back") ||
      has("next_bet_hope") ||
      /\b(win (it )?back|recover|chas(e|ing)|lost|losing|losses)\b/.test(t),
    money:
      has("need_money") ||
      /\b(no money|broke|rent|school fees|fees|food|transport|hungry|can'?t pay|cannot pay|owe|debt|loan|borrow)/.test(t),
    restart: /\b(again|relapse|slipped|went back|bet (again|today|last night)|i failed)\b/.test(t),
    urge: /\b(urge|itch|tempt|craving|right now|feel like betting)\b/.test(t),
    groups: has("friends_groups") || /\b(group|telegram|whatsapp|friends|tips? group|channel)\b/.test(t),
    lonely: has("bored_lonely") || /\b(bored|lonely|alone)\b/.test(t),
    stressed: has("stressed") || /\b(stress|overwhelm|pressure|worried|anxious|tired)\b/.test(t),
  };
}

function choose(input: PlanInput, s: Signals): {
  ack: AcknowledgementKey;
  immediate: ActionId;
  today: ActionId;
  human: ActionId;
} {
  const human: ActionId = input.goal === "human_support" ? "professional_help" : "trusted_person";

  switch (input.goal) {
    case "stop_next_bet":
      return {
        ack: s.chasing ? "chasing" : "general",
        immediate: s.chasing ? "stop_chasing" : "close_app",
        today: s.money ? "list_essentials" : "remove_apps",
        human,
      };
    case "protect_money":
      return {
        ack: s.money ? "money" : s.chasing ? "chasing" : "general",
        immediate: "protect_money_now",
        today: s.money ? "urgent_money_step" : "list_essentials",
        human,
      };
    case "get_through_urge":
      return {
        ack: "urge",
        immediate: "delay_ten",
        today: s.groups ? "leave_groups" : "plan_hard_time",
        human,
      };
    case "start_again":
      return {
        ack: "restart",
        immediate: "after_betting",
        today: s.chasing ? "no_borrowing" : "restart_small",
        human,
      };
    case "human_support":
      return {
        ack: "human",
        immediate: s.chasing ? "stop_chasing" : "delay_ten",
        today: s.money ? "list_essentials" : "slow_deposits",
        human,
      };
    default:
      break;
  }

  // No goal selected: infer from what they wrote and ticked.
  if (s.restart) {
    return { ack: "restart", immediate: "after_betting", today: s.chasing ? "no_borrowing" : "restart_small", human };
  }
  if (s.money) {
    return { ack: "money", immediate: "protect_money_now", today: s.chasing ? "no_borrowing" : "urgent_money_step", human };
  }
  if (s.chasing) {
    return { ack: "chasing", immediate: "stop_chasing", today: "slow_deposits", human };
  }
  if (s.groups) {
    return { ack: "pressure", immediate: "mute_triggers", today: "leave_groups", human };
  }
  if (s.lonely) {
    return { ack: "lonely", immediate: "name_feeling", today: "plan_hard_time", human };
  }
  if (s.stressed) {
    return { ack: "general", immediate: "name_feeling", today: "plan_hard_time", human };
  }
  if (s.urge) {
    return { ack: "urge", immediate: "delay_ten", today: "remove_apps", human };
  }
  // Empty submission or "I can't stop": a general plan, no error.
  return { ack: "general", immediate: "close_app", today: "slow_deposits", human };
}

export function sanitiseText(text: unknown): string {
  if (typeof text !== "string") return "";
  // Strip control characters and cap the length.
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, MAX_TEXT_LENGTH);
}

export function buildReviewedPlan(input: PlanInput, safety: SafetyAssessment): Plan {
  const s = readSignals(input);
  const picked = choose(input, s);
  const under18 = input.under18 || safety.categories.includes("under_18");

  let ack: AcknowledgementKey = picked.ack;
  let immediate = picked.immediate;
  if (safety.asksForBettingHelp) {
    ack = "tips";
    immediate = "stop_chasing";
  } else if (under18 && ack === "general") {
    ack = "under18";
  }

  return {
    acknowledgement: ACKNOWLEDGEMENTS[ack],
    immediate,
    today: picked.today,
    human: under18 ? "trusted_adult" : picked.human,
    source: "reviewed",
  };
}

/** Ensures every action id exists and sits in the right slot. */
export function isValidPlanShape(plan: Plan): boolean {
  return (
    ACTIONS[plan.immediate]?.slot === "immediate" &&
    ACTIONS[plan.today]?.slot === "today" &&
    ACTIONS[plan.human]?.slot === "human"
  );
}
