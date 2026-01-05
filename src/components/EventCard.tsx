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
  color?: string; // Color for the chart line (auto-assigned if not provided)
  priceHistory?: number[]; // Price history for this option
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
}

interface EventCardProps {
  event: EventData;
  onEventClick?: (eventId: string) => void;
  onTrade?: (eventId: string, optionId: string, side: "long" | "short", quantity: number) => void;
}

// Chart colors for options
const CHART_COLORS = [
  "hsl(0, 70%, 55%)",    // Red
  "hsl(45, 90%, 55%)",   // Yellow/Orange
  "hsl(220, 70%, 55%)",  // Blue
  "hsl(150, 60%, 50%)",  // Green
  "hsl(280, 60%, 60%)",  // Purple
];

// X-axis date labels
const generateDateLabels = () => {
  const now = new Date();
  const labels = [];
  for (let i = 4; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 4);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    labels.push(`${month}/${day} ${hour}:00`);
  }
  return labels;
};

// Multi-line chart component matching the design reference
const MiniChart = ({ options }: { options: EventOption[] }) => {
  const dateLabels = generateDateLabels();
  
  // Get all price histories and find global min/max for consistent scaling
  const allPrices = options.flatMap(o => o.priceHistory || []);
  const min = 0; // Always start from 0%
  const max = 100; // Always end at 100%
  
  const chartWidth = 100;
  const chartHeight = 100;
  const paddingLeft = 0;
  const paddingRight = 8;
  const paddingTop = 5;
  const paddingBottom = 5;
  
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const generatePath = (data: number[]) => {
    if (!data || data.length === 0) return "";
    
    return data.map((value, index) => {
      const x = paddingLeft + (index / (data.length - 1)) * innerWidth;
      const y = paddingTop + (1 - value / 100) * innerHeight;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(" ");
  };

  // Y-axis percentage labels
  const yLabels = [100, 75, 50, 25, 0];

  return (
    <div className="w-full bg-muted/20 rounded-xl p-4 relative">
      <div className="relative h-32">
        {/* Y-axis labels */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-muted-foreground font-mono w-8 text-right pr-1">
          {yLabels.map((label) => (
            <span key={label}>{label}%</span>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="absolute left-0 right-10 top-0 bottom-0">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yLabels.map((_, i) => (
              <div key={i} className="border-t border-dashed border-border/30" />
            ))}
          </div>
          
          {/* SVG Chart */}
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
            {options.map((option, index) => {
              const data = option.priceHistory || Array.from({ length: 1500 }, () => 20 + Math.random() * 60);
              const color = CHART_COLORS[index % CHART_COLORS.length];
              
              return (
                <path
                  key={option.id}
                  d={generatePath(data)}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono pr-10">
        {dateLabels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
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

  // Generate mock price history for options if not provided
  const optionsWithHistory = event.options.map((option, index) => ({
    ...option,
    color: CHART_COLORS[index % CHART_COLORS.length],
    priceHistory: option.priceHistory || Array.from({ length: 20 }, () => 20 + Math.random() * 60),
  }));

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
        {/* Mini Chart - Multi-line for all options */}
        <MiniChart options={optionsWithHistory} />

        {/* Options List - with matching chart colors */}
        <div className="space-y-2">
          {optionsWithHistory.map((option, index) => (
            <button
              key={option.id}
              onClick={() => !isLocked && setSelectedOption(option.id)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                selectedOption === option.id
                  ? "bg-muted/50 border border-border/60"
                  : "bg-muted/30 border border-transparent hover:bg-muted/40"
              } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-sm text-foreground">
                  {option.label}
                </span>
              </div>
              <span 
                className="font-mono text-sm font-medium"
                style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}
              >
                $ {option.price}
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
