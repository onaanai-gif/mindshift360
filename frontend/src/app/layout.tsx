import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINDSHIFT360 Business Growth Partner",
  description: "MINDSHIFT360 Business Growth Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
