import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";

const formatBalance = (balance: number | null | undefined) => {
  if (balance == null) return "$0.00";
  return `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface HomeKPIHeaderProps {
  rightSlot: React.ReactNode;
  onLogin: () => void;
  weeklyPnL?: string;
  weeklyPnLPercent?: string;
}

export const HomeKPIHeader = ({
  rightSlot,
  onLogin,
  weeklyPnL = "+$34.56",
  weeklyPnLPercent = "+1.9%",
}: HomeKPIHeaderProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const isProfit = weeklyPnL.startsWith("+");
  const isPctProfit = weeklyPnLPercent.startsWith("+");

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/40 px-5 pt-5 pb-5">
      {/* Row 1: brand + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Logo size="md" showMainnetBadge={false} />
          <span className="flex items-center gap-1 rounded-full border border-trading-green/30 bg-trading-green/10 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-trading-green animate-pulse" />
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-trading-green">
              Mainnet
            </span>
          </span>
        </div>
        <div className="flex-shrink-0">{rightSlot}</div>
      </div>

      {/* Row 2: KPI / CTA */}
      {user ? (
        <div className="mt-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Total equity
          </p>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-4xl font-bold tracking-tight text-foreground leading-none">
              {formatBalance(profile?.balance)}
            </span>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                isProfit ? "text-trading-green" : "text-trading-red",
              )}
            >
              {weeklyPnL}
            </span>
          </div>

          {/* Sub metrics group */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                7D Change
              </span>
              <span
                className={cn(
                  "font-mono text-[15px] font-bold leading-none",
                  isPctProfit ? "text-trading-green" : "text-trading-red",
                )}
              >
                {weeklyPnLPercent}
              </span>
            </div>
            <div className="h-7 w-px bg-border/60" />
            <div className="flex flex-col gap-0.5 text-right">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Available
              </span>
              <span className="font-mono text-[15px] font-bold leading-none text-foreground">
                {formatBalance(profile?.balance)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-trading-green/30 bg-trading-green/10 px-4 py-3 text-left transition-colors hover:bg-trading-green/15"
        >
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-trading-green">
              Welcome
            </p>
            <p className="text-sm font-semibold text-foreground">Sign in to start trading</p>
          </div>
          <ChevronRight className="h-4 w-4 text-trading-green" strokeWidth={2.5} />
        </button>
      )}
    </header>
  );
};
