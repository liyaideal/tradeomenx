// ============================================================
// LiteEventCard — Lite surface event card.
// - Reuses MarketCardB骨架 in spirit but strips Pro-only signals
//   (leverage / funding / Long/Short / Futures / Spot). Product form
//   is conveyed by the sector — never by copy on the card.
// - Stocks branch: shows a "Settles today · {ET time}" badge derived from
//   events.freeze_time (fallback end_date). No hardcoded 16:00 semantics.
// ============================================================
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventWithOptions } from "@/hooks/useActiveEvents";
import { parseSideLabels } from "@/lib/eventUtils";

interface LiteEventCardProps {
  event: EventWithOptions;
  onClick?: () => void;
  onSelect?: (side: "yes" | "no") => void;
  isStocks?: boolean;
  className?: string;
}

const formatEt = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));

const isSameEtDay = (iso: string) => {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
  return fmt.format(new Date(iso)) === fmt.format(now);
};

export const LiteEventCard = ({
  event,
  onClick,
  onSelect,
  isStocks,
  className,
}: LiteEventCardProps) => {
  const sideLabels = parseSideLabels(event.side_labels);
  // Fallback is Yes/No — "Up / Not Up" wording only applies when the event's
  // own side_labels supply it (Stocks). Crypto/macro must not surface Up copy.
  const yesLabel = sideLabels?.yes ?? "Yes";
  const noLabel = sideLabels?.no ?? "No";

  const yesOpt =
    event.options.find((o) => /(^|[-_ ])yes$/i.test(o.label)) || event.options[0];
  const noOpt =
    event.options.find((o) => /(^|[-_ ])no$/i.test(o.label)) ||
    event.options.find((o) => o.id !== yesOpt?.id) ||
    event.options[1];

  const yesPrice = yesOpt ? Number(yesOpt.price) : 0.5;
  const noPrice = noOpt ? Number(noOpt.price) : 1 - yesPrice;

  const freezeIso = (event as any).freeze_time || event.end_date;
  const settlesToday = isStocks && freezeIso && isSameEtDay(freezeIso);

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border/40 bg-card p-4 transition-all",
        "hover:border-primary/40 hover:bg-card/80 active:scale-[0.99]",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-foreground">
          {event.name}
        </h3>
        {settlesToday && freezeIso && (
          <span className="flex flex-shrink-0 items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
            <Clock className="h-3 w-3" />
            Settles today · {formatEt(freezeIso)} ET
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect ? onSelect("yes") : onClick?.();
          }}
          className="group flex flex-col items-start gap-0.5 rounded-lg border border-trading-green/30 bg-trading-green/5 px-3 py-2 text-left transition-all hover:border-trading-green hover:bg-trading-green/15"
        >
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {yesLabel}
          </span>
          <span className="font-mono text-base font-bold text-trading-green">
            {Math.round(yesPrice * 100)}%
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect ? onSelect("no") : onClick?.();
          }}
          className="group flex flex-col items-start gap-0.5 rounded-lg border border-trading-red/30 bg-trading-red/5 px-3 py-2 text-left transition-all hover:border-trading-red hover:bg-trading-red/15"
        >
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {noLabel}
          </span>
          <span className="font-mono text-base font-bold text-trading-red">
            {Math.round(noPrice * 100)}%
          </span>
        </button>
      </div>
    </div>
  );
};
