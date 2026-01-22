import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export interface SupabaseOrder {
  id: string;
  user_id: string;
  event_name: string;
  option_label: string;
  side: string;
  order_type: string;
  price: number;
  quantity: number;
  amount: number;
  margin: number;
  fee: number;
  leverage: number;
  status: string;
  tp_value: number | null;
  tp_mode: string | null;
  sl_value: number | null;
  sl_mode: string | null;
  created_at: string;
  updated_at: string;
}

export const useSupabaseOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch pending orders (status = 'Pending' or 'Partial Filled')
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["pending-orders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["Pending", "Partial Filled"])
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pending orders:", error);
        throw error;
      }

      return data as SupabaseOrder[];
    },
    enabled: !!user?.id,
  });

  // Subscribe to realtime updates for trades
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("pending-orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trades",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Trades realtime update:", payload);
          // Refetch to get updated orders
          queryClient.invalidateQueries({ queryKey: ["pending-orders", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("trades")
        .update({ status: "Cancelled" })
        .eq("id", orderId)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-orders", user?.id] });
    },
  });

  // Fill order mutation (for manual fill or when price matches)
  const fillOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      // First get the order details
      const { data: order, error: fetchError } = await supabase
        .from("trades")
        .select("*")
        .eq("id", orderId)
        .single();

      if (fetchError || !order) throw fetchError || new Error("Order not found");

      // Update trade status to Filled
      const { error: updateError } = await supabase
        .from("trades")
        .update({ status: "Filled", closed_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // Create corresponding position
      const { error: positionError } = await supabase
        .from("positions")
        .insert({
          user_id: order.user_id,
          trade_id: orderId,
          event_name: order.event_name,
          option_label: order.option_label,
          side: order.side === "buy" ? "long" : "short",
          entry_price: order.price,
          mark_price: order.price,
          size: order.quantity,
          margin: order.margin,
          leverage: order.leverage,
          status: "Open",
          tp_value: order.tp_value,
          tp_mode: order.tp_mode,
          sl_value: order.sl_value,
          sl_mode: order.sl_mode,
        });

      if (positionError) throw positionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["supabase-positions", user?.id] });
    },
  });

  return {
    orders,
    isLoading,
    refetch,
    cancelOrder: cancelOrderMutation.mutateAsync,
    fillOrder: fillOrderMutation.mutateAsync,
    isCancelling: cancelOrderMutation.isPending,
    isFilling: fillOrderMutation.isPending,
  };
};
