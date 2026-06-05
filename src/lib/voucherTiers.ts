// Shared voucher-earnings tier definitions. Used by:
//   - useVoucherEarnings (UI hook)
//   - VoucherEarningsCard (UI)
//   - claim-voucher-earnings edge function (server-side copy must stay in sync)
//   - StyleGuide / Vouchers playground

export interface VoucherTier {
  id: 1 | 2 | 3 | 4;
  label: string;
  /** Cumulative filled-trade volume (USDC) required to unlock this tier. */
  volume: number;
  /** Max cumulative USDC that may have been claimed-to-wallet at this tier. `null` = unlimited. */
  maxClaim: number | null;
}

export const VOUCHER_TIERS: VoucherTier[] = [
  { id: 1, label: "T1", volume: 5_000, maxClaim: 25 },
  { id: 2, label: "T2", volume: 15_000, maxClaim: 100 },
  { id: 3, label: "T3", volume: 50_000, maxClaim: 500 },
  { id: 4, label: "T4", volume: 150_000, maxClaim: null },
];

export interface VoucherTierState {
  current: VoucherTier | null; // null = below T1
  next: VoucherTier | null;    // null = at T4
  volumeToNext: number;        // 0 once at T4
  unlockedCap: number;         // Infinity at T4
  claimable: number;           // amount user can claim right now
  lifetimeAtCap: boolean;      // already claimed up to the cap of current tier
}

export function deriveVoucherTierState(
  volume: number,
  pending: number,
  lifetimeCredited: number,
): VoucherTierState {
  let current: VoucherTier | null = null;
  let next: VoucherTier | null = VOUCHER_TIERS[0];
  for (const t of VOUCHER_TIERS) {
    if (volume >= t.volume) {
      current = t;
      const idx = VOUCHER_TIERS.indexOf(t);
      next = VOUCHER_TIERS[idx + 1] ?? null;
    }
  }
  const unlockedCap = current?.maxClaim == null
    ? (current ? Number.POSITIVE_INFINITY : 0)
    : current.maxClaim;
  const headroom = Math.max(0, unlockedCap - lifetimeCredited);
  const claimable = Math.max(0, Math.min(pending, headroom));
  const volumeToNext = next ? Math.max(0, next.volume - volume) : 0;
  const lifetimeAtCap = !!current && Number.isFinite(unlockedCap) && lifetimeCredited >= unlockedCap;
  return { current, next, volumeToNext, unlockedCap, claimable, lifetimeAtCap };
}

export const formatTierCap = (t: VoucherTier) =>
  t.maxClaim == null ? "Unlimited" : `$${t.maxClaim.toLocaleString()}`;
