# Reclaim launch checklist

The software working is not the same as the service being ready. Do not deploy
publicly until every item below is done and signed off.

## 1. Professional review of support content
- [ ] A qualified Ghanaian mental health professional with experience of
      gambling harm reviews `src/content/supportContent.ts` (pause steps,
      action cards, follow-ups, safety flow, under-18 content).
- [ ] A safeguarding professional reviews the under-18 route and the safety
      flow wording.
- [ ] Review of the AI instructions in `src/lib/ai/prompt.ts` and the output
      filter in `src/lib/outputFilter.ts`.
- [ ] Testing with a small group of young people in Ghana for clarity and tone
      (plain British English, no shame, no clichés).
- [ ] Safety keyword lists in `src/lib/safety.ts` reviewed for common Ghanaian
      English, Pidgin and Twi phrasing.
- [ ] Update `CONTENT_VERSION` once reviewed.

## 2. Verified Ghanaian contacts
- [ ] Every item in `docs/RESOURCE_VERIFICATION.md` checked on an official
      source; verified entries added to `src/content/resources.ts` with
      `lastChecked` dates.
- [ ] Emergency numbers confirmed and added to `VERIFIED_EMERGENCY_CONTACTS`.
- [ ] Gaming Commission self-exclusion process confirmed and the wording in
      `FOLLOW_UP_TEXT.blockSteps` and the resource note updated to match.
- [ ] A schedule for re-checking contacts (suggested: every 3 months).

## 3. Privacy configuration
- [ ] Decide whether live AI is used at launch. If yes, set
      `RECLAIM_AI_ENABLED=true` and `ANTHROPIC_API_KEY` as server-side secrets
      in the hosting platform (never in the repository or in `NEXT_PUBLIC_`
      variables).
- [ ] Confirm the Anthropic account's data retention settings, and make the
      privacy page wording match them exactly.
- [ ] Confirm the hosting provider's access log retention, and that request
      bodies are not logged by any proxy, CDN or error reporter.
- [ ] Do not add analytics, session replay or error reporting that captures
      request bodies or page text.
- [ ] Run `npm run build && npm run check:bundle` with the production key set.
- [ ] A privacy notice reviewed against Ghana's Data Protection Act, 2012
      (Act 843), and registration with the Data Protection Commission if
      required.
- [ ] Rate limiting: the built-in limiter is per server instance. For
      multi-instance hosting, add a shared limiter.

## 4. Telegram community
- [ ] Provide the real community invite link and set
      `NEXT_PUBLIC_RECLAIM_TELEGRAM_URL` (must start with `https://t.me/`).
      Until then the link stays hidden.
- [ ] Confirm the community's rules, age policy (18+), moderation
      arrangements and expected response times. Update
      `COMMUNITY_CONTENT` if moderation is confirmed; do not promise it
      otherwise.

## 5. Final checks
- [ ] Owner approves the private preview.
- [ ] Test on a low-cost Android phone on a slow mobile connection.
- [ ] Screen reader check (TalkBack) of the pause flow, form and safety flow.
- [ ] Do not describe Reclaim as clinically validated or as a treatment.
