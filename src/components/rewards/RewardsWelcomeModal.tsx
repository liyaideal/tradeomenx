import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MobileDrawer } from "@/components/ui/mobile-drawer";
import { Button } from "@/components/ui/button";
import { Star, Gift, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTreasureDrop } from "@/hooks/useTreasureDrop";
import { useUserProfile } from "@/hooks/useUserProfile";
import treasurePenguin from "@/assets/treasure-penguin.gif";

/**
 * Full-screen welcome modal shown on Home page for logged-in users
 * who haven't yet claimed their treasure drop.
 * Once claimed → this hides and the FloatingRewardsButton takes over.
 */
export const RewardsWelcomeModal = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useUserProfile();
  const { hasClaimed, isLoading } = useTreasureDrop();

  // Only show for logged-in users who haven't claimed treasure
  const shouldShow = !!user && !hasClaimed && !isLoading;

  const handleGoToRewards = () => {
    navigate("/rewards");
  };

  const content = (
    <div className="flex flex-col items-center text-center py-2">
      {/* Penguin illustration */}
      <div className="relative mb-4">
        <div className="absolute -inset-6 rounded-full bg-primary/15 blur-2xl animate-pulse" />
        <img
          src={treasurePenguin}
          alt="Rewards"
          className="w-36 h-36 md:w-44 md:h-44 object-contain relative z-10 drop-shadow-xl"
        />
      </div>

      {/* Headline */}
      <h2 className="text-xl font-bold text-foreground mb-1.5">
        🎁 Claim Your Free Trial Funds
      </h2>
      <p className="text-sm text-muted-foreground mb-5 max-w-[280px] leading-relaxed">
        Complete simple tasks to earn points, then convert them into trial funds to start trading — no deposit needed!
      </p>

      {/* Steps preview */}
      <div className="w-full space-y-2.5 mb-6">
        {[
          { step: "1", label: "Complete Tasks", desc: "Easy one-time missions", icon: "🎯" },
          { step: "2", label: "Earn Points", desc: "Instant point rewards", icon: "⭐" },
          { step: "3", label: "Get Trial Funds", desc: "Convert points to capital", icon: "💰" },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 text-lg">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={handleGoToRewards}
        className="w-full btn-primary text-base h-12 gap-2"
        size="lg"
      >
        <Gift className="w-5 h-5" />
        Go to Rewards Center
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  if (!shouldShow) return null;

  if (isMobile) {
    return (
      <MobileDrawer
        open={true}
        onOpenChange={() => {/* keep open, user must navigate */}}
        showHandle={true}
        hideCloseButton={false}
        className="bg-gradient-to-b from-background to-background/95"
      >
        {content}
      </MobileDrawer>
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md border-primary/30 bg-gradient-to-b from-background to-background/95"
        hideCloseButton
      >
        <DialogTitle className="sr-only">Welcome to Rewards</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};
