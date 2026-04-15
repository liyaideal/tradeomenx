import { useNavigate } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewBadge } from "./NewBadge";
import { ClosingSoonCountdown } from "./ClosingSoonCountdown";
import { EventRow, ChgTimeframe, getChange, getVolume } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  market: EventRow;
  isWatched: boolean;
  onToggleWatch: (e?: React.MouseEvent) => void;
  chgTimeframe?: ChgTimeframe;
}

const formatUSD = (val: number): string => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
};

const formatExpiry = (date: Date | null) => {
  if (!date) return "—";
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / 86400000);
  if (days > 30) return `${Math.floor(days / 30)}mo`;
  return `${days}d`;
};

const TF_LABELS: Record<ChgTimeframe, string> = {
  "1h": "1H CHG",
  "4h": "4H CHG",
  "24h": "24H CHG",
};

export const MarketCard = ({ market, isWatched, onToggleWatch, chgTimeframe = "24h" }: MarketCardProps) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_STYLES[market.categoryLabel as CategoryType] || CATEGORY_STYLES.General;
  const hasMultipleMarkets = market.children.length > 0;
  const chgValue = getChange(market, chgTimeframe);
  const volValue = getVolume(market, chgTimeframe);

  return (
    <div
      className="group relative rounded-xl border border-border/40 p-4 cursor-pointer transition-all hover:border-primary/40"
      style={{
        background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
      }}
      onClick={() => navigate(`/trade?event=${market.eventId}`)}
    >
      {/* Top Row: Star + Badge + NEW */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWatch(e); }}
            className="p-0.5 transition-transform active:scale-125"
          >
            <Star className={cn("h-4 w-4", isWatched ? "fill-trading-yellow text-trading-yellow" : "text-muted-foreground")} />
          </button>
          {market.isNew && <NewBadge />}
          <Badge variant={catStyle.variant || "general"} className="text-[10px] border-0 px-2 py-0.5">
            {market.categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
        {market.eventName}
      </h3>

      {/* Outcome mini-table */}
      {market.children.length > 0 ? (
        <div className="space-y-1 mb-3">
          {market.children.slice(0, 3).map((child) => {
            const chg = getChange(child, chgTimeframe);
            return (
              <div key={child.id} className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground truncate max-w-[60%]">{child.optionLabel}</span>
                <span className={cn("text-[11px] font-mono font-semibold whitespace-nowrap", chg >= 0 ? "text-trading-green" : "text-trading-red")}>
                  {chg >= 0 ? "▲" : "▼"} {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                </span>
              </div>
            );
          })}
          {market.children.length > 3 && (
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[10px] font-medium text-primary">+{market.children.length - 3} more</span>
              <ChevronRight className="h-3 w-3 text-primary" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-3">
          <span className={cn("text-[11px] font-mono font-semibold", chgValue >= 0 ? "text-trading-green" : "text-trading-red")}>
            {chgValue >= 0 ? "▲" : "▼"} {chgValue >= 0 ? "+" : ""}{chgValue.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Stats row */}
      <div className="pt-2 border-t border-border/20 flex items-center gap-3">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{chgTimeframe.toUpperCase()} Vol</div>
          <div className="text-[10px] font-mono text-muted-foreground">{formatUSD(volValue)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">Total Vol</div>
          <div className="text-[10px] font-mono text-muted-foreground">{formatUSD(market.totalVolume)}</div>
        </div>
      </div>
    </div>
  );
};
