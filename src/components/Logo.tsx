import omenxLogo from "@/assets/omenx-logo.svg";
import { cn } from "@/lib/utils";

export type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  /** Show the small green pulse dot indicating mainnet is live. Default: true */
  showMainnetDot?: boolean;
}

// Standard logo sizes - use these consistently across the app
const sizeClasses: Record<LogoSize, string> = {
  sm: "h-4 w-auto",   // Small: for compact headers, mobile nav items
  md: "h-5 w-auto",   // Medium: default for mobile headers (MobileHome, EventsPage)
  lg: "h-6 w-auto",   // Large: for desktop headers
  xl: "h-8 w-auto",   // Extra large: for landing pages, prominent branding
};

export function Logo({ size = "md", className, showMainnetDot = true }: LogoProps) {
  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <img src={omenxLogo} alt="OMENX" className={sizeClasses[size]} />
      {showMainnetDot && (
        <span
          aria-label="Mainnet live"
          title="Mainnet live"
          className="relative ml-1.5 inline-flex h-1.5 w-1.5"
        >
          <span className="absolute inset-0 inline-flex animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
      )}
    </span>
  );
}

// Export the raw logo for special cases (StyleGuide documentation, etc.)
export { omenxLogo };
