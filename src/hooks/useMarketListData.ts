import { useMemo } from "react";
import { EventWithOptions } from "@/hooks/useActiveEvents";
import { isClosingSoon, isNewEvent } from "@/components/events/ClosingSoonCountdown";
import { getCategoryInfo } from "@/lib/categoryUtils";

export interface MarketRow {
  // Identity
  id: string; // option id (or event id for parent row)
  eventId: string;
  eventName: string;
  eventIcon: string;
  optionLabel: string;
  category: string;
  categoryLabel: string;

  // Pricing (real from DB)
  markPrice: number;

  // Mock fields
  change24h: number; // percentage
  volume24h: number; // absolute USD
  openInterest: number;
  fundingRate: number; // percentage per 8h
  maxLeverage: number;

  // Dates
  expiry: Date | null;
  createdAt: string;

  // Computed flags
  isNew: boolean;
  isClosingSoon: boolean;

  // Multi-market
  isParent: boolean;
  childCount: number;
  children: MarketRow[];
}

// Seeded pseudo-random for deterministic mocks
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const mockValue = (seed: number, min: number, max: number) =>
  min + seededRandom(seed) * (max - min);

export const useMarketListData = (events: EventWithOptions[]): MarketRow[] => {
  return useMemo(() => {
    return events.map((event) => {
      const endDate = event.end_date ? new Date(event.end_date) : null;
      const closingSoon = isClosingSoon(endDate);
      const newEvent = !closingSoon && isNewEvent(event.created_at);
      const catInfo = getCategoryInfo(event.category);
      const seed = event.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

      // Build child market rows
      const children: MarketRow[] = event.options.map((opt, i) => {
        const optSeed = seed + i * 137;
        return {
          id: opt.id,
          eventId: event.id,
          eventName: event.name,
          eventIcon: event.icon,
          optionLabel: opt.label,
          category: event.category,
          categoryLabel: catInfo.label,
          markPrice: opt.price,
          change24h: parseFloat(mockValue(optSeed + 1, -15, 15).toFixed(2)),
          volume24h: parseFloat(mockValue(optSeed + 2, 50000, 5000000).toFixed(0)),
          openInterest: parseFloat(mockValue(optSeed + 3, 10000, 2000000).toFixed(0)),
          fundingRate: parseFloat(mockValue(optSeed + 4, -0.05, 0.05).toFixed(4)),
          maxLeverage: 10,
          expiry: endDate,
          createdAt: event.created_at,
          isNew: newEvent,
          isClosingSoon: closingSoon,
          isParent: false,
          childCount: 0,
          children: [],
        };
      });

      // For binary (1-2 options), return a single "parent" row using the first option's data
      // For multi (3+), return a parent row with children
      const representative = children.length > 0 ? children[0] : null;

      const parent: MarketRow = {
        id: event.id,
        eventId: event.id,
        eventName: event.name,
        eventIcon: event.icon,
        optionLabel: representative?.optionLabel || "",
        category: event.category,
        categoryLabel: catInfo.label,
        markPrice: representative?.markPrice || 0.5,
        change24h: representative?.change24h || 0,
        // Sum volumes for parent
        volume24h: children.reduce((s, c) => s + c.volume24h, 0),
        openInterest: children.reduce((s, c) => s + c.openInterest, 0),
        fundingRate: representative?.fundingRate || 0,
        maxLeverage: 10,
        expiry: endDate,
        createdAt: event.created_at,
        isNew: newEvent,
        isClosingSoon: closingSoon,
        isParent: true,
        childCount: children.length,
        children: children.length >= 2 ? children : [],
      };

      return parent;
    });
  }, [events]);
};
