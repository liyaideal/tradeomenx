import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

// Available avatar seeds for DiceBear adventurer-neutral style
export const AVATAR_SEEDS = [
  "felix", "aneka", "sophia", "liam", "mia", "oliver", "emma", "noah",
  "ava", "elijah", "isabella", "james", "luna", "benjamin", "chloe",
  "lucas", "penelope", "henry", "layla", "alexander", "riley", "jackson",
  "zoey", "sebastian", "nora", "aiden", "lily", "owen", "ella", "william",
  "grace", "ethan", "aurora", "jacob", "scarlett", "michael", "camila",
  "harper", "mason", "evelyn", "logan", "abigail", "lucas", "emily", "jack",
  "madison", "levi", "elizabeth", "mateo", "sofia", "daniel", "avery", "leo",
  "mila", "asher", "aria", "carter", "charlotte", "wyatt", "amelia", "julian",
  "harper", "grayson", "ella", "ezra", "chloe", "luke", "layla", "henry",
  "madison", "jayden", "victoria", "gabriel", "scarlett", "isaac", "hannah"
];

// Background colors for avatars
export const AVATAR_BACKGROUNDS = [
  "b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"
];

export const generateAvatarUrl = (seed: string, bgIndex: number = 0) => {
  const bg = AVATAR_BACKGROUNDS[bgIndex % AVATAR_BACKGROUNDS.length];
  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}&backgroundColor=${bg}`;
};

export const getRandomAvatarUrl = () => {
  const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
  const randomBg = Math.floor(Math.random() * AVATAR_BACKGROUNDS.length);
  return generateAvatarUrl(randomSeed, randomBg);
};

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  trial_balance: number | null;
  created_at: string;
  updated_at: string;
}

const PROFILE_QUERY_KEY = ["user-profile"];

// Fetch profile from Supabase
const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data;
};

// Update profile in Supabase
const updateProfileInDb = async ({ 
  userId, 
  updates 
}: { 
  userId: string; 
  updates: Partial<Profile> 
}): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return data;
};

/**
 * useUserProfile - A unified hook for user profile data using React Query
 * This ensures profile data is synced across all components
 */
export const useUserProfile = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthLoading(false);
      
      // Invalidate profile query when auth changes
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      } else {
        queryClient.setQueryData(PROFILE_QUERY_KEY, null);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Query for profile data
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => user ? fetchProfile(user.id) : null,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => 
      updateProfileInDb({ userId: user!.id, updates }),
    onSuccess: (newProfile) => {
      // Update cache immediately
      queryClient.setQueryData(PROFILE_QUERY_KEY, newProfile);
    },
  });

  // Helper functions for specific updates
  const updateUsername = async (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return { 
        success: false, 
        error: "Username must be 3-20 characters, alphanumeric and underscores only" 
      };
    }
    try {
      await updateMutation.mutateAsync({ username });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    try {
      await updateMutation.mutateAsync({ avatar_url: avatarUrl });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email address" };
    }
    try {
      await updateMutation.mutateAsync({ email });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateBalance = async (newBalance: number) => {
    try {
      await updateMutation.mutateAsync({ trial_balance: newBalance });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deductBalance = async (amount: number) => {
    const currentBalance = profile?.trial_balance ?? 0;
    const newBalance = currentBalance - amount;
    if (newBalance < 0) return false;
    return updateBalance(newBalance);
  };

  const addBalance = async (amount: number) => {
    const currentBalance = profile?.trial_balance ?? 0;
    const newBalance = currentBalance + amount;
    return updateBalance(newBalance);
  };

  return {
    // Profile data
    profile,
    user,
    
    // Loading states
    isLoading: isAuthLoading || isProfileLoading,
    isUpdating: updateMutation.isPending,
    error,
    
    // Computed values for convenience
    balance: profile?.trial_balance ?? 0,
    username: profile?.username ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    email: profile?.email ?? null,
    
    // Update functions
    updateUsername,
    updateAvatar,
    updateEmail,
    updateBalance,
    deductBalance,
    addBalance,
    
    // Refetch
    refetchProfile: refetch,
  };
};

// Export query key for external invalidation if needed
export { PROFILE_QUERY_KEY };
