// ============================================================
// SurfaceContext — Pro / Lite dual surface control.
// - Authed users: reads / writes profiles.preferred_surface
// - Guests: persists to localStorage (DEMO-STATE: guest persistence is a
//   convenience so 未登录浏览 stays consistent across reloads; production
//   should key surface off the account only.)
// - Toggle is a pure display switch — same account, same balances, same
//   positions. Zero data migration on flip.
// - Consumers pattern: `const { surface, setSurface, toggleSurface } = useSurface();`
// ============================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

export type Surface = "lite" | "pro";

const GUEST_KEY = "omenx.surface";
const DEFAULT_SURFACE: Surface = "lite";

const readGuestSurface = (): Surface => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw === "pro" ? "pro" : "lite";
  } catch {
    return DEFAULT_SURFACE;
  }
};

const writeGuestSurface = (s: Surface) => {
  try {
    localStorage.setItem(GUEST_KEY, s);
  } catch {
    /* noop */
  }
};

interface SurfaceCtx {
  surface: Surface;
  setSurface: (s: Surface) => void;
  toggleSurface: () => void;
  isAuthed: boolean;
}

const Ctx = createContext<SurfaceCtx | null>(null);

export const SurfaceProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile, isLoading } = useUserProfile();
  const [surface, setSurfaceState] = useState<Surface>(() => readGuestSurface());
  const seededForUserRef = useRef<string | null>(null);

  // When the profile arrives (or user changes) sync from DB.
  useEffect(() => {
    if (isLoading) return;
    if (user && profile) {
      if (seededForUserRef.current === user.id) return;
      const dbSurface = (profile as { preferred_surface?: string }).preferred_surface;
      const next: Surface = dbSurface === "pro" ? "pro" : "lite";
      setSurfaceState(next);
      seededForUserRef.current = user.id;
    } else if (!user) {
      seededForUserRef.current = null;
      setSurfaceState(readGuestSurface());
    }
  }, [user, profile, isLoading]);

  const setSurface = useCallback(
    (next: Surface) => {
      setSurfaceState(next);
      if (user) {
        // Fire-and-forget; UI switches immediately.
        supabase
          .from("profiles")
          .update({ preferred_surface: next })
          .eq("user_id", user.id)
          .then(({ error }) => {
            if (error) console.warn("preferred_surface update failed:", error);
          });
      } else {
        writeGuestSurface(next);
      }
    },
    [user],
  );

  const toggleSurface = useCallback(() => {
    setSurface(surface === "lite" ? "pro" : "lite");
  }, [surface, setSurface]);

  const value = useMemo<SurfaceCtx>(
    () => ({ surface, setSurface, toggleSurface, isAuthed: !!user }),
    [surface, setSurface, toggleSurface, user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSurface = (): SurfaceCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe fallback (should never trigger; provider mounts at App root).
    return {
      surface: DEFAULT_SURFACE,
      setSurface: () => {},
      toggleSurface: () => {},
      isAuthed: false,
    };
  }
  return ctx;
};
