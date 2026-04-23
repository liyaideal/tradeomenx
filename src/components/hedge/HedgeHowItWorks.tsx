import { Wallet, ScanLine, DollarSign, ArrowDown } from "lucide-react";
import { HedgeCTAButton } from "./HedgeCTAButton";

const STEPS = [
  {
    icon: Wallet,
    title: "Connect Polymarket",
    body: "Link your wallet — read-only. We never touch your funds.",
    note: "Takes ~30 seconds",
  },
  {
    icon: ScanLine,
    title: "We scan your positions",
    body: "Find qualifying positions ($200+, held 3+ days, matching market on OmenX).",
    note: "Fully automatic",
  },
  {
    icon: DollarSign,
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

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col">
              <div className="relative flex flex-1 flex-col rounded-2xl border border-border/40 bg-card p-6 transition-colors hover:border-primary/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
                <p className="mt-4 text-xs font-medium text-primary">{step.note}</p>
              </div>

              {/* Mobile down-arrow connector */}
              {i < STEPS.length - 1 && (
                <div className="my-2 flex justify-center md:hidden">
                  <ArrowDown className="h-5 w-5 text-muted-foreground/60" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <HedgeCTAButton />
        </div>
      </div>
    </section>
  );
};
