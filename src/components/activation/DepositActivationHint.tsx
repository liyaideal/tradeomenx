import { Sparkles } from "lucide-react";
import { useActivationState } from "@/hooks/useActivationState";
import { Countdown } from "@/components/mainnet-launch/Countdown";

/**
 * Thin success bar shown above the Deposit page tabs for S0 users only.
 * Frames the deposit as the entry point to the launch campaign.
 */
export const DepositActivationHint = () => {
  const { state, isLoading } = useActivationState();
  if (isLoading || state !== "S0_NEW") return null;

  return (
    <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-trading-green/30 bg-trading-green/[0.06] px-3 py-2 text-xs">
      <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-trading-green" />
      <span className="flex-1 text-foreground">
        Your first deposit unlocks the launch campaign — rebates kick in at $5,000 trading volume.
      </span>
    </div>
  );
};
