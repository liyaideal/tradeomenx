/**
 * US stock daily up/down event — session timing constants + lifecycle map.
 *
 * PRD alignment (v2026-07-15): the event `lifecycle_status` enum is
 *   CREATED → EXTENDED_TRADING → OPEN_COOLDOWN → TRADING → CLOSE_MODE
 *     → FROZEN → SETTLING → SETTLED
 * plus branches SUSPENDED / REVIEW / CANCELED.
 *
 * PRE_FREEZE is a LP-quote session concept (a display-layer window
 * before close), NOT an event lifecycle state — do not use it as an
 * `events.lifecycle_status` value.
 *
 * The four timing constants below are still PLACEHOLDER: pending confirmation.
 */

// Minutes before the 16:00 ET official close when the display should
// hint "closing soon" (LP quote mode may switch to CONSERVATIVE/WIDE).
// NOTE: presentation-layer only — not a lifecycle_status.
export const PRE_FREEZE_MINUTES_BEFORE_CLOSE = 15; // PLACEHOLDER: pending confirmation

// Minutes before 16:00 ET when new orders are hard-frozen.
// freeze_time = close − FREEZE_MINUTES_BEFORE_CLOSE  → 15:55 ET.
export const FREEZE_MINUTES_BEFORE_CLOSE = 5; // PLACEHOLDER: pending confirmation

// Open cooldown window (ET) at 09:30–09:35 when trading is disabled
// while opening auction prints settle.
export const OPEN_COOLDOWN_START_ET = "09:30"; // PLACEHOLDER: pending confirmation
export const OPEN_COOLDOWN_END_ET = "09:35"; // PLACEHOLDER: pending confirmation

// Latest time (ET) by which settlement credit must be posted to user wallets.
export const SETTLEMENT_CREDIT_BY_ET = "16:30"; // PLACEHOLDER: pending confirmation

/** Full lifecycle_status → badge label + class. Unknown → gray "Unknown". */
export const LIFECYCLE_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  CREATED: {
    label: "Created",
    className: "bg-muted text-muted-foreground border-border",
  },
  EXTENDED_TRADING: {
    label: "Extended",
    className: "bg-primary/15 text-primary border-primary/40",
  },
  OPEN_COOLDOWN: {
    label: "Open Cooldown",
    className: "bg-trading-yellow/15 text-trading-yellow border-trading-yellow/40",
  },
  TRADING: {
    label: "Trading",
    className: "bg-trading-green/15 text-trading-green border-trading-green/40",
  },
  CLOSE_MODE: {
    label: "Closing",
    className: "bg-trading-yellow/15 text-trading-yellow border-trading-yellow/40",
  },
  FROZEN: {
    label: "Frozen",
    className: "bg-muted text-muted-foreground border-border",
  },
  SETTLING: {
    label: "Settling",
    className: "bg-muted text-muted-foreground border-border",
  },
  SETTLED: {
    label: "Settled",
    className: "bg-muted/60 text-muted-foreground border-border/60",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-trading-red/15 text-trading-red border-trading-red/40",
  },
  REVIEW: {
    label: "Under Review",
    className: "bg-trading-red/15 text-trading-red border-trading-red/40",
  },
  CANCELED: {
    label: "Canceled",
    className: "bg-trading-red/15 text-trading-red border-trading-red/40",
  },
};

export const UNKNOWN_LIFECYCLE_BADGE = {
  label: "Unknown",
  className: "bg-muted text-muted-foreground border-border",
} as const;

/** Get badge for any lifecycle string; unknown → gray "Unknown". */
export const getLifecycleBadge = (lifecycle: string | null | undefined) =>
  (lifecycle && LIFECYCLE_BADGE[lifecycle]) || UNKNOWN_LIFECYCLE_BADGE;

/** States where new orders are allowed. Everything else is blocked. */
const ORDERABLE_STATES = new Set([
  "TRADING",
  "EXTENDED_TRADING",
  "OPEN_COOLDOWN",
]);

/** Returns true if the event lifecycle disallows new orders. */
export const isOrderingBlocked = (lifecycle: string | null | undefined): boolean =>
  !lifecycle || !ORDERABLE_STATES.has(lifecycle);

/** Short reason string for a disabled CTA. Empty string when orderable. */
export const getBlockedReason = (lifecycle: string | null | undefined): string => {
  if (!lifecycle) return "Market unavailable";
  switch (lifecycle) {
    case "TRADING":
    case "EXTENDED_TRADING":
    case "OPEN_COOLDOWN":
      return "";
    case "CLOSE_MODE":
      return "Closing — no new orders";
    case "FROZEN":
      return "Market frozen";
    case "SETTLING":
      return "Settling";
    case "SETTLED":
      return "Settled";
    case "SUSPENDED":
      return "Market suspended";
    case "REVIEW":
      return "Under review";
    case "CANCELED":
      return "Canceled";
    case "CREATED":
      return "Not yet open";
    default:
      return "Market unavailable";
  }
};

/** LP quote mode badge — separate from lifecycle. Mirrors `lp_quote_mode`. */
export const LP_QUOTE_MODE_BADGE: Record<
  string,
  { label: string; className: string; tooltip: string }
> = {
  NORMAL: {
    label: "NORMAL",
    className: "bg-muted text-muted-foreground border-border",
    tooltip: "Normal LP quoting — standard spread and depth.",
  },
  CONSERVATIVE: {
    label: "CONSERVATIVE",
    className: "bg-trading-yellow/15 text-trading-yellow border-trading-yellow/40",
    tooltip: "LP is widening spreads and reducing size ahead of close or volatility.",
  },
  HEDGE_ONLY: {
    label: "HEDGE ONLY",
    className: "bg-primary/15 text-primary border-primary/40",
    tooltip: "LP is only quoting the side that reduces its inventory risk.",
  },
  CANCEL_ONLY: {
    label: "CANCEL ONLY",
    className: "bg-trading-red/15 text-trading-red border-trading-red/40",
    tooltip: "New orders paused. Existing orders may still be cancelled.",
  },
};

/** Format a Date as ET (America/New_York) and Beijing (Asia/Shanghai). */
export const formatDualTimezone = (date: Date): { et: string; bj: string } => {
  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  return { et: `${fmt("America/New_York")} ET`, bj: `${fmt("Asia/Shanghai")} 北京` };
};

/**
 * Presentation-layer helper: is the event within the PRE_FREEZE_MINUTES_BEFORE_CLOSE
 * window before its end? Used for "Closing soon" hints — does NOT change
 * `lifecycle_status`.
 */
export const isInPreFreezeWindow = (endDate: Date | null | undefined): boolean => {
  if (!endDate) return false;
  const ms = endDate.getTime() - Date.now();
  return ms > 0 && ms <= PRE_FREEZE_MINUTES_BEFORE_CLOSE * 60_000;
};

// -----------------------------------------------------------------
// Session-aware LP profile (LP PRD §4.2 / §6.1).
// Drives buildBook depth/spread/size and the quote-mode badge on
// the /spot terminal.
//   REGULAR              09:30–15:45 ET  → NORMAL       — 8..12 levels, spread ×1, size ×1
//   EXTENDED_AFTER_HOURS 15:45–20:00 ET  → CONSERVATIVE — 3..7 levels,  spread ×2, size ×0.4
//   OVERNIGHT            20:00–04:00 ET  → CONSERVATIVE — 3 levels,     spread ×3, size ×0.25
//   PRE_MARKET           04:00–09:30 ET  → CONSERVATIVE — 3..7 levels,  spread ×2, size ×0.4
// PLACEHOLDER: pending confirmation — cutoffs mirror the four session
// timing constants above; adjust in one place if PM confirms.
// -----------------------------------------------------------------
export type SessionType =
  | "REGULAR"
  | "EXTENDED_AFTER_HOURS"
  | "OVERNIGHT"
  | "PRE_MARKET";

export interface SessionProfile {
  session: SessionType;
  label: string;
  quoteMode: "NORMAL" | "CONSERVATIVE" | "HEDGE_ONLY" | "CANCEL_ONLY";
  levelsMin: number;
  levelsMax: number;
  spreadMult: number;
  sizeMult: number;
  tooltip: string;
}

export const SESSION_PROFILES: Record<SessionType, SessionProfile> = {
  REGULAR: {
    session: "REGULAR",
    label: "Regular trading",
    quoteMode: "NORMAL",
    levelsMin: 8,
    levelsMax: 12,
    spreadMult: 1,
    sizeMult: 1,
    tooltip: "Regular US session (09:30–15:45 ET) — normal LP quoting.",
  },
  EXTENDED_AFTER_HOURS: {
    session: "EXTENDED_AFTER_HOURS",
    label: "After hours",
    quoteMode: "CONSERVATIVE",
    levelsMin: 3,
    levelsMax: 7,
    spreadMult: 2,
    sizeMult: 0.4,
    tooltip: "After-hours session — LP widens spreads and reduces size.",
  },
  OVERNIGHT: {
    session: "OVERNIGHT",
    label: "Overnight",
    quoteMode: "CONSERVATIVE",
    levelsMin: 3,
    levelsMax: 3,
    spreadMult: 3,
    sizeMult: 0.25,
    tooltip: "Overnight session (20:00–04:00 ET) — minimal depth, wide spreads.",
  },
  PRE_MARKET: {
    session: "PRE_MARKET",
    label: "Pre-market",
    quoteMode: "CONSERVATIVE",
    levelsMin: 3,
    levelsMax: 7,
    spreadMult: 2,
    sizeMult: 0.4,
    tooltip: "Pre-market session (04:00–09:30 ET) — LP widens spreads and reduces size.",
  },
};

const etMinutesOfDay = (d: Date = new Date()): number => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10) % 24;
  const m = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  return h * 60 + m;
};

/** Derive the current LP session profile from the wall clock (America/New_York). */
export const getCurrentSession = (now: Date = new Date()): SessionProfile => {
  const mins = etMinutesOfDay(now);
  const REG_START = 9 * 60 + 30; // 09:30
  const REG_END = 15 * 60 + 45; // 15:45 — matches CLOSE_MODE hand-off
  const AH_END = 20 * 60; // 20:00
  const PM_START = 4 * 60; // 04:00
  if (mins >= REG_START && mins < REG_END) return SESSION_PROFILES.REGULAR;
  if (mins >= REG_END && mins < AH_END) return SESSION_PROFILES.EXTENDED_AFTER_HOURS;
  if (mins >= AH_END || mins < PM_START) return SESSION_PROFILES.OVERNIGHT;
  return SESSION_PROFILES.PRE_MARKET;
};

