import { ArrowLeftRight } from "lucide-react";
import { HedgeCTAButton } from "./HedgeCTAButton";

// Mock live stats — operations can edit these constants directly.
const LIVE_STATS = {
  distributed: "$47,320",
  claimed: "1,284",
  remaining: "213",
};

export const HedgeHero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:gap-16 md:px-6 md:py-24">
        {/* Left: copy */}
        <div className="flex flex-col justify-center">
          <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary md:mb-4 md:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Hedge-to-Earn · Live Now
          </span>

          <h1 className="max-w-full text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.5rem] lg:tracking-[-0.02em] xl:text-6xl">
            <span className="xl:whitespace-nowrap">Holding a Polymarket bet?</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent lg:whitespace-nowrap">
              Lock in profit — on us.
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:mt-5 md:text-lg">
            We'll airdrop you a free counter-position worth up to{" "}
            <span className="font-mono text-foreground">$10</span>. Win or lose
            on Polymarket, you walk away with real USDC.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
            <HedgeCTAButton size="lg" />
          </div>

          {/* Live stats bar — mobile: 3-col grid; desktop: inline flex */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-border/40 rounded-lg border border-border/40 bg-card/60 text-center md:mt-6 md:flex md:flex-wrap md:items-center md:gap-x-5 md:gap-y-2 md:divide-x-0 md:px-4 md:py-2.5 md:text-left">
            <div className="flex flex-col items-center gap-0.5 px-2 py-2 md:flex-row md:items-center md:gap-1.5 md:p-0">
              <div className="flex items-center gap-1.5">
                <span className="hidden h-1.5 w-1.5 rounded-full bg-trading-green animate-pulse md:inline-block" />
                <span className="font-mono text-sm font-semibold text-foreground md:text-xs">
                  {LIVE_STATS.distributed}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground md:text-xs">distributed</span>
            </div>
            <span className="hidden text-border md:inline">·</span>
            <div className="flex flex-col items-center gap-0.5 px-2 py-2 md:flex-row md:items-center md:gap-1.5 md:p-0">
              <span className="font-mono text-sm font-semibold text-foreground md:text-xs">
                {LIVE_STATS.claimed}
              </span>
              <span className="text-[10px] text-muted-foreground md:text-xs">users claimed</span>
            </div>
            <span className="hidden text-border md:inline">·</span>
            <div className="flex flex-col items-center gap-0.5 px-2 py-2 md:flex-row md:items-center md:gap-1.5 md:p-0">
              <span className="font-mono text-sm font-semibold text-primary md:text-xs">
                {LIVE_STATS.remaining}
              </span>
              <span className="text-[10px] text-muted-foreground md:text-xs">spots left today</span>
            </div>
          </div>

        </div>

        {/* Right: animated card mockup — DESKTOP version (stacked floating cards) */}
        <div className="relative hidden items-center justify-center md:flex">
          <div className="relative w-full max-w-md">
            {/* Polymarket card */}
            <div
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-2xl shadow-primary/5"
              style={{ animation: "hedge-float 6s ease-in-out infinite" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Polymarket
                </span>
                <span className="rounded-md bg-trading-green/15 px-2 py-0.5 text-[10px] font-semibold text-trading-green">
                  YES
                </span>
              </div>
              <p className="text-base font-semibold">BTC &gt; $100K by Dec 31</p>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Position</span>
                <span className="font-mono text-xl font-bold">$500</span>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="my-3 flex items-center justify-center gap-2 text-primary">
              <ArrowLeftRight className="h-5 w-5" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Auto-hedged
              </span>
            </div>

            {/* OmenX card */}
            <div
              className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 shadow-2xl shadow-primary/20"
              style={{ animation: "hedge-float 6s ease-in-out infinite reverse" }}
            >
              <div className="absolute -top-2 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                FREE
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  OmenX
                </span>
                <span className="rounded-md bg-trading-red/15 px-2 py-0.5 text-[10px] font-semibold text-trading-red">
                  SHORT
                </span>
              </div>
              <p className="text-base font-semibold">BTC &gt; $100K by Dec 31</p>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Hedge</span>
                <span className="font-mono text-xl font-bold text-primary">$10</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE version — single compact horizontal card */}
        <div className="relative flex md:hidden">
          <div className="relative w-full rounded-2xl border border-border/60 bg-card p-3 shadow-xl shadow-primary/5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              {/* Polymarket mini */}
              <div className="rounded-lg border border-border/40 bg-background/40 p-2.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    Polymarket
                  </span>
                  <span className="rounded bg-trading-green/15 px-1 py-0.5 text-[8px] font-semibold text-trading-green">
                    YES
                  </span>
                </div>
                <p className="text-[11px] font-medium leading-tight">BTC &gt; $100K</p>
                <p className="mt-1.5 font-mono text-base font-bold">$500</p>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-0.5 text-primary">
                <ArrowLeftRight className="h-4 w-4" />
                <span className="text-[8px] font-mono uppercase tracking-wider">hedge</span>
              </div>

              {/* OmenX mini */}
              <div className="relative rounded-lg border border-primary/40 bg-gradient-to-br from-primary/15 to-transparent p-2.5">
                <div className="absolute -top-1.5 right-2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                  FREE
                </div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    OmenX
                  </span>
                  <span className="rounded bg-trading-red/15 px-1 py-0.5 text-[8px] font-semibold text-trading-red">
                    SHORT
                  </span>
                </div>
                <p className="text-[11px] font-medium leading-tight">BTC &gt; $100K</p>
                <p className="mt-1.5 font-mono text-base font-bold text-primary">$10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Float animation keyframes (scoped via global style) */}
      <style>{`
        @keyframes hedge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};
