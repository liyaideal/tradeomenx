import { useNavigate } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewBadge } from "./NewBadge";
import { ClosingSoonCountdown } from "./ClosingSoonCountdown";
import { MarketRow } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  market: MarketRow;
  isWatched: boolean;
  onToggleWatch: (e?: React.MouseEvent) => void;
}

const formatUSD = (val: number): string => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
};

export const MarketCard = ({ market, isWatched, onToggleWatch }: MarketCardProps) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_STYLES[market.categoryLabel as CategoryType] || CATEGORY_STYLES.General;

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
      <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {market.eventIcon} {market.eventName}
      </h3>

      {/* Price row */}
      <div className="grid grid-cols-2 gap-y-2 mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">Mark Price</div>
          <div className="text-sm font-mono font-semibold text-foreground">${market.markPrice.toFixed(2)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase">24h Change</div>
          <div className={cn("text-sm font-mono font-semibold", market.change24h >= 0 ? "text-trading-green" : "text-trading-red")}>
            {market.change24h >= 0 ? "▲" : "▼"} {market.change24h >= 0 ? "+" : ""}{market.change24h.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">Volume 24h</div>
          <div className="text-sm font-mono text-muted-foreground">{formatUSD(market.volume24h)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase">Open Interest</div>
          <div className="text-sm font-mono text-muted-foreground">{formatUSD(market.openInterest)}</div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2 border-t border-border/20">
        <div className="flex items-center gap-3 text-[11px]">
          <span className={cn("font-mono", market.fundingRate >= 0 ? "text-trading-green" : "text-trading-red")}>
            Funding: {market.fundingRate >= 0 ? "+" : ""}{(market.fundingRate * 100).toFixed(3)}%
          </span>
          <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-border/50">
            {market.maxLeverage}x
          </Badge>
        </div>
        <div className="text-[11px]">
          {market.isClosingSoon && market.expiry ? (
            <ClosingSoonCountdown endDate={market.expiry} />
          ) : (
            <span className="text-muted-foreground font-mono">
              {market.expiry ? `${Math.ceil((market.expiry.getTime() - Date.now()) / 86400000)}d` : "—"}
            </span>
          )}
        </div>
      </div>

      {/* Multi-market indicator */}
      {market.children.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{market.childCount} markets</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
