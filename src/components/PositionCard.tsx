import { TrendingUp, TrendingDown, X } from "lucide-react";

interface PositionCardProps {
  type: "long" | "short";
  event: string;
  option: string;
  entryPrice: string;
  markPrice: string;
  size: string;
  margin: string;
  pnl: string;
  pnlPercent: string;
  leverage: string;
}

export const PositionCard = ({
  type,
  event,
  option,
  entryPrice,
  markPrice,
  size,
  margin,
  pnl,
  pnlPercent,
  leverage,
}: PositionCardProps) => {
  const isProfitable = !pnl.startsWith("-");

  return (
    <div className="bg-card rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              type === "long"
                ? "bg-trading-green/20 text-trading-green"
                : "bg-trading-red/20 text-trading-red"
            }`}
          >
            {type === "long" ? "Long" : "Short"}
          </span>
          <span className="text-xs text-muted-foreground">{leverage}</span>
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Event Info */}
      <div className="mb-2">
        <h3 className="font-medium text-foreground text-sm">{event}</h3>
        <p className="text-xs text-muted-foreground">{option}</p>
      </div>

      {/* Position Details */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div>
          <span className="text-[10px] text-muted-foreground block">Size</span>
          <span className="font-mono text-xs">{size}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Entry</span>
          <span className="font-mono text-xs">{entryPrice}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Mark</span>
          <span className="font-mono text-xs">{markPrice}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Margin</span>
          <span className="font-mono text-xs">{margin}</span>
        </div>
      </div>

      {/* Footer - PnL display like status in Orders */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground">TP/SL: --</span>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
          isProfitable ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"
        }`}>
          {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {pnl} ({pnlPercent})
        </div>
      </div>
    </div>
  );
};
