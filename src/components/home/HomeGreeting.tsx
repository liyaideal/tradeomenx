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
 * Home identity + asset header (merged Greeting + Equity).
 *
 * Layout:
 *   ┌────────────────────────────────────────┐
 *   │ Hello,                            [+]  │
 *   │ DISPLAY_NAME                           │
 *   │ <metadata line>          → Wallet      │
 *   └────────────────────────────────────────┘
 *
 * - Guest:  metadata = "Sign in to trade"; tap-area opens AuthSheet.
 * - Authed: metadata = "$balance · Today ±x%"; tap-area → /wallet.
 * - `+` button keeps its own action (deposit / sign-in) and stops propagation.
 */
export const HomeGreeting = ({ onSignIn, todayPnLPercent = "+1.9%" }: HomeGreetingProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { username, profile } = useUserProfile();

  const isAuthed = !!user;
  const displayName = isAuthed
    ? (username || user?.email?.split("@")[0] || "trader").replace(/_/g, " ")
    : "there";

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthed) navigate("/deposit");
    else onSignIn();
  };

  const handleBlockClick = () => {
    if (isAuthed) navigate("/wallet");
    else onSignIn();
  };

  const isProfit = todayPnLPercent.startsWith("+");

  return (
    <button
      onClick={handleBlockClick}
      className="group flex w-full items-start justify-between gap-3 text-left"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-tight text-muted-foreground">Hello,</p>
        <h1 className="mt-0.5 truncate text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-foreground">
          {displayName}
        </h1>

        {/* Metadata row — merged equity / sign-in CTA */}
        <div className="mt-1.5 flex items-center gap-2 text-[12px]">
          {isAuthed ? (
            <>
              <span className="font-mono text-[15px] font-semibold tabular-nums text-foreground">
                {formatBalance(profile?.balance)}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span
                className={cn(
                  "font-mono font-semibold tabular-nums",
                  isProfit ? "text-trading-green" : "text-trading-red",
                )}
              >
                Today {todayPnLPercent}
              </span>
              <span className="ml-auto inline-flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                Wallet
                <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground transition-colors group-hover:text-primary">
              Sign in to trade
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          )}
        </div>
      </div>

      <span
        onClick={handlePlus}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePlus(e as unknown as React.MouseEvent);
          }
        }}
        aria-label={isAuthed ? "Deposit" : "Sign in"}
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 hover:opacity-90"
      >
        <Plus className="h-5 w-5" strokeWidth={2.75} />
      </span>
    </button>
  );
};
