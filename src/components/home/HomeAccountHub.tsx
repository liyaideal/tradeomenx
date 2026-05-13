import { useNavigate } from "react-router-dom";
import { ArrowDownToLine, TrendingUp, ChevronRight, Check, ShieldCheck, LineChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useActivationState } from "@/hooks/useActivationState";
import { cn } from "@/lib/utils";

const formatBalance = (balance: number | null | undefined) => {
  if (balance == null) return "$0.00";
  return `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const GuestWelcomeCard = ({ onLogin }: { onLogin: () => void }) => {
  const features = [
    { icon: TrendingUp, label: "Up to 10x leverage", desc: "Amplify your positions", color: "text-trading-green", bgColor: "bg-trading-green/20" },
    { icon: LineChart, label: "Pro trading tools", desc: "Charts, orderbook & more", color: "text-primary", bgColor: "bg-primary/20" },
    { icon: Sparkles, label: "Trending events", desc: "Crypto, sports, politics & pop culture", color: "text-trading-yellow", bgColor: "bg-trading-yellow/20" },
  ];
  return (
    <div className="trading-card p-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Trade the future</h2>
        <p className="text-sm text-muted-foreground mt-1">Predict outcomes. Maximize returns.</p>
      </div>
      <div className="space-y-2">
        {features.map((f, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className={`w-9 h-9 rounded-lg ${f.bgColor} flex items-center justify-center flex-shrink-0`}>
              <f.icon className={`h-4 w-4 ${f.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{f.label}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full bg-trading-green hover:bg-trading-green/90 text-white font-medium h-11" onClick={onLogin}>
        Start trading
      </Button>
    </div>
  );
};

const ActivationCard = ({
  variant,
  balance,
  hasDeposited,
  hasTraded,
}: {
  variant: "onboarding" | "funded";
  balance: number | null | undefined;
  hasDeposited: boolean;
  hasTraded: boolean;
}) => {
  const navigate = useNavigate();
  const steps = [
    { id: "verify", label: "Verify your account", icon: ShieldCheck, done: true, action: null, cta: "" },
    { id: "deposit", label: "Deposit USDC on Base", icon: ArrowDownToLine, done: hasDeposited, action: () => navigate("/deposit"), cta: "Deposit" },
    { id: "trade", label: "Place your first trade", icon: TrendingUp, done: hasTraded, action: () => navigate("/events"), cta: "Browse markets" },
  ];
  const completed = steps.filter((s) => s.done).length;
  const headline = variant === "onboarding" ? "Start trading in 3 steps" : "You're funded — make your first trade";

  return (
    <section
      aria-label="Mainnet activation"
      className="relative overflow-hidden rounded-2xl border border-trading-green/25 bg-card p-5 shadow-[0_1px_0_0_hsl(var(--border)/0.4)_inset,0_24px_48px_-24px_hsl(var(--trading-green)/0.25)]"
    >
      {/* Subtle ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-trading-green/[0.10] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-trading-green/15 blur-3xl"
      />

      <div className="relative">
        {/* Eyebrow */}
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-trading-green/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-trading-green" />
            </span>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-trading-green">
              Mainnet · Activation
            </p>
          </div>
          <span className="font-mono text-[11px] font-semibold text-muted-foreground rounded-md border border-border/50 bg-background/40 px-1.5 py-0.5">
            {completed}/{steps.length}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
          {headline}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {variant === "onboarding"
            ? "Three quick steps to unlock real-money trading."
            : "One step left — place a trade to start earning."}
        </p>

        {/* Balance row */}
        {variant === "funded" && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3.5 py-3 backdrop-blur-sm">
            <span className="text-xs text-muted-foreground">Available balance</span>
            <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
              {formatBalance(balance)}
            </span>
          </div>
        )}

        {/* Steps */}
        <ol className="mt-4 space-y-2.5">
          {steps.map((step, idx) => {
            const isActive = !step.done && idx === completed;
            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                  step.done && "border-border/30 bg-transparent opacity-60",
                  isActive && "border-trading-green/30 bg-trading-green/[0.06]",
                  !step.done && !isActive && "border-border/40 bg-background/30",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                    step.done
                      ? "bg-trading-green/15 text-trading-green"
                      : isActive
                      ? "bg-trading-green text-background"
                      : "bg-muted/60 text-muted-foreground",
                  )}
                >
                  {step.done ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    <span className="font-mono text-[11px] font-semibold">{idx + 1}</span>
                  )}
                </div>
                <p
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm",
                    step.done
                      ? "text-muted-foreground line-through decoration-muted-foreground/50"
                      : "font-medium text-foreground",
                  )}
                >
                  {step.label}
                </p>
                {isActive && step.action && (
                  <button
                    onClick={step.action}
                    className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-trading-green px-3 py-1.5 text-xs font-semibold text-background hover:bg-trading-green/90 transition-colors shadow-[0_4px_14px_-4px_hsl(var(--trading-green)/0.6)]"
                  >
                    {step.cta}
                    <ChevronRight className="h-3 w-3" strokeWidth={3} />
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

const UserStatsCard = ({
  username,
  balance,
  weeklyPnL,
  weeklyPnLPercent,
}: {
  username: string | null;
  balance: number | null | undefined;
  weeklyPnL: string;
  weeklyPnLPercent: string;
}) => (
  <div className="trading-card p-4 space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Hello, {username || "Trader"}!</h2>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-muted-foreground">7-day P&L</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-trading-green">{weeklyPnL}</span>
        <span className="text-sm text-trading-green">({weeklyPnLPercent})</span>
      </div>
    </div>
    <div className="pt-2 border-t border-border">
      <span className="text-xs text-muted-foreground">Available balance</span>
      <div className="text-2xl font-bold text-foreground">{formatBalance(balance)}</div>
    </div>
  </div>
);

interface HomeAccountHubProps {
  onLogin: () => void;
}

export const HomeAccountHub = ({ onLogin }: HomeAccountHubProps) => {
  const { user } = useAuth();
  const { profile, username } = useUserProfile();
  const { state, hasDeposited, hasTraded, isLoading } = useActivationState();

  // Mock weekly PnL — preserved from previous implementation
  const weeklyPnL = "+$34.56";
  const weeklyPnLPercent = "+1.9%";

  if (!user) return <GuestWelcomeCard onLogin={onLogin} />;
  if (isLoading) return <div className="trading-card p-4 h-32 animate-pulse" />;

  if (state === "S0_NEW") {
    return <ActivationCard variant="onboarding" balance={profile?.balance} hasDeposited={hasDeposited} hasTraded={hasTraded} />;
  }
  if (state === "S1_DEPOSITED") {
    return <ActivationCard variant="funded" balance={profile?.balance} hasDeposited={hasDeposited} hasTraded={hasTraded} />;
  }
  return (
    <UserStatsCard
      username={username}
      balance={profile?.balance}
      weeklyPnL={weeklyPnL}
      weeklyPnLPercent={weeklyPnLPercent}
    />
  );
};
