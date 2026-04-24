import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground md:mt-3 md:text-base">
            Three steps. No deposit. No catch.
          </p>
        </div>

        {/* DESKTOP: horizontal connected steps */}
        <div className="mx-auto hidden max-w-5xl items-start gap-4 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="relative">
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

              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center pt-8">
                  <div className="flex items-center">
                    <span className="block h-px w-12 bg-border" />
                    <ArrowRight className="h-4 w-4 -ml-1 text-muted-foreground" />
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* MOBILE: compact vertical timeline with numbered badges + connecting line */}
        <ol className="relative mx-auto max-w-md md:hidden">
          {/* Vertical line */}
          <span
            aria-hidden
            className="absolute left-[17px] top-2 bottom-2 w-px bg-border"
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-sm font-semibold text-primary">
                {i + 1}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold leading-tight">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
                <p className="mt-1.5 text-[11px] font-mono uppercase tracking-wider text-primary">
                  {step.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
