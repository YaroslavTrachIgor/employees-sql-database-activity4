"use client";

import { useEffect, useRef } from "react";
import { logoutAction } from "@/app/actions/auth";

const IDLE_MS = Number(
  process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS ?? 900000
);

const EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "click"] as const;

/**
 * Resets the idle timer on user activity; logs out via server action when the timeout elapses.
 */
export function IdleLogout() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void logoutAction();
      }, IDLE_MS);
    };

    schedule();
    EVENTS.forEach((ev) => {
      window.addEventListener(ev, schedule, { passive: true });
    });
    return () => {
      EVENTS.forEach((ev) => {
        window.removeEventListener(ev, schedule);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
