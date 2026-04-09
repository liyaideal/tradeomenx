import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "./useUserProfile";
import { useConnectedAccounts } from "./useConnectedAccounts";

export interface AirdropPosition {
  id: string;
  externalEventName: string;
  externalSide: string;
  externalPrice: number;
  counterEventName: string;
  counterOptionLabel: string;
  counterSide: string;
  counterPrice: number;
  airdropValue: number;
  status: string;
  expiresAt: string;
  activatedAt: string | null;
  createdAt: string;
}

const QUERY_KEY = ["airdrop-positions"];

// Mock airdrop data for frontend development
// 3 positions detected, 2 airdrops received (pending + activated)
const MOCK_AIRDROPS: AirdropPosition[] = [
  {
    id: "mock-airdrop-1",
    externalEventName: "Will Bitcoin reach $120k by March 2026?",
    externalSide: "Yes",
    externalPrice: 0.62,
    counterEventName: "BTC End of Q1 2026 Price",
    counterOptionLabel: "Below $120,000",
    counterSide: "short",
    counterPrice: 0.38,
    airdropValue: 10,
    status: "pending",
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    activatedAt: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-airdrop-2",
    externalEventName: "Fed rate cut in June 2026?",
    externalSide: "Yes",
    externalPrice: 0.45,
    counterEventName: "Fed Interest Rate Decision June 2026",
    counterOptionLabel: "Hold Steady",
    counterSide: "long",
    counterPrice: 0.55,
    airdropValue: 10,
    status: "activated",
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    activatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-airdrop-3",
    externalEventName: "ETH above $5,000 by April 2026?",
    externalSide: "No",
    externalPrice: 0.72,
    counterEventName: "ETH Price Prediction April 2026",
    counterOptionLabel: "Above $5,000",
    counterSide: "long",
    counterPrice: 0.28,
    airdropValue: 10,
    status: "expired",
    expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    activatedAt: null,
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
  },
];

export const useAirdropPositions = () => {
  const { user } = useUserProfile();
  const { activeAccounts, isDemoMode } = useConnectedAccounts();

  const { data: airdrops = [], isLoading } = useQuery({
    queryKey: [...QUERY_KEY, activeAccounts.length],
    queryFn: async () => {
      // Demo mode: only show mock airdrops if there are active connected accounts
      if (isDemoMode) {
        return activeAccounts.length > 0 ? MOCK_AIRDROPS : [];
      }

      if (!user) return [];

      // Try real data first
      const { data, error } = await supabase
        .from("airdrop_positions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching airdrop positions:", error);
        return [];
      }

      if (data && data.length > 0) {
        return (data as any[]).map((row): AirdropPosition => ({
          id: row.id,
          externalEventName: row.external_event_name,
          externalSide: row.external_side,
          externalPrice: Number(row.external_price),
          counterEventName: row.counter_event_name,
          counterOptionLabel: row.counter_option_label,
          counterSide: row.counter_side,
          counterPrice: Number(row.counter_price),
          airdropValue: Number(row.airdrop_value),
          status: row.status,
          expiresAt: row.expires_at,
          activatedAt: row.activated_at,
          createdAt: row.created_at,
        }));
      }

      return [];
    },
    enabled: isDemoMode || !!user,
  });

  const pendingAirdrops = airdrops.filter((a) => a.status === "pending");
  const activatedAirdrops = airdrops.filter((a) => a.status === "activated");
  const expiredAirdrops = airdrops.filter((a) => a.status === "expired");

  return {
    airdrops,
    pendingAirdrops,
    activatedAirdrops,
    expiredAirdrops,
    isLoading,
  };
};
