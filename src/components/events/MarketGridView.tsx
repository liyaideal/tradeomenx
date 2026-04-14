import { MarketCard } from "./MarketCard";
import { EventRow } from "@/hooks/useMarketListData";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketGridViewProps {
  markets: EventRow[];
  isWatched: (id: string) => boolean;
  onToggleWatch: (id: string, e?: React.MouseEvent) => void;
}

export const MarketGridView = ({ markets, isWatched, onToggleWatch }: MarketGridViewProps) => {
  const isMobile = useIsMobile();
  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}>
      {markets.map((m, i) => (
        <div key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <MarketCard
            market={m}
            isWatched={isWatched(m.eventId)}
            onToggleWatch={(e) => onToggleWatch(m.eventId, e)}
          />
        </div>
      ))}
    </div>
  );
};
