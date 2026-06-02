import { useMemo, useState } from "react";
import { Search, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import type { PositionVoucher } from "@/hooks/usePositionVouchers";

export interface PickedOption {
  eventId: string;
  eventName: string;
  optionId: string;
  optionLabel: string;
  price: number;
  side: "long" | "short";
}

interface EligibilityResult {
  ok: boolean;
  reason?: string;
}

const checkEligibility = (
  voucher: PositionVoucher,
  price: number,
  endDate: string | null,
  isResolved: boolean,
): EligibilityResult => {
  if (isResolved) return { ok: false, reason: "Event already resolved" };
  if (!endDate) return { ok: false, reason: "No end date" };
  const hoursToEnd = (new Date(endDate).getTime() - Date.now()) / 3600 / 1000;
  if (hoursToEnd < voucher.minHoursToSettlement) {
    return { ok: false, reason: `Closes within ${voucher.minHoursToSettlement}h` };
  }
  if (price < voucher.entryPriceMin || price > voucher.entryPriceMax) {
    return {
      ok: false,
      reason: `Price out of ${voucher.entryPriceMin.toFixed(2)}–${voucher.entryPriceMax.toFixed(2)} band`,
    };
  }
  return { ok: true };
};

interface EventPickerListProps {
  voucher: PositionVoucher;
  selected: PickedOption | null;
  onSelect: (picked: PickedOption | null) => void;
}

export const EventPickerList = ({ voucher, selected, onSelect }: EventPickerListProps) => {
  const { events, isLoading } = useActiveEvents();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  }, [events, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="pl-9 h-9 text-sm"
        />
      </div>

      <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
        {isLoading && <div className="text-xs text-muted-foreground text-center py-6">Loading events...</div>}
        {!isLoading && filtered.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-6">No events found</div>
        )}
        {filtered.map((event) => (
          <div key={event.id} className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground truncate">{event.name}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{event.category}</div>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {event.options.length} option{event.options.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="space-y-1.5">
              {event.options.map((opt) => {
                const eligibility = checkEligibility(voucher, opt.price, event.end_date, event.is_resolved);
                const isSelectedLong = selected?.optionId === opt.id && selected?.side === "long";
                const isSelectedShort = selected?.optionId === opt.id && selected?.side === "short";

                const pickButton = (side: "long" | "short", isSelected: boolean, label: string, colorClass: string) => {
                  const inner = (
                    <button
                      type="button"
                      disabled={!eligibility.ok}
                      onClick={() => {
                        if (!eligibility.ok) return;
                        onSelect({
                          eventId: event.id,
                          eventName: event.name,
                          optionId: opt.id,
                          optionLabel: opt.label,
                          price: opt.price,
                          side,
                        });
                      }}
                      className={[
                        "h-7 px-2 rounded text-[11px] font-medium border transition",
                        eligibility.ok
                          ? isSelected
                            ? `${colorClass} ring-2 ring-offset-1 ring-offset-background`
                            : `${colorClass} opacity-80 hover:opacity-100`
                          : "border-border bg-muted/40 text-muted-foreground cursor-not-allowed",
                      ].join(" ")}
                    >
                      {!eligibility.ok && <Lock className="w-3 h-3 inline mr-1" />}
                      {label}
                    </button>
                  );

                  if (eligibility.ok) return inner;
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>{inner}</TooltipTrigger>
                      <TooltipContent className="text-xs">{eligibility.reason}</TooltipContent>
                    </Tooltip>
                  );
                };

                return (
                  <div key={opt.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 text-xs text-foreground/90 truncate">{opt.label}</div>
                    <div className="font-mono text-xs text-muted-foreground tabular-nums w-12 text-right">
                      ${opt.price.toFixed(2)}
                    </div>
                    <div className="flex gap-1">
                      {pickButton(
                        "long",
                        isSelectedLong,
                        "Yes",
                        "border-trading-green/40 bg-trading-green/15 text-trading-green",
                      )}
                      {pickButton(
                        "short",
                        isSelectedShort,
                        "No",
                        "border-trading-red/40 bg-trading-red/15 text-trading-red",
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
