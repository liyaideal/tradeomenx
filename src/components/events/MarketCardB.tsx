import { useNavigate } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewBadge } from "./NewBadge";
import { ClosingSoonCountdown } from "./ClosingSoonCountdown";
import { EventRow, ChgTimeframe, getChange, getVolume } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface MarketCardBProps {
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

export const MarketCardB = ({ market, isWatched, onToggleWatch, chgTimeframe = "24h" }: MarketCardBProps) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_STYLES[market.categoryLabel as CategoryType] || CATEGORY_STYLES.General;
  const hasMultipleMarkets = market.children.length > 0;
  const chgValue = getChange(market, chgTimeframe);
  const volValue = getVolume(market, chgTimeframe);

  return (
    <div
      className="group relative rounded-xl border border-border/40 p-3 cursor-pointer transition-all hover:border-primary/40"
      style={{
        background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
      }}
      onClick={() => navigate(`/trade?event=${market.eventId}`)}
    >
      {/* Top Row: Star + Badge + NEW ... Expiry */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWatch(e); }}
            className="p-0.5 transition-transform active:scale-125"
          >
            <Star className={cn("h-3.5 w-3.5", isWatched ? "fill-trading-yellow text-trading-yellow" : "text-muted-foreground")} />
          </button>
          <Badge variant={catStyle.variant || "general"} className="text-[10px] border-0 px-1.5 py-0">
            {market.categoryLabel}
          </Badge>
          {market.isNew && <NewBadge />}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          {market.isClosingSoon && market.expiry ? (
            <ClosingSoonCountdown endDate={market.expiry} />
          ) : (
            formatExpiry(market.expiry)
          )}
        </div>
      </div>

      {/* Title - single line */}
      <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {market.eventName}
      </h3>

      {/* 1×3 Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{TF_LABELS[chgTimeframe]}</div>
          <div className={cn("text-xs font-mono font-semibold", chgValue >= 0 ? "text-trading-green" : "text-trading-red")}>
            {chgValue >= 0 ? "▲" : "▼"} {chgValue >= 0 ? "+" : ""}{chgValue.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">{chgTimeframe.toUpperCase()} Vol</div>
          <div className="text-xs font-mono text-muted-foreground">{formatUSD(volValue)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">Total Vol</div>
          <div className="text-xs font-mono text-muted-foreground">{formatUSD(market.totalVolume)}</div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-primary">
          {hasMultipleMarkets ? `View ${market.childCount} Markets` : "Trade"}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-primary" />
      </div>
    </div>
  );
};
