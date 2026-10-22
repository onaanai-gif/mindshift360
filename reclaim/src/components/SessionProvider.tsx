"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { GoalId, PauseOptionId, TriggerId } from "@/content/supportContent";
import type { Plan } from "@/lib/planner";
import type { FollowUp } from "@/lib/followUps";
import type { SafetyCategory } from "@/content/supportContent";

/**
 * Everything about the current visit lives here, in memory only. Nothing is
 * written to localStorage, cookies, URLs or analytics. Closing the tab or
 * pressing "Clear this session" removes it.
 */

export type View =
  | "landing"
  | "pause"
  | "pause-choice"
  | "pause-guidance"
  | "form"
  | "loading"
  | "plan"
  | "safety";

export interface FormState {
  text: string;
  triggers: TriggerId[];
  goal: GoalId | null;
  under18: boolean;
}

export interface SessionState {
  view: View;
  pauseStep: number;
  pauseOption: PauseOptionId | null;
  form: FormState;
  plan: Plan | null;
  /** Shown when live AI was not used, so the person knows what they are reading. */
  usedFallback: boolean;
  safetyCategories: SafetyCategory[];
  /** Where to go after the safety panel. */
  afterSafety: View;
  stepIndex: number;
  followUps: FollowUp[];
  followUpLimitReached: boolean;
}

export const EMPTY_FORM: FormState = { text: "", triggers: [], goal: null, under18: false };

export const INITIAL_STATE: SessionState = {
  view: "landing",
  pauseStep: 0,
  pauseOption: null,
  form: EMPTY_FORM,
  plan: null,
  usedFallback: false,
  safetyCategories: [],
  afterSafety: "landing",
  stepIndex: 0,
  followUps: [],
  followUpLimitReached: false,
};

type Action =
  | { type: "go"; view: View }
  | { type: "pauseStep"; step: number }
  | { type: "pauseOption"; option: PauseOptionId }
  | { type: "form"; form: FormState }
  | { type: "plan"; plan: Plan; usedFallback: boolean; safetyCategories: SafetyCategory[] }
  | { type: "safety"; categories: SafetyCategory[]; after: View }
  | { type: "followUp"; followUp: FollowUp | null; stepIndex: number; limitReached: boolean }
  | { type: "clear" };

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "go":
      return { ...state, view: action.view };
    case "pauseStep":
      return { ...state, view: "pause", pauseStep: action.step };
    case "pauseOption":
      return { ...state, view: "pause-guidance", pauseOption: action.option };
    case "form":
      return { ...state, form: action.form };
    case "plan":
      return {
        ...state,
        view: "plan",
        plan: action.plan,
        usedFallback: action.usedFallback,
        safetyCategories: action.safetyCategories,
        stepIndex: 0,
        followUps: [],
        followUpLimitReached: false,
      };
    case "safety":
      return { ...state, view: "safety", safetyCategories: action.categories, afterSafety: action.after };
    case "followUp":
      return {
        ...state,
        stepIndex: action.stepIndex,
        followUps: action.followUp ? [...state.followUps, action.followUp] : state.followUps,
        followUpLimitReached: action.limitReached,
      };
    case "clear":
      return INITIAL_STATE;
  }
}

interface SessionContextValue {
  state: SessionState;
  dispatch: (action: Action) => void;
  clear: () => void;
  aiEnabled: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children, aiEnabled }: { children: ReactNode; aiEnabled: boolean }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const value = useMemo(() => ({ state, dispatch, clear, aiEnabled }), [state, clear, aiEnabled]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
