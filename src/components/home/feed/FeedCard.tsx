import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FeedTier = 1 | 2 | 3;
export type FeedAccent = "primary" | "green" | "red" | "yellow" | "none";

interface FeedCardProps {
  /** Top-left tag, e.g. "Trending", "Onboarding". Sentence/Title case OK. Hidden when compact. */
  tag: string;
  /** Optional small element on the top-right (e.g. countdown, dismiss). */
  meta?: ReactNode;
  /** Card body. */
  children: ReactNode;
  /** Optional click handler (turns the whole card into a button). */
  onClick?: () => void;
  /** Visual hierarchy tier. Defaults to 3 (browse). */
  tier?: FeedTier;
  /** Accent color (left bar for tier 1; meta tint for tier 2). */
  accent?: FeedAccent;
  /** Compact mode — used for 2nd+ consecutive same-kind item. */
  compact?: boolean;
  className?: string;
}

const accentBarMap: Record<FeedAccent, string> = {
  primary: "bg-primary",
  green: "bg-trading-green",
  red: "bg-trading-red",
  yellow: "bg-trading-yellow",
  none: "",
};

/**
 * Shared visual shell for every Home feed item.
 *
 * Rules:
 *  - shell: rounded-2xl border border-border/40 bg-card
 *  - tier 1 (personal): p-4 + 2px left accent bar
 *  - tier 2 (opportunity): p-4, accent only on meta
 *  - tier 3 (browse): p-3.5, no accent
 *  - compact: hide tag, p-3 (used for repeated kinds)
 *
 * One accent allowed inside (primary / trading-green|red|yellow).
 * No background gradients, no decorative imagery.
 */
export const FeedCard = ({
  tag,
  meta,
  children,
  onClick,
  tier = 3,
  accent = "none",
  compact = false,
  className,
}: FeedCardProps) => {
  const Wrapper = onClick ? "button" : "div";
  const showAccentBar = tier === 1 && accent !== "none" && !compact;

  const padding = compact ? "p-3" : tier === 3 ? "p-3.5" : "p-4";

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "relative block w-full overflow-hidden rounded-2xl border border-border/40 bg-card text-left transition-colors",
        padding,
        onClick && "hover:bg-card-hover active:scale-[0.998]",
        showAccentBar && "pl-[14px]",
        className,
      )}
    >
      {showAccentBar && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-2 left-0 w-[2px] rounded-r-full",
            accentBarMap[accent],
          )}
        />
      )}
      {!compact && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {tag}
          </span>
          {meta && <span className="text-[11px] text-muted-foreground">{meta}</span>}
        </div>
      )}
      {children}
    </Wrapper>
  );
};
