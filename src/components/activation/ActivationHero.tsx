import { useNavigate } from "react-router-dom";
import { ArrowDownToLine, TrendingUp, ChevronRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivationState } from "@/hooks/useActivationState";
import { MainnetBadge } from "@/components/MainnetBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Wallet page activation hero — the conversion centerpiece for S0/S1 users.
 * Replaces the "show balance first" mental model with "tell user the next step first".
 */
export const ActivationHero = () => {
  const navigate = useNavigate();
  const { state, isLoading } = useActivationState();
  const isMobile = useIsMobile();

  if (isLoading) return null;
  if (state === "GUEST" || state === "S2_TRADED" || state === "S3_ACTIVE") return null;

  const isS0 = state === "S0_NEW";

  const headline = isS0
    ? "Start trading on mainnet in 3 steps"
    : "You're funded — make your first real trade";

  const subline = isS0
    ? "Deposit USDC on Base, place your first trade, then earn launch campaign rebates."
    : "Open any market and place a trade to unlock the launch campaign rebate tiers.";

  const primaryCta = isS0
    ? { label: "Deposit now", href: "/deposit", icon: ArrowDownToLine }
    : { label: "Browse markets", href: "/events", icon: TrendingUp };

  const PrimaryIcon = primaryCta.icon;

  const steps = [
    { n: 1, label: "Deposit", done: !isS0 },
    { n: 2, label: "First trade", done: false },
    { n: 3, label: "Rebates", done: false },
  ];

  // Mobile compact layout
  if (isMobile) {
    return (
      <section
        aria-label="Mainnet activation"
        className="relative overflow-hidden rounded-2xl border border-trading-green/40 bg-gradient-to-br from-trading-green/[0.10] via-background to-background p-4"
      >
        <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-trading-green/15 blur-2xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <MainnetBadge size="sm" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Activation
            </span>
          </div>

          <h2 className="text-base font-semibold leading-snug text-foreground">{headline}</h2>
          <p className="mt-1 text-xs leading-snug text-muted-foreground line-clamp-2">{subline}</p>

          {/* Inline stepper */}
          <ol className="mt-3 flex items-center gap-1.5">
            {steps.map((s, idx) => (
              <li key={s.n} className="flex flex-1 items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border",
                    s.done
                      ? "border-trading-green bg-trading-green/20 text-trading-green"
                      : "border-border bg-muted/30 text-muted-foreground",
                  )}
                >
                  {s.done ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <span className="font-mono text-[10px] font-semibold">{s.n}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "truncate text-[11px]",
                    s.done ? "text-muted-foreground line-through" : "text-foreground",
                  )}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className="ml-0.5 h-px flex-1 bg-border/60" />
                )}
              </li>
            ))}
          </ol>

          <Button
            onClick={() => navigate(primaryCta.href)}
            className="mt-3 w-full bg-trading-green text-background hover:bg-trading-green/90 font-semibold h-10"
          >
            <PrimaryIcon className="mr-2 h-4 w-4" />
            {primaryCta.label}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>

        </div>
      </section>
    );
  }

  // Desktop layout (unchanged)
  return (
    <section
      aria-label="Mainnet activation"
      className="relative overflow-hidden rounded-2xl border border-trading-green/40 bg-gradient-to-br from-trading-green/[0.10] via-background to-background p-5"
    >
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-trading-green/15 blur-3xl" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <MainnetBadge size="md" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Activation
          </span>
        </div>

        <h2 className="text-xl font-semibold leading-tight text-foreground">{headline}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subline}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { n: "1", label: "Deposit USDC" },
            { n: "2", label: "First trade" },
            { n: "3", label: "Earn rebates" },
          ].map((s, i) => {
            const done = (isS0 && false) || (!isS0 && i === 0);
            return (
              <div
                key={s.n}
                className={`rounded-lg border p-2.5 ${
                  done
                    ? "border-trading-green/30 bg-trading-green/5"
                    : "border-border/50 bg-muted/20"
                }`}
              >
                <div className="font-mono text-[10px] text-muted-foreground">Step {s.n}</div>
                <div className="mt-0.5 text-xs font-medium text-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => navigate(primaryCta.href)}
            className="w-full bg-trading-green text-background hover:bg-trading-green/90 font-semibold h-11"
          >
            <PrimaryIcon className="mr-2 h-4 w-4" />
            {primaryCta.label}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
