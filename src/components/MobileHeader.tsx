import { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, Heart, Share2, ExternalLink } from "lucide-react";
import { useNavigate, useNavigationType } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  endTime?: Date; // New prop for countdown
  showBack?: boolean; // Force show/hide back button
  backTo?: string; // Custom back navigation path (default: navigate(-1))
  showActions?: boolean;
  tweetCount?: number;
  // Price-based event data
  currentPrice?: string;
  priceChange24h?: string;
  sourceUrl?: string;
  sourceName?: string;
  period?: string;
  onTitleClick?: () => void; // Optional callback when title is clicked
  isFavorite?: boolean; // External favorite state
  onFavoriteToggle?: () => void; // Callback to toggle favorite
}

// Countdown hook
const useCountdown = (endTime: Date | undefined) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference <= 0) {
        return "00:00:00";
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

export const MobileHeader = ({ 
  title, 
  subtitle, 
  endTime, 
  showBack, 
  backTo, 
  showActions = false, 
  tweetCount, 
  currentPrice,
  priceChange24h,
  sourceUrl,
  sourceName,
  period,
  onTitleClick,
  isFavorite = false,
  onFavoriteToggle,
}: MobileHeaderProps) => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const countdown = useCountdown(endTime);
  const displayTime = endTime ? countdown : subtitle;
  
  // Show back button: if explicitly set use that value, otherwise show only for PUSH navigation
  const shouldShowBack = showBack !== undefined ? showBack : navigationType === "PUSH";

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleFavorite = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle();
      toast(isFavorite ? "Removed from favorites" : "Added to favorites", {
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out this prediction market: ${title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast("Link copied to clipboard", { duration: 2000 });
      }
    } catch (err) {
      // User cancelled or error
      if ((err as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(window.location.href);
        toast("Link copied to clipboard", { duration: 2000 });
      }
    }
  };

  return (
    <header className="sticky top-0 bg-background z-40 px-4 py-1.5">
      <div className="flex items-center">
        {/* Left: Back button */}
        {shouldShowBack ? (
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-muted/80 flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        {/* Center: Title and countdown */}
        <div 
          className={`flex-1 text-center px-2 ${onTitleClick ? "cursor-pointer" : ""}`}
          onClick={onTitleClick}
        >
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-sm font-semibold text-foreground">{title}</h1>
            {onTitleClick && <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
          {(displayTime || tweetCount !== undefined || currentPrice) && (
            <div className="flex items-center justify-center gap-4 mt-0.5">
              {displayTime && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-trading-red rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Ends in</span>
                  <span className="text-xs text-trading-red font-mono font-medium">{displayTime}</span>
                </div>
              )}
              {tweetCount !== undefined && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground">Tweets</span>
                      <span className="text-xs text-orange-500 font-mono font-medium">{tweetCount}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="center">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tweet Count</span>
                        <span className="text-lg font-bold text-orange-500">{tweetCount}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Period</span>
                          <span>{period || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last updated</span>
                          <span>Just now</span>
                        </div>
                      </div>
                      {sourceUrl && (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {sourceName || "View Source"}
                        </a>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {currentPrice && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      <span className="w-1.5 h-1.5 bg-trading-green rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="text-xs text-trading-green font-mono font-medium">{currentPrice}</span>
                      {priceChange24h && (
                        <span className={`text-xs font-mono ${priceChange24h.startsWith('+') ? 'text-trading-green' : 'text-trading-red'}`}>
                          {priceChange24h}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="center">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Price</span>
                        <span className="text-lg font-bold text-trading-green">{currentPrice}</span>
                      </div>
                      {priceChange24h && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">24h Change</span>
                          <span className={`text-sm font-medium ${priceChange24h.startsWith('+') ? 'text-trading-green' : 'text-trading-red'}`}>
                            {priceChange24h}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Period</span>
                          <span>{period || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last updated</span>
                          <span>Just now</span>
                        </div>
                      </div>
                      {sourceUrl && (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {sourceName || "View Source"}
                        </a>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}
        </div>

        {/* Right: Action buttons */}
        {showActions ? (
          <div className="flex items-center gap-1">
            <button 
              onClick={handleFavorite}
              className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${isFavorite ? "text-trading-red fill-trading-red" : "text-muted-foreground"}`} 
                strokeWidth={1.5} 
              />
            </button>
            <button 
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              <Share2 className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="w-9" />
        )}
      </div>
    </header>
  );
};
