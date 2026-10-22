"use client";

import { useState } from "react";

export function CopyMessage({ message }: { message: string }) {
  const [status, setStatus] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setStatus("Message copied.");
    } catch {
      setStatus("Copying did not work. You can select the message and copy it yourself.");
    }
  };
  return (
    <div className="copy-message">
      <p className="quote">{message}</p>
      <button type="button" className="button button-secondary" onClick={copy}>
        Copy this message
      </button>
      <p className="small" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
