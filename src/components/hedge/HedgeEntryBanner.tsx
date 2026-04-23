import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hedge-banner-hero.png";

interface HedgeEntryBannerProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * H2E operational entry banner.
 * High-impact layout featuring a dramatic hero image (Polymarket loss vs OmenX hedge)
 * as the visual centerpiece, framed by scarcity badges and a clear CTA.
 * Routes users to /hedge landing page on click.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");

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
          "group w-full text-left rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg shadow-primary/10 overflow-hidden relative transition-all hover:border-primary/50 hover:shadow-primary/20",
          className,
        )}
      >
        {/* Hero image — full bleed top */}
        <div className="relative w-full aspect-[2/1] overflow-hidden bg-black">
          <img
            src={heroImage}
            alt="OmenX hedges your Polymarket positions"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Top badges overlay */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>
        </div>

        {/* Content below image */}
        <div className="px-4 py-4">
          <h3 className="text-base font-bold text-foreground leading-tight mb-1">
            Your Polymarket positions are exposed.
          </h3>
          <p className="text-[13px] text-muted-foreground leading-snug mb-3">
            We'll hedge them — for free. Earn up to <span className="font-mono font-semibold text-foreground">$100</span>.
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30">
              Get My Free Hedge
              <ArrowRight className="!w-4 !h-4" />
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase text-right">
              First come<br />first served
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group w-full text-left rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/10 overflow-hidden relative transition-all hover:border-primary/50 hover:shadow-primary/20",
        className,
      )}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl z-0" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-primary/10 blur-3xl z-0" />

      <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5">
        {/* Left: badges + headline + CTA */}
        <div className="min-w-0">
          <div className="flex gap-2 mb-3">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>

          <h3 className="text-2xl lg:text-[26px] font-bold text-foreground leading-[1.15] tracking-tight mb-2">
            Your Polymarket positions are exposed.
          </h3>
          <p className="text-sm text-muted-foreground leading-snug mb-4">
            We'll hedge them — for free. First come, first served.
          </p>

          <span
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30 transition-transform group-hover:translate-x-0.5"
          >
            Get My Free Hedge
            <ArrowRight className="!w-4 !h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Center: hero image */}
        <div className="relative h-[180px] lg:h-[200px] aspect-[2/1] rounded-xl overflow-hidden bg-black shadow-2xl shadow-primary/20 ring-1 ring-primary/20">
          <img
            src={heroImage}
            alt="OmenX hedges your Polymarket losses"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right: hero $100 */}
        <div className="flex flex-col items-end justify-center pl-2">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Earn up to
          </span>
          <span className="font-mono text-5xl lg:text-6xl font-bold text-foreground leading-none my-1">
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
