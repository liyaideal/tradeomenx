import { MarketCard } from "./MarketCard";
import { MarketCardB } from "./MarketCardB";
import { EventRow, ChgTimeframe } from "@/hooks/useMarketListData";
import { useIsMobile } from "@/hooks/use-mobile";
import { ViewMode } from "./ViewToggle";

interface MarketGridViewProps {
  markets: EventRow[];
  isWatched: (id: string) => boolean;
  onToggleWatch: (id: string, e?: React.MouseEvent) => void;
  chgTimeframe?: ChgTimeframe;
  viewMode?: ViewMode;
}

export const MarketGridView = ({ markets, isWatched, onToggleWatch, chgTimeframe = "24h", viewMode = "grid-a" }: MarketGridViewProps) => {
  const isMobile = useIsMobile();
  const CardComponent = viewMode === "grid-b" ? MarketCardB : MarketCard;

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}>
      {markets.map((m, i) => (
        <div key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <CardComponent
            market={m}
            isWatched={isWatched(m.eventId)}
            onToggleWatch={(e) => onToggleWatch(m.eventId, e)}
            chgTimeframe={chgTimeframe}
          />
        </div>
      ))}
    </div>
  );
};
