import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowDownLeft, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivationStage } from "@/hooks/useActivationStage";
import { trackActivation, ENGAGED_VOLUME_THRESHOLD } from "@/lib/activation";
import { cn } from "@/lib/utils";

interface ActivationCardProps {
  className?: string;
  /** "compact" trims paddings for sidebars; "full" for page tops */
  variant?: "full" | "compact";
}

/**
 * The user's "what to do next" card. Driven entirely by activation stage.
 * Renders nothing for S0 (visitor — handled by guest banners) and S3/S4
 * (already converted — zero noise).
 */
export function ActivationCard({ className, variant = "full" }: ActivationCardProps) {
  const navigate = useNavigate();
  const { stage, isLoading, volume } = useActivationStage();

  if (isLoading) return null;
  if (stage === "S0" || stage === "S3" || stage === "S4") return null;

  const isS1 = stage === "S1";
  const isS2 = stage === "S2";

  const Icon = isS1 ? ArrowDownLeft : Target;
  const eyebrow = "You're on Mainnet";
  const title = isS1
    ? "Fund your account to start trading"
    : "Place your first real trade";
  const body = isS1
    ? "Deposit any USDC on Base to trade real markets. Min $1 · arrives in ~30s."
    : "You're funded. Pick a market and place a $1 test order — we'll show you exactly how it settles.";
  const primaryLabel = isS1 ? "Deposit" : "Browse markets";
  const primaryAction = () => {
    trackActivation("card_cta_click", { stage, action: "primary" });
    navigate(isS1 ? "/deposit" : "/events");
  };
  const secondaryLabel = isS1 ? "Use $10 welcome gift" : "Open mainnet campaign";
  const secondaryAction = () => {
    trackActivation("card_cta_click", { stage, action: "secondary" });
    navigate(isS1 ? "/rewards" : "/mainnet-launch");
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-success/30",
        "bg-gradient-to-br from-success/[0.08] via-background to-background",
        variant === "full" ? "p-5" : "p-4",
        className,
      )}
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-success/10 blur-3xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-success">
              {eyebrow}
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold text-foreground sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>

          {isS2 && volume > 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-success" />
              <span className="font-mono">${volume.toFixed(0)}</span>
              <span>traded · next milestone ${ENGAGED_VOLUME_THRESHOLD.toLocaleString()}</span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={primaryAction}
              className="bg-success text-background hover:bg-success/90"
            >
              {primaryLabel}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={secondaryAction}>
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
