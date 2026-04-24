import { Fragment } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

const STEPS = [
  {
    title: "Connect Polymarket",
    body: "Link your wallet — read-only. We never touch your funds.",
    note: "Takes ~30 seconds",
  },
  {
    title: "We scan your positions",
    body: "Find qualifying positions ($200+, held 3+ days, matching market on OmenX).",
    note: "Fully automatic",
  },
  {
    title: "Claim your free hedge",
    body: "Up to $10 per position credited as a free counter-trade. Settle to real cash.",
    note: "Up to $100 lifetime",
  },
];

export const HedgeHowItWorks = () => {
  return (
    <section className="border-b border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Three steps. No deposit. No catch.
          </p>
        </div>

        {/* Horizontal connected steps (no card grid) */}
        <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="relative">
                {/* Big number */}
                <div className="mb-3 font-mono text-5xl font-bold leading-none text-primary/30 md:text-6xl">
                  0{i + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold md:text-xl">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
                <p className="mt-3 text-xs font-mono uppercase tracking-wider text-primary">
                  {step.note}
                </p>
              </div>

              {/* Connector — only between items */}
              {i < STEPS.length - 1 && (
                <>
                  <div className="hidden items-center justify-center pt-8 md:flex">
                    <div className="flex items-center">
                      <span className="block h-px w-12 bg-border" />
                      <ArrowRight className="h-4 w-4 -ml-1 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex justify-center md:hidden">
                    <ArrowDown className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
