import { useEffect, useState } from "react";
import { ArrowRight, Network, ShieldCheck, Trophy } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Countdown } from "@/components/mainnet-launch/Countdown";
import { cn } from "@/lib/utils";

interface CampaignBannerCarouselProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

type CampaignBannerConfig = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  labels: Array<{ text: string; tone: "accent" | "success" | "neutral" }>;
  metrics: Array<{ label: string; value: string }>;
  visual: "launch" | "hedge";
  countdown?: boolean;
};

const banners: CampaignBannerConfig[] = [
  {
    id: "mainnet-launch",
    href: "/mainnet-launch",
    eyebrow: "Mainnet Launch",
    title: "First qualifying trade unlocks campaign rewards.",
    description: "Trade on mainnet, qualify once, and track reward status through a transparent payout ledger.",
    ctaLabel: "Join Now",
    labels: [
      { text: "Live", tone: "success" },
      { text: "Reward ledger", tone: "accent" },
    ],
    metrics: [
      { label: "Activation", value: "$5K" },
      { label: "Guaranteed", value: "$2-$50" },
      { label: "Max rebate", value: "$200" },
    ],
    visual: "launch",
    countdown: true,
  },
  {
    id: "hedge",
    href: "/hedge",
    eyebrow: "Hedge Campaign",
    title: "Protect exposed prediction positions before volatility hits.",
    description: "Bring your outside market exposure into OmenX and claim hedge credits after verification.",
    ctaLabel: "Open Hedge",
    labels: [
      { text: "Free hedge", tone: "accent" },
      { text: "Up to $100", tone: "neutral" },
    ],
    metrics: [
      { label: "Credit cap", value: "$100" },
      { label: "Setup", value: "2 min" },
      { label: "Status", value: "Open" },
    ],
    visual: "hedge",
  },
];

const labelClassName = {
  accent: "border-mainnet-gold/30 bg-mainnet-gold/10 text-mainnet-gold",
  success: "border-trading-green/25 bg-trading-green/10 text-trading-green",
  neutral: "border-border/60 bg-background/35 text-muted-foreground",
};

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
    <div className={cn("relative w-full max-w-full overflow-hidden", className)}>
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full max-w-full overflow-hidden">
        <CarouselContent className="-ml-0">
          <CarouselItem className="min-w-0 pl-0">
            <button
              type="button"
              onClick={() => navigateWithRef("/mainnet-launch")}
              aria-label="Join OmenX Mainnet Launch campaign"
              className={cn(
                "group relative block w-full max-w-full overflow-hidden rounded-md border border-mainnet-gold/20 bg-mainnet-surface text-left shadow-lg shadow-background/30 transition-all hover:border-mainnet-gold/40",
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
                      <span key={item} className="border border-border/50 bg-background/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
                  <div className="border border-mainnet-gold/20 bg-background/40 px-3 py-2 font-mono text-xs text-muted-foreground backdrop-blur">
                    <span className="text-foreground">Ends </span><Countdown compact className="text-mainnet-gold" />
                  </div>
                  <div className="inline-flex items-center gap-2 border border-mainnet-gold bg-mainnet-gold px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-background transition-transform group-hover:translate-x-1">
                    Join Now <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </button>
          </CarouselItem>

          <CarouselItem className="min-w-0 pl-0">
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
