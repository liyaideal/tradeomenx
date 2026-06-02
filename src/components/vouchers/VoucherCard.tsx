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
          "w-full text-left rounded-xl border p-3 transition-all",
          "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
          selected
            ? "border-primary ring-2 ring-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.4)]"
            : "border-primary/20 hover:border-primary/40",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-primary/20 flex items-center justify-center">
            {selected ? (
              <Check className="w-5 h-5 text-primary" />
            ) : (
              <Ticket className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-muted-foreground truncate">
                {voucher.code}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[11px] font-mono shrink-0",
                  urgent ? "text-trading-red" : "text-muted-foreground",
                )}
              >
                <Clock className="w-3 h-3" />
                {timeLeft}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2 mt-0.5">
              <span className="font-mono text-lg text-foreground">
                ${voucher.faceValue.toFixed(2)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                cap{" "}
                <span className="font-mono text-trading-green">${cap.toFixed(2)}</span>
              </span>
            </div>
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
