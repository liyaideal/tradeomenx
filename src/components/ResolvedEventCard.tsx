import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, BarChart3, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResolvedEvent, ResolvedEventOption } from "@/hooks/useResolvedEvents";
import { getCategoryInfo } from "@/lib/categoryUtils";
import { format } from "date-fns";

interface ResolvedEventCardProps {
  event: ResolvedEvent;
  onClick?: () => void;
}

const formatVolume = (volume: string | null): string => {
  if (!volume) return "$0";
  // Handle raw numbers
  const num = parseFloat(volume.replace(/[$,]/g, ""));
  if (isNaN(num)) return volume;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
};

const OptionItem = ({ 
  option
}: { 
  option: ResolvedEventOption;
}) => {
  const isWinner = option.is_winner;
  const displayPrice = option.final_price ?? option.price;
  
  return (
    <div
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
        isWinner
          ? "bg-trading-green/15 border border-trading-green/30"
          : "bg-transparent border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isWinner ? (
          <Check className="h-4 w-4 text-trading-green flex-shrink-0" />
        ) : (
          <X className="h-4 w-4 text-trading-red/70 flex-shrink-0" />
        )}
        <span className={`text-sm truncate ${isWinner ? "text-trading-green font-medium" : "text-muted-foreground"}`}>
          {option.label}
        </span>
      </div>
      <span className={`font-mono text-sm font-semibold flex-shrink-0 ml-2 ${isWinner ? "text-trading-green" : "text-muted-foreground"}`}>
        ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : displayPrice}
      </span>
    </div>
  );
};

// Mobile collapsible threshold
const MOBILE_COLLAPSE_THRESHOLD = 4;

export const ResolvedEventCard = ({ event, onClick }: ResolvedEventCardProps) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const settledDate = event.settled_at 
    ? format(new Date(event.settled_at), "MMM d, yyyy")
    : "N/A";
  
  const categoryInfo = getCategoryInfo(event.category);

  // For mobile: determine which options to show
  const shouldCollapse = isMobile && event.options.length > MOBILE_COLLAPSE_THRESHOLD;
  const visibleOptions = shouldCollapse && !isExpanded 
    ? event.options.slice(0, MOBILE_COLLAPSE_THRESHOLD) 
    : event.options;
  const hiddenCount = event.options.length - MOBILE_COLLAPSE_THRESHOLD;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Mobile layout - unified with Active card structure
  if (isMobile) {
    return (
      <Card 
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 border-border/40 hover:border-primary/40"
        onClick={onClick}
        style={{
          background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
        }}
      >
        <CardHeader className="pb-3 relative">
          {/* Row 1: Title + Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-foreground leading-snug text-[15px] group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <Badge 
              variant="outline"
              className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-wide bg-muted/50 text-muted-foreground border-border/50"
            >
              Settled
            </Badge>
          </div>
          
          {/* Row 2: Category + Participation + Date */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <Badge 
              className="text-[10px] font-medium border-0 px-2 py-0.5"
              style={{ 
                backgroundColor: `hsl(${categoryInfo.color} / 0.2)`,
                color: `hsl(${categoryInfo.color})`
              }}
            >
              {categoryInfo.label}
            </Badge>
            {event.userParticipated && event.userPnl !== null && (
              <Badge 
                variant="outline"
                className={`text-[10px] font-semibold px-2 py-0.5 ${
                  event.userPnl >= 0
                    ? "bg-trading-green/15 text-trading-green border-trading-green/40"
                    : "bg-trading-red/15 text-trading-red border-trading-red/40"
                }`}
              >
                {event.userPnl >= 0 ? "+" : "-"}${Math.abs(event.userPnl).toFixed(0)}
              </Badge>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="font-mono text-[11px]">{settledDate}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Options List - single column vertical layout for mobile */}
          <div className="space-y-1.5">
            {visibleOptions.map((option) => (
              <OptionItem 
                key={option.id} 
                option={option} 
              />
            ))}
          </div>

          {/* Expand/Collapse Button */}
          {shouldCollapse && (
            <button
              onClick={handleExpandClick}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  <span>Show More ({hiddenCount})</span>
                </>
              )}
            </button>
          )}

          {/* Total Volume */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-2 border-t border-border/30">
            <BarChart3 className="h-3.5 w-3.5 text-primary/60" />
            <span>Vol: <span className="text-foreground font-mono font-medium">{formatVolume(event.volume)}</span></span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop layout
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 border-border/40 hover:border-primary/40"
      onClick={onClick}
      style={{
        background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
      }}
    >
      {/* Subtle glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(260 65% 58% / 0.08) 0%, transparent 60%)"
        }}
      />
      
      <CardHeader className="pb-3 relative">
        {/* Row 1: Title + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug text-[15px] group-hover:text-primary transition-colors flex-1">
            {event.name}
          </h3>
          <Badge 
            variant="outline"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-wide bg-muted/50 text-muted-foreground border-border/50"
          >
            Settled
          </Badge>
        </div>
        
        {/* Row 2: Category + Participation + Date */}
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <Badge 
            className="text-[10px] font-medium border-0 px-2 py-0.5"
            style={{ 
              backgroundColor: `hsl(${categoryInfo.color} / 0.2)`,
              color: `hsl(${categoryInfo.color})`
            }}
          >
            {categoryInfo.label}
          </Badge>
          {event.userParticipated && event.userPnl !== null && (
            <Badge 
              variant="outline"
              className={`text-[10px] font-semibold px-2 py-0.5 ${
                event.userPnl >= 0
                  ? "bg-trading-green/15 text-trading-green border-trading-green/40"
                  : "bg-trading-red/15 text-trading-red border-trading-red/40"
              }`}
            >
              {event.userPnl >= 0 ? "+" : "-"}${Math.abs(event.userPnl).toFixed(0)}
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="font-mono text-[11px]">{settledDate}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Options - 2-column grid for >2 options, single column for binary */}
        <div className={`${
          event.options.length > 2 
            ? "grid grid-cols-2 gap-x-2 gap-y-1" 
            : "space-y-1.5"
        }`}>
          {event.options.map((option) => (
            <OptionItem 
              key={option.id} 
              option={option} 
            />
          ))}
        </div>

        {/* Total Volume */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border/30">
          <BarChart3 className="h-3.5 w-3.5 text-primary/60" />
          <span>Total Volume: <span className="text-foreground font-mono font-medium">{formatVolume(event.volume)}</span></span>
        </div>
      </CardContent>
    </Card>
  );
};
