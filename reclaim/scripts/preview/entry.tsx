import { createRoot } from "react-dom/client";
import { ReclaimApp } from "@/components/ReclaimApp";
import { SessionProvider } from "@/components/SessionProvider";
import { Footer, Header } from "@/components/SiteChrome";
import HelpPage from "@/app/help/page";
import PrivacyPage from "@/app/privacy/page";
import { PreviewRouter } from "./router";

function Page({ path }: { path: string }) {
  if (path === "/help") return <HelpPage />;
  if (path === "/privacy") return <PrivacyPage />;
  return <ReclaimApp />;
}

createRoot(document.getElementById("reclaim-root")!).render(
  <PreviewRouter>
    {(path) => (
      <SessionProvider aiEnabled={false}>
        <p className="preview-banner">
          Private preview. Live AI is off, so you see Reclaim&apos;s reviewed support steps. Contact details are
          waiting for verification.
        </p>
        <Header />
        <main id="main" className="main">
          <Page path={path} />
        </main>
        <Footer />
      </SessionProvider>
    )}
  </PreviewRouter>,
);
