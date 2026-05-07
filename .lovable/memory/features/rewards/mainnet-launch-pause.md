---
name: Rewards mainnet launch pause
description: All Beta points entry points are paused before mainnet. Toast on entries, non-dismissible dialog on /rewards, 503 from claim-task/claim-treasure/redeem-points.
type: feature
---

# Rewards mainnet launch pause

Beta points stop accruing before mainnet launch. Existing balances will be converted at a set ratio to mainnet points.

## Frontend

- **Unified copy** lives in `src/lib/rewardsPause.ts` (`REWARDS_PAUSED_TITLE`, `REWARDS_PAUSED_DESCRIPTION`, `showRewardsPausedToast()`). All entry points must use these — never re-write the wording.
- **Entry points → toast (no navigation):**
  - `FloatingRewardsButton` (mobile home, gold bonus badge) — also hides the claimable count badge
  - `EventsDesktopHeader` user dropdown → Rewards / Referral
  - `BottomNav` profile drawer → Rewards / Referral
- **`RewardsWelcomeModal`**: hard-disabled (`return null` at top). New users are not pushed into the rewards flow.
- **`/rewards` page**: page contents are intentionally untouched (so historical UI/data still renders read-only); a non-dismissible Dialog is overlayed:
  - `[&>button]:hidden` removes the X
  - `onEscapeKeyDown` / `onPointerDownOutside` / `onInteractOutside` all `preventDefault`
  - No CTAs in the dialog body — purely informational

## Backend (defense in depth)

All three points-issuing edge functions return their pause status without touching tables:
- `claim-task` → 503 (added at top of try block)
- `claim-treasure` → 503
- `redeem-points` → 403

## Do NOT

- Do not delete `points_accounts` / `points_ledger` / `user_tasks` rows — they are the source of truth for the mainnet conversion.
- Do not remove the rewards components/pages — only their entry behavior is paused.
- Do not change `MainnetLaunch` campaign rewards (RewardSnapshot / RewardLadder) — that is the campaign's own incentive system, unrelated to Beta points.
