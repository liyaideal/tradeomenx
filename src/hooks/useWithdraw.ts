import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  WithdrawStatus, 
  WithdrawRecord, 
  WithdrawLimits,
  WithdrawFormData,
  getWithdrawFee,
  getWithdrawMinimum 
} from '@/types/withdraw';
import { useUserProfile } from './useUserProfile';

// Mock data for development - will be replaced with actual API calls
const MOCK_WITHDRAW_LIMITS: WithdrawLimits = {
  minAmount: 20,
  maxAmount: 10000,
  dailyLimit: 50000,
  dailyUsed: 0,
  dailyRemaining: 50000,
};

const MOCK_PENDING_WITHDRAWALS: WithdrawRecord[] = [];

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  const { user, balance } = useUserProfile();
  const [currentWithdrawal, setCurrentWithdrawal] = useState<WithdrawRecord | null>(null);

  // Fetch withdrawal limits
  const { data: limits = MOCK_WITHDRAW_LIMITS, isLoading: isLoadingLimits } = useQuery({
    queryKey: ['withdraw-limits', user?.id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return MOCK_WITHDRAW_LIMITS;
    },
    enabled: !!user,
  });

  // Fetch pending withdrawals
  const { data: pendingWithdrawals = [], isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: ['pending-withdrawals', user?.id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return MOCK_PENDING_WITHDRAWALS;
    },
    enabled: !!user,
  });

  // Fetch withdrawal history
  const { data: withdrawHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['withdraw-history', user?.id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [] as WithdrawRecord[];
    },
    enabled: !!user,
  });

  // Submit withdrawal request
  const submitWithdrawalMutation = useMutation({
    mutationFn: async (data: WithdrawFormData) => {
      // Validate amount
      const amount = parseFloat(data.amount);
      const fee = getWithdrawFee(data.token);
      const minAmount = getWithdrawMinimum(data.token);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }
      
      if (amount < minAmount) {
        throw new Error(`Minimum withdrawal is ${minAmount} ${data.token}`);
      }
      
      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      if (amount > limits.dailyRemaining) {
        throw new Error('Exceeds daily withdrawal limit');
      }

      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newWithdrawal: WithdrawRecord = {
        id: `wd-${Date.now()}`,
        amount,
        fee,
        netAmount: amount - fee,
        token: data.token,
        toAddress: data.toAddress,
        status: 'REQUESTED',
        createdAt: new Date().toISOString(),
      };

      return newWithdrawal;
    },
    onSuccess: (withdrawal) => {
      setCurrentWithdrawal(withdrawal);
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdraw-limits'] });
    },
  });

  // Cancel withdrawal request (only when status is REQUESTED)
  const cancelWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalId: string) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      setCurrentWithdrawal(null);
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdraw-limits'] });
    },
  });

  // Validate withdrawal form
  const validateWithdrawal = useCallback((data: WithdrawFormData): string | null => {
    const amount = parseFloat(data.amount);
    const fee = getWithdrawFee(data.token);
    const minAmount = getWithdrawMinimum(data.token);

    if (!data.amount || isNaN(amount) || amount <= 0) {
      return 'Please enter a valid amount';
    }

    if (amount < minAmount) {
      return `Minimum withdrawal is ${minAmount} ${data.token}`;
    }

    if (amount + fee > balance) {
      return 'Insufficient balance (including fee)';
    }

    if (amount > limits.maxAmount) {
      return `Maximum withdrawal is ${limits.maxAmount} ${data.token}`;
    }

    if (amount > limits.dailyRemaining) {
      return `Exceeds daily limit. Remaining: ${limits.dailyRemaining} ${data.token}`;
    }

    if (!data.toAddress) {
      return 'Please select a withdrawal address';
    }

    // Basic address validation
    if (!data.toAddress.startsWith('0x') || data.toAddress.length !== 42) {
      return 'Invalid wallet address';
    }

    return null;
  }, [balance, limits]);

  // Calculate net amount after fee
  const calculateNetAmount = useCallback((token: string, amount: string): number => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;
    const fee = getWithdrawFee(token);
    return Math.max(0, numAmount - fee);
  }, []);

  // Format time ago
  const formatTimeAgo = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }, []);

  return {
    // Data
    limits,
    pendingWithdrawals,
    withdrawHistory,
    currentWithdrawal,
    availableBalance: balance,
    
    // Loading states
    isLoadingLimits,
    isLoadingWithdrawals,
    isLoadingHistory,
    isSubmitting: submitWithdrawalMutation.isPending,
    isCancelling: cancelWithdrawalMutation.isPending,
    
    // Actions
    submitWithdrawal: submitWithdrawalMutation.mutateAsync,
    cancelWithdrawal: cancelWithdrawalMutation.mutateAsync,
    setCurrentWithdrawal,
    
    // Helpers
    validateWithdrawal,
    calculateNetAmount,
    formatTimeAgo,
    getWithdrawFee,
    getWithdrawMinimum,
  };
};
