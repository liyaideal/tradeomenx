import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClosingSoonCountdown } from "@/components/events/ClosingSoonCountdown";
import { NewBadge } from "@/components/events/NewBadge";
import { EventRow } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface HomeMatchCardProps {
  market: EventRow;
  isWatched: boolean;
  onToggleWatch: (e?: React.MouseEvent) => void;
}

const formatUSD = (val: number): string => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
};

const formatExpiry = (date: Date | null) => {
  if (!date) return "—";
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days >= 1) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
};

/**
 * D-class card — sportsbook score-and-odds layout for the Home page.
 *
 * Strict isolation from MarketCardA / MarketCardB / MarketCardC per project
 * memory ("card-style-isolation"). Owns its own visual language and is only
 * mounted by Home v3.
 *
 * Layout (binary):  [⭐ Cat · time]
 *                    Title (1-2 lines)
 *                    [ YES 0.72 +3% ] [ Vol 1.2M ] [ NO 0.28 -3% ]
 *
 * Multi-outcome events (>2 children) fall back to a stacked outcome list
 * inside the same shell.
 */
export const HomeMatchCard = ({ market, isWatched, onToggleWatch }: HomeMatchCardProps) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_STYLES[market.categoryLabel as CategoryType] || CATEGORY_STYLES.General;
  const isMulti = market.children.length > 2;

  // Pick top-volume child as the YES side; second as NO. Mock prices come
  // from price simulation; we display them as 0..1 share prices.
  const yesChild = market.children[0];
  const noChild = market.children[1];
  const yesPrice = yesChild?.markPrice ?? 0.5;
  const noPrice = noChild?.markPrice ?? (yesChild ? Math.max(0, 1 - yesPrice) : 0.5);
  const yesChg = yesChild?.change24h ?? market.change24h;
  const noChg = noChild?.change24h ?? -market.change24h;

  const goEvent = () => navigate(`/trade?event=${market.eventId}`);

  return (
    <article
      onClick={goEvent}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/40 bg-card p-3.5 transition-all duration-150 hover:border-border/70 active:scale-[0.99]"
    >
      {/* Header */}
      <header className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatch(e);
            }}
            className="-m-1 p-1 transition-transform active:scale-125"
            aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                isWatched ? "fill-trading-yellow text-trading-yellow" : "text-muted-foreground",
              )}
            />
          </button>
          <Badge variant={catStyle.variant || "general"} className="border-0 px-1.5 py-0 text-[10px]">
            {market.categoryLabel}
          </Badge>
          {market.isNew && <NewBadge />}
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          {market.isClosingSoon && market.expiry ? (
            <ClosingSoonCountdown endDate={market.expiry} />
          ) : (
            formatExpiry(market.expiry)
          )}
        </div>
      </header>

      {/* Title */}
      <h3 className="mb-2.5 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
        {market.eventName}
      </h3>

      {/* Odds row */}
      {isMulti ? (
        <div className="space-y-1.5">
          {market.children.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-background/50 px-2.5 py-2"
            >
              <span className="truncate text-[12px] text-foreground">{c.optionLabel}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-semibold tabular-nums text-foreground">
                  {c.markPrice.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    c.change24h >= 0 ? "text-trading-green" : "text-trading-red",
                  )}
                >
                  {c.change24h >= 0 ? "+" : ""}
                  {c.change24h.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          {market.children.length > 3 && (
            <div className="pt-0.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              +{market.children.length - 3} more
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-1.5">
          <OddsBlock
            label="Yes"
            price={yesPrice}
            change={yesChg}
            tone="green"
            onClick={(e) => {
              e.stopPropagation();
              goEvent();
            }}
          />
          <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 px-2 py-2 text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              24h Vol
            </span>
            <span className="mt-0.5 font-mono text-[12px] font-semibold tabular-nums text-foreground">
              {formatUSD(market.volume24h)}
            </span>
          </div>
          <OddsBlock
            label="No"
            price={noPrice}
            change={noChg}
            tone="red"
            onClick={(e) => {
              e.stopPropagation();
              goEvent();
            }}
          />
        </div>
      )}
    </article>
  );
};

interface OddsBlockProps {
  label: "Yes" | "No";
  price: number;
  change: number;
  tone: "green" | "red";
  onClick: (e: React.MouseEvent) => void;
}

const OddsBlock = ({ label, price, change, tone, onClick }: OddsBlockProps) => {
  const toneClass = tone === "green" ? "text-trading-green" : "text-trading-red";
  return (
    <button
      onClick={onClick}
      className={cn(
        "group/odds flex flex-col items-center justify-center rounded-lg border border-border/30 bg-background/60 px-2 py-2",
        "transition-colors hover:bg-background hover:border-border/60 active:scale-[0.97]",
      )}
    >
      <span className={cn("font-mono text-[9px] font-semibold uppercase tracking-widest", toneClass)}>
        {label}
      </span>
      <span className="mt-0.5 font-mono text-[15px] font-bold tabular-nums text-foreground">
        {price.toFixed(2)}
      </span>
      <span
        className={cn(
          "font-mono text-[10px] tabular-nums",
          change >= 0 ? "text-trading-green" : "text-trading-red",
        )}
      >
        {change >= 0 ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    </button>
  );
};
