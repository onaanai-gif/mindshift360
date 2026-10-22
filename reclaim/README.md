# Reclaim

A small, mobile-first support site for young people in Ghana who want to stop
gambling (football betting, online casinos, Aviator and other games of chance)
and are finding it hard.

Reclaim is support and education. It is not a gambling service, a diagnostic
tool, an emergency service or a replacement for professional treatment.

**Status: private preview. Not approved for public deployment.** See
[docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

## What it does

- **Help me pause**: three steps shown one at a time, an optional ten-minute
  timer, then "What would help you most right now?" with reviewed guidance.
  Works without the form and without AI.
- **Help me make a plan**: a short, fully optional form, then three action
  cards (right now, today, human support) with follow-up buttons.
- **Safety flow**: shown automatically for disclosures of self-harm, danger or
  debt-related threats, and always reachable through "Get human help".
- **Under-18 route**: optional checkbox or detected from text. Points to a
  trusted adult and never offers the adult Telegram community.
- **Resources** (`/help`) and **privacy and service information** (`/privacy`).
- **Clear this session** on every page. No accounts, no storage, no analytics.

## How it is organised

```
src/content/supportContent.ts   Reviewed support content (edit this for wording)
src/content/resources.ts        Verified resource directory and emergency contacts
src/content/siteConfig.ts       Public config (Telegram URL)
src/lib/safety.ts               Safety routing (runs in browser and on server)
src/lib/planner.ts              Deterministic plan from reviewed content
src/lib/followUps.ts            Reviewed follow-ups
src/lib/ai/                     Server-only AI integration, prompt and output validation
src/lib/outputFilter.ts         Blocks unsafe AI text (betting help, borrowing, diagnosis, contacts, links)
src/lib/requestPlan.ts          Browser-side request with local fallback
src/app/api/plan/route.ts       POST endpoint: validation, rate limit, safety screen, AI, fallback
src/components/                 Interface
```

### How the AI is constrained

The AI never writes support steps. It receives the reviewed action list and
returns JSON (enforced with a JSON schema) choosing one action per card, a
short acknowledgement (at most 45 words) and an optional one-sentence note.
The server then:

1. checks the shape, action ids and lengths,
2. runs the output filter, rejecting anything that mentions odds, stakes,
   smaller bets, borrowing, PINs, diagnosis, promises, people monitoring,
   phone numbers, links or markup,
3. forces the trusted-adult card for under-18s.

If anything fails, times out (12 seconds by default), is refused or the
network is down, the reviewed plan is shown instead. Text with crisis
disclosures, requests for betting tips or attempts to change the instructions
is never sent to the AI provider. With live AI off, nothing the person types
leaves their device.

### Privacy

- State lives in React memory only (`SessionProvider`); no localStorage,
  cookies, URL parameters or analytics.
- The API route never logs or echoes request text. Errors are reduced to a
  short reason code.
- Strict security headers (CSP with `connect-src 'self'`, no referrer).
- `npm run check:bundle` fails if the API key, system prompt or provider
  endpoint appears in browser bundles.

## Setup

Requires Node.js 20 or later.

```bash
cd reclaim
npm install
cp .env.example .env.local   # then edit; never commit real values
npm run dev                  # http://localhost:3000
```

Without changes to `.env.example`, Reclaim runs the reviewed deterministic
flow only. To connect live AI, set these as **server-side secrets** in your
hosting platform (or in `.env.local` locally; never paste keys into chat or
commit them):

| Variable | Purpose |
| --- | --- |
| `RECLAIM_AI_ENABLED` | `true` to use live AI |
| `ANTHROPIC_API_KEY` | Anthropic API key (server only) |
| `RECLAIM_AI_MODEL` | Defaults to `claude-opus-5-5` |
| `RECLAIM_AI_TIMEOUT_MS` | Defaults to 12000 |
| `NEXT_PUBLIC_RECLAIM_TELEGRAM_URL` | Telegram invite link; empty hides it |
| `RECLAIM_RATE_LIMIT_MAX`, `RECLAIM_RATE_LIMIT_WINDOW_MS` | Defaults: 8 requests per 10 minutes |

`NEXT_PUBLIC_RECLAIM_TELEGRAM_URL` is read at build time, so rebuild after
changing it.

The AI request enables the API's server-side refusal fallback
(`fallbacks: "default"`), so if the model declines, the API retries on a
fallback model. If that also declines, Reclaim shows the reviewed plan.

## Checks

```bash
npm test               # unit, API and interface tests
npm run lint
npm run typecheck
npm run build && npm run check:bundle
```

The tests cover: "I can't stop", empty submission, chasing losses with money
left, no money for essentials, returning after betting, requests for tips,
under-18 disclosure, self-harm, danger and debt threats, attempts to override
the instructions, missing credentials, network failure, timeouts, refusals and
invalid AI output, plus checks that user text never reaches console output or
API responses.

## Editing content

- Wording: `src/content/supportContent.ts`. Keep it short, British English, no
  em dashes, no clinical labels, no promises. Changes should be reviewed by a
  professional before release.
- Resources: `src/content/resources.ts`. Only add contacts checked on an
  official source; candidates waiting for checks are in
  `docs/RESOURCE_VERIFICATION.md`.
