import { useCallback } from "react";

/**
 * DEPRECATED — Treasure drop is paused for mainnet launch.
 *
 * The 100-point random treasure drop has been disabled. This hook is kept
 * as a no-op shim so existing imports keep compiling, but it never triggers
 * the floating treasure button, never queries the backend, and never calls
 * the `claim-treasure` edge function (which itself returns 503).
 *
 * Re-enable by restoring the prior implementation from git history when the
 * mainnet rewards strategy is finalized.
 */
interface ClaimResult {
  success: boolean;
  pointsDropped: number;
  targetPoints: number;
  tier: string;
  newBalance: number;
}

export const useTreasureDrop = () => {
  const claimTreasure = useCallback(async (): Promise<ClaimResult> => {
    throw new Error("Treasure drop is paused for mainnet launch.");
  }, []);

  const hideTreasure = useCallback(() => {
    /* no-op */
  }, []);

  return {
    shouldShowTreasure: false,
    isEligible: false,
    hasClaimed: false,
    existingDrop: null,
    claimTreasure,
    isClaiming: false,
    claimError: null,
    hideTreasure,
    isLoading: false,
  };
};
