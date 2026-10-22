import { createHash } from "crypto";

/**
 * Small in-memory sliding-window limiter. Per server instance only, which
 * is enough for a private preview. Client keys are hashed and never logged.
 */
const hits = new Map<string, number[]>();

function envInt(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function allowRequest(key: string, now = Date.now()): boolean {
  const max = envInt("RECLAIM_RATE_LIMIT_MAX", 8);
  const windowMs = envInt("RECLAIM_RATE_LIMIT_WINDOW_MS", 10 * 60 * 1000);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep memory bounded.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimits(): void {
  hits.clear();
}
