import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "./Countdown";
import { RewardMeter } from "./RewardMeter";

interface HeroProps {
  onCta: (section: string) => void;
}

export const Hero = ({ onCta }: HeroProps) => {
  return (
    <section className="relative w-full max-w-full overflow-hidden px-5 pb-12 pt-7 md:px-8 md:pb-20 md:pt-14">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_74%_12%,hsl(var(--mainnet-gold)/0.16),transparent_38%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0 space-y-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
            <span className="border border-mainnet-gold/30 bg-mainnet-gold/10 px-2.5 py-1 text-mainnet-gold">
              Mainnet Launch · May 14 – 28
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-[2.75rem] font-semibold leading-[1] tracking-[-0.035em] text-foreground md:text-[4.25rem] xl:text-[5rem]">
              Your first mainnet trade <span className="text-mainnet-gold">pays you back.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Hit $5K in trading volume and we'll send you USDC. Keep going and we'll send you more — up to $250 over the launch window.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => onCta("hero")}
              className="h-12 rounded-sm border border-mainnet-gold bg-mainnet-gold px-6 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-background hover:bg-mainnet-gold/90"
            >
              Claim My Bonus
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex h-12 items-center gap-3 rounded-sm border border-border/60 bg-mainnet-surface/70 px-4 font-mono text-xs text-muted-foreground backdrop-blur">
              <span className="uppercase tracking-[0.16em] text-foreground">Ends in</span>
              <Countdown compact className="text-mainnet-gold" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-trading-green animate-pulse" />
              Live on mainnet · withdraw anytime
            </span>
            <span>Paid out every day at 18:00 UTC+8</span>
          </div>
        </div>

        <div className="min-w-0">
          <RewardMeter />
        </div>
      </div>
    </section>
  );
};
