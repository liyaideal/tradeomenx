import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/MobileHeader";
import { DesktopHeader } from "@/components/DesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { executeSpotTrade } from "@/services/tradingService";
import { parseSideLabels } from "@/lib/eventUtils";
import {
  LIFECYCLE_BADGE,
  isOrderingBlocked,
  formatDualTimezone,
} from "@/lib/usStockSessions";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type EventRow = Tables<"events"> & { options: Tables<"event_options">[] };

// -------- Mocked order book (front-end only, per LP PRD sketch) --------
interface BookLevel { price: number; size: number; }
const buildBook = (mid: number, seed: number): { bids: BookLevel[]; asks: BookLevel[] } => {
  const rand = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };
  const halfSpread = 0.02;
  const asks: BookLevel[] = [];
  const bids: BookLevel[] = [];
  let askSize = 200 * (0.9 + rand(1) * 0.2);
  let bidSize = 200 * (0.9 + rand(2) * 0.2);
  for (let i = 0; i < 10; i++) {
    const p = Math.min(0.99, Math.max(0.01, mid + halfSpread + i * 0.01));
    asks.push({ price: p, size: Math.round(askSize) });
    askSize *= 0.82;
  }
  for (let i = 0; i < 10; i++) {
    const p = Math.min(0.99, Math.max(0.01, mid - halfSpread - i * 0.01));
    bids.push({ price: p, size: Math.round(bidSize) });
    bidSize *= 0.82;
  }
  return { bids, asks };
};

const SpotTrading = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || "";
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const {
    balance,
    trialBalance,
    totalBalance,
    deductBalance,
    addBalance,
  } = useUserProfile();

  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [heldQty, setHeldQty] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data: e } = await supabase.from("events").select("*").eq("id", eventId).maybeSingle();
      const { data: opts } = await supabase.from("event_options").select("*").eq("event_id", eventId);
      if (!alive) return;
      if (e) {
        setEvent({ ...e, options: opts || [] });
        const first = (opts || [])[0];
        if (first) {
          setSelectedOptionId(first.id);
          setPrice(String(Number(first.price).toFixed(2)));
        }
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [eventId]);

  // Load user's spot holding for this option
  useEffect(() => {
    if (!user || !selectedOptionId) { setHeldQty(0); return; }
    (async () => {
      const { data } = await supabase
        .from("positions")
        .select("size")
        .eq("user_id", user.id)
        .eq("option_id", selectedOptionId)
        .eq("product_line", "spot")
        .eq("side", "long")
        .eq("status", "Open")
        .maybeSingle();
      setHeldQty(data ? Number(data.size) : 0);
    })();
  }, [user, selectedOptionId, submitting]);

  const sideLabels = useMemo(() => parseSideLabels(event?.side_labels), [event]);
  const selectedOption = event?.options.find((o) => o.id === selectedOptionId) || null;

  // Refresh price when option changes
  useEffect(() => {
    if (selectedOption) setPrice(String(Number(selectedOption.price).toFixed(2)));
  }, [selectedOptionId]);

  const lifecycle = event?.lifecycle_status || "TRADING";
  const badge = LIFECYCLE_BADGE[lifecycle] || LIFECYCLE_BADGE.TRADING;
  const blocked = isOrderingBlocked(lifecycle);

  const p = parseFloat(price) || 0;
  const amt = parseFloat(amount) || 0;
  const qty = p > 0 ? amt / p : 0;
  const maxLoss = side === "buy" ? amt : 0;
  const payoutIfRight = side === "buy" ? qty : 0;

  const seed = useMemo(
    () => (selectedOption?.id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0),
    [selectedOption?.id]
  );
  const book = useMemo(
    () => buildBook(selectedOption ? Number(selectedOption.price) : 0.5, seed),
    [selectedOption, seed]
  );

  const endDate = event?.end_date ? new Date(event.end_date) : null;
  const tz = endDate ? formatDualTimezone(endDate) : null;

  // Countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const countdown = useMemo(() => {
    if (!endDate) return "";
    const diff = endDate.getTime() - now;
    if (diff <= 0) return "Settled";
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    return `${h}h ${m}m ${s}s`;
  }, [endDate, now]);

  const handleSubmit = async () => {
    if (!user) { toast.error("Please sign in first."); return; }
    if (!selectedOption) return;
    if (blocked) { toast.error("Market is frozen — no new orders."); return; }
    if (amt <= 0 || p <= 0 || p >= 1) { toast.error("Enter a valid price and amount."); return; }
    if (side === "sell" && qty > heldQty + 0.000001) {
      toast.error("Short selling is not supported. Reduce quantity.");
      return;
    }
    if (side === "buy" && amt > totalBalance) {
      toast.error("Insufficient balance.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await executeSpotTrade(user.id, {
        eventName: event!.name,
        optionLabel: selectedOption.label,
        optionId: selectedOption.id,
        side,
        price: p,
        quantity: qty,
      });
      if (res.balanceDelta < 0) {
        await deductBalance(-res.balanceDelta);
      } else if (res.balanceDelta > 0) {
        await addBalance(res.balanceDelta);
      }
      toast.success(side === "buy" ? "Spot buy filled" : "Spot sell filled");
      setAmount("");
    } catch (err: any) {
      toast.error(err?.message || "Trade failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <p className="text-muted-foreground">Event not found.</p>
        <Button onClick={() => navigate("/events?pl=spot")}>Back to Spot markets</Button>
      </div>
    );
  }

  const yesLabel = sideLabels?.yes || "Yes";
  const noLabel = sideLabels?.no || "No";
  const yesOpt = event.options.find((o) => o.label.endsWith("-yes")) || event.options[0];
  const noOpt = event.options.find((o) => o.label.endsWith("-no")) || event.options[1];

  return (
    <div className={cn("min-h-screen bg-background", isMobile && "pb-24")}>
      {isMobile ? (
        <MobileHeader showBack backTo="/events?pl=spot" title="Spot" />
      ) : (
        <DesktopHeader />
      )}

      <main className={cn("mx-auto w-full space-y-4", isMobile ? "px-4 py-4" : "max-w-5xl px-8 py-8")}>
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px]">SPOT</Badge>
            <Badge variant="outline" className={cn("text-[10px] border", badge.className)}>
              {badge.label}
            </Badge>
          </div>
          <h1 className={cn("font-bold text-foreground", isMobile ? "text-xl" : "text-2xl")}>
            {event.name}
          </h1>
          {event.base_price != null && (
            <p className="text-xs text-muted-foreground">
              Settles vs prior official close ${Number(event.base_price).toFixed(2)} · flat close = {noLabel}
            </p>
          )}
          {tz && (
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-3 flex-wrap">
              <span>Closes in <span className="text-foreground">{countdown}</span></span>
              <span>·</span>
              <span>{tz.et}</span>
              <span>·</span>
              <span>{tz.bj}</span>
            </div>
          )}
        </div>

        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-[1fr_360px]")}>
          {/* Order book */}
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Order Book</h3>
              <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30" title="LP quote mode">
                NORMAL
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] uppercase text-muted-foreground pb-1 border-b border-border/40">
                  <span>Bid</span><span>Size</span>
                </div>
                {book.bids.slice(0, 8).map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-trading-green">{l.price.toFixed(2)}</span>
                    <span className="text-muted-foreground">{l.size}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] uppercase text-muted-foreground pb-1 border-b border-border/40">
                  <span>Ask</span><span>Size</span>
                </div>
                {book.asks.slice(0, 8).map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-trading-red">{l.price.toFixed(2)}</span>
                    <span className="text-muted-foreground">{l.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade panel */}
          <div className="rounded-lg border border-border/60 bg-card p-4 space-y-3">
            {/* Outcome switch */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => yesOpt && setSelectedOptionId(yesOpt.id)}
                className={cn(
                  "py-2 rounded-md text-sm font-semibold border transition",
                  selectedOptionId === yesOpt?.id
                    ? "bg-trading-green/15 text-trading-green border-trading-green/40"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {yesLabel}
                {yesOpt && (
                  <div className="text-[11px] font-mono opacity-70">${Number(yesOpt.price).toFixed(2)}</div>
                )}
              </button>
              <button
                onClick={() => noOpt && setSelectedOptionId(noOpt.id)}
                className={cn(
                  "py-2 rounded-md text-sm font-semibold border transition",
                  selectedOptionId === noOpt?.id
                    ? "bg-trading-red/15 text-trading-red border-trading-red/40"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {noLabel}
                {noOpt && (
                  <div className="text-[11px] font-mono opacity-70">${Number(noOpt.price).toFixed(2)}</div>
                )}
              </button>
            </div>

            {/* Buy / Sell tabs */}
            <div className="inline-flex w-full items-center gap-1 rounded-md border border-border/60 bg-muted/30 p-1">
              {(["buy", "sell"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={cn(
                    "flex-1 py-1.5 rounded text-sm font-medium capitalize transition",
                    side === s
                      ? (s === "buy" ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red")
                      : "text-muted-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Price / Amount */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Limit price ($)</label>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {side === "buy" ? "Amount ($)" : `Amount ($) — held: ${heldQty.toFixed(0)} shares`}
                </label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-md bg-muted/30 p-2.5 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span>${(p * qty).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max loss</span>
                <span>${maxLoss.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payout if right</span>
                <span>${payoutIfRight.toFixed(2)} <span className="text-muted-foreground">({qty.toFixed(0)} × $1)</span></span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Info className="h-3 w-3" />
              Trial ${trialBalance.toFixed(2)} + Cash ${balance.toFixed(2)} = ${totalBalance.toFixed(2)}
            </div>

            <Button
              className="w-full h-11"
              disabled={submitting || blocked || amt <= 0}
              onClick={handleSubmit}
              variant={side === "buy" ? "default" : "destructive"}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> :
                blocked ? "Market frozen" :
                `${side === "buy" ? "Buy" : "Sell"} ${selectedOption?.label.endsWith("-yes") ? yesLabel : noLabel}`}
            </Button>
          </div>
        </div>
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
};

export default SpotTrading;
