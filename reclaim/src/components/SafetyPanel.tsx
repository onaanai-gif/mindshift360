import Link from "next/link";
import type { Ref } from "react";
import { SAFETY_CONTENT, type SafetyCategory } from "@/content/supportContent";
import { VERIFIED_EMERGENCY_CONTACTS } from "@/content/resources";

interface Props {
  categories: SafetyCategory[];
  /** Automatic detection shows the "checks can be wrong" note. */
  automatic: boolean;
  headingId?: string;
  headingRef?: Ref<HTMLHeadingElement>;
  onContinue?: () => void;
  /** Use 1 when the panel is the whole view. */
  headingLevel?: 1 | 2;
}

export function EmergencyContacts() {
  if (VERIFIED_EMERGENCY_CONTACTS.length === 0) {
    return (
      <p className="small">
        Reclaim has not yet listed emergency numbers because we have not been able to confirm them from an official
        source. Use the emergency number you know, or go to the nearest hospital or police station.
      </p>
    );
  }
  return (
    <ul className="contact-list">
      {VERIFIED_EMERGENCY_CONTACTS.map((c) => (
        <li key={c.value}>
          <strong>{c.label}:</strong>{" "}
          {c.href ? <a href={c.href}>{c.value}</a> : c.value}{" "}
          <span className="small">(checked {c.lastChecked})</span>
        </li>
      ))}
    </ul>
  );
}

export function SafetyPanel({
  categories,
  automatic,
  headingId = "safety-heading",
  headingRef,
  onContinue,
  headingLevel = 2,
}: Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const has = (c: SafetyCategory) => categories.includes(c);
  return (
    <section className="panel panel-safety" aria-labelledby={headingId}>
      <Heading id={headingId} ref={headingRef} tabIndex={-1}>
        {SAFETY_CONTENT.heading}
      </Heading>
      {has("self_harm") && <p>{SAFETY_CONTENT.selfHarm}</p>}
      {has("danger") && <p>{SAFETY_CONTENT.danger}</p>}
      {has("debt_threat") && <p>{SAFETY_CONTENT.debtThreat}</p>}
      <ul>
        {SAFETY_CONTENT.immediate.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <EmergencyContacts />
      {(has("under_18") || !automatic) && <p>{SAFETY_CONTENT.under18}</p>}
      <p>
        <strong>{SAFETY_CONTENT.notMonitored}</strong>
      </p>
      {automatic && <p className="small">{SAFETY_CONTENT.automatedNote}</p>}
      <div className="button-row">
        {automatic && (
          <Link className="button button-primary" href="/help">
            See human support options
          </Link>
        )}
        {onContinue && (
          <button type="button" className="button button-secondary" onClick={onContinue}>
            {SAFETY_CONTENT.continueLabel}
          </button>
        )}
      </div>
    </section>
  );
}
