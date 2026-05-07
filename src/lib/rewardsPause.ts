import { toast } from "sonner";

/**
 * Mainnet launch — Beta points are paused.
 * All rewards/referral entry points should call `showRewardsPausedToast()`
 * instead of navigating to /rewards. The /rewards page itself is gated
 * behind a non-dismissible announcement dialog.
 */
export const REWARDS_PAUSED_TITLE = "Mainnet launching soon";
export const REWARDS_PAUSED_DESCRIPTION =
  "Beta points are no longer accruing. Your existing Beta points will be converted to mainnet points at a set ratio. Stay tuned.";

export const showRewardsPausedToast = () => {
  toast(REWARDS_PAUSED_TITLE, {
    description: REWARDS_PAUSED_DESCRIPTION,
    duration: 6000,
  });
};
