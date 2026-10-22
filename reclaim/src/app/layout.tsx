import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Footer, Header } from "@/components/SiteChrome";
import { isAiEnabled } from "@/lib/ai/provider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reclaim: support to stop betting",
  description: "Short, practical support for young people in Ghana who want to stop betting.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02182d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <SessionProvider aiEnabled={isAiEnabled()}>
          <Header />
          <main id="main" className="main">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
