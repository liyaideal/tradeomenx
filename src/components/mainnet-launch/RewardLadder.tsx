import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAINNET_REBATE_TIERS, FIRST_TRADE_VOLUME, formatUsd } from "@/lib/mainnetLaunch";
import { SectionShell, SectionTitle } from "./SectionShell";
import { useMainnetLaunchProgress } from "@/hooks/useMainnetLaunchProgress";
import { cn } from "@/lib/utils";

interface Props { onCta: (section: string) => void; }

export const RewardLadder = ({ onCta }: Props) => {
  const { user, volume, event1Qualified, currentTier } = useMainnetLaunchProgress();

  return (
    <SectionShell className="bg-mainnet-surface/30">
      <SectionTitle eyebrow="Rewards" title="Activation first. Rebate tier second." desc="Event 1 is a guaranteed first-trade reward. Event 2 is a highest-tier rebate, not a cumulative payout stack." />

      <div className="grid gap-5 lg:grid-cols-[0.74fr_1.26fr]">
        <div className="rounded-sm border border-mainnet-gold/20 bg-background/30 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mainnet-gold">Event 1</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">First Trade Bonus</h3>
            </div>
            <span className="font-mono text-xs text-muted-foreground">100% win rate</span>
          </div>

          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="border border-border/50 bg-mainnet-surface/70 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">threshold</p>
              <p className="mt-2 font-mono text-xl font-semibold text-foreground">{formatUsd(FIRST_TRADE_VOLUME, true)}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-mainnet-gold" />
            <div className="border border-mainnet-gold/25 bg-mainnet-gold/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">reward</p>
              <p className="mt-2 font-mono text-xl font-semibold text-mainnet-gold">$2-$50</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Volume includes open and close amounts. The qualifying reward is distributed in the daily reward cycle.
          </p>
          {user && event1Qualified && (
            <div className="mt-5 flex items-center gap-2 border border-trading-green/25 bg-trading-green/10 px-3 py-2 font-mono text-xs text-trading-green">
              <CheckCircle2 className="h-4 w-4" />
              qualified · processing
            </div>
          )}
        </div>

        <div className="rounded-sm border border-border/50 bg-card/40 p-5 md:p-6">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mainnet-orange">Event 2</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">Volume Rebate Ledger</h3>
            </div>
            <p className="font-mono text-xs text-muted-foreground">highest tier only</p>
          </div>

          <div className="grid gap-2 md:grid-cols-7">
            {MAINNET_REBATE_TIERS.map((tier) => {
              const active = !!user && currentTier?.volume === tier.volume;
              const reached = !!user && volume >= tier.volume;
              return (
                <div
                  key={tier.volume}
                  className={cn(
                    "min-h-[116px] border border-border/50 bg-background/30 p-3 transition-colors",
                    reached && "border-mainnet-gold/30 bg-mainnet-gold/10",
                    active && "border-mainnet-gold bg-mainnet-gold/20 shadow-[inset_0_1px_0_hsl(var(--mainnet-gold)/0.35)]",
                  )}
                >
                  <p className="font-mono text-[10px] text-muted-foreground">{formatUsd(tier.volume, true)}</p>
                  <p className={cn("mt-7 font-mono text-lg font-semibold text-foreground", (active || reached) && "text-mainnet-gold")}>${tier.rebate}</p>
                  <div className={cn("mt-3 h-px w-full bg-border", (active || reached) && "bg-mainnet-gold/50")} />
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">rebate</p>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Rewards are based on the highest tier reached by the end of the campaign. They do not accumulate across tiers.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border border-border/40 bg-background/30 p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>
          First {formatUsd(FIRST_TRADE_VOLUME, true)} activates Event 1 and starts Event 2 progress.
        </span>
        <Button onClick={() => onCta("ladder")} className="w-full gap-2 rounded-sm bg-mainnet-gold font-mono text-background hover:bg-mainnet-gold/90 md:w-auto">
          Start Trading <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </SectionShell>
  );
};
