/** Public, non-secret configuration that is safe to ship to the browser. */

function readTelegramUrl(): string | null {
  const raw = (process.env.NEXT_PUBLIC_RECLAIM_TELEGRAM_URL ?? "").trim();
  if (!raw) return null;
  // Only accept a real Telegram invite link, so a typo cannot send people elsewhere.
  return /^https:\/\/t\.me\/[A-Za-z0-9_+\/-]+$/.test(raw) ? raw : null;
}

export const SITE = {
  name: "Reclaim",
  telegramUrl: readTelegramUrl(),
} as const;
