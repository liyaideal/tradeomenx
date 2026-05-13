import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useActivationState } from "@/hooks/useActivationState";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { OnboardingCard } from "@/components/home/feed/cards/OnboardingCard";
import { TrendingCard } from "@/components/home/feed/cards/TrendingCard";
import { WelcomeBackCard } from "@/components/home/feed/cards/WelcomeBackCard";

/**
 * Home feed — priority-sorted single-column stream.
 *
 * Step 1 scope: Onboarding + Welcome back + Trending only.
 * Real ordering hook (`useHomeFeed`) and the rest of the card types
 * land in step 2.
 */
export const HomeFeed = () => {
  const { user } = useAuth();
  const { state, isLoading: activationLoading } = useActivationState();
  const { events, isLoading: eventsLoading } = useActiveEvents();

  const isLoading = eventsLoading || (!!user && activationLoading);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Loading feed…
        </span>
      </div>
    );
  }

  // Sleeping heuristic placeholder: authed user with no in-progress onboarding
  // and no positions concept yet wired in step 1 — show welcome-back at top
  // only when activation state is the long-tail "S2_ACTIVATED" (everyone else
  // is either new or onboarding).
  const showWelcomeBack = !!user && state === "S2_ACTIVATED";

  const trendingIds = events.slice(0, 6).map((e) => e.id);

  return (
    <div className="space-y-2.5">
      {/* Onboarding renders only when authed + incomplete */}
      <OnboardingCard />

      {showWelcomeBack && <WelcomeBackCard />}

      {trendingIds.map((id) => (
        <TrendingCard key={id} eventId={id} />
      ))}
    </div>
  );
};
