// ============================================================
// LiteSpotTrade — Lite surface Stocks quick-buy page.
// Simplified sibling of /spot: header + LiteBuyPanel only. Reuses the same
// URL (/spot?eventId=…) so links stay shareable across surfaces.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { LiteBuyPanel } from "@/components/lite/LiteBuyPanel";
import type { Tables } from "@/integrations/supabase/types";
import type { EventWithOptions } from "@/hooks/useActiveEvents";
import { useCountdown } from "@/hooks/useCountdown";
import { formatEtTime } from "@/lib/usStockSessions";
import { ExpiredEventFallback } from "@/components/ExpiredEventFallback";

const LiteSpotTrade = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [event, setEvent] = useState<EventWithOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: ev, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !ev) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data: opts } = await supabase
        .from("event_options")
        .select("*")
        .eq("event_id", ev.id);
      setEvent({
        ...(ev as Tables<"events">),
        options: (opts || []).map((o) => ({
          ...o,
          price: Number(o.price),
          final_price: o.final_price ? Number(o.final_price) : null,
        })),
      } as EventWithOptions);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const freezeIso = (event as any)?.freeze_time || event?.end_date || null;
  const freezeAt = freezeIso ? new Date(freezeIso) : null;
  const countdown = useCountdown(freezeIso);
  const countdownLabel = countdown.isExpired ? "Closed" : countdown.compact || "--";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (notFound || !event) {
    return <ExpiredEventFallback eventId={eventId || ""} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && <EventsDesktopHeader />}

      <main
        className={
          isMobile
            ? "px-4 py-4 pb-24"
            : "mx-auto max-w-2xl px-6 py-6"
        }
      >
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/40"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Quick buy</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-foreground">
              {countdownLabel}
            </p>
            {freezeAt && (
              <p className="text-[10px] text-muted-foreground">
                closes {formatEtTime(freezeAt)} ET
              </p>
            )}
          </div>
        </div>

        <LiteBuyPanel event={event} />
      </main>
    </div>
  );
};

export default LiteSpotTrade;
