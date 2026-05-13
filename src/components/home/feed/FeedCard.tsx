import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  /** Top-left tag, e.g. "Trending", "Onboarding". Sentence/Title case OK. */
  tag: string;
  /** Optional small element on the top-right (e.g. countdown, dismiss). */
  meta?: ReactNode;
  /** Card body. */
  children: ReactNode;
  /** Optional click handler (turns the whole card into a button). */
  onClick?: () => void;
  className?: string;
}

/**
 * Shared visual shell for every Home feed item.
 *
 * Strict rules (do NOT override per-card):
 *  - shell: rounded-2xl border border-border/40 bg-card p-4
 *  - tag:   text-[10px] uppercase tracking-[0.2em] text-muted-foreground
 *  - one accent allowed inside (primary / trading-green|red / trading-yellow)
 *
 * No background gradients, no colored borders, no decorative imagery.
 */
export const FeedCard = ({ tag, meta, children, onClick, className }: FeedCardProps) => {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "block w-full rounded-2xl border border-border/40 bg-card p-4 text-left transition-colors",
        onClick && "hover:bg-card-hover active:scale-[0.998]",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {tag}
        </span>
        {meta && <span className="text-[11px] text-muted-foreground">{meta}</span>}
      </div>
      {children}
    </Wrapper>
  );
};
