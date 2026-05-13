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
  subtitle?: string;
  tone?: Tone;
  actionLabel?: string;
  onAction?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Unified mobile-home section header. Editorial rhythm with mono eyebrow,
 * tinted icon chip, semantic title and a tracked action link.
 */
export const SectionHeader = ({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  tone = "primary",
  actionLabel,
  onAction,
  rightSlot,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn("mb-3 border-b border-border/40 pb-2.5", className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className={cn(
              "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md",
              TONE_BG[tone],
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
            <h3 className="mt-0.5 text-base font-semibold tracking-tight text-foreground truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
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
    </div>
  );
};
