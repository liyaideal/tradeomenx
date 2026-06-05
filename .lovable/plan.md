## Goal

Two changes to `/vouchers`:

1. Vouchers must first be **claimed** before they can be redeemed. Once claimed, redemption window = **7 days**.
2. **Pending earnings** → **tiered claim-to-wallet** unlocks based on cumulative filled trading volume (4 tiers).

---

## 1) Voucher claim step (7-day redemption window)

### New status machine

```
granted → claimed → redeemed → settled
       ↘ expired (granted not claimed in time)
       ↘ expired (claimed not redeemed within 7 days)
```

- New voucher status: `granted` (default on issue). Existing `issued` becomes `claimed` (already-claimed legacy rows get backfilled to `claimed`).
- `granted` voucher shows a **Claim voucher** button on the card. No countdown on face value yet — just "Expires in Nd" against the original `expires_at` (the long grant validity, unchanged).
- On claim: edge function flips status to `claimed`, sets `claimed_at = now()`, and overrides `expires_at = claimed_at + 7 days`. From this point the existing 7-day countdown chip drives urgency. After 7 days without redeem → `expired`.
- Redeem flow only enabled for `claimed` vouchers (current "Available" list = claimed & not yet redeemed).

### Sections on `/vouchers`

- **To claim (N)** — `granted` vouchers. Card variant with `Claim voucher` CTA, grant-expiry chip.
- **Available (N)** — `claimed` vouchers (today's "Available"). Existing card, 7-day countdown drives urgency band.
- **Redeemed** / **Expired** — unchanged.

### DB / backend

- Migration: add `claimed_at timestamptz` to `position_vouchers`; allow new enum value `granted`; backfill rows where `status='issued' AND redeemed_at IS NULL` → keep as `claimed` (treat all existing as already claimed so nothing in production breaks).
- New edge function `claim-position-voucher` (POST `{ voucherId }`): validates ownership + `status='granted'` + not past grant expiry, sets `status='claimed'`, `claimed_at=now()`, `expires_at=claimed_at + interval '7 days'`. Idempotent.
- Existing `redeem-position-voucher` updated to require `status='claimed'` instead of `issued`.

### Frontend

- `usePositionVouchers`: split into `grantedVouchers` + `claimedVouchers` (rename `issuedVouchers` → `claimedVouchers`, keep alias). Add `claim(voucherId)` calling the new edge function.
- `VoucherCard`: new `state='granted'` variant with primary `Claim voucher` button + grant-expires chip. Existing claimed card unchanged besides label.
- `Vouchers.tsx`: render new **To claim** carousel/list above **Available**; default selection picks first `claimed` voucher.
- `/style-guide` Vouchers section: add Granted card + Granted carousel preset rail entries so all states are enumerated (per playground mandate).
- Copy dictionary updates: `Granted`, `Claim voucher`, `Claim window: 7 days`, `Expires in <Xd>`. Lock before merging.

---

## 2) Tiered volume → tiered claimable amount

Replace the single 50k gate with 4 cumulative volume tiers. Each tier unlocks a **maximum claimable amount** from the pending pool (cumulative cap, not per-tier batches).

### Proposed tiers (USDC filled volume → max cumulative claim)


| Tier | Volume reached | Max claimable to wallet |
| ---- | -------------- | ----------------------- |
| T1   | $1,000         | up to $5                |
| T2   | $15,000        | up to $10               |
| T3   | $50,000        | up to $20               |
| T4   | $150,000       | unlimited (full pool)   |


`claimableNow = min(pending, tierCap) − lifetimeCredited_withinTierWindow` — simpler: cap is on **lifetimeCredited + thisClaim** so a user with $40 already credited and at T1 can't claim again until they hit T2.

Effective formula:

```
unlockedCap   = tierCap(volume)          // ∞ at T4
claimable     = max(0, min(pending, unlockedCap − lifetimeCredited))
```

### UI changes (`VoucherEarningsCard`)

- Replace single progress bar with a **segmented tier rail**: 4 segments, current tier highlighted, next tier label + delta volume to reach it.
- Show **Claimable now**: `$X` (capped by current tier) above the button, and **Pending**: `$Y` headline unchanged.
- Button label: `Claim $X to wallet`, disabled when `claimable === 0`. Tooltip / helper text explains why (need more volume / nothing pending).
- Tier chips row below: `T1 $25 · T2 $100 · T3 $500 · T4 Unlimited` with current tier styled primary.

### Backend

- `useVoucherEarnings`: derive `currentTier`, `tierCap`, `nextTier`, `claimable`, `volumeToNextTier` from constants. No schema change needed (already track `pending_amount`, `lifetime_credited`, `volume`).
- `claim-voucher-earnings` edge function: enforce server-side `claimAmount = min(pending, tierCap − lifetime_credited)`; reject if `<= 0`. Return the amount actually credited.
- Constants centralised in `src/lib/voucherTiers.ts` so playground + hook + edge function reference same table (edge function duplicates the table as a TS constant).

### Playground

- `/style-guide` Vouchers section: add `VoucherEarningsCard` preset rail covering: `No pending / T1 partial / T1 capped / T2 unlocked / T3 unlocked / T4 unlimited` so every state is visible.

---

## Files touched (planned)

- DB migration: add `claimed_at`, enum value `granted`, backfill.
- `supabase/functions/claim-position-voucher/index.ts` (new).
- `supabase/functions/redeem-position-voucher/index.ts` (status guard).
- `supabase/functions/claim-voucher-earnings/index.ts` (tier cap).
- `src/lib/voucherTiers.ts` (new — shared tier table & helpers).
- `src/hooks/usePositionVouchers.ts` (granted vs claimed, `claim` action).
- `src/hooks/useVoucherEarnings.ts` (tier derivation, claimable amount).
- `src/components/vouchers/VoucherCard.tsx` (granted variant + CTA).
- `src/components/vouchers/VoucherEarningsCard.tsx` (tier rail + dynamic button).
- `src/pages/Vouchers.tsx` (To-claim section).
- `src/pages/StyleGuide/sections/VouchersSection.tsx` (granted preset + earnings tier presets).
- `docs/copy-dictionary.md` (Granted / Claim voucher / Tier labels).
- Memory: update `mem://features/voucher-earnings-pool` with tier table; add reference to claim step.

---

## Open questions (please confirm)

1. **Grant validity** before "To claim" expires — keep current `expires_at` (e.g. 30 days from issue), or shorter? Default I'll use **14 days**.
2. **Tier numbers** above are my proposal — happy with them, or want different volume thresholds / caps?
3. Should the claim button on a **granted** voucher live on the card itself (inline) or open a confirm dialog? Default: **inline button**, optimistic toast.