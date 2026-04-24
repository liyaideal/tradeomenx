import { HedgeCTAButton } from "./HedgeCTAButton";
import hedgeHeroImage from "@/assets/hedge-hero.png";
import hedgeHeroMobileImage from "@/assets/hedge-hero-mobile.png";

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

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2 md:gap-16 md:px-6 md:py-12 lg:py-14 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] xl:py-16">
        {/* Left: copy */}
        <div className="flex min-w-0 flex-col justify-center">
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

        {/* Right: hero image — DESKTOP */}
        <div className="relative hidden items-center justify-center md:flex">
          <div
            className="relative w-full max-w-md"
            style={{ animation: "hedge-float 6s ease-in-out infinite" }}
          >
            <img
              src={hedgeHeroImage}
              alt="OmenX hedges your Polymarket position — like insurance"
              className="h-auto w-full rounded-2xl"
              loading="eager"
            />
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
