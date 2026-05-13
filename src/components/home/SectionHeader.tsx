import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "trading-green" | "trading-red" | "trading-yellow" | "trading-purple" | "muted";

const TONE_BG: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  "trading-green": "bg-trading-green/10 text-trading-green",
  "trading-red": "bg-trading-red/10 text-trading-red",
  "trading-yellow": "bg-trading-yellow/10 text-trading-yellow",
  "trading-purple": "bg-trading-purple/10 text-trading-purple",
  muted: "bg-muted/40 text-muted-foreground",
};

interface SectionHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  tone?: Tone;
  actionLabel?: string;
  onAction?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Compact mobile-home section header. Inline eyebrow · title on a single line.
 */
export const SectionHeader = ({
  icon: Icon,
  eyebrow,
  title,
  tone = "primary",
  actionLabel,
  onAction,
  rightSlot,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn("mb-2.5 flex items-center justify-between gap-3 border-b border-border/40 pb-2", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md",
            TONE_BG[tone],
          )}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} />
        </span>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <span className="text-muted-foreground/40">·</span>
        <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
          {title}
        </h3>
      </div>
      {rightSlot ? (
        rightSlot
      ) : actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="flex flex-shrink-0 items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors"
        >
          {actionLabel}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
};
