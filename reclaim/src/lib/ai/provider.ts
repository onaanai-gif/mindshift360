import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Plan, PlanInput } from "@/lib/planner";
import { SYSTEM_PROMPT, buildUserMessage, outputSchema } from "@/lib/ai/prompt";
import { validateAiOutput } from "@/lib/ai/validateAiOutput";

/**
 * Server-only Anthropic integration. The API key never leaves the server and
 * the person's text is never logged here.
 */

export type AiFailure = "disabled" | "timeout" | "network" | "api_error" | "refusal" | "invalid_output";

export type AiResult = { ok: true; plan: Plan } | { ok: false; reason: AiFailure };

export function isAiEnabled(): boolean {
  return process.env.RECLAIM_AI_ENABLED === "true" && Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

function timeoutMs(): number {
  const n = Number(process.env.RECLAIM_AI_TIMEOUT_MS);
  return Number.isFinite(n) && n >= 2000 && n <= 30000 ? n : 12000;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0, timeout: timeoutMs() });
  }
  return client;
}

/** Exposed for tests. */
export function setClientForTests(c: Anthropic | null): void {
  client = c;
}

export async function generateAiPlan(input: PlanInput, suggested: Plan, under18: boolean): Promise<AiResult> {
  if (!isAiEnabled()) return { ok: false, reason: "disabled" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());

  try {
    const response = await getClient().beta.messages.create(
      {
        model: process.env.RECLAIM_AI_MODEL?.trim() || "claude-opus-5-5",
        max_tokens: 2000,
        // Short, structured output: low effort keeps it fast.
        output_config: { effort: "low", format: { type: "json_schema", schema: outputSchema() } },
        // If the primary model declines, let the API retry on its default fallback.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(input, suggested) }],
      },
      { signal: controller.signal },
    );

    if (response.stop_reason === "refusal") return { ok: false, reason: "refusal" };
    if (response.stop_reason !== "end_turn") return { ok: false, reason: "invalid_output" };

    const text = response.content
      .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
      .map((b) => b.text)
      .join("");

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, reason: "invalid_output" };
    }

    const plan = validateAiOutput(parsed, { under18 });
    return plan ? { ok: true, plan } : { ok: false, reason: "invalid_output" };
  } catch (err) {
    if (controller.signal.aborted || err instanceof Anthropic.APIConnectionTimeoutError || err instanceof Anthropic.APIUserAbortError) {
      return { ok: false, reason: "timeout" };
    }
    if (err instanceof Anthropic.APIConnectionError) return { ok: false, reason: "network" };
    return { ok: false, reason: "api_error" };
  } finally {
    clearTimeout(timer);
  }
}
