import { ArrowRight, CheckCircle2, Clock, Gift, TrendingUp } from "lucide-react";
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

  return (
    <SectionShell className="bg-mainnet-surface/50">
      <SectionTitle title="Your Campaign Progress" desc="Your first-trade reward is processing. Keep trading to climb the rebate ladder." />
      <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-3 md:overflow-visible">
        <div className="min-w-[220px] rounded-lg border border-trading-green/30 bg-trading-green/10 p-5">
          <Gift className="mb-4 h-5 w-5 text-trading-green" />
          <p className="text-sm text-muted-foreground">Event 1</p>
          <h3 className="mt-1 text-xl font-bold text-trading-green">Qualified</h3>
          <p className="mt-2 text-sm text-muted-foreground">$2–$50 USDC · Processing</p>
        </div>
        <div className="min-w-[220px] rounded-lg border border-mainnet-gold/30 bg-mainnet-gold/10 p-5">
          <TrendingUp className="mb-4 h-5 w-5 text-mainnet-gold" />
          <p className="text-sm text-muted-foreground">Event 2 Tier</p>
          <h3 className="mt-1 text-xl font-bold text-mainnet-gold">{currentTier ? formatUsd(currentTier.volume, true) : "Pre-tier"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Current rebate: ${currentTier?.rebate ?? 0}</p>
        </div>
        <div className="min-w-[220px] rounded-lg border border-border/60 bg-card/70 p-5">
          <Clock className="mb-4 h-5 w-5 text-mainnet-orange" />
          <p className="text-sm text-muted-foreground">Time Left</p>
          <h3 className="mt-1 text-xl font-bold text-foreground"><Countdown compact /></h3>
          <p className="mt-2 text-sm text-muted-foreground">Ends May 28, 2026</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border/60 bg-card/70 p-5 md:p-7">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <h3 className="font-mono text-2xl font-bold text-foreground">{formatUsd(volume)}</h3>
          </div>
          {nextTier ? (
            <p className="text-sm text-muted-foreground">{Math.round(progressToNext)}% to {formatUsd(nextTier.volume)}</p>
          ) : (
            <p className="text-sm font-semibold text-mainnet-gold">Max tier reached</p>
          )}
        </div>
        <Progress value={progressToNext} className="h-3 bg-mainnet-gold/15 [&>div]:bg-mainnet-gold" />
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-trading-green" /> Current Tier: {currentTier ? `${formatUsd(currentTier.volume)} → $${currentTier.rebate} rebate` : "No rebate tier yet"}</p>
          <p>Next Tier: {nextTier ? `${formatUsd(nextTier.volume)} → $${nextTier.rebate} rebate, need ${formatUsd(volumeToNextTier)} more` : "All tiers unlocked"}</p>
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={() => onCta("progress")} className="w-full gap-2 rounded-lg md:w-auto" style={{ background: "var(--gradient-mainnet)" }}>
          Go to Events <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </SectionShell>
  );
};
