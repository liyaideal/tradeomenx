import { useUserProfile } from "./useUserProfile";
import { useAirdropPositions } from "./useAirdropPositions";

const H2E_EARNINGS_CAP = 100;
const H2E_VOLUME_UNLOCK = 400000;

export interface H2eRewardsSummary {
  /** Frozen balance from H2E settlements (available for trading, locked for withdrawal) */
  frozenBalance: number;
  /** Total volume completed toward unlock */
  volumeCompleted: number;
  /** Whether the frozen balance has been unlocked for withdrawal */
  isUnlocked: boolean;
  /** Lifetime H2E earnings */
  totalEarned: number;
  /** Max earnings cap */
  earningsCap: number;
  /** Volume required to unlock */
  volumeRequired: number;
  /** Percentage of volume completed */
  volumePercent: number;
  /** Percentage of earnings cap used */
  earningsPercent: number;
  /** Settlement history from settled airdrops */
  settlements: Array<{
    id: string;
    eventName: string;
    pnl: number;
    trigger: string;
    settledAt: string;
  }>;
}

export const useH2eRewardsSummary = (): H2eRewardsSummary => {
  const { user } = useUserProfile();
  const { settledAirdrops } = useAirdropPositions();

  // In demo mode, compute from settled airdrops
  const totalEarned = settledAirdrops.reduce((sum, a) => {
    const pnl = a.settledPnl ?? 0;
    return sum + (pnl > 0 ? pnl : 0);
  }, 0);

  // Demo: frozen = total earned (not yet unlocked)
  const frozenBalance = Math.min(totalEarned, H2E_EARNINGS_CAP);

  // Demo: mock volume progress
  const volumeCompleted = 2450;
  const isUnlocked = volumeCompleted >= H2E_VOLUME_UNLOCK;

  const settlements = settledAirdrops
    .filter((a) => a.settledAt)
    .map((a) => ({
      id: a.id,
      eventName: a.counterEventName,
      pnl: a.settledPnl ?? 0,
      trigger: a.settlementTrigger === "event_resolved" ? "Event Resolved" : "Source Closed",
      settledAt: a.settledAt!,
    }));

  return {
    frozenBalance,
    volumeCompleted,
    isUnlocked,
    totalEarned,
    earningsCap: H2E_EARNINGS_CAP,
    volumeRequired: H2E_VOLUME_UNLOCK,
    volumePercent: Math.min((volumeCompleted / H2E_VOLUME_UNLOCK) * 100, 100),
    earningsPercent: Math.min((totalEarned / H2E_EARNINGS_CAP) * 100, 100),
    settlements,
  };
};
