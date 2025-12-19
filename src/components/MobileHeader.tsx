import { useState, useEffect } from "react";
import { ChevronLeft, Heart, Share2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  showBack?: boolean;
  showActions?: boolean;
  tweetCount?: number;
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

export const MobileHeader = ({ title, subtitle, endTime, showBack = true, showActions = false, tweetCount }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const countdown = useCountdown(endTime);
  const displayTime = endTime ? countdown : subtitle;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast(isFavorite ? "Removed from favorites" : "Added to favorites", {
      duration: 2000,
    });
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
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-muted/80 flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        {/* Center: Title and countdown */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {(displayTime || tweetCount !== undefined) && (
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
                    <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
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
                          <span>Dec 12 - Dec 19, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last updated</span>
                          <span>Just now</span>
                        </div>
                      </div>
                      <a
                        href="https://x.com/elonmusk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on X (Twitter)
                      </a>
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
