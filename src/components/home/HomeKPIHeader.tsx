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

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/40 px-4 pt-3 pb-3">
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
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">
              Total equity
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[26px] font-semibold tracking-tight text-foreground leading-none">
                {formatBalance(profile?.balance)}
              </span>
              <span
                className={cn(
                  "font-mono text-xs font-medium",
                  isProfit ? "text-trading-green" : "text-trading-red",
                )}
              >
                {weeklyPnL}
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pb-1">
            7d {weeklyPnLPercent}
          </span>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-trading-green/30 bg-trading-green/10 px-3.5 py-2.5 text-left transition-colors hover:bg-trading-green/15"
        >
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-trading-green">
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
