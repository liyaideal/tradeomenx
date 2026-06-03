import { Ticket, Clock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";
import type { PositionVoucher } from "@/hooks/usePositionVouchers";

interface VoucherCardProps {
  voucher: PositionVoucher;
  onRedeem: (voucher: PositionVoucher) => void;
  /** Compact: single clickable row used as a selector in the left rail */
  compact?: boolean;
  selected?: boolean;
}

export const VoucherCard = ({ voucher, onRedeem, compact, selected }: VoucherCardProps) => {
  const { timeLeft, urgent } = useCountdown(voucher.expiresAt);
  const cap = voucher.faceValue * voucher.redeemableCapPct;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onRedeem(voucher)}
        className={cn(
          "relative w-full text-left rounded-2xl overflow-hidden transition-all border bg-card",
          selected
            ? "border-primary/40 shadow-[0_0_25px_-5px_hsl(var(--primary)/0.35)]"
            : "border-border/60 opacity-60 hover:opacity-100 hover:border-border",
        )}
      >
        {selected && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 rounded-b-full bg-primary"
            style={{ boxShadow: "0 2px 10px hsl(var(--primary) / 0.5)" }}
          />
        )}

        {/* Top zone: face value + expiry */}
        <div className="p-5 flex justify-between items-start gap-3">
          <div className="flex flex-col min-w-0">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5",
                selected ? "text-primary/80" : "text-muted-foreground/60",
              )}
            >
              Face value
            </span>
            <span
              className={cn(
                "font-mono text-4xl font-bold tracking-tight leading-none",
                selected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              ${voucher.faceValue.toFixed(2)}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border shrink-0",
              urgent
                ? "bg-trading-red/10 border-trading-red/30"
                : "bg-muted/40 border-border",
            )}
          >
            {urgent ? (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-trading-red/75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-trading-red" />
              </span>
            ) : (
              <Clock className="w-3 h-3 text-muted-foreground" />
            )}
            <span
              className={cn(
                "font-mono text-[12px] font-bold",
                urgent ? "text-trading-red" : "text-muted-foreground",
              )}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Perforation with side notches */}
        <div className="relative flex items-center px-4">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-background border border-border/60" />
          <div
            className={cn(
              "w-full border-t-2 border-dashed",
              selected ? "border-border/60" : "border-border/40",
            )}
          />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-background border border-border/60" />
        </div>

        {/* Bottom zone: code + max payout */}
        <div
          className={cn(
            "p-5 flex justify-between items-center gap-3",
            selected ? "bg-gradient-to-b from-primary/[0.03] to-primary/[0.08]" : "bg-muted/20",
          )}
        >
          <div className="flex flex-col min-w-0">
            <span
              className={cn(
                "text-[9px] uppercase font-bold tracking-widest mb-2",
                selected ? "text-muted-foreground" : "text-muted-foreground/60",
              )}
            >
              Voucher code
            </span>
            <span
              className={cn(
                "font-mono text-sm font-bold tracking-[0.15em] px-2.5 py-1 rounded-md border w-fit",
                selected
                  ? "text-foreground bg-foreground/5 border-border"
                  : "text-muted-foreground bg-muted/40 border-border/60",
              )}
            >
              {voucher.code}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={cn(
                "text-[9px] uppercase font-bold tracking-widest mb-2",
                selected ? "text-muted-foreground" : "text-muted-foreground/60",
              )}
            >
              Max profit
            </span>
            <span
              className={cn(
                "font-mono text-sm font-bold px-2 py-1 rounded-md border",
                selected
                  ? "text-trading-green bg-trading-green/10 border-trading-green/20"
                  : "text-trading-green/60 bg-trading-green/5 border-trading-green/10",
              )}
            >
              ${cap.toFixed(2)}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{voucher.code}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
                Voucher
              </Badge>
            </div>
            <div className="font-mono text-xl text-foreground mt-0.5">
              ${voucher.faceValue.toFixed(2)}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${urgent ? "text-trading-red font-medium" : "text-muted-foreground"}`}>
          <Clock className="w-3 h-3" />
          <span className="font-mono">{timeLeft}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div>
          <div className="text-[10px] text-muted-foreground">Max Profit</div>
          <div className="font-mono text-trading-green">${cap.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Hold Window</div>
          <div className="font-mono">{voucher.maxHoldingHours}h</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Price Band</div>
          <div className="font-mono">
            {voucher.entryPriceMin.toFixed(2)}–{voucher.entryPriceMax.toFixed(2)}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/80 mb-3 leading-relaxed">
        Pick any tradeable event to open a free position. Auto-settles at event end or after {voucher.maxHoldingHours}h.
      </p>

      <Button className="w-full h-9" onClick={() => onRedeem(voucher)}>
        Redeem voucher
      </Button>
    </div>
  );
};
