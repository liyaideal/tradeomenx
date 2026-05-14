import { ArrowRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEquity7D } from "@/hooks/useEquity7D";
import { cn } from "@/lib/utils";

interface HomeGreetingProps {
  onSignIn: () => void;
  /** Deprecated — kept for backward compatibility, no longer rendered. */
  todayPnLPercent?: string;
}

const formatBalance = (n: number | null | undefined) =>
  `$${(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Build a normalized SVG path (line + area) for a 7D equity series.
 * Returns empty paths when there isn't enough variation to draw.
 */
const buildSparkPaths = (points: number[]) => {
  if (points.length < 2) return { line: "", area: "" };
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const W = 100;
  const H = 40;
  const stepX = W / (points.length - 1);

  const coords = points.map((v, i) => {
    const x = i * stepX;
    // Invert: higher value → smaller y (top). Pad 4px top/bottom.
    const y = 4 + (1 - (v - min) / range) * (H - 8);
    return [x, y] as const;
  });

  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  return { line, area };
};

/**
 * Home identity + asset hero — data card variant.
 *
 * 7D PnL + 7D sparkline derived from closed trades (mark-to-market on realized PnL).
 */
export const HomeGreeting = ({ onSignIn }: HomeGreetingProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { username, profile } = useUserProfile();
  const { pnlPercent, points, hasData } = useEquity7D();

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

  const isProfit = pnlPercent >= 0;
  const TrendIcon = isProfit ? TrendingUp : TrendingDown;
  const pnlDisplay = `${isProfit ? "+" : "-"}${Math.abs(pnlPercent).toFixed(1)}%`;
  const { line, area } = buildSparkPaths(points);

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
            {hasData ? (
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-mono text-sm font-bold tabular-nums",
                    isProfit ? "text-trading-green" : "text-trading-red",
                  )}
                >
                  <TrendIcon className="h-3 w-3" strokeWidth={2.75} />
                  {pnlDisplay}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  7D
                </span>
              </div>
            ) : (
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="font-sans text-[12px] font-medium text-muted-foreground">
                  No 7D activity —
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                  Tap deposit to start
                </span>
              </div>
            )}
          </div>

          {/* Sparkline (7D) */}
          <div className="relative h-12 w-24 shrink-0 opacity-70 transition-opacity group-hover:opacity-100">
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              {hasData && line ? (
                <>
                  <defs>
                    <linearGradient id="hgSparkFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={
                          isProfit ? "hsl(var(--trading-green))" : "hsl(var(--trading-red))"
                        }
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          isProfit ? "hsl(var(--trading-green))" : "hsl(var(--trading-red))"
                        }
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path d={area} fill="url(#hgSparkFill)" />
                  <path
                    d={line}
                    fill="none"
                    stroke={isProfit ? "hsl(var(--trading-green))" : "hsl(var(--trading-red))"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <line
                  x1="0"
                  y1="20"
                  x2="100"
                  y2="20"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
              )}
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
      {isAuthed && hasData && (
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
