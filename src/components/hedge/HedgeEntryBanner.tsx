import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hedge-banner-hero.png";

interface HedgeEntryBannerProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * H2E operational entry banner.
 * The hero image IS the banner — full-bleed cinematic artwork containing
 * all messaging (headline, comparison, $100 reward). The component is a
 * thin clickable wrapper that routes to /hedge.
 */
export const HedgeEntryBanner = ({ variant, className }: HedgeEntryBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const effective = variant ?? (isMobile ? "mobile" : "desktop");

  const handleClick = () => navigate("/hedge");

  if (effective === "mobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Get your free Polymarket hedge — earn up to $100"
        className={cn(
          "group block w-full rounded-2xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/10 transition-all hover:border-primary/50 hover:shadow-primary/20 bg-black",
          className,
        )}
      >
        <img
          src={heroImage}
          alt="Markets move fast. Don't get rekt. We'll hedge your exposed Polymarket positions for free."
          className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Get your free Polymarket hedge — earn up to $100"
      className={cn(
        "group block w-full rounded-2xl overflow-hidden border border-primary/30 shadow-xl shadow-primary/10 transition-all hover:border-primary/50 hover:shadow-primary/25 bg-black",
        className,
      )}
    >
      <img
        src={heroImage}
        alt="Markets move fast. Don't get rekt. We'll hedge your exposed Polymarket positions for free."
        className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.015]"
        loading="lazy"
      />
    </button>
  );
};
