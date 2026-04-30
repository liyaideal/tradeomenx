import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
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

const ticker = ["$5K activation", "$2-$50 guaranteed", "$200 max rebate"];

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
                "group relative block w-full overflow-hidden rounded-md border border-mainnet-gold/20 bg-mainnet-surface text-left shadow-lg shadow-background/30 transition-all hover:border-mainnet-gold/45",
                isMobile ? "min-h-[180px] p-4" : "min-h-[220px] p-6",
              )}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.18)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--mainnet-gold)/0.14),transparent_34%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-5 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="border border-mainnet-gold/30 bg-mainnet-gold/10 px-2 py-1 text-mainnet-gold">Mainnet Launch</span>
                    <span className="border border-trading-green/25 bg-trading-green/10 px-2 py-1 text-trading-green">Live</span>
                  </div>
                  <h3 className={cn("font-semibold leading-tight tracking-[-0.03em] text-foreground", isMobile ? "text-2xl" : "text-4xl")}>First qualifying trade unlocks campaign rewards.</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {ticker.map((item) => (
                      <span key={item} className="border border-border/55 bg-background/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
                  <div className="border border-mainnet-gold/20 bg-background/45 px-3 py-2 font-mono text-xs text-muted-foreground backdrop-blur">
                    <span className="text-foreground">Ends </span><Countdown compact className="text-mainnet-gold" />
                  </div>
                  <div className="inline-flex items-center gap-2 border border-mainnet-gold bg-mainnet-gold px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-background transition-transform group-hover:translate-x-1">
                    Join Now <ArrowRight className="h-4 w-4" />
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
                className="block h-auto w-full transition-transform group-hover:scale-[1.01]"
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
