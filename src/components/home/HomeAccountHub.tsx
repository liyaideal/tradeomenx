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
      className="relative overflow-hidden rounded-2xl border border-trading-green/30 bg-gradient-to-br from-trading-green/[0.08] via-background to-background p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-trading-green">Mainnet · Activation</p>
          <h2 className="mt-0.5 text-base font-semibold text-foreground">{headline}</h2>
        </div>
        <span className="font-mono text-xs text-muted-foreground flex-shrink-0 mt-1">{completed}/{steps.length}</span>
      </div>

      {variant === "funded" && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <span className="text-xs text-muted-foreground">Available balance</span>
          <span className="font-mono text-sm font-semibold text-foreground">{formatBalance(balance)}</span>
        </div>
      )}

      <ol className="space-y-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
                step.done ? "border-trading-green/30 bg-trading-green/5" : "border-border/50 bg-muted/20",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                  step.done ? "bg-trading-green/20 text-trading-green" : "bg-muted text-muted-foreground",
                )}
              >
                {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="font-mono text-xs font-semibold">{idx + 1}</span>}
              </div>
              <div className="min-w-0 flex-1 flex items-center gap-1.5">
                <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", step.done ? "text-trading-green" : "text-muted-foreground")} />
                <p className={cn("truncate text-sm", step.done ? "text-muted-foreground line-through" : "text-foreground font-medium")}>
                  {step.label}
                </p>
              </div>
              {!step.done && step.action && (
                <button
                  onClick={step.action}
                  className="flex flex-shrink-0 items-center gap-1 rounded-md bg-trading-green px-2.5 py-1.5 text-xs font-semibold text-background hover:bg-trading-green/90 transition-colors"
                >
                  {step.cta}
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </li>
          );
        })}
      </ol>
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
