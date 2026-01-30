import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

/**
 * Hook to subscribe to real-time transaction updates.
 * Automatically refreshes the transactions query when changes occur.
 */
export const useRealtimeTransactions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const showStatusNotification = useCallback((
    type: string,
    status: string,
    amount: number
  ) => {
    const formattedAmount = Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const typeLabel = type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdrawal' : 'Transaction';

    switch (status) {
      case 'processing':
        toast.info(`${typeLabel} of $${formattedAmount} is processing...`, {
          icon: '⏳',
        });
        break;
      case 'completed':
        if (type === 'deposit') {
          toast.success(`Deposit of $${formattedAmount} confirmed!`, {
            icon: '💰',
          });
        } else if (type === 'withdraw') {
          toast.success(`Withdrawal of $${formattedAmount} completed!`, {
            icon: '✅',
          });
        }
        break;
      case 'failed':
        toast.error(`${typeLabel} of $${formattedAmount} failed`, {
          icon: '❌',
        });
        break;
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to changes on the transactions table for the current user
    const channel = supabase
      .channel(`transactions-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('[Realtime] Transaction change:', payload);

          // Invalidate queries to refresh the data
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });

          // Show notification for status updates
          if (payload.eventType === 'UPDATE' && payload.new) {
            const { type, status, amount } = payload.new as {
              type: string;
              status: string;
              amount: number;
            };
            
            // Only notify on meaningful status transitions
            const oldStatus = (payload.old as { status?: string })?.status;
            if (status !== oldStatus) {
              showStatusNotification(type, status, amount);
            }
          }

          // Show notification for new transactions
          if (payload.eventType === 'INSERT' && payload.new) {
            const { type, status, amount } = payload.new as {
              type: string;
              status: string;
              amount: number;
            };
            
            if (type === 'deposit' && status === 'pending') {
              const formattedAmount = Math.abs(amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              toast.info(`Deposit of $${formattedAmount} detected, awaiting confirmations...`, {
                icon: '🔍',
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
      });

    // Cleanup on unmount
    return () => {
      console.log('[Realtime] Unsubscribing from transactions channel');
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient, showStatusNotification]);
};
