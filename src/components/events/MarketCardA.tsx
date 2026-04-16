import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewBadge } from "./NewBadge";
import { ClosingSoonCountdown } from "./ClosingSoonCountdown";
import { EventRow, ChgTimeframe, getChange, getVolume } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface MarketCardAProps {
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

export const MarketCardA = ({ market, isWatched, onToggleWatch, chgTimeframe = "24h" }: MarketCardAProps) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_STYLES[market.categoryLabel as CategoryType] || CATEGORY_STYLES.General;
  const chgValue = getChange(market, chgTimeframe);
  const volValue = getVolume(market, chgTimeframe);
  const topChild = market.children[0];
  const childCount = market.children.length;

  return (
    <div
      className="group relative rounded-xl border border-border/40 p-3 cursor-pointer transition-all hover:border-primary/40 overflow-hidden"
      style={{
        background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
      }}
      onClick={() => navigate(`/trade?event=${market.eventId}`)}
    >
      {/* Category background image */}
      {catStyle.cardBg && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={catStyle.cardBg}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover opacity-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(225_40%_7%)] via-[hsl(225_40%_7%/0.65)] to-transparent" />
        </div>
      )}

      <div className="relative z-10">
        {/* Row 1: Star + NEW + Category badge ... Expiry */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWatch(e); }}
              className="p-0.5 transition-transform active:scale-125"
            >
              <Star className={cn("h-3.5 w-3.5", isWatched ? "fill-trading-yellow text-trading-yellow" : "text-muted-foreground")} />
            </button>
            {market.isNew && <NewBadge />}
            <Badge variant={catStyle.variant || "general"} className="text-[10px] border-0 px-1.5 py-0">
              {market.categoryLabel}
            </Badge>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            {market.isClosingSoon && market.expiry ? (
              <ClosingSoonCountdown endDate={market.expiry} />
            ) : (
              formatExpiry(market.expiry)
            )}
          </div>
        </div>

        {/* Row 2: Title + 10X badge + link icon */}
        <div className="flex items-start gap-1.5 mb-2">
          <h3 className="text-[15px] font-semibold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors flex-1">
            {market.eventName}
          </h3>
          <span className="shrink-0 bg-trading-yellow/20 text-trading-yellow text-[10px] font-bold px-1 py-0.5 rounded leading-none mt-0.5">
            10X
          </span>
          <ExternalLink className="h-3 w-3 text-muted-foreground/50 shrink-0 mt-1" />
        </div>

        {/* Row 3: Three-column data area */}
        <div className="bg-white/[0.04] rounded-lg overflow-hidden mb-1.5">
          {/* Column headers */}
          <div className="grid grid-cols-3">
            <div className="px-2 py-1 text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wide border-r border-border/20">
              Top Market
            </div>
            <div className="px-2 py-1 text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wide border-r border-border/20">
              {TF_LABELS[chgTimeframe]}
            </div>
            <div className="px-2 py-1 text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wide">
              Price
            </div>
          </div>
          {/* Column values */}
          <div className="grid grid-cols-3 border-t border-border/10">
            <div className="px-2 py-1.5 text-[11px] text-foreground/90 font-medium truncate border-r border-border/20">
              {topChild ? topChild.optionLabel : market.eventName.slice(0, 15)}
            </div>
            <div className="px-2 py-1.5 border-r border-border/20">
              <span className={cn("text-[11px] font-mono font-semibold tabular-nums", chgValue >= 0 ? "text-trading-green" : "text-trading-red")}>
                {chgValue >= 0 ? "▲" : "▼"} {chgValue >= 0 ? "+" : ""}{chgValue.toFixed(2)}%
              </span>
            </div>
            <div className="px-2 py-1.5">
              <span className="text-[11px] font-mono text-foreground/90 tabular-nums">
                {topChild ? topChild.markPrice.toFixed(2) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Row 4: View N Markets link (only if >1) */}
        {childCount > 1 && (
          <div className="flex items-center justify-center gap-1 py-1 text-[11px] text-primary font-medium">
            View {childCount} Markets
            <ChevronRight className="h-3 w-3" />
          </div>
        )}

        {/* Row 5: Footer bar */}
        <div className="bg-white/[0.03] rounded-lg px-2.5 py-1.5 flex items-center justify-between mt-1">
          <span className="text-[10px] font-mono text-muted-foreground">
            Total Vol. {formatUSD(market.totalVolume)}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            Expires {formatExpiry(market.expiry)}
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </div>
      </div>
    </div>
  );
};
