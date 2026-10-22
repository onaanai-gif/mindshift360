/** @jest-environment node */
import { ACTIONS, MAX_FOLLOW_UPS } from "@/content/supportContent";
import { nextFollowUp } from "@/lib/followUps";
import type { Plan } from "@/lib/planner";

const plan: Plan = { acknowledgement: "x", immediate: "close_app", today: "remove_apps", human: "trusted_person", source: "reviewed" };

describe("follow-ups", () => {
  it("offers a smaller step for the current action", () => {
    const out = nextFollowUp(plan, 0, "too_difficult", 0);
    expect(out.followUp?.steps).toEqual([ACTIONS.close_app.smallerStep]);
    expect(out.nextStepIndex).toBe(0);
  });

  it("moves to the next step when done, without repeating the plan", () => {
    const out = nextFollowUp(plan, 0, "done", 0);
    expect(out.nextStepIndex).toBe(1);
    expect(out.followUp?.steps).toHaveLength(1);
  });

  it("offers the timer and human help when the urge is strong", () => {
    const out = nextFollowUp(plan, 1, "urge_strong", 0);
    expect(out.followUp?.offerTimer).toBe(true);
    expect(out.followUp?.offerHumanHelp).toBe(true);
  });

  it("is honest that Reclaim cannot block access", () => {
    expect(nextFollowUp(plan, 0, "block_access", 0).followUp?.intro).toMatch(/cannot block/);
  });

  it("stops after a small number of follow-ups", () => {
    expect(nextFollowUp(plan, 0, "done", MAX_FOLLOW_UPS).limitReached).toBe(true);
  });
});
