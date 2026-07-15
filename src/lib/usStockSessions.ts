/**
 * US stock daily up/down event — session timing constants.
 *
 * NOTE: All four values below are PLACEHOLDER: pending confirmation.
 * They match the current PRD draft; adjust when the final settlement /
 * freeze schedule lands.
 */

// Minutes before the 16:00 ET official close when the market enters
// PRE_FREEZE state (order book widens, quote mode may switch to WIDE).
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

/** Lifecycle status → badge color + label. */
export const LIFECYCLE_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  TRADING: {
    label: "Trading",
    className: "bg-trading-green/15 text-trading-green border-trading-green/40",
  },
  EXTENDED_TRADING: {
    label: "Extended",
    className: "bg-primary/15 text-primary border-primary/40",
  },
  PRE_FREEZE: {
    label: "Pre-freeze",
    className: "bg-trading-yellow/15 text-trading-yellow border-trading-yellow/40",
  },
  FROZEN: {
    label: "Frozen · Settling",
    className: "bg-muted text-muted-foreground border-border",
  },
  CANCELED: {
    label: "Canceled",
    className: "bg-trading-red/15 text-trading-red border-trading-red/40",
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

/** Returns true if the event lifecycle disallows new orders. */
export const isOrderingBlocked = (lifecycle: string | null | undefined): boolean =>
  lifecycle === "PRE_FREEZE" ||
  lifecycle === "FROZEN" ||
  lifecycle === "CANCELED";
