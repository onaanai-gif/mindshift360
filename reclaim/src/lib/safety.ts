/**
 * Safety routing.
 *
 * Runs in the browser and on the server before any AI call. It is a simple
 * keyword screen, not a reliable classifier: it will miss some disclosures
 * and flag some that are not. The safety flow is therefore also reachable at
 * any time through the visible "Get human help" link.
 */
import type { SafetyCategory } from "@/content/supportContent";

export interface SafetyAssessment {
  categories: SafetyCategory[];
  /** True when the safety panel should be shown before anything else. */
  urgent: boolean;
  /** Asking for tips, odds or ways to win. */
  asksForBettingHelp: boolean;
  /** Text that tries to change the assistant's instructions. */
  looksLikeInjection: boolean;
}

const SELF_HARM = [
  /\bkill(ing)? my ?self\b/,
  /\bend(ing)? (my|it) (own )?li(fe|ves)\b/,
  /\bend it all\b/,
  /\btake my (own )?life\b/,
  /\bsuicid/,
  /\b(want|wanna|going) to die\b/,
  /\bwish i (was|were) dead\b/,
  /\bbetter off dead\b/,
  /\bdon'?t want to (live|be alive|be here)\b/,
  /\bno (reason|point) (to|in) (live|living)\b/,
  /\b(hurt|harm|cut)(ing)? my ?self\b/,
  /\bself[- ]?harm/,
  /\boverdose\b/,
  /\bjump (off|from)\b/,
];

const DANGER = [
  /\bin danger\b/,
  /\bnot safe\b/,
  /\bunsafe\b/,
  /\b(going|gonna|want|wants|trying|threaten(ed|ing)?) to (kill|hurt|beat|attack|harm) me\b/,
  /\b(beat(ing|en)? me|beat me up|attack(ed|ing)? me|stabbed|kidnap)/,
  /\b(gun|knife|machete|weapon)\b/,
  /\b(threaten(ed|ing)? (me|my)|threats? (from|against)|(getting|receiving|sending me) threats)\b/,
];

const DEBT = /\b(owe|owing|debt|loan|lender|borrow(ed)?|pay (it|them|him|her) back|money back)\b/;
const DEBT_THREAT = /\b(threat|threaten|beat|hurt|kill|harass|come for me|find me|deal with me|expose|shame me|post my|call(ing)? my (family|contacts|friends))/;

const UNDER_18 = [
  /\bi('?m| am) (1[0-7])\b(?!( |-)?(cedis|ghs|gh₵|k\b|times|bets|games|days|hours|minutes|weeks|months|matches|odds|%))/,
  /\b([89]|1[0-7]) ?(-| )?(years? old|yrs old|year-old|yo)\b/,
  /\bunder ?(18|eighteen)\b/,
  /\bunderage\b/,
  /\b(jhs|shs|junior high|senior high)\b/,
  /\bin form (one|two|three|1|2|3)\b/,
];

const BETTING_HELP = [
  /\b(give|send|share|need|want|any|best|good|today'?s) (me )?(some )?(betting )?(tips?|odds|predictions?|sure games?)\b/,
  /\b(sure (bet|win|odds|games?)|fixed match(es)?|correct score|tipster)\b/,
  /\bwhat (should|do|can) i (bet|stake|play)\b/,
  /\bhow (do i|to|can i) win\b/,
  /\b(strategy|system|trick|hack) (for|to win|on) /,
  /\bwhich (team|game|match) (should|to|will)\b/,
  /\baviator (strategy|trick|hack|signal|predictor|cash ?out)/,
];

const INJECTION = [
  /\bignore (all |any |the )?(previous|prior|above|earlier|your) (instructions|rules|prompts?)/,
  /\bdisregard (all |the |your )?(instructions|rules)/,
  /\b(system|developer) (prompt|message|instructions)\b/,
  /\byou are now\b/,
  /\bact as\b/,
  /\bjailbreak|\bdan mode|\bdeveloper mode/,
  /\bnew instructions\b/,
  /\bpretend (to be|you are)\b/,
  /<\/?(system|assistant|instructions?)>/,
];

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function assessSafety(text: string, options: { under18?: boolean } = {}): SafetyAssessment {
  const t = normalise(text);
  const categories = new Set<SafetyCategory>();

  if (SELF_HARM.some((re) => re.test(t))) categories.add("self_harm");
  if (DEBT.test(t) && DEBT_THREAT.test(t)) categories.add("debt_threat");
  else if (DANGER.some((re) => re.test(t))) categories.add("danger");
  if (options.under18 || UNDER_18.some((re) => re.test(t))) categories.add("under_18");

  const urgent =
    categories.has("self_harm") || categories.has("danger") || categories.has("debt_threat");

  return {
    categories: Array.from(categories),
    urgent,
    asksForBettingHelp: BETTING_HELP.some((re) => re.test(t)),
    looksLikeInjection: INJECTION.some((re) => re.test(t)),
  };
}
