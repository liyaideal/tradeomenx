import { useMemo } from "react";
import { EventWithOptions } from "@/hooks/useActiveEvents";
import { isClosingSoon, isNewEvent } from "@/components/events/ClosingSoonCountdown";
import { getCategoryInfo } from "@/lib/categoryUtils";

export interface MarketChildRow {
  id: string;
  optionLabel: string;
  markPrice: number;
  change24h: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
}

export interface EventRow {
  // Identity
  id: string;
  eventId: string;
  eventName: string;
  eventIcon: string;
  category: string;
  categoryLabel: string;

  // Event-level aggregated metrics
  change24h: number;
  volume24h: number;
  openInterest: number;

  // Dates
  expiry: Date | null;
  createdAt: string;

  // Computed flags
  isNew: boolean;
  isClosingSoon: boolean;

  // Children
  childCount: number;
  children: MarketChildRow[];
}

/** @deprecated Use EventRow instead */
export type MarketRow = EventRow;

// Seeded pseudo-random for deterministic mocks
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const mockValue = (seed: number, min: number, max: number) =>
  min + seededRandom(seed) * (max - min);

export const useMarketListData = (events: EventWithOptions[]): EventRow[] => {
  return useMemo(() => {
    return events.map((event) => {
      const endDate = event.end_date ? new Date(event.end_date) : null;
      const closingSoon = isClosingSoon(endDate);
      const newEvent = !closingSoon && isNewEvent(event.created_at);
      const catInfo = getCategoryInfo(event.category);
      const seed = event.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

      // Build child market rows
      const children: MarketChildRow[] = event.options.map((opt, i) => {
        const optSeed = seed + i * 137;
        return {
          id: opt.id,
          optionLabel: opt.label,
          markPrice: opt.price,
          change24h: parseFloat(mockValue(optSeed + 1, -15, 15).toFixed(2)),
          volume24h: parseFloat(mockValue(optSeed + 2, 50000, 5000000).toFixed(0)),
          openInterest: parseFloat(mockValue(optSeed + 3, 10000, 2000000).toFixed(0)),
          fundingRate: parseFloat(mockValue(optSeed + 4, -0.05, 0.05).toFixed(4)),
        };
      });

      // Event-level change24h: use change of the child with max volume
      const maxVolChild = children.length > 0
        ? children.reduce((best, c) => (c.volume24h > best.volume24h ? c : best), children[0])
        : null;

      const row: EventRow = {
        id: event.id,
        eventId: event.id,
        eventName: event.name,
        eventIcon: event.icon,
        category: event.category,
        categoryLabel: catInfo.label,
        change24h: maxVolChild?.change24h || 0,
        volume24h: children.reduce((s, c) => s + c.volume24h, 0),
        openInterest: children.reduce((s, c) => s + c.openInterest, 0),
        expiry: endDate,
        createdAt: event.created_at,
        isNew: newEvent,
        isClosingSoon: closingSoon,
        childCount: children.length,
        children: children.length >= 2 ? children : [],
      };

      return row;
    });
  }, [events]);
};
