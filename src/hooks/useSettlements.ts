import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

export interface SettlementListItem {
  id: string;
  event: string;
  option: string;
  side: "long" | "short";
  entryPrice: string;
  exitPrice: string;
  size: string;
  pnl: string;
  pnlPercent: string;
  leverage: string;
  settledAt: string;
  result: "win" | "lose";
}

export const useSettlements = () => {
  const { user } = useUserProfile();

  return useQuery({
    queryKey: ["settlements", user?.id],
    queryFn: async (): Promise<SettlementListItem[]> => {
      if (!user) return [];

      // Fetch closed trades (settlements)
      const { data: trades, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "Filled")
        .not("closed_at", "is", null)
        .order("closed_at", { ascending: false });

      if (error) {
        console.error("Error fetching settlements:", error);
        throw error;
      }

      if (!trades || trades.length === 0) return [];

      // Group trades by event_name + option_label to aggregate
      const groupedTrades = trades.reduce((acc, trade) => {
        const key = `${trade.event_name}|${trade.option_label}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(trade);
        return acc;
      }, {} as Record<string, typeof trades>);

      // Transform grouped trades into settlements
      return Object.entries(groupedTrades).map(([key, groupTrades]) => {
        // Use the first trade's id as the settlement id (for navigation)
        const firstTrade = groupTrades[0];
        
        // Calculate aggregated values
        const totalQty = groupTrades.reduce((sum, t) => sum + Number(t.quantity), 0);
        const totalCost = groupTrades.reduce((sum, t) => sum + Number(t.amount), 0);
        const avgEntryPrice = totalQty > 0 ? totalCost / totalQty : Number(firstTrade.price);
        const totalPnl = groupTrades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);
        const totalMargin = groupTrades.reduce((sum, t) => sum + Number(t.margin), 0);
        
        const isWin = totalPnl > 0;
        const exitPrice = isWin ? 1.0 : 0.0;
        const pnlPercent = totalMargin > 0 ? (totalPnl / totalMargin) * 100 : 0;
        
        // Find the latest closed_at date
        const settledAt = groupTrades.reduce((latest, t) => {
          const date = t.closed_at || t.updated_at;
          return date > latest ? date : latest;
        }, groupTrades[0].closed_at || groupTrades[0].updated_at);

        const side: "long" | "short" = firstTrade.side === "buy" ? "long" : "short";

        return {
          id: firstTrade.id,
          event: firstTrade.event_name,
          option: firstTrade.option_label,
          side,
          entryPrice: `$${avgEntryPrice.toFixed(4)}`,
          exitPrice: `$${exitPrice.toFixed(4)}`,
          size: totalQty.toLocaleString(),
          pnl: `${totalPnl >= 0 ? "+" : "-"}$${Math.abs(totalPnl).toFixed(2)}`,
          pnlPercent: `(${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(1)}%)`,
          leverage: `${firstTrade.leverage}x`,
          settledAt: settledAt.split("T")[0], // Just the date part
          result: isWin ? "win" : "lose",
        };
      });
    },
    enabled: !!user,
  });
};
