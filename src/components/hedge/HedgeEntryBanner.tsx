import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Lock, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import heroImage from "@/assets/hedge-banner-hero.png";

interface HedgeEntryBannerProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

const SPOTS_TAKEN = 231;
const SPOTS_TOTAL = 1000;
const SPOTS_PERCENT = (SPOTS_TAKEN / SPOTS_TOTAL) * 100;

/**
 * H2E operational entry banner — high-impact 3-segment narrative.
 * Desktop: [Left: warning + CTA] / [Center: hero image] / [Right: scarcity + reward]
 * Mobile: vertical stack with hero on top, scarcity card above CTA
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

  const ScarcityCard = (
    <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Clock className="!w-3.5 !h-3.5 text-primary" />
        <span className="text-[10px] font-bold tracking-wider text-primary uppercase leading-none">
          Limited Spots Left
        </span>
      </div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-mono text-sm font-bold text-foreground leading-none">
          {SPOTS_TAKEN} / {SPOTS_TOTAL.toLocaleString()}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground leading-none">
          spots claimed
        </span>
      </div>
      <Progress value={SPOTS_PERCENT} className="h-1.5 bg-primary/10" />
    </div>
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
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {LimitedFundBadge}
            {IndustryFirstBadge}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <h3 className="text-xl font-black tracking-tight leading-[1.05] mb-1">
            <span className="block text-foreground">Markets move fast.</span>
            <span className="block text-primary">Don't get rekt.</span>
          </h3>
          <p className="text-[13px] text-muted-foreground leading-snug mb-3">
            We'll hedge your exposed positions — for <span className="font-semibold text-foreground">FREE</span>. Earn up to{" "}
            <span className="font-mono font-bold text-foreground">$100</span>.
          </p>

          {/* Scarcity card */}
          <div className="mb-3">{ScarcityCard}</div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30">
              Get My Free Hedge
              <ArrowRight className="!w-4 !h-4" />
            </span>
            <span className="italic font-semibold text-primary text-xs">
              Don't miss out.
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
      {/* Background glows — red (exposure) left, primary center, green (hedge) right */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-destructive/10 blur-3xl z-0" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary/15 blur-3xl z-0" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-success/10 blur-3xl z-0" />

      <div className="relative z-10 px-7 pt-5 pb-5">
        {/* Top badges row */}
        <div className="flex gap-2 mb-4">
          {LimitedFundBadge}
          {IndustryFirstBadge}
        </div>

        {/* 3-column narrative */}
        <div className="grid grid-cols-[1.1fr_0.9fr_1fr] items-center gap-6">
          {/* LEFT: Headline + CTA + micro-trust */}
          <div className="min-w-0">
            <h3 className="font-black tracking-tight leading-[1.05] mb-2.5">
              <span className="block text-foreground text-3xl lg:text-[34px]">
                Markets move fast.
              </span>
              <span className="block text-primary text-3xl lg:text-[34px]">
                Don't get rekt.
              </span>
            </h3>
            <p className="text-sm text-muted-foreground leading-snug mb-4 max-w-[340px]">
              We'll hedge your exposed positions — for{" "}
              <span className="font-semibold text-foreground">FREE</span>. First come, first served.
            </p>

            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30 transition-transform group-hover:translate-x-0.5 mb-4">
              Get My Free Hedge
              <ArrowRight className="!w-4 !h-4 transition-transform group-hover:translate-x-0.5" />
            </span>

            {/* Micro-trust row */}
            <div className="flex items-center gap-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="!w-3.5 !h-3.5 text-success shrink-0" />
                <div className="leading-tight">
                  <div className="text-[10px] font-bold tracking-wider text-foreground uppercase">Zero Cost</div>
                  <div className="text-[10px] text-muted-foreground">No catch.</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="!w-3.5 !h-3.5 text-warning shrink-0" />
                <div className="leading-tight">
                  <div className="text-[10px] font-bold tracking-wider text-foreground uppercase">Instant</div>
                  <div className="text-[10px] text-muted-foreground">Sleep better.</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="!w-3.5 !h-3.5 text-primary shrink-0" />
                <div className="leading-tight">
                  <div className="text-[10px] font-bold tracking-wider text-foreground uppercase">You Keep Profits</div>
                  <div className="text-[10px] text-muted-foreground">We cover downside.</div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Hero image — full height, edge-faded */}
          <div
            className="relative h-[220px] lg:h-[240px] w-full"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 55%, transparent 95%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 95%)",
            }}
          >
            <img
              src={heroImage}
              alt="OmenX hedges your Polymarket losses"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          {/* RIGHT: Reward + scarcity + tagline */}
          <div className="flex flex-col items-end justify-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                Earn up to
              </span>
              <span className="font-mono text-5xl lg:text-[56px] font-black text-foreground leading-none my-1">
                $100
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                Per account · Zero cost
              </span>
            </div>

            <div className="w-full max-w-[240px]">{ScarcityCard}</div>

            <span className="italic font-semibold text-primary text-xs self-end">
              Don't miss out.
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
