/** @jest-environment node */
import { requestPlan } from "@/lib/requestPlan";
import type { PlanInput } from "@/lib/planner";

const base: PlanInput = { text: "I keep betting", triggers: [], goal: null, under18: false };

describe("requestPlan (browser side)", () => {
  it("never contacts the server when live AI is off", async () => {
    const fetchImpl = jest.fn();
    const out = await requestPlan(base, false, fetchImpl as unknown as typeof fetch);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(out.usedFallback).toBe(false);
  });

  it("never sends crisis text anywhere", async () => {
    const fetchImpl = jest.fn();
    const out = await requestPlan({ ...base, text: "I want to end my life" }, true, fetchImpl as unknown as typeof fetch);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(out.urgent).toBe(true);
  });

  it("shows reviewed steps on network failure", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const out = await requestPlan(base, true, fetchImpl as unknown as typeof fetch);
    expect(out.plan.source).toBe("reviewed");
    expect(out.usedFallback).toBe(true);
  });

  it("shows reviewed steps on server errors", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    const out = await requestPlan(base, true, fetchImpl as unknown as typeof fetch);
    expect(out.plan.source).toBe("reviewed");
  });

  it("rejects a malformed plan from the server", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ plan: { acknowledgement: "hi", immediate: "bet_now", today: "x", human: "y", source: "ai" } }),
    });
    const out = await requestPlan(base, true, fetchImpl as unknown as typeof fetch);
    expect(out.plan.source).toBe("reviewed");
  });

  it("uses a valid AI plan", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plan: { acknowledgement: "That sounds hard.", immediate: "delay_ten", today: "remove_apps", human: "trusted_person", source: "ai" },
        safety: { categories: [], urgent: false },
      }),
    });
    const out = await requestPlan(base, true, fetchImpl as unknown as typeof fetch);
    expect(out.plan.source).toBe("ai");
    expect(out.usedFallback).toBe(false);
    const init = fetchImpl.mock.calls[0][1];
    expect(fetchImpl.mock.calls[0][0]).toBe("/api/plan");
    expect(init.method).toBe("POST");
  });
});
