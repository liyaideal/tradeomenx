import { useNavigate } from "react-router-dom";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { FeedCard } from "@/components/home/feed/FeedCard";

interface TrendingCardProps {
  eventId: string;
}

/**
 * One trending market as a feed card.
 * Pulls the named event from useActiveEvents; renders nothing if not found.
 */
export const TrendingCard = ({ eventId }: TrendingCardProps) => {
  const navigate = useNavigate();
  const { events } = useActiveEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return null;

  const top = event.options[0];
  const second = event.options[1];

  return (
    <FeedCard
      tag="Trending"
      meta={<span className="font-mono">Vol {event.volume || "$0"}</span>}
      onClick={() => navigate(`/trade?event=${event.id}`)}
    >
      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
        {event.name}
      </p>
      {top && (
        <div className="mt-2 flex items-center gap-3 text-[12px]">
          <span className="text-muted-foreground">
            <span className="text-foreground/80">{top.label}</span>{" "}
            <span className="font-mono font-semibold text-foreground">
              ${top.price.toFixed(2)}
            </span>
          </span>
          {second && (
            <>
              <span className="opacity-30">·</span>
              <span className="text-muted-foreground">
                <span className="text-foreground/80">{second.label}</span>{" "}
                <span className="font-mono font-semibold text-foreground">
                  ${second.price.toFixed(2)}
                </span>
              </span>
            </>
          )}
        </div>
      )}
    </FeedCard>
  );
};
