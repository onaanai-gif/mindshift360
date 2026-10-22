/**
 * Human support resource directory.
 *
 * Maintained separately from AI output: the AI never writes or edits these
 * entries, and the AI response is not allowed to contain phone numbers or
 * links (see src/lib/outputFilter.ts).
 *
 * RULES FOR EDITING
 * - Only add contact details you have checked on the organisation's own
 *   official website or by contacting them directly.
 * - Set `contactsVerified: true` only after that check, and update
 *   `lastChecked`. Unverified contacts are never displayed.
 * - Do not add services that only operate outside Ghana.
 * - Candidate details that still need checking live in
 *   docs/RESOURCE_VERIFICATION.md, not here.
 */

export interface Contact {
  label: string;
  /** Shown as written. For phone numbers use a format people can dial. */
  value: string;
  /** Optional link, such as tel: or https: */
  href?: string;
}

export interface SupportResource {
  id: string;
  name: string;
  purpose: string;
  officialUrl: string;
  /** Only shown when contactsVerified is true. */
  contacts: Contact[];
  contactsVerified: boolean;
  coverage: string;
  /** Leave undefined unless opening hours have been confirmed. */
  openingHours?: string;
  /** ISO date of the last check. */
  lastChecked: string;
  /** Plain description of what was and was not confirmed. */
  verificationNote: string;
  /** Extra guidance shown with the entry. */
  note?: string;
}

export const RESOURCES: readonly SupportResource[] = [
  {
    id: "gaming-commission-ghana",
    name: "Gaming Commission of Ghana",
    purpose:
      "The government regulator for gaming and betting in Ghana. It has described a self-exclusion scheme for people who want to be excluded from gambling platforms or take a break.",
    officialUrl: "https://www.gamingcommission.gov.gh/",
    contacts: [],
    contactsVerified: false,
    coverage: "Ghana",
    lastChecked: "2026-10-22",
    verificationNote:
      "Official website identified. Contact details and the current self-exclusion process have not yet been confirmed by Reclaim.",
    note: "Ask how self-exclusion currently works and which betting companies it covers. One request may not block every operator, so also ask each betting company you use to close or exclude your account.",
  },
  {
    id: "mental-health-authority",
    name: "Mental Health Authority (Ghana)",
    purpose:
      "The government agency responsible for mental health services in Ghana.",
    officialUrl: "https://www.moh.gov.gh/mental-health-authority/",
    contacts: [],
    contactsVerified: false,
    coverage: "Ghana",
    lastChecked: "2026-10-22",
    verificationNote:
      "Listed on the Ministry of Health website. Helpline numbers and opening hours have not yet been confirmed by Reclaim.",
  },
  {
    id: "mogcsp",
    name: "Ministry of Gender, Children and Social Protection",
    purpose:
      "The ministry responsible for child protection and social welfare in Ghana. It runs a call centre for social and psychological concerns.",
    officialUrl: "https://www.mogcsp.gov.gh/",
    contacts: [],
    contactsVerified: false,
    coverage: "Ghana",
    lastChecked: "2026-10-22",
    verificationNote:
      "Official website identified. Call centre numbers and opening hours have not yet been confirmed by Reclaim.",
  },
  {
    id: "ghana-police-service",
    name: "Ghana Police Service",
    purpose:
      "For immediate danger, threats, violence or harassment, including threats connected with debts.",
    officialUrl: "https://police.gov.gh/",
    contacts: [],
    contactsVerified: false,
    coverage: "Ghana",
    lastChecked: "2026-10-22",
    verificationNote:
      "Official website identified. Emergency numbers have not yet been confirmed by Reclaim from an official source.",
  },
];

/**
 * Emergency numbers shown at the top of the safety flow.
 * Leave empty until each number has been confirmed from an official
 * Ghanaian source (for example the National Communications Authority or
 * the Ghana Police Service). The safety flow still works without them.
 */
export const VERIFIED_EMERGENCY_CONTACTS: readonly (Contact & { lastChecked: string })[] = [];
