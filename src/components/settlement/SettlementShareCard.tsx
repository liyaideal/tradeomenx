import { Trophy, TrendingDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import omenxLogo from "@/assets/omenx-logo.svg";
import { TRADING_TERMS } from "@/lib/tradingTerms";

interface SettlementShareCardProps {
  event: string;
  option: string;
  side: "long" | "short";
  result: "win" | "lose";
  pnl: number;
  pnlPercent: number;
  entryPrice: number;
  exitPrice: number;
  leverage: number;
  settledAt: string;
}

export const SettlementShareCard = ({
  event,
  option,
  side,
  result,
  pnl,
  pnlPercent,
  entryPrice,
  exitPrice,
  leverage,
  settledAt,
}: SettlementShareCardProps) => {
  const isWin = result === "win";
  const isLong = side === "long";
  const settledDate = format(new Date(settledAt), "MMM d, yyyy");

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border border-primary/30 p-5"
      style={{ 
        backgroundColor: 'hsl(222 47% 6%)',
        background: isWin 
          ? 'linear-gradient(145deg, hsl(222 47% 8%) 0%, hsl(145 50% 8% / 0.3) 100%)'
          : 'linear-gradient(145deg, hsl(222 47% 8%) 0%, hsl(0 50% 8% / 0.3) 100%)'
      }}
    >
      {/* Background effects */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
        isWin ? "bg-trading-green/20" : "bg-trading-red/20"
      }`} />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl" />
      
      {/* Sparkle decorations */}
      {isWin && (
        <>
          <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-400/60 animate-pulse" />
          <Sparkles className="absolute bottom-16 right-8 w-3 h-3 text-trading-green/50" />
        </>
      )}

      {/* Header with Logo */}
      <div className="relative flex items-center justify-between mb-4">
        <img src={omenxLogo} alt="OMENX" className="h-5" />
        <Badge 
          variant="outline"
          className="text-[9px] uppercase tracking-wide bg-muted/50 text-muted-foreground border-border/50"
        >
          Settled {settledDate}
        </Badge>
      </div>

      {/* Event Name */}
      <div className="relative mb-4">
        <h2 className="text-base font-bold text-foreground leading-tight line-clamp-2 mb-2">
          {event}
        </h2>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={isLong 
              ? "text-[10px] border-trading-green/50 text-trading-green bg-trading-green/10" 
              : "text-[10px] border-trading-red/50 text-trading-red bg-trading-red/10"
            }
          >
            {isLong ? "Long" : "Short"} {leverage}x
          </Badge>
          <span className="text-xs text-muted-foreground">{option}</span>
        </div>
      </div>

      {/* Result Card */}
      <div className={`relative p-4 rounded-xl mb-4 ${
        isWin ? "bg-trading-green/15 border border-trading-green/30" : "bg-trading-red/15 border border-trading-red/30"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isWin ? "bg-trading-green/20" : "bg-trading-red/20"}`}>
              {isWin ? <Trophy className="w-5 h-5 text-trading-green" /> : <TrendingDown className="w-5 h-5 text-trading-red" />}
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-wide block ${isWin ? "text-trading-green/80" : "text-trading-red/80"}`}>
                {isWin ? "Winner!" : "Result"}
              </span>
              <div className={`font-mono font-bold text-xl ${isWin ? "text-trading-green" : "text-trading-red"}`}>
                {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}
              </div>
            </div>
          </div>
          <div className={`text-right ${isWin ? "text-trading-green" : "text-trading-red"}`}>
            <span className="text-lg font-mono font-bold">
              {pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(1)}%
            </span>
            <div className="text-[10px] opacity-70">ROI</div>
          </div>
        </div>
      </div>

      {/* Trade Details */}
      <div className="relative grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/30 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground block mb-0.5">{TRADING_TERMS.ENTRY_PRICE}</span>
          <span className="font-mono text-sm font-medium">${entryPrice.toFixed(4)}</span>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground block mb-0.5">{TRADING_TERMS.EXIT_PRICE}</span>
          <span className={`font-mono text-sm font-medium ${isWin ? "text-trading-green" : "text-trading-red"}`}>
            ${exitPrice.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative pt-3 border-t border-border/30 text-center">
        <p className="text-[10px] text-primary font-medium">
          Trade on OMENX • omenx.com
        </p>
      </div>
    </div>
  );
};
