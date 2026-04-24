import { ArrowLeftRight, TrendingUp, TrendingDown, Quote } from "lucide-react";

// NOTE: market title and testimonial handles are MOCK and intended for ops to
// replace with a currently-trending market + real user quotes once available.
const MARKET_TITLE = "Trump wins 2028 election";

export const HedgeLiveExample = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
            See it in action
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:mt-3 md:text-base">
            An example:{" "}
            <span className="font-medium text-foreground">{MARKET_TITLE}</span>
          </p>
        </div>

        {/* Position pair */}
        <div className="mx-auto grid max-w-4xl items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {/* Polymarket */}
          <div className="rounded-2xl border border-border/40 bg-card p-4 md:p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your Polymarket position
              </span>
              <span className="rounded-md bg-trading-green/15 px-2 py-0.5 text-[10px] font-semibold text-trading-green">
                YES
              </span>
            </div>
            <p className="text-base font-semibold md:text-lg">{MARKET_TITLE}</p>
            <div className="mt-3 space-y-2 text-sm md:mt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Side</span>
                <span className="font-medium">YES (long)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stake</span>
                <span className="font-mono font-medium">$500</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center py-1 md:py-0">
            <div className="flex items-center gap-2 text-primary md:flex-col md:gap-1">
              <span className="block h-px w-8 bg-primary/40 md:hidden" />
              <ArrowLeftRight className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-[10px] font-mono uppercase tracking-wider">hedge</span>
              <span className="block h-px w-8 bg-primary/40 md:hidden" />
            </div>
          </div>

          {/* OmenX */}
          <div className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4 md:p-6">
            <div className="absolute -top-2 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              FREE
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your free OmenX hedge
              </span>
              <span className="rounded-md bg-trading-red/15 px-2 py-0.5 text-[10px] font-semibold text-trading-red">
                SHORT
              </span>
            </div>
            <p className="text-base font-semibold md:text-lg">{MARKET_TITLE}</p>
            <div className="mt-3 space-y-2 text-sm md:mt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Side</span>
                <span className="font-medium">SHORT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost to you</span>
                <span className="font-mono font-bold text-primary">$0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div className="mx-auto mt-6 grid max-w-4xl gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
          <div className="rounded-2xl border border-trading-green/30 bg-trading-green/5 p-4 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-trading-green md:h-5 md:w-5" />
              <h3 className="text-sm font-semibold md:text-base">
                Scenario A: Trump wins
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Polymarket YES</span>
                <span className="font-mono text-trading-green">+$500</span>
              </li>
              <li className="flex justify-between">
                <span>OmenX SHORT</span>
                <span className="font-mono text-muted-foreground">$0</span>
              </li>
              <li className="mt-2 flex justify-between border-t border-border/40 pt-2 font-medium">
                <span className="text-foreground">You walk away with</span>
                <span className="font-mono text-trading-green">+$500</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary md:h-5 md:w-5" />
              <h3 className="text-sm font-semibold md:text-base">
                Scenario B: Trump loses
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Polymarket YES</span>
                <span className="font-mono text-trading-red">-$500</span>
              </li>
              <li className="flex justify-between">
                <span>OmenX SHORT</span>
                <span className="font-mono text-trading-green">+$10</span>
              </li>
              <li className="mt-2 flex justify-between border-t border-border/40 pt-2 font-medium">
                <span className="text-foreground">Free cash from us</span>
                <span className="font-mono text-trading-green">+$10</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Testimonial + stats */}
        <div className="mx-auto mt-6 max-w-3xl md:mt-10">
          <figure className="rounded-2xl border border-border/40 bg-card/60 p-4 md:p-6">
            <Quote className="mb-2 h-4 w-4 text-primary/60 md:mb-3 md:h-5 md:w-5" />
            <blockquote className="text-sm leading-relaxed text-foreground md:text-lg">
              "Held my Trump 2028 long, hedged with OmenX, made{" "}
              <span className="font-mono font-semibold text-trading-green">$8</span>{" "}
              when it dipped. Took 30 seconds to set up."
            </blockquote>
            <figcaption className="mt-3 flex flex-col items-start gap-1 text-xs md:flex-row md:items-center md:justify-between">
              <span className="font-mono text-muted-foreground">
                — @cryptotrader_xyz
              </span>
              <span className="text-muted-foreground">
                Avg claim settled{" "}
                <span className="font-mono font-semibold text-trading-green">+$6.40</span>{" "}
                within 7 days
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
