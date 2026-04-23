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
 * H2E operational entry banner — replicates the reference layout:
 * [Left: badges + headline + CTA] [Center: hero artwork] [Right: $100 reward]
 * Hero artwork is the no-text product visual; all copy is rendered in code.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");

  const LimitedFundBadge = (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-warning/15 border border-warning/40 whitespace-nowrap">
      <span className="text-[10px] font-bold tracking-wider text-warning leading-none">LIMITED FUND</span>
    </span>
  );

  const IndustryFirstBadge = (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/20 border border-primary/50 whitespace-nowrap">
      <span className="text-[10px] font-bold tracking-wider text-primary leading-none">INDUSTRY FIRST</span>
    </span>
  );

  if (effective === "mobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "group w-full text-left rounded-2xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/10 transition-all hover:border-primary/50 hover:shadow-primary/20 bg-black relative",
          className,
        )}
      >
        {/* Hero artwork — full bleed top */}
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <img
            src={heroImage}
            alt="OmenX hedges your Polymarket positions"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content below image */}
        <div className="px-4 py-4 bg-black">
          <div className="flex gap-1.5 mb-3">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>

          <h3 className="text-lg font-bold text-foreground leading-[1.15] tracking-tight mb-1">
            Your Polymarket positions are exposed.
          </h3>
          <p className="text-[13px] text-muted-foreground leading-snug mb-3">
            We'll hedge your exposed positions —{" "}
            <span className="font-semibold text-foreground">for FREE</span>. Earn up to{" "}
            <span className="font-mono font-bold text-foreground">$100</span>.
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/40">
              Get My Free Hedge
              <ArrowRight className="!w-4 !h-4" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase text-right">
              Don't<br />miss out.
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
        "group w-full text-left rounded-2xl overflow-hidden border border-primary/30 shadow-xl shadow-primary/10 transition-all hover:border-primary/50 hover:shadow-primary/25 bg-black relative",
        className,
      )}
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black z-0" />

      <div className="relative z-10 grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,0.9fr)] items-center gap-4 px-6 py-5 min-h-[200px]">
        {/* Left column: badges + headline + sub + CTA */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex gap-2 mb-3">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>

          <h3 className="text-2xl xl:text-[28px] font-extrabold leading-[1.05] tracking-tight mb-3">
            <span className="block text-foreground">MARKETS MOVE FAST.</span>
            <span className="block text-primary">DON'T GET REKT.</span>
          </h3>

          <p className="text-[13px] text-muted-foreground leading-snug mb-4">
            We'll hedge your exposed positions —{" "}
            <span className="font-semibold text-foreground">for FREE</span>.
            <br />
            First come, first served.
          </p>

          <span className="inline-flex w-fit items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/40 transition-transform group-hover:translate-x-0.5">
            Get My Free Hedge
            <ArrowRight className="!w-4 !h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Center: hero artwork — anchors the composition */}
        <div className="relative h-full min-h-[180px] flex items-center justify-center">
          <img
            src={heroImage}
            alt="OmenX hedges your Polymarket losses with $100 reward"
            className="block max-h-[220px] w-auto h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Right column: $100 reward */}
        <div className="flex flex-col items-end justify-center text-right pr-1">
          <span className="text-[10px] font-bold tracking-[0.18em] text-primary uppercase">
            Earn up to
          </span>
          <span className="font-mono text-5xl xl:text-6xl font-bold text-foreground leading-none my-1.5 [text-shadow:_0_0_24px_hsl(var(--primary)/0.5)]">
            $100
          </span>
          <span className="text-[9px] font-bold tracking-[0.18em] text-primary uppercase mb-3">
            Per account · Zero cost
          </span>
          <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase italic">
            Don't miss out.
          </span>
        </div>
      </div>
    </button>
  );
};
