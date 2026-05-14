import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";

interface HomeGreetingProps {
  onSignIn: () => void;
  /** Mock-friendly daily PnL string, e.g. "+1.9%" / "-0.4%". */
  todayPnLPercent?: string;
}

const formatBalance = (n: number | null | undefined) =>
  `$${(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Home identity + asset header — minimalist refresh.
 *
 * Layout:
 *   ┌────────────────────────────────────────┐
 *   │ Hello,                  DEPOSIT  (+)   │
 *   │ TRADER                                  │
 *   │                                         │
 *   │ $0.00     TODAY  +1.9%                  │
 *   └────────────────────────────────────────┘
 *
 * - Whole block tap → /wallet (auth) or onSignIn() (guest).
 * - Top-right ghost "Deposit" chip → /deposit (stops propagation).
 * - Guest: chip hidden; balance row replaced by "Sign in to trade →".
 */
export const HomeGreeting = ({ onSignIn, todayPnLPercent = "+1.9%" }: HomeGreetingProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { username, profile } = useUserProfile();

  const isAuthed = !!user;
  const displayName = isAuthed
    ? (username || user?.email?.split("@")[0] || "trader").replace(/_/g, " ")
    : "there";

  const handleDeposit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigate("/deposit");
  };

  const handleBlockClick = () => {
    if (isAuthed) navigate("/wallet");
    else onSignIn();
  };

  const isProfit = todayPnLPercent.startsWith("+");

  return (
    <button
      onClick={handleBlockClick}
      className="group flex w-full flex-col gap-3 text-left"
    >
      {/* Row 1: Greeting + Deposit ghost chip */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-[14px] font-medium leading-tight text-muted-foreground">
            Hello,
          </p>
          <h1 className="truncate text-[24px] font-bold uppercase leading-tight tracking-tight text-foreground">
            {displayName}
          </h1>
        </div>

        {isAuthed && (
          <span
            onClick={handleDeposit}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleDeposit(e);
              }
            }}
            aria-label="Deposit"
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-muted-foreground transition-colors hover:text-trading-green"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
              Deposit
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border/60 transition-all group-hover:border-trading-green/50 group-hover:bg-trading-green/10">
              <Plus className="h-3 w-3" strokeWidth={2.75} />
            </span>
          </span>
        )}
      </div>

      {/* Row 2: Balance + Today PnL  /  Guest CTA */}
      {isAuthed ? (
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[34px] font-bold leading-none tracking-tight text-foreground">
            {formatBalance(profile?.balance)}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Today
            </span>
            <span
              className={cn(
                "font-mono text-sm font-bold tabular-nums",
                isProfit ? "text-trading-green" : "text-trading-red",
              )}
            >
              {todayPnLPercent}
            </span>
          </div>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1 text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
          Sign in to trade
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
};
