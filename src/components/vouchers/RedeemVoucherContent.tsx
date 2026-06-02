import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePositionVouchers, type PositionVoucher } from "@/hooks/usePositionVouchers";
import { EventPickerList, type PickedOption } from "./EventPickerList";

interface RedeemVoucherContentProps {
  voucher: PositionVoucher;
  onClose?: () => void;
  /** dialog/drawer wrap actions in a footer; `inline` renders directly on the page */
  variant?: "dialog" | "drawer" | "inline";
}

export const RedeemVoucherContent = ({ voucher, onClose, variant = "dialog" }: RedeemVoucherContentProps) => {
  const [picked, setPicked] = useState<PickedOption | null>(null);
  const { redeem, isRedeeming } = usePositionVouchers();
  const navigate = useNavigate();

  const cap = voucher.faceValue * voucher.redeemableCapPct;
  const size = picked ? voucher.faceValue / picked.price : 0;

  const handleSubmit = async () => {
    if (!picked) return;
    const res = await redeem(voucher.id, picked.eventId, picked.optionId, picked.side);
    if (res.success) {
      onClose?.();
      navigate(`/trade?event=${picked.eventId}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Voucher</span>
          <span className="font-mono">{voucher.code}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Face value</span>
          <span className="font-mono text-trading-green">${voucher.faceValue.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Max realisable profit</span>
          <span className="font-mono">${cap.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Hold window</span>
          <span className="font-mono">{voucher.maxHoldingHours}h</span>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Pick a market</div>
        <EventPickerList voucher={voucher} selected={picked} onSelect={setPicked} />
      </div>

      {picked && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
          <div className="text-xs font-medium text-foreground">{picked.eventName}</div>
          <div className="text-xs text-muted-foreground">
            {picked.optionLabel} ·{" "}
            <span className={picked.side === "long" ? "text-trading-green" : "text-trading-red"}>
              {picked.side === "long" ? "Yes" : "No"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            <div>
              <div className="text-[10px] text-muted-foreground">Entry</div>
              <div className="font-mono">${picked.price.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Size</div>
              <div className="font-mono">{size.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Profit cap</div>
              <div className="font-mono text-trading-green">${cap.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 text-[11px] text-muted-foreground rounded-md bg-muted/30 p-2.5">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-trading-yellow" />
        <span>
          Position can't be closed manually — it auto-settles when the event ends or after {voucher.maxHoldingHours}h.
          Profits are capped at ${cap.toFixed(2)}; losses don't affect your balance.
        </span>
      </div>

      <div className={variant === "drawer" ? "flex gap-2 pt-2" : "flex justify-end gap-2 pt-2"}>
        {variant === "inline" ? (
          picked && (
            <Button variant="outline" onClick={() => setPicked(null)}>
              Reset selection
            </Button>
          )
        ) : (
          <Button variant="outline" onClick={onClose} className={variant === "drawer" ? "flex-1 h-11" : ""}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!picked || isRedeeming}
          className={variant === "drawer" ? "flex-1 h-11" : ""}
        >
          {isRedeeming ? "Redeeming..." : "Confirm & open position"}
        </Button>
      </div>
    </div>
  );
};
