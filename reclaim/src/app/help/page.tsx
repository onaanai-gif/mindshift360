import type { Metadata } from "next";
import { CommunityLink } from "@/components/CommunityLink";
import { CopyMessage } from "@/components/CopyMessage";
import { ResourceList } from "@/components/ResourceList";
import { SafetyPanel } from "@/components/SafetyPanel";
import { TRUSTED_PERSON_MESSAGE, UNDER_18_CONTENT } from "@/content/supportContent";

export const metadata: Metadata = { title: "Get human help: Reclaim" };

export default function HelpPage() {
  return (
    <div className="stack">
      <h1>Get human help</h1>
      <p className="lead">
        Reclaim is a website, not a person. Nobody is watching this page. These are ways to reach real people.
      </p>

      <SafetyPanel categories={[]} automatic={false} />

      <section aria-labelledby="trusted-heading" className="stack-tight">
        <h2 id="trusted-heading">Talk to someone you trust</h2>
        <p>
          A friend, family member, religious leader, teacher or colleague. You do not have to tell them everything.
          You could send this:
        </p>
        <CopyMessage message={TRUSTED_PERSON_MESSAGE} />
      </section>

      <section aria-labelledby="under-18" className="panel panel-quiet stack-tight">
        <h2 id="under-18" tabIndex={-1}>
          {UNDER_18_CONTENT.heading}
        </h2>
        <p>{UNDER_18_CONTENT.intro}</p>
        <ul>
          {UNDER_18_CONTENT.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="resources-heading" className="stack-tight">
        <h2 id="resources-heading">Organisations in Ghana</h2>
        <p>
          Reclaim only lists contact details after checking them on an official source. Where details are still being
          checked, please use the organisation&apos;s official website.
        </p>
        <ResourceList />
      </section>

      <CommunityLink />
    </div>
  );
}
