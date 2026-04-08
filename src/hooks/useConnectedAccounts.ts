import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "./useUserProfile";

export interface ConnectedAccount {
  id: string;
  platform: string;
  walletAddress: string;
  displayAddress: string;
  status: string;
  verifiedAt: string | null;
  createdAt: string;
}

const QUERY_KEY = ["connected-accounts"];

export const useConnectedAccounts = () => {
  const queryClient = useQueryClient();
  const { user } = useUserProfile();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("connected_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching connected accounts:", error);
        return [];
      }

      return (data as any[]).map((row): ConnectedAccount => ({
        id: row.id,
        platform: row.platform,
        walletAddress: row.wallet_address,
        displayAddress: row.display_address,
        status: row.status,
        verifiedAt: row.verified_at,
        createdAt: row.created_at,
      }));
    },
    enabled: !!user,
  });

  const verifyAndConnectMutation = useMutation({
    mutationFn: async (payload: {
      walletAddress: string;
      signature: string;
      message: { platform: string; account: string; timestamp: string; nonce: string };
      platform: string;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "verify-wallet-signature",
        { body: payload }
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from("connected_accounts")
        .update({ status: "disconnected", disconnected_at: new Date().toISOString() } as any)
        .eq("id", accountId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    accounts,
    isLoading,
    activeAccounts: accounts.filter((a) => a.status === "active"),
    verifyAndConnect: verifyAndConnectMutation.mutateAsync,
    isVerifying: verifyAndConnectMutation.isPending,
    disconnect: disconnectMutation.mutateAsync,
    isDisconnecting: disconnectMutation.isPending,
  };
};
