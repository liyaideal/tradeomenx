import { Ticket, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import type { PositionVoucher } from "@/hooks/usePositionVouchers";

interface VoucherCardProps {
  voucher: PositionVoucher;
  onRedeem: (voucher: PositionVoucher) => void;
}

export const VoucherCard = ({ voucher, onRedeem }: VoucherCardProps) => {
  const { timeLeft, urgent } = useCountdown(voucher.expiresAt);
  const cap = voucher.faceValue * voucher.redeemableCapPct;

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
