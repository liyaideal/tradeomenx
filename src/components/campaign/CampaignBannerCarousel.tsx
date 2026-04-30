import { useEffect, useState } from "react";
import { ArrowRight, Rocket, ShieldCheck, Timer } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Countdown } from "@/components/mainnet-launch/Countdown";
import { cn } from "@/lib/utils";
import hedgeBanner from "@/assets/hedge-entry-banner.png";
import hedgeBannerMobile from "@/assets/hedge-entry-banner-mobile.png";

interface CampaignBannerCarouselProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export const CampaignBannerCarousel = ({ variant = "desktop", className }: CampaignBannerCarouselProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
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
    const timer = window.setInterval(() => api.scrollNext(), 6200);
    return () => window.clearInterval(timer);
  }, [api]);

  const navigateWithRef = (path: string) => {
    const ref = searchParams.get("ref");
    navigate(ref ? `${path}?ref=${encodeURIComponent(ref)}` : path);
  };

  const hedgeSrc = isMobile ? hedgeBannerMobile : hedgeBanner;

  return (
    <div className={cn("relative", className)}>
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="-ml-0">
          <CarouselItem className="pl-0">
            <button
              type="button"
              onClick={() => navigateWithRef("/mainnet-launch")}
              aria-label="Join OmenX Mainnet Launch campaign"
              className={cn(
                "group relative block w-full overflow-hidden rounded-lg border border-mainnet-gold/30 bg-mainnet-surface text-left shadow-lg shadow-mainnet-gold/10 transition-all hover:border-mainnet-gold/50",
                isMobile ? "min-h-[180px] p-4" : "min-h-[220px] p-7",
              )}
            >
              <div className="absolute inset-0" style={{ background: "var(--gradient-mainnet-glow)" }} />
              <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-mainnet-gold/10 blur-2xl" />
              <div className="absolute bottom-0 right-8 h-28 w-16 bg-gradient-to-t from-mainnet-orange/50 to-transparent blur-xl" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-5 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-mainnet-gold">
                    <Rocket className="h-3.5 w-3.5" />
                    MAINNET LAUNCH
                    <span className="rounded-full border border-trading-green/30 bg-trading-green/10 px-2 py-0.5 text-[10px] text-trading-green">LIVE NOW</span>
                  </div>
                  <h3 className={cn("font-black leading-tight text-foreground", isMobile ? "text-xl" : "text-3xl")}>Your first trade wins. Every time.</h3>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">Up to $50 USDC — 100% win rate.</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-background transition-transform group-hover:translate-x-1" style={{ background: "var(--gradient-mainnet)" }}>
                    Join Now <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
                  <div className="rounded-lg border border-mainnet-gold/25 bg-background/55 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
                    <span className="text-foreground">Ends in </span><Countdown compact />
                  </div>
                  <div className="relative hidden h-24 w-28 md:block">
                    <Rocket className="absolute right-6 top-1 h-16 w-16 -rotate-12 text-mainnet-gold animate-rocket-lift" />
                    <ShieldCheck className="absolute bottom-0 left-1 h-9 w-9 text-mainnet-orange animate-float" />
                    <Timer className="absolute bottom-3 right-0 h-8 w-8 text-mainnet-gold animate-float [animation-delay:700ms]" />
                  </div>
                </div>
              </div>
            </button>
          </CarouselItem>

          <CarouselItem className="pl-0">
            <button
              type="button"
              onClick={() => navigate("/hedge")}
              aria-label="Get your free hedge — earn up to $100"
              className="group block w-full overflow-hidden rounded-lg border border-primary/30 bg-background shadow-lg shadow-primary/10 transition-all hover:border-primary/50 hover:shadow-primary/20"
            >
              <img
                src={hedgeSrc}
                alt="Your Polymarket positions are exposed — OmenX hedges them for free. Earn up to $100."
                className="block w-full h-auto transition-transform group-hover:scale-[1.01]"
                loading="lazy"
              />
            </button>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="mt-3 flex justify-center gap-2">
        {[0, 1].map((index) => (
          <button
            key={index}
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
