import { Check } from "lucide-react";
import { HedgeCTAButton } from "./HedgeCTAButton";

const RULES = [
  <>Position notional value <span className="font-mono font-medium text-foreground">≥ $200</span> on Polymarket</>,
  <>Position held for at least <span className="font-mono font-medium text-foreground">3 days</span></>,
  <>Matching OmenX event has <span className="font-mono font-medium text-foreground">≥ 72 hours</span> until resolution</>,
  <>Each qualifying position receives a <span className="font-mono font-medium text-foreground">$10</span> free counter-side hedge</>,
  <>Up to <span className="font-mono font-medium text-foreground">3 active airdrops</span> per linked account</>,
  <>Airdrops expire in <span className="font-mono font-medium text-foreground">72 hours</span> if not activated · Max <span className="font-mono font-medium text-foreground">$100</span> lifetime per account</>,
];

export const HedgeKeyRules = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            The fine print isn't fine print
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Six rules. Zero hidden terms.
          </p>
        </div>

        <ul className="space-y-3">
          {RULES.map((rule, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border/40 bg-card px-5 py-4"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-trading-green/20 text-trading-green">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{rule}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-foreground">
            No hidden terms. No tricks.
          </p>
          <HedgeCTAButton />
        </div>
      </div>
    </section>
  );
};
