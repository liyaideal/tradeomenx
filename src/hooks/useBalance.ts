import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Fetch balance from profiles table
  const fetchBalance = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("trial_balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching balance:", error);
        return;
      }

      if (data?.trial_balance !== null && data?.trial_balance !== undefined) {
        setBalance(Number(data.trial_balance));
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update balance in database
  const updateBalance = useCallback(async (newBalance: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ trial_balance: newBalance })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating balance:", error);
        return false;
      }

      setBalance(newBalance);
      return true;
    } catch (error) {
      console.error("Error updating balance:", error);
      return false;
    }
  }, [user]);

  // Deduct from balance (for trades)
  const deductBalance = useCallback(async (amount: number) => {
    const newBalance = balance - amount;
    if (newBalance < 0) return false;
    return updateBalance(newBalance);
  }, [balance, updateBalance]);

  // Add to balance (for closing positions with profit)
  const addBalance = useCallback(async (amount: number) => {
    const newBalance = balance + amount;
    return updateBalance(newBalance);
  }, [balance, updateBalance]);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchBalance(currentUser.id);
      } else {
        setBalance(0);
        setIsLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchBalance(currentUser.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    user,
    updateBalance,
    deductBalance,
    addBalance,
    refetchBalance: () => user && fetchBalance(user.id),
  };
};
