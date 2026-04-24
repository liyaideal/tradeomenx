import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import bannerImage from "@/assets/hedge-entry-banner.png";

interface HedgeEntryBannerProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * H2E operational entry banner — single composite image.
 * Click anywhere to navigate to /hedge.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Get your free hedge — earn up to $100"
      className={cn(
        "group block w-full overflow-hidden rounded-2xl border border-primary/30 bg-black shadow-lg shadow-primary/10 transition-all hover:border-primary/50 hover:shadow-primary/20",
        className,
      )}
    >
      <img
        src={bannerImage}
        alt="Your Polymarket positions are exposed — OmenX hedges them for free. Earn up to $100."
        className={cn(
          "block w-full h-auto object-cover transition-transform group-hover:scale-[1.01]",
          effective === "mobile" ? "aspect-[16/7]" : "aspect-[1920/440]",
        )}
        loading="lazy"
      />
    </button>
  );
};
