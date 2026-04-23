import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HedgeEntryBannerProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * H2E operational entry banner.
 * High-impact layout: scarcity badges + loss-aversion headline (left)
 * with a hero $100 figure as visual anchor (right).
 * Routes users to /hedge landing page on click.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");
  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/hedge");
  };

  const LimitedFundBadge = (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-warning/15 border border-warning/30 whitespace-nowrap">
      <span className="text-[10px] font-bold tracking-wider text-warning leading-none">LIMITED FUND</span>
    </span>
  );

  const IndustryFirstBadge = (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/20 border border-primary/40 whitespace-nowrap">
      <span className="text-[10px] font-bold tracking-wider text-primary leading-none">INDUSTRY FIRST</span>
    </span>
  );

  if (effective === "mobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "group w-full text-left rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg shadow-primary/10 px-4 py-5 transition-all hover:border-primary/50 hover:shadow-primary/20 overflow-hidden relative",
          className,
        )}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3 mb-3">
          <div className="flex gap-1.5">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[9px] font-medium tracking-wider text-muted-foreground uppercase leading-none">Earn up to</span>
            <span className="font-mono text-3xl font-bold text-foreground leading-none mt-0.5">$100</span>
          </div>
        </div>

        <h3 className="relative text-lg font-bold text-foreground leading-tight mb-1.5">
          Your Polymarket positions are exposed.
        </h3>
        <p className="relative text-[13px] text-muted-foreground leading-snug mb-4">
          We'll hedge them — for free. First come, first served.
        </p>

        <div className="relative flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30">
            Get My Free Hedge
            <ArrowRight className="!w-4 !h-4" />
          </span>
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Per account · <span className="font-mono">$0</span> cost
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group w-full text-left rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/10 px-8 py-7 transition-all hover:border-primary/50 hover:shadow-primary/20 overflow-hidden relative",
        className,
      )}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex items-center justify-between gap-8">
        {/* Left: badges + headline + CTA */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-3">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>

          <h3 className="text-2xl lg:text-[28px] font-bold text-foreground leading-[1.15] tracking-tight mb-2">
            Your Polymarket positions are exposed.
          </h3>
          <p className="text-sm text-muted-foreground leading-snug mb-4">
            We'll hedge them — for free. First come, first served.
          </p>

          <span
            onClick={handleCTAClick}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30 transition-transform group-hover:translate-x-0.5"
          >
            Get My Free Hedge
            <ArrowRight className="!w-4 !h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Right: hero $100 */}
        <div className="flex flex-col items-end shrink-0 pl-4">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Earn up to
          </span>
          <span className="font-mono text-6xl lg:text-7xl font-bold text-foreground leading-none my-1">
            $100
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Per account · Zero cost
          </span>
        </div>
      </div>
    </button>
  );
};
