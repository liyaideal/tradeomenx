import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

export type SettlementKind = "settled" | "closed";
export type SettlementProductLine = "futures" | "spot";

export interface SettlementListItem {
  id: string;
  event: string;
  option: string;
  side: "long" | "short";
  entryPrice: string;
  /** Rendered when kind==='settled' ($1/$0). For 'closed' intraday: real close price if available, else "—". */
  exitPrice: string;
  size: string;
  pnl: string;
  /** Numeric PnL for color / sort logic without re-parsing strings. */
  pnlValue: number;
  pnlPercent: string;
  leverage: string;
  settledAt: string;
  /** Legacy field kept for stats card (Win Rate) — DO NOT change semantics. */
  result: "win" | "lose";
  /** New 4B fields — drive display without touching the legacy Win Rate metric. */
  kind: SettlementKind;
  productLine: SettlementProductLine;
}

// Winner rule for the row-level "Settled" badge:
//   spot event is fully resolved AND the group's last close mark price is
//   pinned to $1 (win) or $0 (loss) by sim-settle-spot. Anything else — user
//   sold intraday, or event not yet resolved — is a closed intraday trade.
const SETTLE_EPS = 0.02; // absorbs tiny drift around 0/1 pins

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

      // Fetch is_resolved for referenced events so we can classify settled vs closed.
      const eventNames = Array.from(new Set(trades.map((t) => t.event_name)));
      const { data: eventRows } = await supabase
        .from("events")
        .select("name, is_resolved")
        .in("name", eventNames);
      const resolvedByName = new Map(
        (eventRows || []).map((e: any) => [e.name, Boolean(e.is_resolved)]),
      );

      // Group trades by event_name + option_label to aggregate
      const groupedTrades = trades.reduce((acc, trade) => {
        const key = `${trade.event_name}|${trade.option_label}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(trade);
        return acc;
      }, {} as Record<string, typeof trades>);

      return Object.entries(groupedTrades).map(([, groupTrades]) => {
        const firstTrade = groupTrades[0];

        // Aggregates
        const totalQty = groupTrades.reduce((sum, t) => sum + Number(t.quantity), 0);
        const totalCost = groupTrades.reduce((sum, t) => sum + Number(t.amount), 0);
        const avgEntryPrice = totalQty > 0 ? totalCost / totalQty : Number(firstTrade.price);
        const totalPnl = groupTrades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);
        const totalMargin = groupTrades.reduce((sum, t) => sum + Number(t.margin), 0);

        // Latest close (used to infer settlement pin).
        const latest = [...groupTrades].sort((a, b) => {
          const at = a.closed_at || a.updated_at;
          const bt = b.closed_at || b.updated_at;
          return bt.localeCompare(at);
        })[0];
        const closeMark = latest?.mark_price != null ? Number(latest.mark_price) : null;

        const productLine: SettlementProductLine =
          (firstTrade as any).product_line === "spot" ? "spot" : "futures";

        const eventResolved = resolvedByName.get(firstTrade.event_name) ?? false;
        const pinnedToBinary =
          closeMark != null &&
          (Math.abs(closeMark - 1) <= SETTLE_EPS || Math.abs(closeMark) <= SETTLE_EPS);
        const kind: SettlementKind = eventResolved && pinnedToBinary ? "settled" : "closed";

        // Result: win-rate metric MUST stay PnL>0 (locked by 4B spec).
        const isWin = totalPnl > 0;

        // Exit price display:
        //   settled  → $1.0000 / $0.0000 (pinned)
        //   closed   → real close mark if available, else placeholder "—"
        let exitDisplay = "—";
        if (kind === "settled") {
          exitDisplay = `$${(closeMark! >= 0.5 ? 1 : 0).toFixed(4)}`;
        } else if (closeMark != null) {
          exitDisplay = `$${closeMark.toFixed(4)}`;
        }

        const pnlPercent = totalMargin > 0 ? (totalPnl / totalMargin) * 100 : 0;

        const settledAt = groupTrades.reduce((latestAt, t) => {
          const date = t.closed_at || t.updated_at;
          return date > latestAt ? date : latestAt;
        }, groupTrades[0].closed_at || groupTrades[0].updated_at);

        const side: "long" | "short" = firstTrade.side === "buy" ? "long" : "short";

        return {
          id: firstTrade.id,
          event: firstTrade.event_name,
          option: firstTrade.option_label,
          side,
          entryPrice: `$${avgEntryPrice.toFixed(4)}`,
          exitPrice: exitDisplay,
          size: totalQty.toLocaleString(),
          pnl: `${totalPnl >= 0 ? "+" : "-"}$${Math.abs(totalPnl).toFixed(2)}`,
          pnlValue: totalPnl,
          pnlPercent: `(${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(1)}%)`,
          leverage: `${firstTrade.leverage}x`,
          settledAt: settledAt.split("T")[0],
          result: isWin ? "win" : "lose",
          kind,
          productLine,
        };
      });
    },
    enabled: !!user,
  });
};
