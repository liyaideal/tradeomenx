import { useMemo } from "react";
import { Flame, Sparkles, Clock } from "lucide-react";
import { EventRow } from "@/hooks/useMarketListData";
import { MarketListView } from "./MarketListView";
import { MarketGridView } from "./MarketGridView";
import { ViewMode } from "./ViewToggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface HotShelfProps {
  markets: EventRow[];
  view: ViewMode;
  isWatched: (id: string) => boolean;
  onToggleWatch: (id: string, e?: React.MouseEvent) => void;
}

const ShelfHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center gap-2 mb-3">
    {icon}
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-[11px] text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const RenderView = ({
  view,
  markets,
  isWatched,
  onToggleWatch,
}: {
  view: ViewMode;
  markets: EventRow[];
  isWatched: (id: string) => boolean;
  onToggleWatch: (id: string, e?: React.MouseEvent) => void;
}) => {
  const isMobile = useIsMobile();
  const effectiveView: ViewMode = isMobile ? "grid" : view;
  return effectiveView === "list" ? (
    <MarketListView markets={markets} isWatched={isWatched} onToggleWatch={onToggleWatch} />
  ) : (
    <MarketGridView markets={markets} isWatched={isWatched} onToggleWatch={onToggleWatch} />
  );
};

export const HotShelf = ({ markets, view, isWatched, onToggleWatch }: HotShelfProps) => {
  const { trending, justLaunched, closingSoon } = useMemo(() => {
    const now = Date.now();
    const h48 = 48 * 3600000;

    const launched = markets.filter(
      (m) => now - new Date(m.createdAt).getTime() <= h48
    );
    const closing = markets.filter(
      (m) => m.expiry && m.expiry.getTime() - now <= h48 && m.expiry.getTime() > now
    );

    const launchedIds = new Set(launched.map((m) => m.id));
    const closingIds = new Set(closing.map((m) => m.id));

    const trend = markets
      .filter((m) => !launchedIds.has(m.id) && !closingIds.has(m.id) && m.volume24h > 10000)
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 5);

    return {
      trending: trend,
      justLaunched: launched.sort((a, b) => b.volume24h - a.volume24h).slice(0, 3),
      closingSoon: closing.sort((a, b) => b.openInterest - a.openInterest).slice(0, 3),
    };
  }, [markets]);

  const hasContent = trending.length > 0 || justLaunched.length > 0 || closingSoon.length > 0;
  if (!hasContent) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hot markets right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {trending.length > 0 && (
        <section>
          <ShelfHeader
            icon={<Flame className="h-5 w-5 text-trading-red" />}
            title="Trending"
            subtitle="Volume spiking now"
          />
          <RenderView view={view} markets={trending} isWatched={isWatched} onToggleWatch={onToggleWatch} />
        </section>
      )}

      {justLaunched.length > 0 && (
        <section>
          <ShelfHeader
            icon={<Sparkles className="h-5 w-5 text-trading-yellow" />}
            title="Just Launched"
            subtitle="New markets"
          />
          <RenderView view={view} markets={justLaunched} isWatched={isWatched} onToggleWatch={onToggleWatch} />
        </section>
      )}

      {closingSoon.length > 0 && (
        <section>
          <ShelfHeader
            icon={<Clock className="h-5 w-5 text-trading-red" />}
            title="Closing Soon"
            subtitle="Expires in < 48h"
          />
          <RenderView view={view} markets={closingSoon} isWatched={isWatched} onToggleWatch={onToggleWatch} />
        </section>
      )}
    </div>
  );
};
