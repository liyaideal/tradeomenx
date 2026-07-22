import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { parseSideLabels } from "@/lib/eventUtils";

export interface ResolvedEventOption {
  id: string;
  event_id: string;
  label: string;
  price: number;
  final_price: number | null;
  is_winner: boolean;
}

export interface ResolvedEvent {
  id: string;
  name: string;
  category: string;
  description: string | null;
  volume: string | null;
  is_resolved: boolean;
  settled_at: string | null;
  winning_option_id: string | null;
  options: ResolvedEventOption[];
  /** Single-market binary 别名（如体育队名）。其它事件为 undefined。 */
  sideLabels?: { yes: string; no: string };
  /** 4B: which product lines the event was live on ("spot" | "futures"). */
  productLines: string[];
  userParticipated: boolean;
  userPnl: number | null;
}

interface UseResolvedEventsOptions {
  category?: string;
  search?: string;
}

export const useResolvedEvents = (options: UseResolvedEventsOptions = {}) => {
  const { user } = useUserProfile();
  const { category = "all", search = "" } = options;

  return useQuery({
    queryKey: ["resolved-events", category, search, user?.id],
    queryFn: async (): Promise<ResolvedEvent[]> => {
      let query = supabase
        .from("events")
        .select(`
          *,
          event_options (*)
        `)
        .eq("is_resolved", true);

      if (category !== "all") {
        query = query.eq("category", category);
      }

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      query = query.order("settled_at", { ascending: false });

      const { data: events, error } = await query;

      if (error) {
        console.error("Error fetching resolved events:", error);
        throw error;
      }

      if (!events) return [];

      let userTrades: { event_name: string; pnl: number | null }[] = [];
      if (user) {
        const eventNames = events.map((e) => e.name);
        const { data: trades } = await supabase
          .from("trades")
          .select("event_name, pnl")
          .eq("user_id", user.id)
          .in("event_name", eventNames);

        userTrades = trades || [];
      }

      return events.map((event) => {
        const userEventTrades = userTrades.filter((t) => t.event_name === event.name);
        const userPnl = userEventTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

        return {
          id: event.id,
          name: event.name,
          category: event.category,
          description: event.description,
          volume: event.volume,
          is_resolved: event.is_resolved,
          settled_at: event.settled_at,
          winning_option_id: event.winning_option_id,
          options: (event.event_options || []).map((opt: any) => ({
            id: opt.id,
            event_id: opt.event_id,
            label: opt.label,
            price: opt.price,
            final_price: opt.final_price,
            is_winner: opt.is_winner,
          })),
          sideLabels: parseSideLabels((event as any).side_labels),
          productLines: Array.isArray((event as any).product_lines)
            ? ((event as any).product_lines as string[])
            : ["futures"],
          userParticipated: userEventTrades.length > 0,
          userPnl: userEventTrades.length > 0 ? userPnl : null,
        };
      });
    },
  });
};
