import { RESOURCES } from "@/content/resources";

export function ResourceList() {
  return (
    <ul className="resource-list">
      {RESOURCES.map((r) => (
        <li key={r.id} className="card">
          <h3 className="card-title">{r.name}</h3>
          <p>{r.purpose}</p>
          {r.note && <p>{r.note}</p>}
          <dl className="details">
            <dt>Official website</dt>
            <dd>
              <a href={r.officialUrl} rel="noopener noreferrer">
                {r.officialUrl.replace(/^https:\/\//, "").replace(/\/$/, "")}
              </a>
            </dd>
            <dt>Contact</dt>
            <dd>
              {r.contactsVerified && r.contacts.length > 0 ? (
                <ul className="contact-list">
                  {r.contacts.map((c) => (
                    <li key={c.value}>
                      {c.label}: {c.href ? <a href={c.href}>{c.value}</a> : c.value}
                    </li>
                  ))}
                </ul>
              ) : (
                "Not yet verified by Reclaim. Please use the official website."
              )}
            </dd>
            <dt>Covers</dt>
            <dd>{r.coverage}</dd>
            <dt>Opening hours</dt>
            <dd>{r.openingHours ?? "Not confirmed"}</dd>
            <dt>Last checked</dt>
            <dd>
              {r.lastChecked}. {r.verificationNote}
            </dd>
          </dl>
        </li>
      ))}
    </ul>
  );
}
