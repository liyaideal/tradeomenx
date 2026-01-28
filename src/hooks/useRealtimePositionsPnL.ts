import { useEffect, useState, useCallback } from "react";
import { useRealtimePricesOptional } from "@/contexts/RealtimePricesContext";
import { supabase } from "@/integrations/supabase/client";

interface OptionMapping {
  optionId: string;
  eventId: string;
  label: string;
  eventName: string;
}

// Cache for option lookups - maps "eventName|optionLabel" to optionId
let optionMappingsCache: Map<string, OptionMapping> = new Map();

export const useRealtimePositionsPnL = () => {
  const pricesContext = useRealtimePricesOptional();
  const [optionMappings, setOptionMappings] = useState<Map<string, OptionMapping>>(optionMappingsCache);
  const [isLoading, setIsLoading] = useState(optionMappingsCache.size === 0);

  // Fetch option mappings (event_name + option_label -> option_id)
  useEffect(() => {
    const fetchMappings = async () => {
      if (optionMappingsCache.size > 0) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("event_options")
          .select(`
            id,
            event_id,
            label,
            events!inner(name)
          `);

        if (error) {
          console.error("Error fetching option mappings:", error);
          return;
        }

        if (data) {
          const mappings = new Map<string, OptionMapping>();
          data.forEach((option: any) => {
            const eventName = option.events?.name || "";
            const key = `${eventName.toLowerCase()}|${option.label.toLowerCase()}`;
            mappings.set(key, {
              optionId: option.id,
              eventId: option.event_id,
              label: option.label,
              eventName: eventName,
            });
          });
          optionMappingsCache = mappings;
          setOptionMappings(mappings);
        }
      } catch (err) {
        console.error("Error in fetchMappings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMappings();
  }, []);

  // Get the option ID for a position
  const getOptionId = useCallback((eventName: string, optionLabel: string): string | null => {
    const key = `${eventName.toLowerCase()}|${optionLabel.toLowerCase()}`;
    const mapping = optionMappings.get(key);
    return mapping?.optionId || null;
  }, [optionMappings]);

  // Calculate realtime PnL for a position
  const calculateRealtimePnL = useCallback((
    position: {
      event: string;
      option: string;
      type: "long" | "short";
      entryPrice: string;
      size: string;
      margin: string;
    }
  ): {
    markPrice: number;
    pnl: number;
    pnlPercent: number;
    hasRealtimePrice: boolean;
  } => {
    // Parse entry price (remove $ and commas)
    const entryPrice = parseFloat(position.entryPrice.replace(/[$,]/g, ""));
    const size = parseFloat(position.size.replace(/,/g, ""));
    const margin = parseFloat(position.margin.replace(/[$,]/g, ""));

    // Try to get realtime price
    const optionId = getOptionId(position.event, position.option);
    const realtimePrice = optionId && pricesContext ? pricesContext.getPrice(optionId) : undefined;

    if (realtimePrice !== undefined) {
      // Calculate PnL based on position type
      const priceDiff = realtimePrice - entryPrice;
      const pnl = position.type === "long" 
        ? priceDiff * size 
        : -priceDiff * size;
      const pnlPercent = margin > 0 ? (pnl / margin) * 100 : 0;

      return {
        markPrice: realtimePrice,
        pnl,
        pnlPercent,
        hasRealtimePrice: true,
      };
    }

    // Fallback: use stored values if no realtime price available
    const storedMarkPrice = parseFloat(position.entryPrice.replace(/[$,]/g, ""));
    return {
      markPrice: storedMarkPrice,
      pnl: 0,
      pnlPercent: 0,
      hasRealtimePrice: false,
    };
  }, [getOptionId, pricesContext]);

  // Format PnL values for display
  const formatPnL = useCallback((pnl: number, pnlPercent: number) => {
    const pnlStr = `${pnl >= 0 ? "+" : ""}$${Math.abs(pnl).toFixed(2)}`;
    const pnlPercentStr = `${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(1)}%`;
    return { pnlStr, pnlPercentStr };
  }, []);

  // Format mark price for display
  const formatMarkPrice = useCallback((price: number) => {
    return `$${price.toFixed(4)}`;
  }, []);

  return {
    isLoading,
    getOptionId,
    calculateRealtimePnL,
    formatPnL,
    formatMarkPrice,
    lastUpdate: pricesContext?.lastUpdate,
  };
};
