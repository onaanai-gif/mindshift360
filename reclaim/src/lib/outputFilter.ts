/**
 * Checks AI-written text before anyone sees it. Anything that fails is
 * discarded and the reviewed text is used instead.
 */

const BLOCKED = [
  // Betting help of any kind.
  /\b(odds|tipsters?|accumulators?|acca|banker|sure (bet|win|odds|games?)|cash ?out|stake|wager|predictions?)\b/i,
  /\b(smaller|small|lower|fewer) bets?\b/i,
  /\bbet (less|smaller|responsibly)\b/i,
  // Money handling we never suggest.
  /\b(borrow|loan|lend)\b(?!.{0,40}\b(not|never|don'?t|avoid)\b)/i,
  /\bpin\b/i,
  /\b(send|transfer|give) (money|it|cash)? ?(to )?(us|reclaim)\b/i,
  /\bstart(ing)? a business\b/i,
  // Diagnosis, treatment and promises.
  /\b(addict(ed|ion)?|disorder|diagnos\w*|compulsive gambler|problem gambler|prescri\w*|medication)\b/i,
  /\b(guarantee\w*|cured?|you will (recover|be fine|be okay|feel better|win)|everything will be (fine|okay))\b/i,
  // Shame and threats.
  /\b(shame on you|you should be ashamed|stupid|foolish|weak|irresponsible|sinful)\b/i,
  // Claims about people who are not there.
  /\b(our|a|the) (team|counsellors?|volunteers?|staff|moderators?|someone) (will|is|are) (contact|call|message|watch|monitor|review|read)/i,
  /\b(i am|i'm) (a )?(human|person|counsellor|doctor|therapist)\b/i,
  // Contact details, links and markup: only the reviewed directory may supply these.
  /https?:\/\//i,
  /\bwww\./i,
  /\b[a-z0-9-]+\.(com|org|gh|net|io|me)\b/i,
  /@/,
  /\d{3,}/,
  /[<>{}]/,
];

export function isSafeAiText(text: string): boolean {
  return !BLOCKED.some((re) => re.test(text));
}

/** House style: no em or en dashes in displayed text. */
export function tidyAiText(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
