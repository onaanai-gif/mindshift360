"use client";

import { useEffect, useRef } from "react";

/**
 * Moves keyboard and screen reader focus to a view's heading when it
 * appears, so a change of step is announced. Skipped on first page load.
 */
export function useFocusHeading<T extends HTMLElement>(key: unknown, skipInitial = false) {
  const ref = useRef<T>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current && skipInitial) {
      first.current = false;
      return;
    }
    first.current = false;
    ref.current?.focus();
  }, [key, skipInitial]);
  return ref;
}
