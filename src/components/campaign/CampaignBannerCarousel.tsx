import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Network, ShieldCheck, Trophy } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Countdown } from "@/components/mainnet-launch/Countdown";
import { cn } from "@/lib/utils";
import mainnetCoinBg from "@/assets/mainnet-launch-coin.jpg";

interface CampaignBannerCarouselProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

type CampaignBannerConfig = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  status?: { text: string; tone: "accent" | "success" | "neutral" };
  heroMetric: { value: string; label: string };
  visual: "launch" | "hedge";
  countdown?: boolean;
};

const banners: CampaignBannerConfig[] = [
  {
    id: "mainnet-launch",
    href: "/mainnet-launch",
    eyebrow: "Mainnet Launch",
    title: "Trade once. Earn up to $200.",
    ctaLabel: "Join Now",
    status: { text: "Live", tone: "success" },
    heroMetric: { value: "$5K", label: "Weekly pool" },
    visual: "launch",
    countdown: true,
  },
  {
    id: "hedge",
    href: "/hedge",
    eyebrow: "Hedge Campaign",
    title: "Hedge your prediction trades. Free.",
    ctaLabel: "Open Hedge",
    status: { text: "Live", tone: "success" },
    heroMetric: { value: "$100", label: "Free hedge credit" },
    visual: "hedge",
  },
];

const labelClassName = {
  accent: "border-mainnet-gold/30 bg-mainnet-gold/10 text-mainnet-gold",
  success: "border-trading-green/25 bg-trading-green/10 text-trading-green",
  neutral: "border-border/60 bg-background/35 text-muted-foreground",
};

// Image intrinsic ratio (1664×936 ≈ 1.778) and where the hero coin sits horizontally
// inside the source image (≈ 0.62 from the left edge).
const COIN_IMG_RATIO = 1664 / 936;
const COIN_FOCAL_X = 0.62;

/**
 * Renders the launch banner background image and computes objectPosition so
 * the OmenX hero coin always lands inside the right "safe zone" (clear of the
 * left text column), regardless of banner width. Falls back gracefully on SSR.
 */
const MainnetLaunchBackground = ({
  src,
  textColumnRatio,
}: {
  src: string;
  /** Fraction of banner width reserved for text on the left (e.g. 0.55). */
  textColumnRatio: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [posX, setPosX] = useState<number>(85); // sensible default %

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const recompute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const containerRatio = w / h;
      // With object-cover, the image is scaled so its height matches container,
      // then cropped horizontally (assuming image is wider than container, which
      // holds for typical banner aspect ratios).
      const scale = h / 936; // px per source pixel
      const scaledImgW = 1664 * scale;
      const overflow = scaledImgW - w; // hidden px split across left/right
      if (overflow <= 0 || containerRatio >= COIN_IMG_RATIO) {
        // Image not wider than container — objectPosition % has no effect on x.
        setPosX(50);
        return;
      }
      // Target: place the coin's focal point at `targetX` (in container coords).
      // We want coin to sit comfortably to the right of the text column.
      const targetX = w * (textColumnRatio + (1 - textColumnRatio) * 0.55);
      // Coin's x in scaled image coords:
      const coinXInImg = COIN_FOCAL_X * scaledImgW;
      // objectPosition X% means: align (X% of image) with (X% of container).
      // Solve: coinXInImg - leftCrop = targetX, where leftCrop = overflow * (p/100).
      // Also: leftCrop = (image_x_at_pct - container_x_at_pct) constrained to [0, overflow].
      // Using the standard formula: leftCrop = overflow * (p / 100) when p is 0-100.
      const leftCrop = coinXInImg - targetX;
      let pct = (leftCrop / overflow) * 100;
      pct = Math.max(0, Math.min(100, pct));
      setPosX(pct);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [textColumnRatio]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{ objectPosition: `${posX}% center` }}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export const CampaignBannerCarousel = ({ variant = "desktop", className }: CampaignBannerCarouselProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = variant === "mobile";

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const timer = window.setInterval(() => {
      if (!isPaused) api.scrollNext();
    }, 6800);
    return () => window.clearInterval(timer);
  }, [api, isPaused]);

  const navigateWithRef = (path: string) => {
    const ref = searchParams.get("ref");
    navigate(ref ? `${path}?ref=${encodeURIComponent(ref)}` : path);
  };

  const renderVisual = (visual: CampaignBannerConfig["visual"]) => {
    if (visual === "hedge") {
      return (
        <div className="relative h-full min-h-[96px] overflow-hidden border border-primary/20 bg-primary/5 p-4">
          <div className="absolute inset-x-4 top-5 h-px bg-primary/30" />
          <div className="absolute inset-x-8 bottom-7 h-px bg-trading-green/30" />
          <div className="relative grid h-full min-h-[120px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <div className="space-y-2">
              <div className="h-2 w-16 bg-primary/35" />
              <div className="h-2 w-10 bg-muted-foreground/25" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center border border-primary/40 bg-background/70 text-primary shadow-lg shadow-primary/10">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="ml-auto space-y-2">
              <div className="h-2 w-14 bg-trading-green/35" />
              <div className="ml-auto h-2 w-9 bg-muted-foreground/25" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-full min-h-[112px] overflow-hidden border border-mainnet-gold/20 bg-background/35 p-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.14)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative flex h-full min-h-[132px] items-center justify-center">
          <div className="grid w-full max-w-[240px] grid-cols-3 gap-2">
            {[Trophy, Network, ArrowRight].map((Icon, index) => (
              <div key={index} className="flex aspect-square items-center justify-center border border-mainnet-gold/25 bg-mainnet-gold/10 text-mainnet-gold">
                <Icon className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("relative w-full max-w-full overflow-hidden", className)} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)}>
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full max-w-full overflow-hidden">
        <CarouselContent className="-ml-0">
          {banners.map((banner) => {
            const isLaunch = banner.visual === "launch";
            return (
            <CarouselItem key={banner.id} className="min-w-0 pl-0">
              <button
                type="button"
                onClick={() => navigateWithRef(banner.href)}
                aria-label={`${banner.eyebrow}: ${banner.title}`}
                className={cn(
                  "group relative block w-full max-w-full overflow-hidden rounded-md border text-left shadow-lg shadow-background/30 transition-all",
                  banner.visual === "hedge" ? "border-primary/25 bg-background hover:border-primary/45" : "border-mainnet-gold/20 bg-mainnet-surface hover:border-mainnet-gold/40",
                  isMobile ? "min-h-[190px] p-4" : "min-h-[236px] p-6",
                )}
              >
                {isLaunch && (
                  <>
                    <MainnetLaunchBackground
                      src={mainnetCoinBg}
                      textColumnRatio={isMobile ? 0.62 : 0.55}
                    />
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-r",
                        isMobile
                          ? "from-mainnet-surface from-0% via-mainnet-surface/95 via-50% to-mainnet-surface/30"
                          : "from-mainnet-surface from-0% via-mainnet-surface/85 via-40% to-mainnet-surface/10",
                      )}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  </>
                )}
                <div className={cn(
                  "absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.14)_1px,transparent_1px)] bg-[size:34px_34px]",
                  isLaunch ? "opacity-15" : "opacity-40",
                )} />
                <div className={cn(
                  "relative z-10 grid h-full min-w-0 gap-5 md:items-stretch",
                  isLaunch ? "md:grid-cols-[minmax(0,1fr)]" : "md:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.9fr)]",
                )}>
                  <div className={cn("flex min-w-0 flex-col justify-between gap-5", isLaunch && "md:max-w-[60%]")}>
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase">
                        <span className="border border-border/60 bg-background/35 px-2 py-1 text-muted-foreground backdrop-blur-sm">{banner.eyebrow}</span>
                        {banner.labels.map((label) => (
                          <span key={label.text} className={cn("border px-2 py-1 backdrop-blur-sm", labelClassName[label.tone])}>
                            {label.text}
                          </span>
                        ))}
                      </div>
                      <h3 className={cn("max-w-2xl font-semibold leading-tight text-foreground", isMobile ? "text-2xl" : "text-3xl lg:text-4xl")}>{banner.title}</h3>
                      <p className={cn("mt-3 max-w-2xl text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>{banner.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {banner.metrics.map((metric) => (
                        <span key={metric.label} className="border border-border/50 bg-background/40 px-2.5 py-1 font-mono text-[10px] uppercase text-muted-foreground backdrop-blur-sm">
                          <span className="text-foreground">{metric.value}</span> {metric.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!isLaunch && (
                    <div className="flex min-w-0 flex-col justify-between gap-3 md:items-end">
                      <div className={cn("w-full min-w-0", isMobile && "hidden sm:block")}>{renderVisual(banner.visual)}</div>
                      <div className="flex w-full flex-wrap items-center justify-between gap-3 md:justify-end">
                        <div className="inline-flex items-center gap-2 border border-mainnet-gold bg-mainnet-gold px-4 py-2 font-mono text-xs font-semibold uppercase text-background transition-transform group-hover:translate-x-1">
                          {banner.ctaLabel} <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {isLaunch && (
                  <div className="absolute bottom-4 right-4 z-10 flex flex-wrap items-center justify-end gap-2 md:bottom-6 md:right-6">
                    {banner.countdown && (
                      <div className="border border-mainnet-gold/30 bg-background/70 px-3 py-2 font-mono text-xs text-muted-foreground backdrop-blur-md">
                        <span className="text-foreground">Ends </span><Countdown compact className="text-mainnet-gold" />
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 border border-mainnet-gold bg-mainnet-gold px-4 py-2 font-mono text-xs font-semibold uppercase text-background transition-transform group-hover:translate-x-1">
                      {banner.ctaLabel} <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </button>
            </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <div className="mt-3 flex justify-center gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Go to campaign slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn("h-1.5 rounded-full transition-all", selected === index ? "w-6 bg-mainnet-gold" : "w-1.5 bg-muted-foreground/40")}
          />
        ))}
      </div>
    </div>
  );
};
