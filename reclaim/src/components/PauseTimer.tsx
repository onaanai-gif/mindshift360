"use client";

import { useEffect, useRef, useState } from "react";
import { TIMER_NOTE } from "@/content/supportContent";

const TEN_MINUTES = 10 * 60;

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Optional, low-pressure ten-minute timer. No sounds, no animation. */
export function PauseTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const endAt = useRef<number>(0);
  const running = remaining !== null && remaining > 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setAnnouncement("Ten minutes have passed. You can choose what to do next.");
      } else if (left % 60 === 0) {
        setAnnouncement(`${left / 60} minutes left.`);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const start = () => {
    endAt.current = Date.now() + TEN_MINUTES * 1000;
    setRemaining(TEN_MINUTES);
    setAnnouncement("Timer started. Ten minutes.");
  };
  const stop = () => {
    setRemaining(null);
    setAnnouncement("Timer stopped.");
  };

  const finished = remaining === 0;

  return (
    <div className="timer" aria-labelledby="timer-label">
      <p id="timer-label" className="timer-label">
        Optional ten-minute timer
      </p>
      {remaining !== null && (
        <p className="timer-time" role="timer" aria-live="off">
          {format(remaining)}
        </p>
      )}
      {finished && (
        <p>Ten minutes have passed. How are you doing? You can choose what to do next.</p>
      )}
      <div className="button-row">
        {!running ? (
          <button type="button" className="button button-secondary" onClick={start}>
            {finished ? "Start another ten minutes" : "Start the timer"}
          </button>
        ) : (
          <button type="button" className="button button-secondary" onClick={stop}>
            Stop the timer
          </button>
        )}
      </div>
      <p className="small">{TIMER_NOTE}</p>
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
