import { ArrowRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
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
 * Home identity + asset hero — data card variant.
 *
 * - Card surface (border + rounded-2xl + bg-card) gives the hero a clear boundary.
 * - WELCOME BACK label + username (long names wrap, never ellipsis).
 * - TOTAL EQUITY label + large mono balance.
 * - PnL row with directional arrow.
 * - Sparkline hint (mock path, trading-green) on the right.
 * - Soft trading-green glow accent in bottom-right corner.
 * - Whole card taps to /wallet; Deposit chip stops propagation → /deposit.
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
  const TrendIcon = isProfit ? TrendingUp : TrendingDown;
  const pnlValue = todayPnLPercent.replace(/^[+\-]/, "");

  return (
    <button
      onClick={handleBlockClick}
      className="group relative block w-full overflow-hidden rounded-2xl border border-border/40 bg-card p-5 text-left transition-all duration-300 hover:border-border active:scale-[0.99]"
    >
      {/* Top row: greeting + Deposit chip */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {isAuthed ? "Welcome back" : "Welcome"}
          </p>
          <h1 className="mt-1 break-words text-[17px] font-bold leading-tight text-foreground line-clamp-2">
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
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-2.5 py-1.5 transition-all hover:border-border hover:bg-muted/60"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
              Deposit
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="h-2.5 w-2.5" strokeWidth={3.5} />
            </span>
          </span>
        )}
      </div>

      {/* Body: balance + sparkline OR guest CTA */}
      {isAuthed ? (
        <div className="mt-6 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total equity
            </p>
            <div className="mt-1.5 font-mono text-[34px] font-bold leading-none tracking-tight text-foreground">
              {formatBalance(profile?.balance)}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-mono text-sm font-bold tabular-nums",
                  isProfit ? "text-trading-green" : "text-trading-red",
                )}
              >
                <TrendIcon className="h-3 w-3" strokeWidth={2.75} />
                {pnlValue}
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Today
              </span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="relative h-12 w-24 shrink-0 opacity-70 transition-opacity group-hover:opacity-100">
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="hgSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isProfit ? "hsl(var(--trading-green))" : "hsl(var(--trading-red))"}
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor={isProfit ? "hsl(var(--trading-green))" : "hsl(var(--trading-red))"}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                d="M0 32 Q 15 30 25 22 T 45 24 T 65 10 T 100 14 V 40 H 0 Z"
                fill="url(#hgSparkFill)"
              />
              <path
                d="M0 32 Q 15 30 25 22 T 45 24 T 65 10 T 100 14"
                fill="none"
                stroke={isProfit ? "hsl(var(--trading-green))" : "hsl(var(--trading-red))"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-1.5 text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
          Sign in to start trading
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </div>
      )}

      {/* Soft accent glow */}
      {isAuthed && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full blur-3xl",
            isProfit ? "bg-trading-green/10" : "bg-trading-red/10",
          )}
        />
      )}
    </button>
  );
};
