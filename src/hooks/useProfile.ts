import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { success: false, error: "No user logged in" };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
      }

      // Refetch profile to get updated data
      await fetchProfile(user.id);
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Failed to update profile" };
    }
  }, [user, fetchProfile]);

  const updateUsername = useCallback(async (username: string) => {
    // Validate username: alphanumeric + underscore, 3-20 chars
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return { 
        success: false, 
        error: "Username must be 3-20 characters, alphanumeric and underscores only" 
      };
    }
    return updateProfile({ username });
  }, [updateProfile]);

  const updateAvatar = useCallback(async (avatarUrl: string) => {
    return updateProfile({ avatar_url: avatarUrl });
  }, [updateProfile]);

  const updateEmail = useCallback(async (email: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email address" };
    }
    return updateProfile({ email });
  }, [updateProfile]);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return {
    profile,
    user,
    isLoading,
    updateProfile,
    updateUsername,
    updateAvatar,
    updateEmail,
    refetchProfile: () => user && fetchProfile(user.id),
  };
};
