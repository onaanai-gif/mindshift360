import { COMMUNITY_CONTENT, UNDER_18_CONTENT } from "@/content/supportContent";
import { SITE } from "@/content/siteConfig";

/**
 * Optional Telegram community link. Hidden entirely until a real URL is
 * configured, and never offered to someone who has said they are under 18.
 */
export function CommunityLink({ under18 = false }: { under18?: boolean }) {
  if (under18) {
    return <p className="small">{UNDER_18_CONTENT.communityNote}</p>;
  }
  if (!SITE.telegramUrl) return null;
  return (
    <section className="panel panel-quiet" aria-labelledby="community-heading">
      <h2 id="community-heading">{COMMUNITY_CONTENT.heading}</h2>
      <p>{COMMUNITY_CONTENT.body}</p>
      <ul className="small">
        {COMMUNITY_CONTENT.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <a className="button button-secondary" href={SITE.telegramUrl} target="_blank" rel="noopener noreferrer">
        {COMMUNITY_CONTENT.linkLabel}
        <span className="visually-hidden"> (opens Telegram in a new tab)</span>
      </a>
    </section>
  );
}
