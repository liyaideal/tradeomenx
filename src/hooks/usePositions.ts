import { useMemo, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useSupabasePositions, SupabasePosition } from "./useSupabasePositions";
import { usePositionsStore, Position as LocalPosition } from "@/stores/usePositionsStore";

// Unified position interface for components
export interface UnifiedPosition {
  id: string;
  type: "long" | "short";
  event: string;
  option: string;
  optionId?: string | null; // Direct reference to event_options for realtime price lookup
  entryPrice: string;
  markPrice: string;
  size: string;
  margin: string;
  pnl: string;
  pnlPercent: string;
  leverage: string;
  tp: string;
  sl: string;
  tpMode: "%" | "$";
  slMode: "%" | "$";
  // Original source for mutations
  _source: "supabase" | "local";
  _supabaseId?: string;
}

// Convert Supabase position to unified format
const convertSupabasePosition = (pos: SupabasePosition): UnifiedPosition => {
  const pnlValue = Number(pos.pnl) || 0;
  const pnlPercentValue = Number(pos.pnl_percent) || 0;
  
  return {
    id: pos.id,
    type: pos.side as "long" | "short",
    event: pos.event_name,
    option: pos.option_label,
    optionId: (pos as any).option_id || null, // Direct reference for realtime prices
    entryPrice: `$${Number(pos.entry_price).toFixed(4)}`,
    markPrice: `$${Number(pos.mark_price).toFixed(4)}`,
    size: Number(pos.size).toLocaleString(),
    margin: `$${Number(pos.margin).toFixed(2)}`,
    pnl: `${pnlValue >= 0 ? "+" : ""}$${Math.abs(pnlValue).toFixed(2)}`,
    pnlPercent: `${pnlPercentValue >= 0 ? "+" : ""}${pnlPercentValue.toFixed(1)}%`,
    leverage: `${pos.leverage}x`,
    tp: pos.tp_value ? String(pos.tp_value) : "",
    sl: pos.sl_value ? String(pos.sl_value) : "",
    tpMode: (pos.tp_mode as "%" | "$") || "%",
    slMode: (pos.sl_mode as "%" | "$") || "%",
    _source: "supabase",
    _supabaseId: pos.id,
  };
};

// Convert local position to unified format
const convertLocalPosition = (pos: LocalPosition, index: number): UnifiedPosition => {
  return {
    id: `local-${index}`,
    type: pos.type,
    event: pos.event,
    option: pos.option,
    entryPrice: pos.entryPrice,
    markPrice: pos.markPrice,
    size: pos.size,
    margin: pos.margin,
    pnl: pos.pnl,
    pnlPercent: pos.pnlPercent,
    leverage: pos.leverage,
    tp: pos.tp,
    sl: pos.sl,
    tpMode: pos.tpMode,
    slMode: pos.slMode,
    _source: "local",
  };
};

export const usePositions = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  // Supabase positions for logged-in users
  const {
    positions: supabasePositions,
    isLoading: supabaseLoading,
    closePosition: closeSupabasePosition,
    updatePositionTpSl: updateSupabaseTpSl,
    isClosing,
    isUpdatingTpSl,
    refetch: refetchSupabasePositions,
  } = useSupabasePositions();
  
  // Local positions for guests
  const {
    positions: localPositions,
    closePosition: closeLocalPosition,
    updatePositionTpSl: updateLocalTpSl,
  } = usePositionsStore();
  
  // Convert to unified format
  const positions: UnifiedPosition[] = useMemo(() => {
    if (isLoggedIn) {
      return supabasePositions.map(convertSupabasePosition);
    }
    return localPositions.map(convertLocalPosition);
  }, [isLoggedIn, supabasePositions, localPositions]);
  
  // Refetch positions (for logged-in users)
  const refetch = useCallback(() => {
    if (isLoggedIn) {
      refetchSupabasePositions();
    }
  }, [isLoggedIn, refetchSupabasePositions]);
  
  // Unified close position handler
  const closePosition = useCallback(
    async (positionId: string, index: number) => {
      if (isLoggedIn) {
        // Get the position to calculate PnL
        const pos = supabasePositions.find(p => p.id === positionId);
        if (pos) {
          const closePrice = Number(pos.mark_price);
          const entryPrice = Number(pos.entry_price);
          const size = Number(pos.size);
          const side = pos.side;
          
          // Calculate PnL
          const priceDiff = closePrice - entryPrice;
          const pnl = side === "long" ? priceDiff * size : -priceDiff * size;
          
          await closeSupabasePosition(positionId, closePrice, pnl);
        }
      } else {
        closeLocalPosition(index);
      }
    },
    [isLoggedIn, supabasePositions, closeSupabasePosition, closeLocalPosition]
  );
  
  // Unified update TP/SL handler
  const updatePositionTpSl = useCallback(
    async (
      positionId: string,
      index: number,
      tp: string,
      sl: string,
      tpMode: "%" | "$",
      slMode: "%" | "$"
    ) => {
      if (isLoggedIn) {
        const tpValue = tp ? parseFloat(tp) : null;
        const slValue = sl ? parseFloat(sl) : null;
        await updateSupabaseTpSl(positionId, tpValue, tpMode, slValue, slMode);
      } else {
        updateLocalTpSl(index, tp, sl, tpMode, slMode);
      }
    },
    [isLoggedIn, updateSupabaseTpSl, updateLocalTpSl]
  );
  
  return {
    positions,
    isLoading: isLoggedIn ? supabaseLoading : false,
    isLoggedIn,
    closePosition,
    updatePositionTpSl,
    isClosing,
    isUpdatingTpSl,
    refetch,
  };
};
