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

const STEP_DESCRIPTIONS: Record<string, string> = {
  verify: "Quick KYC unlocks deposits and trading.",
  deposit: "Send USDC on Base to start trading with real capital.",
  trade: "Open any market to unlock launch campaign rebates.",
};

const ActivationCard = ({
  balance,
  hasDeposited,
  hasTraded,
}: {
  balance: number | null | undefined;
  hasDeposited: boolean;
  hasTraded: boolean;
}) => {
  const navigate = useNavigate();
  const steps = [
    { id: "verify", label: "Verify your account", done: true, action: () => navigate("/settings"), cta: "Verify" },
    { id: "deposit", label: "Deposit USDC on Base", done: hasDeposited, action: () => navigate("/deposit"), cta: "Deposit USDC" },
    { id: "trade", label: "Place your first trade", done: hasTraded, action: () => navigate("/events"), cta: "Browse markets" },
  ];
  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const currentIdx = steps.findIndex((s) => !s.done);
  const current = currentIdx >= 0 ? steps[currentIdx] : steps[steps.length - 1];
  const showBalance = hasDeposited;

  return (
    <section
      aria-label="Activation"
      className="relative overflow-hidden rounded-2xl border border-trading-green/25 bg-card p-4 shadow-[0_1px_0_0_hsl(var(--border)/0.4)_inset,0_20px_40px_-24px_hsl(var(--trading-green)/0.22)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-trading-green/[0.08] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-trading-green/15 blur-3xl"
      />

      <div className="relative">
        {/* Eyebrow row: step counter + balance/get started */}
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Step {Math.min(currentIdx + 1, total)} of {total}
          </p>
          {showBalance ? (
            <span className="font-mono text-xs font-semibold text-foreground">
              {formatBalance(balance)}
            </span>
          ) : (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-trading-green">
              Get started
            </span>
          )}
        </div>

        {/* Progress dot bar */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {steps.map((s, i) => {
            const isDone = s.done;
            const isActive = i === currentIdx;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors",
                    isDone && "bg-trading-green",
                    isActive && "bg-trading-green ring-2 ring-trading-green/30",
                    !isDone && !isActive && "bg-muted",
                  )}
                />
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1 transition-colors",
                      i < completed ? "bg-trading-green/60" : "bg-border/60",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Hero: current step name */}
        <h2 className="mt-3.5 text-xl font-semibold tracking-tight text-foreground leading-snug">
          {current.label}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {STEP_DESCRIPTIONS[current.id]}
        </p>

        {/* Single full-width CTA */}
        <button
          onClick={current.action}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-trading-green px-4 py-3 text-sm font-semibold text-background hover:bg-trading-green/90 transition-colors shadow-[0_8px_20px_-8px_hsl(var(--trading-green)/0.55)]"
        >
          {current.cta}
          <ChevronRight className="h-4 w-4" strokeWidth={3} />
        </button>
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
