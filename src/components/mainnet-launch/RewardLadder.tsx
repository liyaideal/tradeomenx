import { ArrowRight, CheckCircle2, CircleDollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MAINNET_REBATE_TIERS, FIRST_TRADE_VOLUME, formatUsd } from "@/lib/mainnetLaunch";
import { SectionShell, SectionTitle } from "./SectionShell";
import { useMainnetLaunchProgress } from "@/hooks/useMainnetLaunchProgress";
import { cn } from "@/lib/utils";

interface Props { onCta: (section: string) => void; }

export const RewardLadder = ({ onCta }: Props) => {
  const { user, volume, event1Qualified, currentTier } = useMainnetLaunchProgress();

  return (
    <SectionShell className="bg-mainnet-surface/50">
      <SectionTitle title="Two Ways to Earn" desc="Start with a guaranteed first-trade bonus, then keep trading to unlock higher USDC rebates." />

      <div className="space-y-6">
        <div className="rounded-lg border border-mainnet-gold/25 bg-mainnet-gold/5 p-5 md:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mainnet-gold/10 text-mainnet-gold">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mainnet-gold">EVENT 1</p>
              <h3 className="text-xl font-bold text-foreground">First Trade Bonus</h3>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span className="text-sm font-semibold text-foreground md:text-base">Trade ≥ 5K USDC volume</span>
              <ArrowRight className="hidden h-5 w-5 text-mainnet-gold md:block" />
              <span className="font-mono text-lg font-bold text-mainnet-gold">Win $2–$50 USDC</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Progress value={100} className="h-3 bg-mainnet-gold/15 [&>div]:bg-mainnet-gold" />
              <span className="whitespace-nowrap text-xs font-bold text-mainnet-gold">100% Win Rate</span>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-trading-green" />
            Every participant wins. No exceptions.
          </p>
          {user && event1Qualified && (
            <div className="mt-4 rounded-lg border border-trading-green/30 bg-trading-green/10 p-3 text-sm text-trading-green">
              First-trade bonus qualified. Reward status: Processing.
            </div>
          )}
        </div>

        <div className="text-center text-sm font-semibold text-mainnet-gold">Keep trading to unlock more</div>

        <div className="rounded-lg border border-border/60 bg-card/70 p-5 md:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mainnet-orange/10 text-mainnet-orange">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mainnet-orange">EVENT 2</p>
              <h3 className="text-xl font-bold text-foreground">Volume Rebates</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/50">
            <div className="grid grid-cols-2 bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span>Cumulative Trading Volume</span>
              <span className="text-right">USDC Rebate</span>
            </div>
            {MAINNET_REBATE_TIERS.map((tier) => {
              const active = !!user && currentTier?.volume === tier.volume;
              const reached = !!user && volume >= tier.volume;
              return (
                <div
                  key={tier.volume}
                  className={cn(
                    "grid grid-cols-2 border-t border-border/50 px-4 py-3 text-sm transition-colors",
                    active && "bg-mainnet-gold/10 text-mainnet-gold",
                    reached && !active && "bg-mainnet-gold/5",
                  )}
                >
                  <span className="font-mono font-semibold">{formatUsd(tier.volume)}</span>
                  <span className="text-right font-mono font-bold">
                    ${tier.rebate}{tier.volume === 1_000_000 ? " MAX" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Rewards based on highest tier reached. Not cumulative across tiers.
          </p>
        </div>

        <div className="rounded-lg border border-mainnet-gold/25 bg-mainnet-gold/5 p-4 text-sm text-foreground">
          Tip: The first $5K gets you both Event 1 and starts Event 2 progress.
          <span className="ml-2 text-muted-foreground">Event 1 threshold: {formatUsd(FIRST_TRADE_VOLUME)} trading volume.</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={() => onCta("ladder")} className="w-full gap-2 rounded-lg md:w-auto" style={{ background: "var(--gradient-mainnet)" }}>
          Start Trading <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </SectionShell>
  );
};
