import { useMemo, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { useMarketListData, EventRow } from "@/hooks/useMarketListData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import { MarketCardB } from "@/components/events/MarketCardB";
import { cn } from "@/lib/utils";

interface HomeTopEventsProps {
  /** Optional slot rendered between the 2nd and 3rd card (e.g. trial CTA). */
  interlude?: ReactNode;
  /** Override section title. */
  title?: string;
}

const ALL = "All";

/**
 * Top Events module — title row with a LIVE filter, category chips, and a
 * vertical list of HomeMatchCard items. Mirrors the sportsbook reference's
 * "Top Events" block.
 */
export const HomeTopEvents = ({ interlude, title = "Top Events" }: HomeTopEventsProps) => {
  const navigate = useNavigate();
  const { events, isLoading } = useActiveEvents();
  const rows = useMarketListData(events);
  const { isWatched, toggle } = useWatchlist();

  const [liveOnly, setLiveOnly] = useState(true);
  const [activeChip, setActiveChip] = useState<string>(ALL);

  // Build chip set from non-empty categories, ordered by 24h volume.
  const chips = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.categoryLabel, (m.get(r.categoryLabel) ?? 0) + r.volume24h);
    return [ALL, ...Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(([k]) => k)];
  }, [rows]);

  const filtered: EventRow[] = useMemo(() => {
    let xs = rows;
    if (activeChip !== ALL) xs = xs.filter((r) => r.categoryLabel === activeChip);
    if (liveOnly) {
      xs = xs.filter((r) => r.isClosingSoon || r.volume24h > 100_000);
    }
    return [...xs]
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 8);
  }, [rows, activeChip, liveOnly]);

  return (
    <section>
      {/* Title + LIVE switch */}
      <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
        <h2 className="text-[18px] font-extrabold uppercase tracking-tight text-foreground">
          {title}
        </h2>
        <button
          onClick={() => setLiveOnly((v) => !v)}
          aria-pressed={liveOnly}
          className="flex items-center gap-2"
        >
          <span
            className={cn(
              "font-mono text-[10px] font-bold uppercase tracking-[0.22em] transition-colors",
              liveOnly ? "text-trading-green" : "text-muted-foreground",
            )}
          >
            Live
          </span>
          <span
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full border transition-colors",
              liveOnly ? "border-trading-green/50 bg-trading-green/30" : "border-border bg-muted",
            )}
          >
            <span
              className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-foreground transition-transform",
                liveOnly ? "translate-x-[18px] bg-trading-green" : "translate-x-0.5",
              )}
            />
          </span>
        </button>
      </div>

      {/* Category chips */}
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => {
          const active = chip === activeChip;
          const style = chip !== ALL ? CATEGORY_STYLES[chip as CategoryType] : null;
          return (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              style={
                active && style
                  ? { backgroundColor: `hsl(${style.hsl})`, borderColor: `hsl(${style.hsl})`, color: "white" }
                  : undefined
              }
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/40 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {isLoading && filtered.length === 0 ? (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-2xl border border-border/40 bg-card/40"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/40 bg-card/30 px-4 py-8 text-center">
          <p className="text-[13px] text-muted-foreground">
            No {liveOnly ? "live " : ""}markets here right now.
          </p>
          <button
            onClick={() => {
              setLiveOnly(false);
              setActiveChip(ALL);
            }}
            className="mt-2 text-[12px] font-semibold text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {filtered.map((m, i) => (
            <div key={m.id}>
              {i === 2 && interlude && <div className="mb-2.5">{interlude}</div>}
              <div
                className="animate-fade-in motion-reduce:animate-none"
                style={{ animationDelay: `${Math.min(i, 6) * 35}ms`, animationFillMode: "both" }}
              >
                <MarketCardB
                  market={m}
                  isWatched={isWatched(m.eventId)}
                  onToggleWatch={(e) => toggle(m.eventId, e)}
                  noBackground
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/events")}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border/40 bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card-hover hover:border-border/70"
      >
        Browse all markets
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </section>
  );
};
