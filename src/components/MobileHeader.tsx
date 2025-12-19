import { ChevronLeft, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showActions?: boolean;
}

export const MobileHeader = ({ title, subtitle, showBack = true, showActions = false }: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-2 h-2 bg-trading-red rounded-full animate-pulse-soft" />
              <span className="text-xs text-trading-red font-mono">{subtitle}</span>
            </div>
          )}
        </div>

        {showActions ? (
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
};
