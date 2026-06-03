### Root cause

Voucher-redeemed airdrop positions live in the real Supabase `airdrop_positions` table (even for demo users — `fetchVoucherAirdropsFromSupabase` always reads from Supabase). But the close handler in `src/hooks/useAirdropPositions.ts` `closePosition` checks `isDemoMode` first and, when true, only updates **localStorage + React Query cache** with `status='settled'` — it never touches Supabase or calls the `close-trial-position` edge function.

So on refresh:
1. localStorage says settled, but the cache is rebuilt from scratch.
2. `fetchVoucherAirdropsFromSupabase` re-reads the row from Supabase where `status` is still `'activated'`.
3. The position reappears in `/portfolio` Airdrops and in `/trade` Positions.

This also means the voucher earnings pool never gets credited, even though the UI toast claims it did.

### Fix

In `src/hooks/useAirdropPositions.ts`, split the demo branch so **voucher source always goes through the real edge function**, and only `matched` / `welcome_gift` demos use the localStorage simulation:

```ts
const closePosition = async (id: string) => {
  const target = airdrops.find((a) => a.id === id);
  const isVoucherClose = target?.source === 'voucher';

  // Vouchers always persist to Supabase, even in demo mode
  if (isDemoMode && !isVoucherClose) {
    // ...existing demo localStorage branch for matched / welcome_gift...
    return;
  }

  // Voucher (demo or real) + real matched/welcome_gift → edge function
  const { data, error } = await supabase.functions.invoke('close-trial-position', { ... });
  // ...existing real branch with toast + invalidations...
};
```

No other files need changes. Backend (`close-trial-position`) already settles the row, caps PnL, and credits `voucher_earnings.pending_amount` correctly.

### Out of scope
- No changes to matched/welcome_gift demo behavior.
- No schema or backend changes.
- No UI changes to the Close dialog.