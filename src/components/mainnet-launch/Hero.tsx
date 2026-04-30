import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "./Countdown";
import { LaunchVisual } from "./LaunchVisual";

interface HeroProps {
  onCta: (section: string) => void;
}

const metrics = [
  { label: "Activation", value: "$5K", detail: "open + close volume" },
  { label: "Event 1", value: "$2-$50", detail: "guaranteed USDC reward" },
  { label: "Event 2", value: "$200", detail: "maximum rebate" },
];

export const Hero = ({ onCta }: HeroProps) => {
  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-7 md:px-8 md:pb-20 md:pt-14">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_74%_12%,hsl(var(--mainnet-gold)/0.14),transparent_38%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
            <span className="border border-mainnet-gold/30 bg-mainnet-gold/10 px-2.5 py-1 text-mainnet-gold">Mainnet Launch</span>
            <span className="border border-trading-green/25 bg-trading-green/10 px-2.5 py-1 text-trading-green">May 14-28</span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-[3.25rem] font-semibold leading-[0.92] tracking-[-0.045em] text-foreground md:text-[5.75rem] xl:text-[6.8rem]">
              OmenX Mainnet Launch
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Complete your first qualifying trade and receive a guaranteed USDC reward. Keep trading to unlock the highest volume rebate tier you reach.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => onCta("hero")}
              className="h-12 rounded-sm border border-mainnet-gold bg-mainnet-gold px-6 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-background hover:bg-mainnet-gold/90"
            >
              Start Trading
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex h-12 items-center gap-3 rounded-sm border border-border/60 bg-mainnet-surface/70 px-4 font-mono text-xs text-muted-foreground backdrop-blur">
              <span className="uppercase tracking-[0.16em] text-foreground">Ends</span>
              <Countdown compact className="text-mainnet-gold" />
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-3 border-y border-border/50">
            {metrics.map((metric) => (
            <div key={metric.label} className="border-r border-border/50 px-3 py-4 last:border-r-0 md:px-4 xl:px-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
                <p className="mt-2 font-mono text-xl font-semibold text-foreground md:text-2xl">{metric.value}</p>
                <p className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <LaunchVisual />
      </div>
    </section>
  );
};
