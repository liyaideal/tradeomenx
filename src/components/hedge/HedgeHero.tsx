import { ArrowLeftRight, ArrowRight } from "lucide-react";
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

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-6 md:py-24">
        {/* Left: copy */}
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Hedge-to-Earn · Live Now
          </span>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Holding a Polymarket bet?
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Lock in profit — on us.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We'll airdrop you a free counter-position worth up to{" "}
            <span className="font-mono text-foreground">$10</span>. Win or lose
            on Polymarket, you walk away with real USDC.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HedgeCTAButton size="lg" />
          </div>

          {/* Live stats bar (mock) */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-border/40 bg-card/60 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-trading-green animate-pulse" />
              <span className="font-mono font-semibold text-foreground">
                {LIVE_STATS.distributed}
              </span>
              <span className="text-muted-foreground">distributed</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-foreground">
                {LIVE_STATS.claimed}
              </span>
              <span className="text-muted-foreground">users claimed</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-primary">
                {LIVE_STATS.remaining}
              </span>
              <span className="text-muted-foreground">spots left today</span>
            </div>
          </div>

          {/* Inline trust line (replaces TrustBar section) */}
          <p className="mt-4 text-xs text-muted-foreground">
            EIP-712 read-only signature · Settled in USDC on Base ·{" "}
            <a
              href="/transparency"
              className="inline-flex items-center gap-0.5 text-primary hover:underline"
            >
              View on-chain audit
              <ArrowRight className="h-3 w-3" />
            </a>
          </p>
        </div>

        {/* Right: animated card mockup */}
        <div className="relative flex items-center justify-center">
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
