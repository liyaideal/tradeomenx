Make the **Close** button on voucher-redeemed positions actually work end-to-end with correct, voucher-aware UX and copy.

## Current state

- The Close button on `/trade` voucher rows already renders `ClosePositionDialog` and wires through `partialClosePosition` → `closeAirdropPosition` → edge function `close-trial-position`. The backend correctly settles the position and credits the **voucher earnings pool** (not trial balance).
- But the surface UX is broken / misleading:
  1. The generic close dialog shows a partial-close slider and a naive `(mark − entry) × size` PnL preview — voucher positions are full-close-only, the PnL is **capped at `redeemable_cap`**, losses are floored at 0 credit, and the credit goes to the **voucher earnings pool**, not the wallet.
  2. The success toast says `"+$X credited to trial balance"` — wrong destination. Per the Voucher Earnings memory rule, it must say voucher earnings pool.
  3. After close, the Voucher Earnings pool card on `/vouchers` doesn't update because the close hook never invalidates the `voucher-earnings` query.

## Changes

### 1. Dedicated voucher close confirm dialog
New file: `src/components/positions/CloseVoucherDialog.tsx`

A small Dialog (no Slider, no partial-close, no quick-ratio buttons) that:
- Shows event + market label, side badge, contracts, entry/mark prices, leverage.
- Computes preview using the same canonical math as the edge function:
  - `contracts = faceValue × 5 / entry`
  - `rawPnl = (mark − entry) × contracts × sideSign`
  - `credit = clamp(rawPnl, 0, cap)` where `cap = redeemableCap ?? faceValue × 0.5`
- Renders three rows: **Raw PnL** (can be negative), **Profit cap**, **Credited to voucher earnings pool** (clamped value, green when > 0).
- Footer: a sentence — "Profits accrue to your voucher earnings pool. Claim to wallet once you hit the 50,000 USDC volume gate."
- Buttons: Cancel (Outline) + **Close position** (destructive `h-11` shadcn Button), `isClosing` spinner.

### 2. Use the voucher dialog on /trade
File: `src/pages/DesktopTrading.tsx` (~line 1343-1368)
- Branch: if `position.airdropSource === "voucher"`, render `CloseVoucherDialog` instead of `ClosePositionDialog`. Pass `faceValue`, `entry`, `mark`, `side`, `redeemableCap` and `onConfirm={() => closePosition(position.id, index)}` (full close, no qty).
- Other rows keep `ClosePositionDialog` unchanged.

`closePosition` (full close) is already exported from `usePositions`; voucher branch already routes correctly through it.

### 3. Mobile parity
File: `src/components/PositionCard.tsx` (~line 309-345)
- The voucher branch currently falls into the same `Edit TPSL / Close` buttons block as normal positions. Change the voucher branch to:
  - Hide TP/SL button.
  - Render only a single full-width destructive "Close position" button that opens a new `CloseVoucherDrawer` (mirror of the dialog using `MobileDrawer` per the mobile-drawer-content-spec memory).
- New file: `src/components/positions/CloseVoucherDrawer.tsx` — same content as the dialog, wrapped in `MobileDrawer` with `MobileDrawerActions`.

### 4. Voucher-correct toast + cache invalidation
File: `src/hooks/useAirdropPositions.ts` (`closePosition`, ~line 332 demo branch and ~line 348-353 prod branch)
- Branch on the position's `source`. For voucher:
  - Toast title: `"Voucher position closed"`.
  - Toast description: `credited > 0 ? "+$X.XX credited to voucher earnings pool" : "No profit credited (loss floored to 0)"`.
  - After invalidating `QUERY_KEY` and `user-profile`, also invalidate `['voucher-earnings']` and `['voucher-earnings-ledger']` so `/vouchers` updates immediately.
- For matched / welcome_gift: keep existing trial-balance copy.

### 5. Backend sanity check (read-only)
The edge function `close-trial-position` already credits `voucher_earnings.pending_amount` and writes a `voucher_earnings_ledger` row. No backend changes.

## Out of scope

- No changes to the close logic for matched / welcome_gift airdrops.
- No changes to the partial-close flow on normal positions.
- No new database migrations.
- No changes to the 50k USDC claim gate or the claim flow.
