import { useNavigate } from "react-router-dom";
import { Gift, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HedgeEntryBannerProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * H2E operational entry banner.
 * Routes users to /hedge landing page on click.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");

  const Pill = (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase shrink-0">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-foreground" />
      </span>
      <Gift className="!w-3 !h-3" />
      H2E LIVE
    </span>
  );

  if (effective === "mobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "w-full text-left rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 shadow-sm shadow-primary/10 px-3.5 py-3 transition-colors hover:border-primary/50 hover:from-primary/20",
          className,
        )}
      >
        <div className="flex items-center gap-2 mb-1.5">
          {Pill}
          <span className="text-sm font-semibold text-foreground leading-tight truncate">
            Hedge your Polymarket positions — for free
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 pl-0">
          <p className="text-[11px] text-muted-foreground leading-snug truncate">
            Up to <span className="font-mono text-foreground">$100</span> free credit · Read-only · <span className="font-mono">$0</span> cost
          </p>
          <ArrowUpRight className="!w-4 !h-4 text-primary shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group w-full text-left rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 shadow-sm shadow-primary/10 px-5 py-3 transition-all hover:border-primary/50 hover:from-primary/20 hover:shadow-primary/20",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {Pill}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-semibold text-foreground truncate">
            Hedge your Polymarket positions — for free
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground truncate hidden md:inline">
            Up to <span className="font-mono text-foreground">$100</span> in free trading credit · Read-only access · <span className="font-mono">$0</span> cost
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary/80 shrink-0">
          Try Hedge-to-Earn
          <ArrowUpRight className="!w-4 !h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </button>
  );
};
