

## Typography & Design Audit: Deposit/Withdraw Components

After comparing the Style Guide specs against all 6 deposit/withdraw components, here are all the inconsistencies found:

### Issues Found

**1. BuyWithFiat.tsx**
- Amount input uses `text-lg font-mono` instead of spec `text-2xl font-mono`
- Fee breakdown uses `text-sm` instead of `text-xs` for inline quote rows
- "Powered by" footer uses `text-xs` instead of `text-[10px]`
- Checkout order summary uses `text-sm` — should be `text-sm` for review (OK), but lacks `font-mono` on some values

**2. SellToFiat.tsx**
- Amount input uses `text-lg font-mono` instead of `text-2xl font-mono`
- Fee breakdown uses `text-sm` instead of `text-xs` for inline rows
- "Powered by" footer uses `text-xs` instead of `text-[10px]`
- Result amount uses `text-2xl` instead of `text-3xl`

**3. WalletWithdraw.tsx**
- Amount input uses `text-xl` (mobile) / `text-lg` (desktop) instead of `text-2xl font-mono`
- CTA button uses `text-lg` on mobile instead of consistent `text-sm font-semibold`
- CTA button height is `h-14` on mobile — should be `h-12` to match other flows

**4. WalletDeposit.tsx**
- Address text uses `text-base` on mobile — should be `text-xs font-mono` per spec for wallet addresses
- Generally OK otherwise

**5. CrossChainDeposit.tsx & CrossChainWithdraw.tsx**
- Mostly correct, but the "Powered by" text size in user screenshots still appears mismatched — need to verify `text-[10px]` is applied consistently

### Plan

**Files to modify (5 files):**

1. **`src/components/deposit/BuyWithFiat.tsx`**
   - Amount input: `text-lg` → `text-2xl`
   - Fee rows: `text-sm` → `text-xs`
   - Powered by: `text-xs` → `text-[10px]`

2. **`src/components/withdraw/SellToFiat.tsx`**
   - Amount input: `text-lg` → `text-2xl`
   - Fee rows: `text-sm` → `text-xs`
   - Powered by: `text-xs` → `text-[10px]`
   - Result amount: `text-2xl` → `text-3xl`

3. **`src/components/withdraw/WalletWithdraw.tsx`**
   - Amount input: normalize to `text-2xl font-mono` (remove mobile/desktop split)
   - CTA button: `h-14 text-lg` → `h-12 text-sm font-semibold` on mobile
   - Summary "You'll Receive" value: `text-base` → `text-sm font-mono`

4. **`src/components/deposit/WalletDeposit.tsx`**
   - Address display: `text-base` on mobile → `text-sm` (or `text-xs font-mono` per strict spec)

5. **`src/components/deposit/CrossChainDeposit.tsx`** (minor)
   - Verify CTA button text includes `text-sm` class explicitly

All changes are purely class-name adjustments — no logic or layout changes.

