import { useState, useMemo, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface ClosePositionPopoverProps {
  /** Trigger element (Close button) */
  children: React.ReactNode;
  /** Position event name (display) */
  event: string;
  /** Option label (display) */
  option: string;
  /** "long" | "short" */
  side: "long" | "short";
  /** Raw numeric size (contracts) */
  size: number;
  /** Raw numeric entry price */
  entryPrice: number;
  /** Raw numeric mark price */
  markPrice: number;
  /** Raw numeric margin (USDC) */
  margin: number;
  /** Display leverage e.g. "10x" */
  leverage: string;
  /** Partial close disabled (airdrop / locked) */
  fullCloseOnly?: boolean;
  /** Confirm: closeQty is integer contracts (1..size) */
  onConfirm: (closeQty: number) => void | Promise<void>;
  isClosing?: boolean;
  /** Anchor side */
  side_?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const QUICK_RATIOS = [25, 50, 75, 100] as const;

export const ClosePositionPopover = ({
  children,
  event,
  option,
  side,
  size,
  entryPrice,
  markPrice,
  margin,
  leverage,
  fullCloseOnly = false,
  onConfirm,
  isClosing = false,
  side_ = "top",
  align = "end",
}: ClosePositionPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [closeQty, setCloseQty] = useState<number>(size);

  // Reset to full size whenever popover (re)opens or size changes
  useEffect(() => {
    if (open) setCloseQty(Math.max(1, Math.floor(size)));
  }, [open, size]);

  const safeSize = Math.max(1, Math.floor(size));
  const clampedQty = Math.min(safeSize, Math.max(1, Math.floor(closeQty || 0)));
  const ratio = safeSize > 0 ? clampedQty / safeSize : 0;
  const ratioPct = Math.round(ratio * 100);

  const { realizedPnl, releasedMargin, remaining } = useMemo(() => {
    const priceDiff = markPrice - entryPrice;
    const pnl = (side === "long" ? priceDiff : -priceDiff) * clampedQty;
    const released = margin * ratio;
    return {
      realizedPnl: pnl,
      releasedMargin: released,
      remaining: safeSize - clampedQty,
    };
  }, [markPrice, entryPrice, side, clampedQty, margin, ratio, safeSize]);

  const isFull = clampedQty === safeSize;
  const pnlPositive = realizedPnl >= 0;

  const fmtUsd = (n: number) => `${n >= 0 ? "" : "-"}$${Math.abs(n).toFixed(2)}`;
  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
  const pnlPctOnMargin = margin > 0 ? (realizedPnl / margin) * 100 : 0;

  const handleConfirm = async () => {
    await onConfirm(clampedQty);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side_}
        align={align}
        className="w-[300px] p-0 bg-card border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-border/40">
          <div className="text-sm font-semibold text-foreground">Close position</div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {option} · <span className={side === "long" ? "text-trading-green" : "text-trading-red"}>{side === "long" ? "Long" : "Short"}</span> · <span className="font-mono">{safeSize.toLocaleString()}</span> contracts
          </div>
        </div>

        {/* Body */}
        <div className="px-3 py-3 space-y-3">
          {!fullCloseOnly && (
            <>
              {/* Quick ratios */}
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_RATIOS.map((r) => {
                  const qty = r === 100 ? safeSize : Math.max(1, Math.round((safeSize * r) / 100));
                  const active = qty === clampedQty;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCloseQty(qty)}
                      className={`text-[11px] font-medium py-1.5 rounded-md transition-colors ${
                        active
                          ? "bg-trading-red/20 text-trading-red border border-trading-red/40"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
                      }`}
                    >
                      {r}%
                    </button>
                  );
                })}
              </div>

              {/* Slider */}
              <div className="space-y-1.5">
                <Slider
                  min={1}
                  max={safeSize}
                  step={1}
                  value={[clampedQty]}
                  onValueChange={(v) => setCloseQty(v[0])}
                />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-mono text-foreground">
                    {clampedQty.toLocaleString()} <span className="text-muted-foreground">({ratioPct}%)</span>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Preview */}
          <div className="rounded-md bg-muted/30 px-2.5 py-2 space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Close price (mark)</span>
              <span className="font-mono text-foreground">${markPrice.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Realized PnL</span>
              <span className={`font-mono ${pnlPositive ? "text-trading-green" : "text-trading-red"}`}>
                {pnlPositive ? "+" : ""}{fmtUsd(realizedPnl)} <span className="opacity-70">({fmtPct(pnlPctOnMargin)})</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Released margin</span>
              <span className="font-mono text-foreground">${releasedMargin.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Remaining size</span>
              <span className="font-mono text-foreground">
                {remaining.toLocaleString()} contracts
              </span>
            </div>
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isClosing || clampedQty < 1}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold bg-trading-red text-white hover:bg-trading-red/90 disabled:opacity-60 transition-colors"
          >
            {isClosing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isFull ? "Close all" : `Close ${clampedQty.toLocaleString()} contracts`}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
