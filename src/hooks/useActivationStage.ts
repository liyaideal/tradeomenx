import { useEffect, useRef } from "react";
import { useUserProfile } from "./useUserProfile";
import { useMainnetLaunchProgress } from "./useMainnetLaunchProgress";
import { useAirdropPositions } from "./useAirdropPositions";
import {
  ActivationStage,
  deriveActivationStage,
  ENGAGED_VOLUME_THRESHOLD,
  trackActivation,
} from "@/lib/activation";

export interface ActivationState {
  stage: ActivationStage;
  isLoading: boolean;
  hasDeposited: boolean;
  hasTraded: boolean;
  volume: number;
  tradeCount: number;
  volumeToEngaged: number;
}

/**
 * Single source of truth for "where is the user in the activation funnel".
 * UI components subscribe to this and react accordingly.
 */
export const useActivationStage = (): ActivationState => {
  const { user, balance, trialBalance, isLoading: profileLoading } = useUserProfile();
  const { volume, tradeCount, isLoading: progressLoading } = useMainnetLaunchProgress();
  const { airdrops, isLoading: airdropsLoading } = useAirdropPositions();

  const hasAirdrop = airdrops.some((a) => a.status === "pending" || a.status === "activated");

  const stage = deriveActivationStage({
    isAuthed: !!user,
    balance,
    trialBalance,
    hasAirdrop,
    tradeCount,
    volume,
  });

  // Fire stage_change event when stage transitions (client-side observer).
  const lastStageRef = useRef<ActivationStage | null>(null);
  useEffect(() => {
    if (profileLoading || progressLoading || airdropsLoading) return;
    if (lastStageRef.current && lastStageRef.current !== stage) {
      trackActivation("stage_change", { from: lastStageRef.current, to: stage });
    }
    lastStageRef.current = stage;
  }, [stage, profileLoading, progressLoading, airdropsLoading]);

  return {
    stage,
    isLoading: profileLoading || progressLoading || airdropsLoading,
    hasDeposited: balance > 0,
    hasTraded: tradeCount > 0,
    volume,
    tradeCount,
    volumeToEngaged: Math.max(0, ENGAGED_VOLUME_THRESHOLD - volume),
  };
};
