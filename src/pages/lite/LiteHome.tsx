// ============================================================
// LiteHome — Lite surface home page.
// Two layers:
//   1. Horizontal SectorRail (Sports external + Stocks / Crypto / Macro /
//      Entertainment — only sectors with active events show).
//   2. Selected sector's event stream (LiteEventCard list).
// The word "Spot" / "Futures" NEVER appears — product form is set by sector.
// ============================================================
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { SectorRail, eventToSector, type SectorKey } from "@/components/lite/SectorRail";
import { LiteEventCard } from "@/components/lite/LiteEventCard";

const DEFAULT_SECTOR: SectorKey = "stocks";

const LiteHome = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { events, isLoading } = useActiveEvents();

  // Pick first sector with events (prefer stocks).
  const availableSectors = useMemo(() => {
    const set = new Set<SectorKey>();
    events.forEach((e) => {
      const s = eventToSector(e);
      if (s) set.add(s);
    });
    return set;
  }, [events]);

  const [sector, setSector] = useState<SectorKey>(DEFAULT_SECTOR);

  useEffect(() => {
    if (availableSectors.size === 0) return;
    if (!availableSectors.has(sector)) {
      const preferred: SectorKey[] = ["stocks", "crypto", "macro", "entertainment"];
      const next = preferred.find((k) => availableSectors.has(k));
      if (next) setSector(next);
    }
  }, [availableSectors, sector]);

  const sectorEvents = useMemo(
    () => events.filter((e) => eventToSector(e) === sector),
    [events, sector],
  );

  const goToTrade = (eventId: string) => {
    // Product-line routing:
    // Stocks (spot) → /spot; everything else keeps the Pro /trade for now
    // (Lite crypto/macro contract UI arrives with the Boost round).
    if (sector === "stocks") navigate(`/spot?eventId=${eventId}`);
    else navigate(`/trade?eventId=${eventId}`);
  };

  return (
    <div className={isMobile ? "min-h-screen bg-background pb-24" : "min-h-screen bg-background"}>
      {isMobile ? <MobileHeader /> : <EventsDesktopHeader />}

      <main className={isMobile ? "px-4 py-4" : "mx-auto max-w-7xl px-6 py-6"}>
        <div className="mb-4">
          <h1 className={isMobile ? "text-xl font-bold" : "text-2xl font-bold"}>
            Markets
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Pick a sector, tap an event, choose a side.
          </p>
        </div>

        <SectorRail events={events} selected={sector} onSelect={setSector} className="mb-6" />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sectorEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/40 py-16 text-center text-sm text-muted-foreground">
            No live events in this sector right now.
          </div>
        ) : (
          <div
            className={
              isMobile
                ? "grid grid-cols-1 gap-3"
                : "grid grid-cols-2 gap-3 xl:grid-cols-3"
            }
          >
            {sectorEvents.map((ev) => (
              <LiteEventCard
                key={ev.id}
                event={ev}
                isStocks={sector === "stocks"}
                onClick={() => goToTrade(ev.id)}
              />
            ))}
          </div>
        )}
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
};

export default LiteHome;
