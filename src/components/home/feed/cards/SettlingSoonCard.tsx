import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { FeedCard } from "@/components/home/feed/FeedCard";

interface SettlingSoonCardProps {
  eventId: string;
  secondsLeft: number;
  compact?: boolean;
}

const formatCountdown = (seconds: number) => {
  if (seconds <= 0) return "Settling";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `Ends in ${h}h ${m}m`;
  return `Ends in ${m}m`;
};

/**
 * Tier 2 opportunity signal — event will settle within 24h.
 * Countdown ticks every 30s.
 */
export const SettlingSoonCard = ({ eventId, secondsLeft, compact }: SettlingSoonCardProps) => {
  const navigate = useNavigate();
  const { events } = useActiveEvents();
  const event = events.find((e) => e.id === eventId);
  const [remaining, setRemaining] = useState(secondsLeft);

  useEffect(() => {
    setRemaining(secondsLeft);
    const t = window.setInterval(() => setRemaining((s) => Math.max(0, s - 30)), 30_000);
    return () => window.clearInterval(t);
  }, [secondsLeft]);

  if (!event) return null;
  const top = event.options[0];

  return (
    <FeedCard
      tag="Settling soon"
      tier={2}
      meta={<span className="font-mono text-trading-yellow">{formatCountdown(remaining)}</span>}
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
