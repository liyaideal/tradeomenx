import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Countdown } from "./Countdown";
import { SectionShell, SectionTitle } from "./SectionShell";
import { formatUsd } from "@/lib/mainnetLaunch";
import { useMainnetLaunchProgress } from "@/hooks/useMainnetLaunchProgress";

interface Props { onCta: (section: string) => void; }

export const ProgressDashboard = ({ onCta }: Props) => {
  const { user, event1Qualified, volume, currentTier, nextTier, progressToNext, volumeToNextTier } = useMainnetLaunchProgress();

  if (!user || !event1Qualified) return null;

  const rows = [
    ["Event 1 Status", "Qualified", "$2-$50 USDC · processing"],
    ["Current Tier", currentTier ? formatUsd(currentTier.volume, true) : "Pre-tier", `rebate $${currentTier?.rebate ?? 0}`],
    ["Next Unlock", nextTier ? formatUsd(nextTier.volume, true) : "Max tier", nextTier ? `${formatUsd(volumeToNextTier)} remaining` : "all tiers unlocked"],
    ["Time Left", <Countdown key="countdown" compact />, "ends May 28, 2026"],
  ] as const;

  return (
    <SectionShell className="bg-mainnet-surface/35">
      <SectionTitle eyebrow="Account" title="Your campaign position" desc="Your live trading volume is already above the activation threshold. The dashboard now tracks the next rebate unlock." />

      <div className="rounded-sm border border-border/55 bg-background/40 p-5 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Total Volume</p>
            <h3 className="mt-2 font-mono text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-6xl">{formatUsd(volume)}</h3>
          </div>
          <div className="flex items-center gap-2 border border-trading-green/25 bg-trading-green/10 px-3 py-2 font-mono text-xs text-trading-green">
            <CheckCircle2 className="h-4 w-4" />
            activation complete
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>{currentTier ? `Current ${formatUsd(currentTier.volume, true)}` : "Pre-tier"}</span>
            <span>{nextTier ? `${Math.round(progressToNext)}% to ${formatUsd(nextTier.volume, true)}` : "100%"}</span>
          </div>
          <Progress value={progressToNext} className="h-2 rounded-none bg-mainnet-gold/12 [&>div]:rounded-none [&>div]:bg-mainnet-gold" />
        </div>

        <div className="mt-7 grid border-t border-l border-border/45 md:grid-cols-4">
          {rows.map(([label, value, detail]) => (
            <div key={label} className="border-b border-r border-border/45 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
              <div className="mt-3 font-mono text-lg font-semibold text-foreground">{value}</div>
              <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={() => onCta("progress")} className="w-full gap-2 rounded-sm bg-mainnet-gold font-mono text-background hover:bg-mainnet-gold/90 md:w-auto">
          Go to Events <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </SectionShell>
  );
};
