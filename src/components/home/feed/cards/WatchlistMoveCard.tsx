import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { FeedCard } from "@/components/home/feed/FeedCard";

interface WatchlistMoveCardProps {
  eventId: string;
  compact?: boolean;
}

/**
 * Tier 2 opportunity signal — a watchlisted event has moved.
 *
 * 24h delta wiring lands with the realtime change feed; for now we surface
 * the watchlisted event with current top-option price as a placeholder.
 */
export const WatchlistMoveCard = ({ eventId, compact }: WatchlistMoveCardProps) => {
  const navigate = useNavigate();
  const { events } = useActiveEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return null;
  const top = event.options[0];

  return (
    <FeedCard
      tag="Watching"
      tier={2}
      meta={<Star className="h-3 w-3 fill-trading-yellow text-trading-yellow" />}
      compact={compact}
      onClick={() => navigate(`/trade?event=${event.id}`)}
    >
      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
        {event.name}
      </p>
      {top && (
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          <span className="text-foreground/80">{top.label}</span>{" "}
          <span className="font-mono font-semibold text-foreground">
            ${top.price.toFixed(2)}
          </span>
        </p>
      )}
    </FeedCard>
  );
};
