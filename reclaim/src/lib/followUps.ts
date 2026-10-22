import {
  ACTIONS,
  FOLLOW_UP_TEXT,
  MAX_FOLLOW_UPS,
  type ActionId,
  type FollowUpKind,
} from "@/content/supportContent";
import type { Plan } from "@/lib/planner";

export const STEP_ORDER = ["immediate", "today", "human"] as const;
export type StepSlot = (typeof STEP_ORDER)[number];

export interface FollowUp {
  id: number;
  kind: FollowUpKind;
  /** The action the person was responding to. */
  actionId: ActionId;
  intro: string;
  steps: string[];
  offerTimer: boolean;
  offerHumanHelp: boolean;
}

export interface FollowUpOutcome {
  followUp: FollowUp | null;
  nextStepIndex: number;
  limitReached: boolean;
}

export function actionForStep(plan: Plan, stepIndex: number): ActionId {
  const slot = STEP_ORDER[Math.min(stepIndex, STEP_ORDER.length - 1)];
  return plan[slot];
}

/**
 * Reviewed, deterministic follow-ups. They respond to the step the person is
 * on and never repeat the whole plan.
 */
export function nextFollowUp(
  plan: Plan,
  stepIndex: number,
  kind: FollowUpKind,
  previousCount: number,
): FollowUpOutcome {
  if (previousCount >= MAX_FOLLOW_UPS) {
    return { followUp: null, nextStepIndex: stepIndex, limitReached: true };
  }

  const actionId = actionForStep(plan, stepIndex);
  const base = { id: previousCount + 1, kind, actionId, offerTimer: false, offerHumanHelp: false };

  switch (kind) {
    case "done": {
      const next = stepIndex + 1;
      if (next >= STEP_ORDER.length) {
        return {
          followUp: { ...base, intro: FOLLOW_UP_TEXT.doneAll, steps: [], offerHumanHelp: true },
          nextStepIndex: STEP_ORDER.length,
          limitReached: false,
        };
      }
      const nextAction = ACTIONS[actionForStep(plan, next)];
      return {
        followUp: { ...base, intro: FOLLOW_UP_TEXT.doneNext, steps: [`${nextAction.title}. ${nextAction.body}`] },
        nextStepIndex: next,
        limitReached: false,
      };
    }
    case "too_difficult":
      return {
        followUp: { ...base, intro: FOLLOW_UP_TEXT.tooDifficult, steps: [ACTIONS[actionId].smallerStep] },
        nextStepIndex: stepIndex,
        limitReached: false,
      };
    case "urge_strong":
      return {
        followUp: {
          ...base,
          intro: FOLLOW_UP_TEXT.urgeStrongIntro,
          steps: [...FOLLOW_UP_TEXT.urgeStrongSteps],
          offerTimer: true,
          offerHumanHelp: true,
        },
        nextStepIndex: stepIndex,
        limitReached: false,
      };
    case "block_access":
      return {
        followUp: { ...base, intro: FOLLOW_UP_TEXT.blockIntro, steps: [...FOLLOW_UP_TEXT.blockSteps] },
        nextStepIndex: stepIndex,
        limitReached: false,
      };
  }
}
