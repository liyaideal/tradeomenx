import { useNavigate } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewBadge } from "./NewBadge";
import { ClosingSoonCountdown } from "./ClosingSoonCountdown";
import { EventRow, ChgTimeframe, getChange, getVolume } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface MarketCardCProps {
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

export const MarketCardC = ({ market, isWatched, onToggleWatch, chgTimeframe = "24h" }: MarketCardCProps) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_STYLES[market.categoryLabel as CategoryType] || CATEGORY_STYLES.General;
  const hasMultipleMarkets = market.children.length > 0;
  const chgValue = getChange(market, chgTimeframe);
  const volValue = getVolume(market, chgTimeframe);
  const childCount = market.children.length;

  return (
    <div
      className="group relative rounded-xl border border-border/40 p-4 cursor-pointer transition-all hover:border-primary/40"
      style={{
        background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
      }}
      onClick={() => navigate(`/trade?event=${market.eventId}`)}
    >
      {/* Top Row: Star + Badge + NEW + Expiry */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWatch(e); }}
            className="p-0.5 transition-transform active:scale-125"
          >
            <Star className={cn("h-4 w-4", isWatched ? "fill-trading-yellow text-trading-yellow" : "text-muted-foreground")} />
          </button>
          <Badge variant={catStyle.variant || "general"} className="text-[10px] border-0 px-2 py-0.5">
            {market.categoryLabel}
          </Badge>
          {market.isNew && <NewBadge />}
        </div>
        <div className="flex items-center gap-2">
          <ClosingSoonCountdown expiry={market.expiry} />
          <span className="text-[10px] text-muted-foreground font-mono">{formatExpiry(market.expiry)}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {market.eventName}
      </h3>

      {/* Three-column stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{TF_LABELS[chgTimeframe]}</div>
          <div className={cn("text-xs font-mono font-semibold mt-0.5", chgValue >= 0 ? "text-trading-green" : "text-trading-red")}>
            {chgValue >= 0 ? "▲" : "▼"} {chgValue >= 0 ? "+" : ""}{chgValue.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{chgTimeframe.toUpperCase()} VOL</div>
          <div className="text-xs font-mono text-foreground/80 mt-0.5">{formatUSD(volValue)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">TOTAL VOL</div>
          <div className="text-xs font-mono text-foreground/80 mt-0.5">{formatUSD(market.totalVolume)}</div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-border/20 flex items-center justify-between">
        <span className="text-xs font-medium text-primary">
          {hasMultipleMarkets ? `View ${childCount} Markets` : "Trade"}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-primary" />
      </div>
    </div>
  );
};
