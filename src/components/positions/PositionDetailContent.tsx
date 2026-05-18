import { useMemo } from "react";
import { TrendingUp, TrendingDown, Clock, Receipt, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedPosition } from "@/hooks/usePositions";
import { useFundingHistory } from "@/hooks/useFundingHistory";
import { useOptionFundingRate } from "@/hooks/useOptionFundingRate";
import { useRealtimePositionsPnL } from "@/hooks/useRealtimePositionsPnL";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PositionDetailContentProps {
  position: UnifiedPosition;
  /** Live mark price from realtime feed (overrides position.markPriceNum if provided). */
  liveMarkPrice?: number;
  /** Current funding rate per hour for this option (decimal, e.g. 0.0001). */
  fundingRatePerHour?: number;
  /** Approximate fee rate per trade (e.g. 0.001 = 0.1%). */
  feeRate?: number;
}

// Use a fixed sentence-case display per design rules
const TRADE_FEE_RATE = 0.001; // 0.1% taker fee assumption for display only

export const PositionDetailContent = ({
  position,
  liveMarkPrice,
  fundingRatePerHour: fundingRatePerHourProp,
  feeRate = TRADE_FEE_RATE,
}: PositionDetailContentProps) => {
  // Use unified realtime lookup (direct optionId + event/option fallback matching)
  // so the detail view always matches the list/card.
  const { getRealtimeMarkPrice } = useRealtimePositionsPnL();
  const livePrice = getRealtimeMarkPrice({
    event: position.event,
    option: position.option,
    optionId: position.optionId,
  });
  const mark = livePrice ?? liveMarkPrice ?? position.markPriceNum;
  const sideSign = position.type === "long" ? 1 : -1;

  // Pull live funding rate + next accrual from event_options when the parent
  // didn't pass an explicit prop (covers all 3 call sites).
  const { data: liveFunding } = useOptionFundingRate(position.optionId);
  const fundingRatePerHour = fundingRatePerHourProp ?? liveFunding?.fundingRatePerHour ?? 0;
  const nextFundingAt = liveFunding?.nextFundingAt ?? null;

  // Price PnL = (mark − entry) × size × side
  // Leverage is NOT multiplied — size already represents contracts and leverage
  // only governs margin / % return. Aligns with useRealtimePositionsPnL.
  const pricePnl = useMemo(() => {
    const diff = mark - position.entryPriceNum;
    return diff * position.sizeNum * sideSign;
  }, [mark, position.entryPriceNum, position.sizeNum, sideSign]);

  const fundingPaid = position.fundingAccrued;
  const netPnl = pricePnl - fundingPaid;
  const pnlPercent = position.marginNum > 0 ? (netPnl / position.marginNum) * 100 : 0;

  // Notional & fee estimates (size × price, no leverage multiplier)
  const notional = position.sizeNum * mark;
  const openFee = position.sizeNum * position.entryPriceNum * feeRate;
  const estCloseFee = notional * feeRate;

  // Funding rate direction
  const userPaysFunding = sideSign * fundingRatePerHour > 0;
  const ratePctPerHour = (fundingRatePerHour * 100).toFixed(4);
  const fundingPerHour = sideSign * fundingRatePerHour * notional;

  // Next accrual countdown — prefer authoritative next_funding_at, fall back to
  // lastFundingAt + 5 min (matches cron cadence).
  const nextAccrualLabel = useMemo(() => {
    const anchor = nextFundingAt
      ? new Date(nextFundingAt).getTime()
      : position.lastFundingAt
      ? new Date(position.lastFundingAt).getTime() + 5 * 60_000
      : null;
    if (anchor == null) return "Within 5 min";
    const diff = anchor - Date.now();
    if (diff <= 0) return "Any moment";
    const m = Math.floor(diff / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  }, [nextFundingAt, position.lastFundingAt]);

  const { data: history = [] } = useFundingHistory(
    position._source === "supabase" ? position.id : null
  );

  const pnlColor = netPnl >= 0 ? "text-trading-green" : "text-trading-red";

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-5">
        {/* ============ Header summary ============ */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "px-2 py-0.5 rounded font-medium",
                position.type === "long"
                  ? "bg-trading-green/10 text-trading-green"
                  : "bg-trading-red/10 text-trading-red"
              )}
            >
              {position.type === "long" ? "Long" : "Short"} {position.leverage}
            </span>
            <span className="text-muted-foreground truncate">{position.option}</span>
          </div>
        </div>

        {/* ============ Net PnL block ============ */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            Net unrealized PnL
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                Net PnL = Price PnL − Funding accrued. Closing now would also incur an estimated trading fee.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className={cn("font-mono text-2xl font-semibold", pnlColor)}>
            {netPnl >= 0 ? "+" : "−"}${Math.abs(netPnl).toFixed(2)}
            <span className="text-base ml-2 opacity-80">
              ({pnlPercent >= 0 ? "+" : ""}
              {pnlPercent.toFixed(2)}%)
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs">
            <span className="text-muted-foreground">Price PnL</span>
            <span
              className={cn(
                "font-mono text-right",
                pricePnl >= 0 ? "text-trading-green" : "text-trading-red"
              )}
            >
              {pricePnl >= 0 ? "+" : "−"}${Math.abs(pricePnl).toFixed(2)}
            </span>

            <span className="text-muted-foreground">Funding paid</span>
            <span
              className={cn(
                "font-mono text-right",
                fundingPaid > 0
                  ? "text-trading-red"
                  : fundingPaid < 0
                  ? "text-trading-green"
                  : "text-foreground"
              )}
            >
              {fundingPaid >= 0 ? "−" : "+"}${Math.abs(fundingPaid).toFixed(4)}
            </span>

            <span className="text-muted-foreground">Cumulative Trading Fees</span>
            <span className="font-mono text-right text-foreground">
              −${openFee.toFixed(4)}
            </span>

            <span className="text-muted-foreground">Est. close fee</span>
            <span className="font-mono text-right text-muted-foreground">
              ≈ ${estCloseFee.toFixed(4)}
            </span>
          </div>
        </div>

        {/* ============ Position block ============ */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Position
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs">
            <span className="text-muted-foreground">Entry price</span>
            <span className="font-mono text-right">{position.entryPrice}</span>
            <span className="text-muted-foreground">Mark price</span>
            <span className="font-mono text-right">${mark.toFixed(4)}</span>
            <span className="text-muted-foreground">Size</span>
            <span className="font-mono text-right">{position.sizeDisplay}</span>
            <span className="text-muted-foreground">Margin</span>
            <span className="font-mono text-right">{position.margin}</span>
            <span className="text-muted-foreground">Notional</span>
            <span className="font-mono text-right">${notional.toFixed(2)}</span>
          </div>
        </div>

        {/* ============ Funding section ============ */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Receipt className="w-3 h-3" /> Funding
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current rate / hour</span>
              <span
                className={cn(
                  "font-mono inline-flex items-center gap-1",
                  userPaysFunding ? "text-trading-red" : "text-trading-green"
                )}
              >
                {userPaysFunding ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {fundingRatePerHour >= 0 ? "+" : ""}
                {ratePctPerHour}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {userPaysFunding ? "You pay / hour" : "You receive / hour"}
              </span>
              <span className="font-mono">
                ≈ ${Math.abs(fundingPerHour).toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> Next accrual
              </span>
              <span className="font-mono text-muted-foreground">{nextAccrualLabel}</span>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none py-1">
                View funding charges ({history.length})
              </summary>
              <ScrollArea className="max-h-48 mt-1 rounded-md border border-border">
                <table className="w-full text-xs">
                  <thead className="text-muted-foreground bg-muted/30">
                    <tr>
                      <th className="text-left font-normal px-2 py-1">Time</th>
                      <th className="text-right font-normal px-2 py-1">Rate</th>
                      <th className="text-right font-normal px-2 py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-t border-border">
                        <td className="px-2 py-1 text-muted-foreground">
                          {new Date(h.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-2 py-1 text-right font-mono">
                          {h.applied_rate >= 0 ? "+" : ""}
                          {(h.applied_rate * 100).toFixed(4)}%
                        </td>
                        <td
                          className={cn(
                            "px-2 py-1 text-right font-mono",
                            h.amount > 0
                              ? "text-trading-red"
                              : h.amount < 0
                              ? "text-trading-green"
                              : ""
                          )}
                        >
                          {h.amount >= 0 ? "−" : "+"}$
                          {Math.abs(h.amount).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </details>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
