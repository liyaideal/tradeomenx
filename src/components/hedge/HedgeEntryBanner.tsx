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
 * Hero image is fused into the card background using mask gradients
 * and blend modes — not a discrete tile — for a high-impact, cohesive feel.
 * Routes to /hedge on click.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");

  const LimitedFundBadge = (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-warning/15 border border-warning/30 backdrop-blur-sm whitespace-nowrap">
      <span className="text-[10px] font-bold tracking-wider text-warning leading-none">LIMITED FUND</span>
    </span>
  );

  const IndustryFirstBadge = (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/20 border border-primary/40 backdrop-blur-sm whitespace-nowrap">
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
        {/* Background image — full bleed, low opacity, blended */}
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity pointer-events-none"
          loading="lazy"
        />
        {/* Primary tint over image to align with brand color */}
        <div className="pointer-events-none absolute inset-0 bg-primary/20 mix-blend-overlay" />
        {/* Vertical readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-card/85 via-card/60 to-card/95" />
        {/* Glow accents */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 px-4 py-4">
          <div className="flex gap-1.5 mb-3">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>

          <h3 className="text-base font-bold text-foreground leading-tight mb-1 [text-shadow:_0_1px_8px_hsl(var(--card)/0.8)]">
            Your Polymarket positions are exposed.
          </h3>
          <p className="text-[13px] text-muted-foreground leading-snug mb-3">
            We'll hedge them — for free. Earn up to{" "}
            <span className="font-mono font-semibold text-foreground">$100</span>.
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/40">
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
      {/* Hero image — fused into right half of card background */}
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-y-0 right-0 h-full w-[65%] object-cover object-left pointer-events-none select-none"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 35%, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%, black 100%)",
        }}
        loading="lazy"
      />
      {/* Primary tint over image — pulls it into brand color */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[65%] bg-primary/25 mix-blend-overlay"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 35%, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%, black 100%)",
        }}
      />
      {/* Left-side readability gradient — ensures text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />

      {/* Background glow accents */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl z-0" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-primary/10 blur-3xl z-0" />

      <div className="relative z-10 grid grid-cols-[3fr_2fr] items-center gap-6 px-6 py-6">
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

          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/40 transition-transform group-hover:translate-x-0.5">
            Get My Free Hedge
            <ArrowRight className="!w-4 !h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Right: $100 floating over fused image */}
        <div className="flex flex-col items-end justify-center">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase [text-shadow:_0_1px_8px_hsl(var(--card))]">
            Earn up to
          </span>
          <span className="font-mono text-5xl lg:text-6xl font-bold text-foreground leading-none my-1 [text-shadow:_0_2px_20px_hsl(var(--primary)/0.5),_0_0_40px_hsl(var(--card))] drop-shadow-2xl">
            $100
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase [text-shadow:_0_1px_8px_hsl(var(--card))]">
            Per account · Zero cost
          </span>
        </div>
      </div>
    </button>
  );
};
