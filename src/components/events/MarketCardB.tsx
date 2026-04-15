import { MarketCard } from "./MarketCard";
import { EventRow, ChgTimeframe } from "@/hooks/useMarketListData";
import { Badge } from "@/components/ui/badge";

interface MarketCardBProps {
  market: EventRow;
  isWatched: boolean;
  onToggleWatch: (e?: React.MouseEvent) => void;
  chgTimeframe?: ChgTimeframe;
}

export const MarketCardB = ({ market, isWatched, onToggleWatch, chgTimeframe = "24h" }: MarketCardBProps) => {
  return (
    <div className="relative">
      <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5">
        B
      </Badge>
      <MarketCard
        market={market}
        isWatched={isWatched}
        onToggleWatch={onToggleWatch}
        chgTimeframe={chgTimeframe}
      />
    </div>
  );
};
