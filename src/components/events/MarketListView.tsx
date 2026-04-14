import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewBadge } from "./NewBadge";
import { ClosingSoonCountdown } from "./ClosingSoonCountdown";
import { MarketRow } from "@/hooks/useMarketListData";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

interface MarketListViewProps {
  markets: MarketRow[];
  isWatched: (id: string) => boolean;
  onToggleWatch: (id: string, e?: React.MouseEvent) => void;
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
  const days = Math.floor(diff / 86400000);
  if (days > 30) return `${Math.floor(days / 30)}mo`;
  if (days > 0) return `${days}d`;
  const hours = Math.floor(diff / 3600000);
  return `${hours}h`;
};

const RowContent = ({
  row,
  isChild,
  isExpanded,
  onToggleExpand,
  isWatched,
  onToggleWatch,
  onClick,
}: {
  row: MarketRow;
  isChild?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isWatched: boolean;
  onToggleWatch: (e?: React.MouseEvent) => void;
  onClick: () => void;
}) => {
  const catStyle = CATEGORY_STYLES[row.categoryLabel as CategoryType] || CATEGORY_STYLES.General;

  return (
    <tr
      className={cn(
        "h-14 border-b border-border/20 transition-colors cursor-pointer",
        isChild ? "bg-muted/20" : "hover:bg-muted/30"
      )}
      onClick={onClick}
    >
      {/* Star */}
      <td className="w-10 text-center" onClick={(e) => { e.stopPropagation(); }}>
        {!isChild && (
          <button onClick={(e) => onToggleWatch(e)} className="p-1 transition-transform active:scale-125">
            <Star
              className={cn("h-4 w-4", isWatched ? "fill-trading-yellow text-trading-yellow" : "text-muted-foreground")}
            />
          </button>
        )}
      </td>

      {/* Market */}
      <td className={cn("pr-3", isChild && "pl-8")}>
        <div className="flex items-center gap-2 min-w-0">
          {row.isParent && row.children.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleExpand?.(); }}
              className="p-0.5 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          )}
          <span className="text-base mr-1">{row.eventIcon}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm font-medium text-foreground truncate">
                {isChild ? row.optionLabel : row.eventName}
              </span>
              {row.isNew && <NewBadge />}
              {row.isParent && row.children.length > 0 && (
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {row.childCount} markets
                </span>
              )}
            </div>
            {!isChild && row.children.length === 0 && row.optionLabel && (
              <span className="text-[11px] text-muted-foreground truncate block">{row.optionLabel}</span>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="w-[100px]">
        <Badge variant={catStyle.variant || "general"} className="text-[10px] border-0 px-2 py-0.5">
          {row.categoryLabel}
        </Badge>
      </td>

      {/* Mark Price */}
      <td className="w-[100px] text-right font-mono text-sm text-foreground">
        ${row.markPrice.toFixed(2)}
      </td>

      {/* 24h Change */}
      <td className={cn("w-[100px] text-right font-mono text-sm", row.change24h >= 0 ? "text-trading-green" : "text-trading-red")}>
        {row.change24h >= 0 ? "+" : ""}{row.change24h.toFixed(2)}%
      </td>

      {/* 24h Volume */}
      <td className="w-[110px] text-right font-mono text-sm text-muted-foreground">
        {formatUSD(row.volume24h)}
      </td>

      {/* OI */}
      <td className="w-[100px] text-right font-mono text-sm text-muted-foreground">
        {formatUSD(row.openInterest)}
      </td>

      {/* Funding Rate */}
      <td className={cn("w-[110px] text-right font-mono text-sm", row.fundingRate >= 0 ? "text-trading-green" : "text-trading-red")}>
        {row.fundingRate >= 0 ? "+" : ""}{(row.fundingRate * 100).toFixed(3)}%
      </td>

      {/* Max Leverage */}
      <td className="w-[80px] text-center">
        <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-border/50">
          {row.maxLeverage}x
        </Badge>
      </td>

      {/* Expiry */}
      <td className="w-[100px] text-right text-sm">
        {row.isClosingSoon && row.expiry ? (
          <ClosingSoonCountdown endDate={row.expiry} />
        ) : (
          <span className="text-muted-foreground font-mono">{formatExpiry(row.expiry)}</span>
        )}
      </td>

      {/* Arrow */}
      <td className="w-10 text-center">
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity inline-block" />
      </td>
    </tr>
  );
};

export const MarketListView = ({ markets, isWatched, onToggleWatch }: MarketListViewProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem("market_expanded");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      sessionStorage.setItem("market_expanded", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30 text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="w-10" />
            <th className="text-left py-3 pr-3 font-medium">Market</th>
            <th className="text-left py-3 font-medium w-[100px]">Category</th>
            <th className="text-right py-3 font-medium w-[100px]">Price</th>
            <th className="text-right py-3 font-medium w-[100px]">24h Chg</th>
            <th className="text-right py-3 font-medium w-[110px]">24h Vol</th>
            <th className="text-right py-3 font-medium w-[100px]">OI</th>
            <th className="text-right py-3 font-medium w-[110px]">Funding</th>
            <th className="text-center py-3 font-medium w-[80px]">Lev</th>
            <th className="text-right py-3 font-medium w-[100px]">Expiry</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {markets.map((row) => {
            const isExp = expanded.has(row.id);
            return (
              <RowGroup key={row.id}>
                <RowContent
                  row={row}
                  isExpanded={isExp}
                  onToggleExpand={() => toggleExpand(row.id)}
                  isWatched={isWatched(row.eventId)}
                  onToggleWatch={(e) => onToggleWatch(row.eventId, e)}
                  onClick={() => navigate(`/trade?event=${row.eventId}`)}
                />
                {isExp &&
                  row.children.map((child) => (
                    <RowContent
                      key={child.id}
                      row={child}
                      isChild
                      isWatched={false}
                      onToggleWatch={() => {}}
                      onClick={() => navigate(`/trade?event=${row.eventId}`)}
                    />
                  ))}
              </RowGroup>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Fragment wrapper to avoid nested tbody
const RowGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
