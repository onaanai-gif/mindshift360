"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND } from "@/content/brand";
import { useSession } from "./SessionProvider";

export function Header() {
  const { dispatch } = useSession();
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="Reclaim home"
          onClick={() => dispatch({ type: "go", view: "landing" })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.markSrc} alt="" width={34} height={40} />
          <span aria-hidden="true">
            <span className="wordmark-re">RE</span>CLAIM
          </span>
        </Link>
        <Link href="/help" className="help-link">
          Get human help
        </Link>
      </div>
    </header>
  );
}

export function ClearSessionButton() {
  const { clear } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  return (
    <div>
      <button
        type="button"
        className="button button-text"
        onClick={() => {
          clear();
          setMessage("This session has been cleared.");
          router.push("/");
        }}
      >
        Clear this session
      </button>
      <p className="small" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner stack-tight">
        <ClearSessionButton />
        <p className="small">
          Reclaim offers support and education for people who want to stop gambling. It is not a gambling service,
          a diagnostic tool, an emergency service or a replacement for professional treatment.
        </p>
        <nav aria-label="Footer" className="footer-links">
          <Link href="/help">Get human help</Link>
          <Link href="/privacy">Privacy and service information</Link>
        </nav>
      </div>
    </footer>
  );
}
