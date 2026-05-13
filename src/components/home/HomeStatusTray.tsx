import { useNavigate } from "react-router-dom";
import { ChevronRight, Gift, Sparkles, Check, type LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useActivationState } from "@/hooks/useActivationState";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";
import { cn } from "@/lib/utils";

type Tone = "trading-green" | "trading-yellow" | "primary";

const TONE: Record<Tone, { chip: string; eyebrow: string; ring: string }> = {
  "trading-green": {
    chip: "bg-trading-green/15 text-trading-green",
    eyebrow: "text-trading-green",
    ring: "border-trading-green/25",
  },
  "trading-yellow": {
    chip: "bg-trading-yellow/15 text-trading-yellow",
    eyebrow: "text-trading-yellow",
    ring: "border-trading-yellow/25",
  },
  primary: {
    chip: "bg-primary/15 text-primary",
    eyebrow: "text-primary",
    ring: "border-primary/25",
  },
};

interface TrayCardProps {
  icon: LucideIcon;
  tone: Tone;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
  width?: number;
}

const TrayCard = ({
  icon: Icon,
  tone,
  eyebrow,
  title,
  subtitle,
  badge,
  onClick,
  width = 260,
}: TrayCardProps) => {
  const t = TONE[tone];
  return (
    <button
      onClick={onClick}
      style={{ width }}
      className={cn(
        "flex-shrink-0 snap-start rounded-2xl border bg-card p-3.5 text-left transition-colors hover:bg-card-hover",
        t.ring,
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl", t.chip)}>
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className={cn("font-mono text-[9px] font-semibold uppercase tracking-[0.18em]", t.eyebrow)}>
              {eyebrow}
            </p>
            {badge && (
              <span className="rounded bg-trading-yellow px-1 py-px font-mono text-[8px] font-bold uppercase tracking-wider text-background">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground/60" />
      </div>
    </button>
  );
};

export const HomeStatusTray = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, hasDeposited, hasTraded, isLoading } = useActivationState();
  const { pendingAirdrops } = useAirdropPositions();

  if (!user || isLoading) {
    // Always show campaign card so guests / loading still see something useful
    return (
      <section aria-label="Status" className="-mx-4">
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
          <TrayCard
            icon={Sparkles}
            tone="primary"
            eyebrow="Campaign"
            title="Trade once. Earn $200."
            subtitle="$5K weekly pool · 14d left"
            onClick={() => navigate("/mainnet-launch")}
            width={280}
          />
        </div>
      </section>
    );
  }

  const cards: React.ReactNode[] = [];

  // Activation card (only when not yet active)
  if (state === "S0_NEW" || state === "S1_DEPOSITED") {
    const steps = [
      { label: "Verify your account", done: true },
      { label: "Deposit USDC on Base", done: hasDeposited },
      { label: "Place your first trade", done: hasTraded },
    ];
    const completed = steps.filter((s) => s.done).length;
    const currentIdx = steps.findIndex((s) => !s.done);
    const current = currentIdx >= 0 ? steps[currentIdx] : steps[steps.length - 1];
    const action = !hasDeposited ? "/deposit" : "/events";

    cards.push(
      <button
        key="activation"
        onClick={() => navigate(action)}
        style={{ width: 280 }}
        className={cn(
          "flex-shrink-0 snap-start rounded-2xl border bg-card p-3.5 text-left transition-colors hover:bg-card-hover",
          TONE["trading-green"].ring,
        )}
      >
        <div className="flex items-start gap-3">
          <span className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl", TONE["trading-green"].chip)}>
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-trading-green">
              Onboarding {completed}/3
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{current.label}</p>
            <div className="mt-1.5 flex items-center gap-1">
              {steps.map((s, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    s.done
                      ? "bg-trading-green"
                      : i === currentIdx
                        ? "bg-trading-green/40"
                        : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
          <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground/60" />
        </div>
      </button>,
    );
  }

  if (pendingAirdrops.length > 0) {
    cards.push(
      <TrayCard
        key="airdrop"
        icon={Gift}
        tone="trading-yellow"
        eyebrow="Airdrop"
        title={`${pendingAirdrops.length} Airdrop${pendingAirdrops.length > 1 ? "s" : ""} pending`}
        subtitle="Trade to activate counter-positions"
        badge="New"
        onClick={() => navigate("/portfolio/airdrops")}
        width={260}
      />,
    );
  }

  cards.push(
    <TrayCard
      key="campaign"
      icon={Sparkles}
      tone="primary"
      eyebrow="Campaign"
      title="Trade once. Earn $200."
      subtitle="$5K weekly pool · 14d left"
      onClick={() => navigate("/mainnet-launch")}
      width={260}
    />,
  );

  if (cards.length === 0) return null;

  return (
    <section aria-label="Status" className="-mx-4">
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
        {cards}
      </div>
    </section>
  );
};
