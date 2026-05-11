import { useEffect, useState } from "react";

export interface CountdownResult {
  /** Human-readable remaining time (e.g. "2h 14m" or "12m 5s"). "Expired" when past. */
  timeLeft: string;
  /** True after expiry. */
  isExpired: boolean;
  /** True when less than 1 hour remains — surface as urgent in UI. */
  urgent: boolean;
  /** Remaining milliseconds (never negative). */
  diffMs: number;
}

/**
 * Countdown to an ISO timestamp. Auto-scales refresh interval based on remaining time:
 *  - ≥ 1h: every 60s
 *  - < 1h: every 10s
 *  - < 1m: every 1s
 */
export const useCountdown = (expiresAt: string | null | undefined): CountdownResult => {
  const compute = (): CountdownResult => {
    if (!expiresAt) {
      return { timeLeft: "", isExpired: false, urgent: false, diffMs: 0 };
    }
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) {
      return { timeLeft: "Expired", isExpired: true, urgent: true, diffMs: 0 };
    }
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let timeLeft: string;
    if (hours >= 1) {
      timeLeft = `${hours}h ${minutes}m`;
    } else if (minutes >= 1) {
      timeLeft = `${minutes}m ${seconds}s`;
    } else {
      timeLeft = `${seconds}s`;
    }
    return {
      timeLeft,
      isExpired: false,
      urgent: diff < 60 * 60 * 1000,
      diffMs: diff,
    };
  };

  const [state, setState] = useState<CountdownResult>(compute);

  useEffect(() => {
    if (!expiresAt) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const next = compute();
      setState(next);
      if (next.isExpired) return;
      const interval =
        next.diffMs < 60 * 1000 ? 1000 : next.diffMs < 60 * 60 * 1000 ? 10_000 : 60_000;
      timer = setTimeout(tick, interval);
    };

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  return state;
};
