import { useEffect, useState, useCallback } from "react";
import { useRealtimePricesOptional } from "@/contexts/RealtimePricesContext";
import { supabase } from "@/integrations/supabase/client";

interface OptionMapping {
  optionId: string;
  eventId: string;
  label: string;
  eventName: string;
}

// Cache for option lookups - maps various keys to optionId
let optionMappingsCache: Map<string, OptionMapping> = new Map();
// Secondary index: just option label -> optionId (for fuzzy matching)
let labelOnlyCache: Map<string, OptionMapping[]> = new Map();

export const useRealtimePositionsPnL = () => {
  const pricesContext = useRealtimePricesOptional();
  const [optionMappings, setOptionMappings] = useState<Map<string, OptionMapping>>(optionMappingsCache);
  const [labelMappings, setLabelMappings] = useState<Map<string, OptionMapping[]>>(labelOnlyCache);
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
          const labelMap = new Map<string, OptionMapping[]>();
          
          data.forEach((option: any) => {
            const eventName = option.events?.name || "";
            const mapping: OptionMapping = {
              optionId: option.id,
              eventId: option.event_id,
              label: option.label,
              eventName: eventName,
            };
            
            // Primary key: exact match on event_name|option_label
            const key = `${eventName.toLowerCase()}|${option.label.toLowerCase()}`;
            mappings.set(key, mapping);
            
            // Secondary index: just label (may have duplicates across events)
            const labelKey = option.label.toLowerCase();
            if (!labelMap.has(labelKey)) {
              labelMap.set(labelKey, []);
            }
            labelMap.get(labelKey)!.push(mapping);
          });
          
          optionMappingsCache = mappings;
          labelOnlyCache = labelMap;
          setOptionMappings(mappings);
          setLabelMappings(labelMap);
        }
      } catch (err) {
        console.error("Error in fetchMappings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMappings();
  }, []);

  // Get the option ID for a position - with fuzzy matching support
  const getOptionId = useCallback((eventName: string, optionLabel: string): string | null => {
    const eventLower = eventName.toLowerCase();
    const labelLower = optionLabel.toLowerCase();
    
    // Try exact match first
    const exactKey = `${eventLower}|${labelLower}`;
    const exactMatch = optionMappings.get(exactKey);
    if (exactMatch) {
      return exactMatch.optionId;
    }
    
    // Try partial event name match - the position may have truncated event name
    for (const [key, mapping] of optionMappings.entries()) {
      const [storedEvent, storedLabel] = key.split('|');
      if (storedLabel === labelLower) {
        // Check if stored event name contains the position's event name or vice versa
        if (storedEvent.includes(eventLower) || eventLower.includes(storedEvent.substring(0, 20))) {
          return mapping.optionId;
        }
        // Check for key words match
        const eventWords = eventLower.split(/\s+/).filter(w => w.length > 3);
        const storedWords = storedEvent.split(/\s+/);
        const matchCount = eventWords.filter(w => storedWords.some(sw => sw.includes(w))).length;
        if (matchCount >= 2) {
          return mapping.optionId;
        }
      }
    }
    
    // Last resort: just match by label (risky if same label exists in multiple events)
    const labelMatches = labelMappings.get(labelLower);
    if (labelMatches && labelMatches.length === 1) {
      return labelMatches[0].optionId;
    }
    
    // If multiple matches by label, try to find best match by event name similarity
    if (labelMatches && labelMatches.length > 1) {
      for (const match of labelMatches) {
        const matchEventLower = match.eventName.toLowerCase();
        // Check for partial match
        if (matchEventLower.includes(eventLower.substring(0, 15)) || 
            eventLower.includes(matchEventLower.substring(0, 15))) {
          return match.optionId;
        }
      }
      // Return first match as fallback
      return labelMatches[0].optionId;
    }
    
    return null;
  }, [optionMappings, labelMappings]);

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
