import type { Metadata } from "next";
import Link from "next/link";
import { isAiEnabled } from "@/lib/ai/provider";

export const metadata: Metadata = { title: "Privacy and service information: Reclaim" };

export default function PrivacyPage() {
  const ai = isAiEnabled();
  return (
    <div className="stack prose">
      <h1>Privacy and service information</h1>

      <section aria-labelledby="what-heading">
        <h2 id="what-heading">What Reclaim is</h2>
        <p>
          Reclaim offers short, practical support and education for people in Ghana who want to stop gambling,
          including football betting, online casinos and games like Aviator.
        </p>
        <p>Reclaim is not:</p>
        <ul>
          <li>a gambling or betting service</li>
          <li>a diagnostic tool</li>
          <li>an emergency service</li>
          <li>a replacement for professional treatment or counselling</li>
        </ul>
        <p>
          Nobody at Reclaim reads or monitors what you type. If you need a person, use{" "}
          <Link href="/help">Get human help</Link>. Reclaim cannot block betting sites or mobile money payments.
        </p>
      </section>

      <section aria-labelledby="no-account-heading">
        <h2 id="no-account-heading">No account needed</h2>
        <p>
          You do not need to create an account or give your name, phone number, email address or location. Please do
          not type them into the form.
        </p>
      </section>

      <section aria-labelledby="data-heading">
        <h2 id="data-heading">What happens to what you type</h2>
        <ul>
          <li>
            Your answers are kept in your browser&apos;s memory only while the page is open. They are not saved to
            local storage, cookies or the web address.
          </li>
          <li>
            &ldquo;Clear this session&rdquo; at the bottom of every page removes them. Closing the tab also removes
            them.
          </li>
          <li>Reclaim does not store conversations in a database.</li>
          {ai ? (
            <li>
              Live AI is switched on. When you send the form, your text and choices go to Reclaim&apos;s server and
              then to an AI provider (Anthropic) to write a short response. Reclaim does not log or save the text. The
              AI provider may keep data for a limited period under its own policies, for example for safety and abuse
              monitoring.
            </li>
          ) : (
            <li>
              Live AI is currently switched off. Your answers are processed on your own device to choose from
              reviewed support steps, and are not sent anywhere.
            </li>
          )}
          <li>
            If what you write suggests you may be in danger, Reclaim shows safety information and does not send that
            text to the AI provider.
          </li>
          <li>
            Like most websites, the hosting provider may keep standard technical records such as IP addresses and
            the time of a visit. Reclaim does not add what you type to those records.
          </li>
        </ul>
        <p>
          Because of these technical records and the AI provider&apos;s policies, Reclaim does not describe itself as
          fully anonymous.
        </p>
      </section>

      <section aria-labelledby="tracking-heading">
        <h2 id="tracking-heading">No advertising or tracking</h2>
        <p>Reclaim uses no advertising trackers, no session recording and no analytics in this version.</p>
      </section>

      <section aria-labelledby="telegram-heading">
        <h2 id="telegram-heading">The Telegram community</h2>
        <p>
          The optional Reclaim community is on Telegram, a separate service with its own privacy policy. Nothing you
          type on Reclaim is sent to Telegram. What other members can see depends on your Telegram settings.
        </p>
      </section>

      <section aria-labelledby="content-heading">
        <h2 id="content-heading">About the support content</h2>
        <p>
          The support steps are written in advance and kept separately from the AI. When live AI is on, it only
          chooses between these steps and writes a short acknowledgement. The content has not been clinically
          validated, and Reclaim cannot promise any particular result.
        </p>
      </section>
    </div>
  );
}
