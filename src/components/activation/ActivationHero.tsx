import { useNavigate } from "react-router-dom";
import { ArrowDownToLine, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivationState } from "@/hooks/useActivationState";
import { MainnetBadge } from "@/components/MainnetBadge";

/**
 * Wallet page activation hero — the conversion centerpiece for S0/S1 users.
 * Replaces the "show balance first" mental model with "tell user the next step first".
 */
export const ActivationHero = () => {
  const navigate = useNavigate();
  const { state, isLoading } = useActivationState();

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
            className="flex-1 bg-trading-green text-background hover:bg-trading-green/90 font-semibold h-11"
          >
            <PrimaryIcon className="mr-2 h-4 w-4" />
            {primaryCta.label}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/mainnet-launch")}
            className="h-11 border-border/60"
          >
            <Sparkles className="mr-1.5 h-4 w-4 text-trading-green" />
            Why mainnet?
          </Button>
        </div>
      </div>
    </section>
  );
};
