import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "./useUserProfile";

export interface Wallet {
  id: string;
  address: string;
  fullAddress: string;
  network: string;
  walletType: string;
  icon: string;
  isPrimary: boolean;
  connectedAt: string;
}

interface DbWallet {
  id: string;
  user_id: string;
  address: string;
  full_address: string;
  network: string;
  wallet_type: string;
  icon: string;
  is_primary: boolean;
  connected_at: string;
  created_at: string;
  updated_at: string;
}

const WALLETS_QUERY_KEY = ["user-wallets"];

// Transform DB wallet to frontend wallet
const transformWallet = (dbWallet: DbWallet): Wallet => ({
  id: dbWallet.id,
  address: dbWallet.address,
  fullAddress: dbWallet.full_address,
  network: dbWallet.network,
  walletType: dbWallet.wallet_type,
  icon: dbWallet.icon,
  isPrimary: dbWallet.is_primary,
  connectedAt: dbWallet.connected_at.split('T')[0],
});

export const useWallets = () => {
  const queryClient = useQueryClient();
  const { user } = useUserProfile();

  // Fetch wallets
  const { data: wallets = [], isLoading, refetch } = useQuery({
    queryKey: WALLETS_QUERY_KEY,
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .order("connected_at", { ascending: false });

      if (error) {
        console.error("Error fetching wallets:", error);
        return [];
      }

      return (data as DbWallet[]).map(transformWallet);
    },
    enabled: !!user,
  });

  // Add wallet mutation
  const addWalletMutation = useMutation({
    mutationFn: async (walletData: {
      address: string;
      fullAddress: string;
      network: string;
      walletType: string;
      icon: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // If this is the first wallet, make it primary
      const isPrimary = wallets.length === 0;

      // If making this wallet primary, unset other primary wallets first
      if (isPrimary) {
        await supabase
          .from("wallets")
          .update({ is_primary: false })
          .eq("user_id", user.id);
      }

      const { data, error } = await supabase
        .from("wallets")
        .insert({
          user_id: user.id,
          address: walletData.address,
          full_address: walletData.fullAddress,
          network: walletData.network,
          wallet_type: walletData.walletType,
          icon: walletData.icon,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
    },
  });

  // Remove wallet mutation
  const removeWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("wallets")
        .delete()
        .eq("id", walletId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
    },
  });

  // Set primary wallet mutation
  const setPrimaryWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      if (!user) throw new Error("User not authenticated");

      // First, unset all primary wallets
      await supabase
        .from("wallets")
        .update({ is_primary: false })
        .eq("user_id", user.id);

      // Then set the selected wallet as primary
      const { error } = await supabase
        .from("wallets")
        .update({ is_primary: true })
        .eq("id", walletId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
    },
  });

  // Helper functions
  const addWallet = async (walletData: {
    address: string;
    fullAddress: string;
    network: string;
    walletType: string;
    icon: string;
  }) => {
    try {
      await addWalletMutation.mutateAsync(walletData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const removeWallet = async (walletId: string) => {
    try {
      await removeWalletMutation.mutateAsync(walletId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const setPrimaryWallet = async (walletId: string) => {
    try {
      await setPrimaryWalletMutation.mutateAsync(walletId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    wallets,
    isLoading,
    isUpdating: addWalletMutation.isPending || removeWalletMutation.isPending || setPrimaryWalletMutation.isPending,
    addWallet,
    removeWallet,
    setPrimaryWallet,
    refetch,
  };
};
