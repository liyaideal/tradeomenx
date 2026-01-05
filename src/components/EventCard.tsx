import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Lock, TrendingUp, Zap, Users, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type EventStatus = "active" | "locked" | "resolved";

export interface EventOption {
  id: string;
  label: string;
  price: string;
}

export interface EventData {
  id: string;
  title: string;
  status: EventStatus;
  hasMultipleOptions: boolean;
  settlementDate: string;
  options: EventOption[];
  totalVolume: string;
  volume24h: string;
  participants: number;
  priceHistory?: number[];
}

interface EventCardProps {
  event: EventData;
  onEventClick?: (eventId: string) => void;
  onTrade?: (eventId: string, optionId: string, side: "long" | "short", quantity: number) => void;
}

// Simple mini chart component
const MiniChart = ({ data, color = "trading-green" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-20 bg-muted/20 rounded-lg p-2 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={`hsl(var(--${color}))`}
          strokeWidth="2"
          points={points}
        />
      </svg>
      {/* Y-axis labels */}
      <div className="absolute left-1 top-1 text-[10px] text-muted-foreground font-mono">{max.toFixed(0)}</div>
      <div className="absolute left-1 bottom-1 text-[10px] text-muted-foreground font-mono">{min.toFixed(0)}</div>
    </div>
  );
};

export const EventCard = ({ event, onEventClick, onTrade }: EventCardProps) => {
  const isMobile = useIsMobile();
  const [selectedOption, setSelectedOption] = useState<string | null>(event.options[0]?.id || null);
  const [tradeSide, setTradeSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState<number>(5);
  const [quantity, setQuantity] = useState<string>("");

  const selectedOptionData = event.options.find(o => o.id === selectedOption);
  const isLocked = event.status === "locked";

  const handleTrade = () => {
    if (selectedOption && quantity && onTrade) {
      onTrade(event.id, selectedOption, tradeSide, parseFloat(quantity));
    }
  };

  // Generate mock price history if not provided
  const priceHistory = event.priceHistory || Array.from({ length: 24 }, () => 60 + Math.random() * 15);
  const chartColor = isLocked ? "muted-foreground" : "trading-green";

  return (
    <Card 
      className="trading-card overflow-hidden cursor-pointer transition-all hover:border-border/80"
      onClick={() => onEventClick?.(event.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground leading-snug">{event.title}</h3>
          <Badge 
            className={
              event.status === "active" 
                ? "bg-trading-green/20 text-trading-green border-trading-green/30 flex-shrink-0" 
                : event.status === "locked"
                ? "bg-trading-red/20 text-trading-red border-trading-red/30 flex-shrink-0"
                : "bg-muted text-muted-foreground flex-shrink-0"
            }
          >
            {event.status === "active" ? "Active" : event.status === "locked" ? "Locked" : "Resolved"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          {event.hasMultipleOptions && (
            <Badge variant="outline" className="text-xs bg-trading-purple/10 text-trading-purple border-trading-purple/30">
              Multiple Options
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{event.settlementDate}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Mini Chart */}
        <MiniChart data={priceHistory} color={chartColor} />

        {/* Options List */}
        <div className="space-y-1">
          {event.options.map((option) => (
            <button
              key={option.id}
              onClick={() => !isLocked && setSelectedOption(option.id)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                selectedOption === option.id
                  ? "bg-trading-purple/20 border border-trading-purple/40"
                  : "bg-muted/30 border border-transparent hover:bg-muted/50"
              } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span 
                  className={`w-2 h-2 rounded-full ${
                    selectedOption === option.id ? "bg-trading-purple" : "bg-muted-foreground/30"
                  }`} 
                />
                <span className={`text-sm ${selectedOption === option.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {option.label}
                </span>
              </div>
              <span className={`font-mono text-sm ${
                selectedOption === option.id ? "text-trading-purple" : "text-muted-foreground"
              }`}>
                ${option.price}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>Volume: <span className="text-foreground font-mono">{event.totalVolume}</span></span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Participants: <span className="text-foreground font-mono">{event.participants}</span></span>
          </div>
        </div>

        {/* Locked Message */}
        {isLocked && (
          <div className="flex items-center justify-center gap-2 py-3 bg-trading-yellow/10 border border-trading-yellow/20 rounded-lg">
            <Lock className="h-4 w-4 text-trading-yellow" />
            <span className="text-sm text-trading-yellow">Event locked, awaiting settlement</span>
          </div>
        )}

        {/* Quick Trade Section - Only on Desktop and Active events */}
        {!isMobile && !isLocked && (
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quick Trade</span>
              <Zap className="h-4 w-4 text-trading-yellow" />
            </div>

            <div className="flex items-center gap-2">
              {/* Long/Short Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  onClick={() => setTradeSide("long")}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    tradeSide === "long" 
                      ? "bg-trading-green text-primary-foreground" 
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  Long
                </button>
                <button
                  onClick={() => setTradeSide("short")}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    tradeSide === "short" 
                      ? "bg-trading-red text-primary-foreground" 
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  Short
                </button>
              </div>

              {/* Leverage */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground">Leverage:</span>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {[5, 10, 20].map((lev) => (
                    <button
                      key={lev}
                      onClick={() => setLeverage(lev)}
                      className={`px-2 py-1 text-xs font-medium transition-colors ${
                        leverage === lev
                          ? "bg-trading-purple text-primary-foreground"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {lev}X
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Price</label>
                <Input 
                  value={selectedOptionData?.price || ""} 
                  readOnly 
                  className="font-mono bg-muted/30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Quantity</label>
                <Input 
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            {/* Trade Button */}
            <Button 
              className={`w-full gap-2 ${
                tradeSide === "long" 
                  ? "bg-trading-green hover:bg-trading-green/90" 
                  : "bg-trading-red hover:bg-trading-red/90"
              }`}
              onClick={handleTrade}
              disabled={!selectedOption || !quantity}
            >
              <TrendingUp className={`h-4 w-4 ${tradeSide === "short" ? "rotate-180" : ""}`} />
              Buy {tradeSide === "long" ? "Long" : "Short"} — {selectedOptionData?.label || "Select option"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
