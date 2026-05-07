import { usePoints } from "@/hooks/usePoints";
import { useUserProfile } from "@/hooks/useUserProfile";
import { showRewardsPausedToast } from "@/lib/rewardsPause";
import bonusBadge from "@/assets/bonus-badge.gif";

interface FloatingRewardsButtonProps {
  className?: string;
}

/**
 * Permanent right-bottom entry point — paused for mainnet launch.
 * Click triggers a toast announcement instead of navigating to /rewards.
 * Claimable badge is hidden because Beta points no longer accrue.
 */
export const FloatingRewardsButton = ({ className = "" }: FloatingRewardsButtonProps) => {
  const { user } = useUserProfile();
  const { pointsBalance } = usePoints();

  if (!user) return null;

  return (
    <button
      onClick={showRewardsPausedToast}
      className={`fixed z-50 group ${className}`}
      aria-label="Beta points paused"
    >
      <div className="relative w-20 h-20 transition-all duration-300 group-hover:scale-110 group-active:scale-95">
        <img
          src={bonusBadge}
          alt="Bonus"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      <div
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap"
      >
        <p className="text-xs text-muted-foreground">Points Balance</p>
        <p className="font-bold text-primary font-mono">{pointsBalance.toLocaleString()}</p>
      </div>
    </button>
  );
};
