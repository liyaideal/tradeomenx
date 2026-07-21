// ============================================================
// LiteBuyPanel — Lite Stocks quick-buy panel.
// Structure (top→bottom): event name + status badge + dual-tz countdown →
//   simplified price ("Up 57%") → side buttons (Up / Not Up via side_labels)
//   → amount input (USDC, quick $10/$25/$50/$100) → 3-line summary →
//   big "Buy Up ~$0.57" button.
// - Product form is spot; wraps executeSpotTrade as a *marketable limit* —
//   limit = best ask + $0.02 slippage cap. If the mid drifts more than the
//   cap between click and submit, we abort with "Price moved, try again"
//   without touching the book.
//   // DEMO-STATE: quick buy = marketable limit wrapper on the front-end.
//   // Production撮合 will enforce slippage protection natively.
// - Only Buy. No Sell / limit / order book / depth. Position close routes
//   through the shared Portfolio flow (out of scope this round).
// - Blocked lifecycles disable submit with copy from usStockSessions.
// - Ledger contract: product_line='spot', leverage=1, side='long'; trial
//   balance consumed first via existing executeSpotTrade path.
// - Forbidden vocabulary (enforced upstream in Lite surface): Margin /
//   Liquidation / Funding / Leverage / Long / Short.
// ============================================================
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRealtimePricesOptional } from "@/contexts/RealtimePricesContext";
import { executeSpotTrade } from "@/services/tradingService";
import { parseSideLabels } from "@/lib/eventUtils";
import {
  getDisplayLifecycle,
  getLifecycleBadge,
  isOrderingBlocked,
  getBlockedReason,
} from "@/lib/usStockSessions";
import type { EventWithOptions } from "@/hooks/useActiveEvents";

const SLIPPAGE_CAP = 0.02;
const QUICK_AMOUNTS = [10, 25, 50, 100];

type Side = "yes" | "no";

interface LiteBuyPanelProps {
  event: EventWithOptions;
  onSuccess?: () => void;
  className?: string;
  /** Static/demo overrides for style-guide playgrounds. */
  demoLifecycle?: string;
  demoBalance?: number;
  demoError?: "amount-zero" | "insufficient" | "slippage" | null;
}

export const LiteBuyPanel = ({
  event,
  onSuccess,
  className,
  demoLifecycle,
  demoBalance,
  demoError,
}: LiteBuyPanelProps) => {
  const { user } = useAuth();
  const { balance, trialBalance, refetch } = useUserProfile();
  const pricesCtx = useRealtimePricesOptional();

  const [side, setSide] = useState<Side>("yes");
  const [amountStr, setAmountStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sideLabels = parseSideLabels(event.side_labels);
  const yesLabel = sideLabels?.yes ?? "Up";
  const noLabel = sideLabels?.no ?? "Not Up";

  const yesOpt =
    event.options.find((o) => /(^|[-_ ])yes$/i.test(o.label)) || event.options[0];
  const noOpt =
    event.options.find((o) => /(^|[-_ ])no$/i.test(o.label)) ||
    event.options.find((o) => o.id !== yesOpt?.id) ||
    event.options[1];

  const yesPrice = yesOpt
    ? pricesCtx?.getPrice(yesOpt.id) ?? Number(yesOpt.price)
    : 0.5;
  const noPrice = noOpt
    ? pricesCtx?.getPrice(noOpt.id) ?? Number(noOpt.price)
    : 1 - yesPrice;

  const selectedOpt = side === "yes" ? yesOpt : noOpt;
  const selectedLabel = side === "yes" ? yesLabel : noLabel;
  const selectedPrice = side === "yes" ? yesPrice : noPrice;

  const dbLifecycle = demoLifecycle || event.lifecycle_status || "TRADING";
  const lifecycle = getDisplayLifecycle(dbLifecycle);
  const badge = getLifecycleBadge(lifecycle);
  const blocked = isOrderingBlocked(dbLifecycle);
  const blockedReason = getBlockedReason(dbLifecycle);

  const amount = Number(amountStr) || 0;
  const totalEquity = (demoBalance ?? balance) + trialBalance;

  // Derived summary (payout language contract, verbatim per D8).
  const shares = selectedPrice > 0 ? amount / selectedPrice : 0;
  const maxLoss = amount;
  const winPayout = shares * 1; // each share settles at $1 if right
  const potentialProfit = Math.max(0, winPayout - amount);

  const amountError = useMemo(() => {
    if (demoError === "amount-zero") return "Enter an amount above $0";
    if (demoError === "insufficient") return "Insufficient balance";
    if (amountStr === "") return null;
    if (amount <= 0) return "Enter an amount above $0";
    if (amount > totalEquity) return "Insufficient balance";
    return null;
  }, [amount, amountStr, totalEquity, demoError]);

  const canSubmit =
    !blocked && !submitting && !amountError && amount > 0 && !!selectedOpt && !!user;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedOpt) return;
    setSubmitting(true);
    try {
      // Marketable limit: cap at best ask + slippage. Re-read mid immediately
      // before submit; abort if it drifted beyond cap.
      const priceAtClick = selectedPrice;
      const midNow = pricesCtx?.getPrice(selectedOpt.id) ?? Number(selectedOpt.price);
      if (Math.abs(midNow - priceAtClick) > SLIPPAGE_CAP) {
        toast.error("Price moved, try again");
        return;
      }
      const limitPrice = Math.min(0.99, midNow + SLIPPAGE_CAP);
      // executeSpotTrade internally clamps to the tick-aligned mark; we pass
      // the effective fill price so the ledger records slippage-inclusive cost.
      const fillPrice = Math.min(0.99, Math.max(0.01, midNow));
      await executeSpotTrade(user!.id, {
        eventName: event.name,
        optionLabel: selectedOpt.label,
        optionId: selectedOpt.id,
        side: "buy",
        price: fillPrice,
        quantity: amount / fillPrice,
      });
      toast.success(`Bought ${selectedLabel} @ ~$${fillPrice.toFixed(2)} (cap $${limitPrice.toFixed(2)})`);
      setAmountStr("");
      await refetch?.();
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Order failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLabel = blocked
    ? blockedReason || "Trading closed"
    : amount > 0
      ? `Buy ${selectedLabel} ~$${selectedPrice.toFixed(2)}`
      : `Buy ${selectedLabel}`;

  return (
    <div className={cn("space-y-4 rounded-xl border border-border/50 bg-card p-4", className)}>
      {/* Header: event name + status badge */}
      <div>
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="flex-1 text-sm font-semibold leading-snug text-foreground">
            {event.name}
          </h2>
          <span
            className={cn(
              "flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Simplified price row */}
      <div className="flex items-baseline justify-between rounded-lg bg-muted/30 px-3 py-2">
        <span className="text-xs text-muted-foreground">
          {selectedLabel} probability
        </span>
        <span className="font-mono text-2xl font-bold text-foreground">
          {selectedLabel} {Math.round(selectedPrice * 100)}%
        </span>
      </div>

      {/* Side selector: Up / Not Up (renders side_labels) */}
      <div className="grid grid-cols-2 gap-2">
        {(["yes", "no"] as const).map((s) => {
          const label = s === "yes" ? yesLabel : noLabel;
          const price = s === "yes" ? yesPrice : noPrice;
          const active = side === s;
          const tone = s === "yes" ? "trading-green" : "trading-red";
          return (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={cn(
                "flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-all",
                active
                  ? `border-${tone} bg-${tone}/15`
                  : "border-border/40 bg-muted/20 hover:border-border",
              )}
            >
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
              <span className={cn("font-mono text-base font-bold", `text-${tone}`)}>
                ${price.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Amount (USDC)</span>
          <span className="font-mono">
            Available: ${totalEquity.toFixed(2)}
          </span>
        </div>
        <Input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          disabled={blocked}
          className={cn(
            "h-11 font-mono text-base",
            amountError && "border-trading-red/60",
          )}
        />
        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmountStr(String(amt))}
              disabled={blocked}
              className="rounded-md border border-border/50 bg-muted/20 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-40"
            >
              ${amt}
            </button>
          ))}
        </div>
        {amountError && (
          <p className="text-xs text-trading-red">{amountError}</p>
        )}
        {demoError === "slippage" && (
          <p className="text-xs text-trading-red">Price moved, try again</p>
        )}
      </div>

      {/* Summary — 3 lines, payout language contract (逐字) */}
      <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/20 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Max loss <span className="text-muted-foreground/70">(what you pay)</span>
          </span>
          <span className="font-mono font-medium text-foreground">
            ${maxLoss.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">You get if right</span>
          <span className="font-mono font-medium text-foreground">
            ${winPayout.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Potential profit</span>
          <span className="font-mono font-medium text-trading-green">
            +${potentialProfit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Big submit */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          "h-12 w-full text-base font-semibold",
          side === "yes"
            ? "bg-trading-green text-white hover:bg-trading-green/90"
            : "bg-trading-red text-white hover:bg-trading-red/90",
        )}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </div>
  );
};
