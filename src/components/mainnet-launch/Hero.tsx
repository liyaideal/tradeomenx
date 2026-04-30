import { ArrowRight, Gift, ShieldCheck, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "./Countdown";
import { LaunchVisual } from "./LaunchVisual";

interface HeroProps {
  onCta: (section: string) => void;
}

const stats = [
  { icon: Trophy, value: "100%", label: "win rate" },
  { icon: Gift, value: "Up to", label: "$50 USDC" },
  { icon: Timer, value: "Rewards", label: "in 24h" },
];

export const Hero = ({ onCta }: HeroProps) => {
  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-8 md:px-8 md:pb-20 md:pt-16">
      <div className="absolute inset-x-0 top-0 h-[520px] opacity-80" style={{ background: "var(--gradient-mainnet-glow)" }} />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[1.02fr_0.98fr] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-mainnet-gold/30 bg-mainnet-gold/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-mainnet-gold">
            <ShieldCheck className="h-3.5 w-3.5" />
            MAINNET LAUNCH
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] text-foreground md:text-7xl">
              OmenX Mainnet Is Live.
            </h1>
            <p className="text-2xl font-bold text-mainnet-gold md:text-4xl">Your first trade wins. Every time.</p>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Make your first trade and win $2–$50 USDC. 100% win rate. No lottery. No luck needed.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => onCta("hero")}
            className="h-13 w-full gap-2 rounded-lg px-7 text-base font-bold text-background md:w-auto"
            style={{ background: "var(--gradient-mainnet)", boxShadow: "0 16px 38px hsl(var(--mainnet-gold) / 0.22)" }}
          >
            Start Trading
            <ArrowRight className="h-5 w-5" />
          </Button>

          <div className="grid grid-cols-3 gap-3 max-w-xl">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-mainnet-gold/20 bg-mainnet-gold/5 p-3">
                <stat.icon className="mb-2 h-4 w-4 text-mainnet-gold" />
                <div className="text-sm font-bold text-foreground md:text-base">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="inline-flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-card/70 px-4 py-3 text-sm text-muted-foreground backdrop-blur">
            <span className="text-foreground">Ends in:</span>
            <Countdown />
            <span className="hidden h-4 w-px bg-border md:block" />
            <span className="font-mono text-mainnet-gold">Mainnet live</span>
          </div>
        </div>

        <LaunchVisual />
      </div>
    </section>
  );
};
