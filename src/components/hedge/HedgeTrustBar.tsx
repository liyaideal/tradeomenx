import { Lock, Coins, Layers, FileSearch } from "lucide-react";

const SIGNALS = [
  {
    icon: Lock,
    title: "Read-only",
    body: "EIP-712 signature. We never get spend permission.",
  },
  {
    icon: Coins,
    title: "Real USDC",
    body: "Settled on Base. Withdraw anytime, no lockups.",
  },
  {
    icon: Layers,
    title: "On-chain proof",
    body: "Every trade & settlement verifiable on Base.",
  },
  {
    icon: FileSearch,
    title: "Open audit",
    body: "Live transparency dashboard for every market.",
  },
];

export const HedgeTrustBar = () => {
  return (
    <section className="border-b border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Why you can trust us
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          {SIGNALS.map((s) => (
            <div
              key={s.title}
              className="flex flex-col items-start gap-2 rounded-xl border border-border/40 bg-card p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">{s.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
