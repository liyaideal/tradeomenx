import { ChevronLeft, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showActions?: boolean;
  tweetCount?: number;
}

export const MobileHeader = ({ title, subtitle, showBack = true, showActions = false, tweetCount }: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-background z-40 px-4 py-2">
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
          <div className="flex items-center justify-center gap-3 mt-0.5">
            {subtitle && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-trading-red rounded-full" />
                <span className="text-xs text-trading-red font-mono">{subtitle}</span>
              </div>
            )}
            {tweetCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs text-orange-500 font-mono">{tweetCount} tweets</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Action buttons */}
        {showActions ? (
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95">
              <Heart className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95">
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
