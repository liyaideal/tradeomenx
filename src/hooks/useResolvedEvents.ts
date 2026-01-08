import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

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
  icon: string;
  category: string;
  description: string | null;
  volume: string | null;
  is_resolved: boolean;
  settled_at: string | null;
  winning_option_id: string | null;
  options: ResolvedEventOption[];
  // User participation data (calculated from trades)
  userParticipated: boolean;
  userPnl: number | null;
}

interface UseResolvedEventsOptions {
  timeRange?: "all" | "month" | "quarter" | "year";
  category?: string;
  search?: string;
  sortBy?: "settlement" | "volume" | "name";
}

export const useResolvedEvents = (options: UseResolvedEventsOptions = {}) => {
  const { user } = useUserProfile();
  const { timeRange = "all", category = "all", search = "", sortBy = "settlement" } = options;

  return useQuery({
    queryKey: ["resolved-events", timeRange, category, search, sortBy, user?.id],
    queryFn: async (): Promise<ResolvedEvent[]> => {
      // Fetch resolved events
      let query = supabase
        .from("events")
        .select(`
          *,
          event_options (*)
        `)
        .eq("is_resolved", true);

      // Apply time range filter
      if (timeRange !== "all") {
        const now = new Date();
        let startDate: Date;
        
        switch (timeRange) {
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "quarter":
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte("settled_at", startDate.toISOString());
      }

      // Apply category filter
      if (category !== "all") {
        query = query.eq("category", category);
      }

      // Apply search filter
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case "settlement":
          query = query.order("settled_at", { ascending: false });
          break;
        case "volume":
          query = query.order("volume", { ascending: false });
          break;
        case "name":
          query = query.order("name", { ascending: true });
          break;
      }

      const { data: events, error } = await query;

      if (error) {
        console.error("Error fetching resolved events:", error);
        throw error;
      }

      if (!events) return [];

      // Fetch user's trades for these events if user is logged in
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

      // Transform data
      return events.map((event) => {
        const userEventTrades = userTrades.filter((t) => t.event_name === event.name);
        const userPnl = userEventTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        return {
          id: event.id,
          name: event.name,
          icon: event.icon,
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
          userParticipated: userEventTrades.length > 0,
          userPnl: userEventTrades.length > 0 ? userPnl : null,
        };
      });
    },
  });
};
