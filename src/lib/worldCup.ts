// World Cup 2026 portal constants
// Kicks off June 11, 2026 — Mexico vs South Africa (Estadio Azteca, 12:00 local / 20:00 UTC)
// Runs through the final on July 19, 2026.

export const WC2026_START = new Date("2026-06-11T20:00:00Z");
export const WC2026_END = new Date("2026-07-20T03:59:59Z");
export const SPORTS_URL = "https://omenx-sports.lovable.app";
export const SPORTS_REF_QUERY = "?ref=omenx-main&src=wc-panel";

export const SPORTS_LINK = `${SPORTS_URL}${SPORTS_REF_QUERY}`;

export const isWorldCupActive = (now: Date = new Date()): boolean => {
  return now >= WC2026_START && now <= WC2026_END;
};

const DISMISS_KEY = "wc2026-panel-dismissed";
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export const isPanelDismissed = (now: Date = new Date()): boolean => {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return now.getTime() - ts < DISMISS_TTL_MS;
  } catch {
    return false;
  }
};

export const dismissPanel = (): void => {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* noop */
  }
};
