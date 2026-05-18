import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export type SupabasePosition = Tables<"positions">;

// Fetch user's open positions from Supabase
const fetchPositions = async (userId: string): Promise<SupabasePosition[]> => {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "Open")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Close a position in Supabase
const closePositionInDb = async ({
  userId,
  positionId,
  closePrice,
  pnl,
}: {
  userId: string;
  positionId: string;
  closePrice: number;
  pnl: number;
}): Promise<{ marginReturned: number }> => {
  // Get position details first
  const { data: position, error: fetchError } = await supabase
    .from("positions")
    .select("margin, trade_id")
    .eq("id", positionId)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;
  if (!position) throw new Error("Position not found");

  // Update position status
  const { error: updateError } = await supabase
    .from("positions")
    .update({
      status: "Closed",
      mark_price: closePrice,
      pnl: pnl,
      closed_at: new Date().toISOString(),
    })
    .eq("id", positionId)
    .eq("user_id", userId);

  if (updateError) throw updateError;

  // Update corresponding trade
  if (position.trade_id) {
    await supabase
      .from("trades")
      .update({
        status: "Closed",
        pnl: pnl,
        closed_at: new Date().toISOString(),
      })
      .eq("id", position.trade_id);
  }

  return { marginReturned: Number(position.margin) + pnl };
};

// Partial close: reduce size/margin proportionally and credit realized PnL line.
// If closeQty >= current size, fully close.
const partialClosePositionInDb = async ({
  userId,
  positionId,
  closeQty,
  closePrice,
}: {
  userId: string;
  positionId: string;
  closeQty: number;
  closePrice: number;
}): Promise<{ closedQty: number; remainingSize: number; releasedMargin: number; realizedPnl: number; fullyClosed: boolean }> => {
  const { data: position, error: fetchError } = await supabase
    .from("positions")
    .select("size, margin, entry_price, side, trade_id, pnl")
    .eq("id", positionId)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;
  if (!position) throw new Error("Position not found");

  const currentSize = Number(position.size);
  const currentMargin = Number(position.margin);
  const entry = Number(position.entry_price);
  const side = position.side;

  const qty = Math.min(Math.max(1, Math.floor(closeQty)), Math.floor(currentSize));
  const priceDiff = closePrice - entry;
  const realizedPnl = (side === "long" ? priceDiff : -priceDiff) * qty;
  const ratio = qty / currentSize;
  const releasedMargin = currentMargin * ratio;

  // Full close path
  if (qty >= currentSize) {
    const { error: updateError } = await supabase
      .from("positions")
      .update({
        status: "Closed",
        mark_price: closePrice,
        pnl: realizedPnl,
        closed_at: new Date().toISOString(),
      })
      .eq("id", positionId)
      .eq("user_id", userId);
    if (updateError) throw updateError;

    if (position.trade_id) {
      await supabase
        .from("trades")
        .update({
          status: "Closed",
          pnl: realizedPnl,
          closed_at: new Date().toISOString(),
        })
        .eq("id", position.trade_id);
    }

    return {
      closedQty: qty,
      remainingSize: 0,
      releasedMargin,
      realizedPnl,
      fullyClosed: true,
    };
  }

  // Partial: reduce size/margin, accumulate realized pnl on the position row
  const newSize = currentSize - qty;
  const newMargin = currentMargin - releasedMargin;
  const accumulatedPnl = Number(position.pnl || 0) + realizedPnl;

  const { error: updateError } = await supabase
    .from("positions")
    .update({
      size: newSize,
      margin: newMargin,
      mark_price: closePrice,
      pnl: accumulatedPnl,
    })
    .eq("id", positionId)
    .eq("user_id", userId);
  if (updateError) throw updateError;

  return {
    closedQty: qty,
    remainingSize: newSize,
    releasedMargin,
    realizedPnl,
    fullyClosed: false,
  };
};

// Update TP/SL in Supabase
const updateTpSlInDb = async ({
  userId,
  positionId,
  tpValue,
  tpMode,
  slValue,
  slMode,
}: {
  userId: string;
  positionId: string;
  tpValue: number | null;
  tpMode: string | null;
  slValue: number | null;
  slMode: string | null;
}) => {
  const { error } = await supabase
    .from("positions")
    .update({
      tp_value: tpValue,
      tp_mode: tpMode,
      sl_value: slValue,
      sl_mode: slMode,
    })
    .eq("id", positionId)
    .eq("user_id", userId);

  if (error) throw error;
};

export const useSupabasePositions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for fetching positions
  const {
    data: positions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["positions", user?.id],
    queryFn: () => fetchPositions(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Mutation for closing position
  const closePositionMutation = useMutation({
    mutationFn: closePositionInDb,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["positions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success(`Position closed! Margin returned: $${data.marginReturned.toFixed(2)}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to close position: ${error.message}`);
    },
  });

  // Mutation for updating TP/SL
  const updateTpSlMutation = useMutation({
    mutationFn: updateTpSlInDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions", user?.id] });
      toast.success("TP/SL updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update TP/SL: ${error.message}`);
    },
  });

  // Subscribe to realtime position changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`positions-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "positions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch positions when any change occurs
          queryClient.invalidateQueries({ queryKey: ["positions", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Helper to close a position
  const closePosition = useCallback(
    async (positionId: string, closePrice: number, pnl: number) => {
      if (!user?.id) return;
      return closePositionMutation.mutateAsync({
        userId: user.id,
        positionId,
        closePrice,
        pnl,
      });
    },
    [user?.id, closePositionMutation]
  );

  // Helper to update TP/SL
  const updatePositionTpSl = useCallback(
    async (
      positionId: string,
      tpValue: number | null,
      tpMode: string | null,
      slValue: number | null,
      slMode: string | null
    ) => {
      if (!user?.id) return;
      return updateTpSlMutation.mutateAsync({
        userId: user.id,
        positionId,
        tpValue,
        tpMode,
        slValue,
        slMode,
      });
    },
    [user?.id, updateTpSlMutation]
  );

  return {
    positions,
    isLoading,
    error,
    refetch,
    closePosition,
    updatePositionTpSl,
    isClosing: closePositionMutation.isPending,
    isUpdatingTpSl: updateTpSlMutation.isPending,
  };
};
