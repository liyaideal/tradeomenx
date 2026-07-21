// ============================================================
// LiteEvents — Lite surface /events list.
// Top = sector tab (Sports 除外，list 页不放外链 tab).
// No Futures | Spot product-line switch. Event cards match LiteEventCard.
// ============================================================
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { eventToSector, SECTOR_META, type SectorKey } from "@/components/lite/SectorRail";
import { LiteEventCard } from "@/components/lite/LiteEventCard";
import { cn } from "@/lib/utils";

const SECTOR_ORDER: SectorKey[] = ["stocks", "crypto", "macro", "entertainment"];

const LiteEvents = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { events, isLoading } = useActiveEvents();

  const availableSectors = useMemo(
    () => SECTOR_ORDER.filter((k) => events.some((e) => eventToSector(e) === k)),
    [events],
  );

  const [sector, setSector] = useState<SectorKey>(
    () => availableSectors[0] || "stocks",
  );

  const sectorEvents = useMemo(
    () => events.filter((e) => eventToSector(e) === sector),
    [events, sector],
  );

  const goToTrade = (eventId: string) => {
    if (sector === "stocks") navigate(`/spot?eventId=${eventId}`);
    else navigate(`/trade?eventId=${eventId}`);
  };

  return (
    <div className={isMobile ? "min-h-screen bg-background pb-24" : "min-h-screen bg-background"}>
      {isMobile ? <MobileHeader /> : <EventsDesktopHeader />}

      <main className={isMobile ? "px-4 py-4" : "mx-auto max-w-7xl px-6 py-6"}>
        <div className="mb-4">
          <h1 className={isMobile ? "text-xl font-bold" : "text-2xl font-bold"}>
            Events
          </h1>
        </div>

        {/* Sector tabs — no Sports (external), no Futures | Spot switch */}
        <div className="-mx-4 mb-4 overflow-x-auto scrollbar-none">
          <div className="flex min-w-max gap-2 px-4">
            {availableSectors.map((key) => {
              const meta = SECTOR_META[key];
              const active = key === sector;
              return (
                <button
                  key={key}
                  onClick={() => setSector(key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                    active
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <meta.Icon className="h-3.5 w-3.5" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sectorEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/40 py-16 text-center text-sm text-muted-foreground">
            No live events in this sector right now.
          </div>
        ) : (
          <div className={isMobile ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 gap-3 xl:grid-cols-3"}>
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

export default LiteEvents;
