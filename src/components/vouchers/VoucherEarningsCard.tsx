import { Coins, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useVoucherEarnings } from "@/hooks/useVoucherEarnings";

const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const VoucherEarningsCard = () => {
  const {
    pending,
    lifetimeCredited,
    volume,
    required,
    progressPct,
    volumeMet,
    canClaim,
    claiming,
    loading,
    claim,
  } = useVoucherEarnings();

  const remaining = Math.max(0, required - volume);

  return (
    <section className="rounded-xl border border-border bg-gradient-to-br from-trading-green/5 via-card/40 to-card/40 p-4 md:p-5">
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 md:items-stretch">
        {/* Pending balance */}
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Coins className="w-3.5 h-3.5" />
            Pending earnings
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl md:text-5xl font-semibold text-trading-green leading-none">
              ${loading ? "—" : fmt(pending)}
            </span>
            <span className="text-xs text-muted-foreground">USDC</span>
          </div>
          <div className="mt-3 text-[11px] md:text-xs text-muted-foreground max-w-md">
            Profits from voucher positions accrue here. Hit the trading volume target to claim them to your available balance.
          </div>
          {lifetimeCredited > 0 && (
            <div className="mt-auto pt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="uppercase tracking-wider">Lifetime claimed</span>
              <span className="font-mono text-foreground">${fmt(lifetimeCredited)}</span>
            </div>
          )}
        </div>

        {/* Volume progress + claim */}
        <div className="rounded-lg border border-border bg-background/40 p-3 md:p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              Trading volume
            </div>
            <div className="font-mono text-xs text-foreground">
              ${fmt(volume)} <span className="text-muted-foreground">/ ${required.toLocaleString()}</span>
            </div>
          </div>
          <Progress value={progressPct} className="h-1.5" />
          <div className="text-[11px] text-muted-foreground">
            {volumeMet
              ? "Volume requirement met. You can claim your pending earnings now."
              : `$${fmt(remaining)} more in filled-trade volume to unlock claim.`}
          </div>
          <Button
            onClick={claim}
            disabled={!canClaim}
            className="w-full mt-auto"
            size="sm"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {claiming ? "Claiming…" : "Claim to wallet"}
          </Button>
        </div>
      </div>
    </section>
  );
};

