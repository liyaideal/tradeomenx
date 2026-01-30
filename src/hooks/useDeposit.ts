import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserProfile } from './useUserProfile';
import { 
  DepositRecord, 
  SupportedToken, 
  SUPPORTED_TOKENS,
  CONFIRMATION_BLOCKS,
  getCustodyAddress,
  getTokenConfig,
} from '@/types/deposit';

// Mock data for development - will be replaced with chain-service API calls
const MOCK_PENDING_CLAIMS: DepositRecord[] = [
  {
    id: 'dep-1',
    txHash: '0xabc123def456789...abc123',
    amount: 5.5,
    token: 'USDT',
    status: 'PENDING_CLAIM',
    confirmations: 15,
    requiredConfirmations: 15,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
  },
  {
    id: 'dep-2',
    txHash: '0xdef789abc123456...def789',
    amount: 8.25,
    token: 'USDC',
    status: 'PENDING_CLAIM',
    confirmations: 15,
    requiredConfirmations: 15,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
  },
];

export const useDeposit = () => {
  const queryClient = useQueryClient();
  const { user } = useUserProfile();
  const [selectedToken, setSelectedToken] = useState<SupportedToken>('USDT');

  // Fetch pending claims (deposits < min amount that need signature)
  const { 
    data: pendingClaims = [], 
    isLoading: isLoadingClaims,
    refetch: refetchClaims,
  } = useQuery({
    queryKey: ['pending-claims', user?.id],
    queryFn: async () => {
      // TODO: Replace with actual chain-service API call
      // const response = await fetch(`/api/deposits/pending-claims?userId=${user?.id}`);
      // return response.json();
      
      // Mock: Return pending claims for development
      return MOCK_PENDING_CLAIMS;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent deposits (for status tracking)
  const {
    data: recentDeposits = [],
    isLoading: isLoadingDeposits,
  } = useQuery({
    queryKey: ['recent-deposits', user?.id],
    queryFn: async () => {
      // TODO: Replace with actual chain-service API call
      // Mock: Return empty for now
      return [] as DepositRecord[];
    },
    enabled: !!user,
    refetchInterval: 10000, // Refresh every 10 seconds for status updates
  });

  // Claim a pending deposit (for amounts < min threshold)
  const claimMutation = useMutation({
    mutationFn: async ({ depositId, signature }: { depositId: string; signature: string }) => {
      // TODO: Replace with actual chain-service API call
      // const response = await fetch('/api/deposits/claim', {
      //   method: 'POST',
      //   body: JSON.stringify({ depositId, signature }),
      // });
      // return response.json();
      
      // Mock: Simulate claim process
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, depositId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-claims'] });
      queryClient.invalidateQueries({ queryKey: ['recent-deposits'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  // Get custody address for selected token
  const getCustodyAddressForToken = useCallback((token: SupportedToken) => {
    return getCustodyAddress(token);
  }, []);

  // Get token config helper
  const getTokenConfigForToken = useCallback((token: SupportedToken) => {
    return getTokenConfig(token);
  }, []);

  // Format time ago
  const formatTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }, []);

  return {
    // Config
    supportedTokens: SUPPORTED_TOKENS,
    getCustodyAddress: getCustodyAddressForToken,
    selectedToken,
    setSelectedToken,
    getTokenConfig: getTokenConfigForToken,
    
    // Data
    pendingClaims,
    recentDeposits,
    
    // Loading states
    isLoadingClaims,
    isLoadingDeposits,
    isClaiming: claimMutation.isPending,
    
    // Actions
    claimDeposit: claimMutation.mutateAsync,
    refetchClaims,
    
    // Helpers
    formatTimeAgo,
    confirmationBlocks: CONFIRMATION_BLOCKS,
  };
};
