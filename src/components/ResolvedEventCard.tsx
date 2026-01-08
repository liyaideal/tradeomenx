import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResolvedEvent, ResolvedEventOption } from "@/hooks/useResolvedEvents";
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
  option, 
  isMobile 
}: { 
  option: ResolvedEventOption;
  isMobile: boolean;
}) => {
  const isWinner = option.is_winner;
  const displayPrice = option.final_price ?? option.price;
  
  return (
    <div
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
        isWinner
          ? "bg-trading-green/15 border border-trading-green/30"
          : "bg-muted/20 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        {isWinner ? (
          <Check className="h-4 w-4 text-trading-green flex-shrink-0" />
        ) : (
          <X className="h-4 w-4 text-trading-red/70 flex-shrink-0" />
        )}
        <span className={`text-sm ${isWinner ? "text-trading-green font-medium" : "text-muted-foreground"}`}>
          {option.label}
        </span>
      </div>
      <span className={`font-mono text-sm font-semibold ${isWinner ? "text-trading-green" : "text-muted-foreground"}`}>
        ${typeof displayPrice === 'number' ? displayPrice.toFixed(4) : displayPrice}
      </span>
    </div>
  );
};

export const ResolvedEventCard = ({ event, onClick }: ResolvedEventCardProps) => {
  const isMobile = useIsMobile();
  
  const settledDate = event.settled_at 
    ? format(new Date(event.settled_at), "yyyy-MM-dd")
    : "N/A";

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
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug text-[15px] group-hover:text-primary transition-colors flex-1">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant="outline"
              className="text-[11px] font-semibold uppercase tracking-wide bg-muted/50 text-muted-foreground border-border/50"
            >
              Settled
            </Badge>
            {event.userParticipated && event.userPnl !== null && (
              <Badge 
                variant="outline"
                className={`text-[11px] font-semibold ${
                  event.userPnl >= 0
                    ? "bg-trading-green/15 text-trading-green border-trading-green/40"
                    : "bg-trading-red/15 text-trading-red border-trading-red/40"
                }`}
              >
                Participated {event.userPnl >= 0 ? "+" : ""}${event.userPnl.toFixed(0)}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Settled On: {settledDate}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Options List */}
        {isMobile ? (
          // Mobile: vertical list
          <div className="space-y-1.5">
            {event.options.map((option) => (
              <OptionItem key={option.id} option={option} isMobile={true} />
            ))}
          </div>
        ) : (
          // Desktop: 2-column grid for multi-option, single column for binary
          <div className={`gap-2 ${event.options.length > 2 ? "grid grid-cols-2" : "space-y-1.5"}`}>
            {event.options.map((option) => (
              <OptionItem key={option.id} option={option} isMobile={false} />
            ))}
          </div>
        )}

        {/* Total Volume */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border/30">
          <BarChart3 className="h-3.5 w-3.5 text-primary/60" />
          <span>Total Volume: <span className="text-foreground font-mono font-medium">{formatVolume(event.volume)}</span></span>
        </div>
      </CardContent>
    </Card>
  );
};
