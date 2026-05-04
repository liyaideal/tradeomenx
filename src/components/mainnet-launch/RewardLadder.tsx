import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAINNET_REBATE_TIERS, formatUsd } from "@/lib/mainnetLaunch";
import { SectionShell, SectionTitle } from "./SectionShell";
import { useMainnetLaunchProgress } from "@/hooks/useMainnetLaunchProgress";
import { cn } from "@/lib/utils";

interface Props { onCta: (section: string) => void; }

export const RewardLadder = ({ onCta }: Props) => {
  const { user, volume, currentTier } = useMainnetLaunchProgress();
  const maxTierVolume = MAINNET_REBATE_TIERS[MAINNET_REBATE_TIERS.length - 1].volume;

  return (
    <SectionShell className="bg-mainnet-surface/30">
      <SectionTitle
        eyebrow="Volume rebate ladder"
        title="Trade more, earn more."
        desc="Rebates pay the highest tier you reach — not cumulative. Hit the top tier for a $200 USDC payout."
      />

      <div className="overflow-hidden rounded-md border border-border/50 bg-background/30">
        {/* header */}
        <div className="grid grid-cols-[1.4fr_0.8fr_1.6fr] gap-4 border-b border-border/40 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:px-6">
          <span>Volume</span>
          <span>Rebate</span>
          <span>Status</span>
        </div>

        {MAINNET_REBATE_TIERS.map((tier) => {
          const reached = !!user && volume >= tier.volume;
          const active = !!user && currentTier?.volume === tier.volume;
          const isMax = tier.volume === maxTierVolume;
          const fillPct = Math.min(100, (tier.volume / maxTierVolume) * 100);

          return (
            <div
              key={tier.volume}
              className={cn(
                "relative grid grid-cols-[1.4fr_0.8fr_1.6fr] items-center gap-4 border-b border-border/30 px-4 py-4 transition-colors last:border-b-0 md:px-6",
                active && "bg-mainnet-gold/10",
                reached && !active && "bg-mainnet-gold/[0.04]",
              )}
            >
              <span className={cn("font-mono text-base font-semibold text-foreground md:text-lg", isMax && "text-mainnet-gold")}>
                {formatUsd(tier.volume, true)}
              </span>

              <span className={cn("font-mono text-base font-semibold md:text-lg", reached || isMax ? "text-mainnet-gold" : "text-foreground")}>
                ${tier.rebate}
              </span>

              <div className="flex items-center gap-3">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border/40">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-500",
                      reached || isMax ? "bg-mainnet-gold" : "bg-border",
                    )}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                {active && (
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-mainnet-gold">
                    you are here
                  </span>
                )}
                {!active && isMax && (
                  <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-mainnet-gold">
                    <Sparkles className="h-3 w-3" />
                    max payout
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 border border-border/40 bg-background/30 p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>Highest tier reached at campaign close = your rebate. Volume from your first $5K counts toward both rewards.</span>
        <Button onClick={() => onCta("ladder")} className="w-full gap-2 rounded-sm bg-mainnet-gold font-mono text-background hover:bg-mainnet-gold/90 md:w-auto">
          Claim My Bonus <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </SectionShell>
  );
};
