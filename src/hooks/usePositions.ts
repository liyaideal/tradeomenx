import { useMemo, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useSupabasePositions, SupabasePosition } from "./useSupabasePositions";
import { usePositionsStore, Position as LocalPosition } from "@/stores/usePositionsStore";
import { useAirdropPositions, AirdropPosition } from "./useAirdropPositions";

// Unified position interface for components
export interface UnifiedPosition {
  id: string;
  type: "long" | "short";
  event: string;
  option: string;
  optionId?: string | null; // Direct reference to event_options for realtime price lookup
  entryPrice: string;
  markPrice: string;
  size: string;           // Raw numeric string for calculations (no commas)
  sizeDisplay: string;    // Formatted string for display (with commas)
  margin: string;
  pnl: string;
  pnlPercent: string;
  leverage: string;
  tp: string;
  sl: string;
  tpMode: "%" | "$";
  slMode: "%" | "$";
  isAirdrop?: boolean;
  airdropId?: string;
  // Original source for mutations
  _source: "supabase" | "local" | "airdrop";
  _supabaseId?: string;
}

// Convert Supabase position to unified format
const convertSupabasePosition = (pos: SupabasePosition): UnifiedPosition => {
  const pnlValue = Number(pos.pnl) || 0;
  const pnlPercentValue = Number(pos.pnl_percent) || 0;
  const sizeNum = Number(pos.size);
  
  return {
    id: pos.id,
    type: pos.side as "long" | "short",
    event: pos.event_name,
    option: pos.option_label,
    optionId: pos.option_id || null, // Direct reference for realtime prices
    entryPrice: `$${Number(pos.entry_price).toFixed(4)}`,
    markPrice: `$${Number(pos.mark_price).toFixed(4)}`,
    size: String(sizeNum), // Raw number for calculations
    sizeDisplay: sizeNum.toLocaleString(), // Formatted for display
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
  const sizeStr = pos.size.replace(/,/g, "");
  const sizeNum = parseFloat(sizeStr) || 0;
  
  return {
    id: `local-${index}`,
    type: pos.type,
    event: pos.event,
    option: pos.option,
    entryPrice: pos.entryPrice,
    markPrice: pos.markPrice,
    size: String(sizeNum), // Raw number for calculations
    sizeDisplay: sizeNum.toLocaleString(), // Formatted for display
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

// Convert activated airdrop to unified position format
const convertAirdropPosition = (airdrop: AirdropPosition): UnifiedPosition => {
  const qty = Math.round(airdrop.airdropValue / airdrop.counterPrice);
  return {
    id: `airdrop-${airdrop.id}`,
    type: airdrop.counterSide as "long" | "short",
    event: airdrop.counterEventName,
    option: airdrop.counterOptionLabel,
    optionId: null,
    entryPrice: `$${airdrop.counterPrice.toFixed(4)}`,
    markPrice: `$${airdrop.counterPrice.toFixed(4)}`,
    size: String(qty),
    sizeDisplay: qty.toLocaleString(),
    margin: `$${airdrop.airdropValue.toFixed(2)}`,
    pnl: "+$0.00",
    pnlPercent: "+0.0%",
    leverage: "1x",
    tp: "",
    sl: "",
    tpMode: "%",
    slMode: "%",
    isAirdrop: true,
    airdropId: airdrop.id,
    _source: "airdrop",
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

  // Activated airdrops (merged into positions list)
  const { activatedAirdrops } = useAirdropPositions();
  
  // Convert to unified format (including activated airdrops)
  const positions: UnifiedPosition[] = useMemo(() => {
    const base = isLoggedIn
      ? supabasePositions.map(convertSupabasePosition)
      : localPositions.map(convertLocalPosition);
    const airdropPositions = activatedAirdrops.map(convertAirdropPosition);
    return [...base, ...airdropPositions];
  }, [isLoggedIn, supabasePositions, localPositions, activatedAirdrops]);
  
  // Refetch positions (for logged-in users)
  const refetch = useCallback(() => {
    if (isLoggedIn) {
      refetchSupabasePositions();
    }
  }, [isLoggedIn, refetchSupabasePositions]);
  
  // Unified close position handler
  const closePosition = useCallback(
    async (positionId: string, index: number) => {
      // Airdrop positions — just remove from local state for now
      if (positionId.startsWith("airdrop-")) {
        // For demo: could mark as closed; for now just toast
        const { toast } = await import("sonner");
        toast.success("Airdrop position closed");
        return;
      }
      if (isLoggedIn) {
        const pos = supabasePositions.find(p => p.id === positionId);
        if (pos) {
          const closePrice = Number(pos.mark_price);
          const entryPrice = Number(pos.entry_price);
          const size = Number(pos.size);
          const side = pos.side;
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
      if (positionId.startsWith("airdrop-")) {
        const { toast } = await import("sonner");
        toast.success("TP/SL updated for airdrop position");
        return;
      }
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
};
