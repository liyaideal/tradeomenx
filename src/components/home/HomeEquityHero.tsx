import { ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";

const formatBalance = (balance: number | null | undefined) => {
  if (balance == null) return "$0.00";
  return `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface HomeEquityHeroProps {
  onLogin: () => void;
  todayPnL?: string;
  weeklyPnLPercent?: string;
}

/**
 * Preset D · Home KPI Hero card.
 * Used ONLY by `/` (MobileHome). See DESIGN.md §10.
 * Do not reuse on other pages.
 */
export const HomeEquityHero = ({
  onLogin,
  todayPnL = "+$34.56",
  weeklyPnLPercent = "+1.9%",
}: HomeEquityHeroProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const isTodayProfit = todayPnL.startsWith("+");
  const isWeekProfit = weeklyPnLPercent.startsWith("+");

  if (!user) {
    return (
      <button
        onClick={onLogin}
        className="block w-full rounded-2xl border border-trading-green/30 bg-gradient-to-br from-trading-green/[0.08] via-card/40 to-card/20 px-5 pt-5 pb-5 text-left transition-colors hover:from-trading-green/[0.12]"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-trading-green">
          Welcome
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-foreground">Sign in to start trading</p>
          <ChevronRight className="h-5 w-5 text-trading-green" strokeWidth={2.5} />
        </div>
      </button>
    );
  }

  return (
    <section className="rounded-2xl border border-border/40 bg-gradient-to-br from-trading-green/[0.04] via-card/40 to-card/20 px-5 pt-5 pb-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Total equity
      </p>
      <div className="mt-2 font-mono text-[40px] font-bold tracking-tight leading-none text-foreground">
        {formatBalance(profile?.balance)}
      </div>
      <div className="mt-3 flex items-center gap-2.5 font-mono text-[12px]">
        <span className={cn("font-semibold", isTodayProfit ? "text-trading-green" : "text-trading-red")}>
          {todayPnL}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="font-semibold text-muted-foreground">
          7D{" "}
          <span className={isWeekProfit ? "text-trading-green" : "text-trading-red"}>
            {weeklyPnLPercent}
          </span>
        </span>
      </div>
    </section>
  );
};
