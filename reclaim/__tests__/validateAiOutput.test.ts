/** @jest-environment node */
import { validateAiOutput } from "@/lib/ai/validateAiOutput";

const good = {
  acknowledgement: "Losing on Aviator and going back again is exhausting. You are not alone in finding it hard.",
  immediate_action: "stop_chasing",
  today_action: "slow_deposits",
  human_action: "trusted_person",
  today_note: "Removing saved MoMo details means each deposit takes longer.",
};

describe("validateAiOutput", () => {
  it("accepts a well-formed, safe response", () => {
    const plan = validateAiOutput(good, { under18: false });
    expect(plan).toMatchObject({ immediate: "stop_chasing", source: "ai" });
  });

  it("replaces em dashes", () => {
    const plan = validateAiOutput({ ...good, acknowledgement: "That sounds hard — really hard." }, { under18: false });
    expect(plan?.acknowledgement).toBe("That sounds hard, really hard.");
  });

  it.each([
    ["unknown action", { ...good, immediate_action: "place_bet" }],
    ["action in wrong slot", { ...good, immediate_action: "list_essentials" }],
    ["extra keys", { ...good, link: "x" }],
    ["missing field", { ...good, today_note: undefined }],
    ["too long", { ...good, acknowledgement: "word ".repeat(60) }],
    ["odds", { ...good, acknowledgement: "Check the odds before you play." }],
    ["smaller bets", { ...good, acknowledgement: "Try placing smaller bets for now." }],
    ["borrowing", { ...good, today_note: "You could borrow from a friend to cover it." }],
    ["PIN", { ...good, today_note: "Give your PIN to your brother." }],
    ["diagnosis", { ...good, acknowledgement: "It sounds like you have a gambling addiction." }],
    ["promise", { ...good, acknowledgement: "You will recover soon, I promise." }],
    ["fake human", { ...good, acknowledgement: "A counsellor will contact you shortly." }],
    ["phone number", { ...good, today_note: "Call 0800 000 000 today." }],
    ["link", { ...good, today_note: "Visit https://example.com" }],
    ["business", { ...good, today_note: "Start a business to make the money back." }],
    ["not an object", "hello"],
    ["array", []],
  ])("rejects %s", (_label, raw) => {
    expect(validateAiOutput(raw, { under18: false })).toBeNull();
  });

  it("forces trusted adult for under-18s", () => {
    expect(validateAiOutput(good, { under18: true })?.human).toBe("trusted_adult");
  });

  it("rejects trusted adult for adults", () => {
    expect(validateAiOutput({ ...good, human_action: "trusted_adult" }, { under18: false })).toBeNull();
  });
});
