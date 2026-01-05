import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Lock, TrendingUp, Zap, Users, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOrdersStore, Order } from "@/stores/useOrdersStore";
import { toast } from "sonner";

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
const MiniChart = ({ 
  options, 
  selectedOptionId, 
  onChartClick 
}: { 
  options: EventOption[]; 
  selectedOptionId: string | null;
  onChartClick: () => void;
}) => {
  const dateLabels = useMemo(() => generateDateLabels(), []);
  
  // Memoize the generated price data to prevent regeneration on each render
  const optionsWithData = useMemo(() => {
    return options.map((option, index) => ({
      ...option,
      data: option.priceHistory || Array.from({ length: 1500 }, () => 20 + Math.random() * 60),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [options]);
  
  const chartWidth = 100;
  const chartHeight = 100;
  const paddingLeft = 0;
  const paddingRight = 8;
  const paddingTop = 5;
  const paddingBottom = 5;
  
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const generatePath = useMemo(() => (data: number[]) => {
    if (!data || data.length === 0) return "";
    
    return data.map((value, index) => {
      const x = paddingLeft + (index / (data.length - 1)) * innerWidth;
      const y = paddingTop + (1 - value / 100) * innerHeight;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(" ");
  }, [innerWidth, innerHeight]);

  // Memoize the paths for each option
  const paths = useMemo(() => {
    return optionsWithData.map(option => ({
      id: option.id,
      path: generatePath(option.data),
      color: option.color,
    }));
  }, [optionsWithData, generatePath]);

  // Filter paths based on selected option
  const visiblePaths = useMemo(() => {
    if (!selectedOptionId) return paths; // Show all if none selected
    return paths.filter(p => p.id === selectedOptionId);
  }, [paths, selectedOptionId]);

  // Y-axis percentage labels
  const yLabels = [100, 75, 50, 25, 0];

  return (
    <div 
      className="w-full bg-muted/20 rounded-xl p-4 relative cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={onChartClick}
    >
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
            {visiblePaths.map(({ id, path, color }) => (
              <path
                key={id}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="0.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { addOrder } = useOrdersStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Default to null (show all)
  const [tradeSide, setTradeSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState<number>(5);
  const [quantity, setQuantity] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const selectedOptionData = event.options.find(o => o.id === selectedOption);
  const isLocked = event.status === "locked";

  // Calculate order details for confirmation
  const orderDetails = useMemo(() => {
    if (!selectedOptionData || !quantity) return null;
    const price = parseFloat(selectedOptionData.price);
    const qty = parseFloat(quantity);
    const notionalValue = (price * qty).toFixed(2);
    const marginRequired = (price * qty / leverage).toFixed(2);
    const estimatedFee = (price * qty * 0.001).toFixed(2);
    const total = (parseFloat(marginRequired) + parseFloat(estimatedFee)).toFixed(2);
    const potentialWin = (qty * (1 - price)).toFixed(0);
    const liqPrice = tradeSide === "long" 
      ? (price * (1 - 1/leverage)).toFixed(4)
      : (price * (1 + 1/leverage)).toFixed(4);
    
    return {
      notionalValue,
      marginRequired,
      estimatedFee,
      total,
      quantity: qty.toLocaleString(),
      potentialWin,
      liqPrice,
    };
  }, [selectedOptionData, quantity, leverage, tradeSide]);

  const handleTrade = () => {
    if (selectedOption && quantity) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmOrder = () => {
    if (!selectedOptionData || !orderDetails) return;

    const newOrder: Order = {
      type: tradeSide === "long" ? "buy" : "sell",
      orderType: "Market",
      event: event.title,
      option: selectedOptionData.label,
      price: `$${selectedOptionData.price}`,
      amount: orderDetails.quantity,
      total: `$${orderDetails.total}`,
      time: "Just now",
      status: "Pending",
    };
    
    addOrder(newOrder);
    setShowConfirmDialog(false);
    toast.success("Order placed successfully!");
    
    // Navigate to trade page
    navigate("/trade");
    
    // Also call the original onTrade callback if provided
    if (onTrade) {
      onTrade(event.id, selectedOption!, tradeSide, parseFloat(quantity));
    }
  };

  // Navigate to trade page when clicking card (except interactive areas)
  const handleCardClick = () => {
    navigate("/trade");
  };

  // Generate mock price history for options if not provided
  const optionsWithHistory = event.options.map((option, index) => ({
    ...option,
    color: CHART_COLORS[index % CHART_COLORS.length],
    priceHistory: option.priceHistory || Array.from({ length: 20 }, () => 20 + Math.random() * 60),
  }));

  return (
    <>
      <Card 
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 border-border/40 hover:border-primary/40"
        onClick={handleCardClick}
        style={{
          background: "linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)",
        }}
      >
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, hsl(260 65% 58% / 0.08) 0%, transparent 60%)"
          }}
        />
        
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug text-[15px] group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <Badge 
            variant="outline"
            className={`flex-shrink-0 text-[11px] font-semibold uppercase tracking-wide ${
              event.status === "active" 
                ? "bg-trading-green/15 text-trading-green border-trading-green/40 shadow-[0_0_8px_hsl(145_80%_42%/0.2)]" 
                : event.status === "locked"
                ? "bg-trading-red/15 text-trading-red border-trading-red/40"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {event.status === "active" ? "● Active" : event.status === "locked" ? "Locked" : "Resolved"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-2.5">
          {event.hasMultipleOptions && (
            <Badge variant="outline" className="text-[10px] font-medium bg-primary/10 text-primary border-primary/30 px-2 py-0.5">
              Multi-Option
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="font-mono text-[11px]">{event.settlementDate}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Mini Chart - Multi-line for all options, or single line when option selected */}
        <MiniChart 
          options={optionsWithHistory} 
          selectedOptionId={selectedOption}
          onChartClick={() => setSelectedOption(null)} // Click chart to reset to show all
        />

        {/* Options List - refined styling */}
        <div className="space-y-1.5">
          {optionsWithHistory.map((option, index) => (
            <button
              key={option.id}
              onClick={() => !isLocked && setSelectedOption(option.id)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedOption === option.id
                  ? "bg-primary/10 border border-primary/30 shadow-[0_0_12px_hsl(260_65%_58%/0.15)]"
                  : "bg-muted/20 border border-transparent hover:bg-muted/35 hover:border-border/30"
              } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-background"
                  style={{ 
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                    boxShadow: selectedOption === option.id ? `0 0 8px ${CHART_COLORS[index % CHART_COLORS.length]}` : 'none'
                  }}
                />
                <span className={`text-sm font-medium ${selectedOption === option.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {option.label}
                </span>
              </div>
              <span 
                className="font-mono text-sm font-bold"
                style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}
              >
                ${option.price}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Row - cleaner */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-primary/60" />
            <span>Vol: <span className="text-foreground font-mono font-medium">{event.totalVolume}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary/60" />
            <span><span className="text-foreground font-mono font-medium">{event.participants}</span> traders</span>
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
          <div className="pt-4 border-t border-border/40 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Quick Trade</span>
              <Zap className="h-4 w-4 text-trading-yellow animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              {/* Long/Short Toggle - uses standardized btn-trading classes */}
              <div className="flex rounded-xl overflow-hidden border border-border/50 bg-background/50 p-0.5">
                <button
                  onClick={() => setTradeSide("long")}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    tradeSide === "long" 
                      ? "btn-trading-green" 
                      : "btn-trading-inactive"
                  }`}
                >
                  Long
                </button>
                <button
                  onClick={() => setTradeSide("short")}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    tradeSide === "short" 
                      ? "btn-trading-red" 
                      : "btn-trading-inactive"
                  }`}
                >
                  Short
                </button>
              </div>

              {/* Leverage - pill style */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground font-medium">Leverage:</span>
                <div className="flex rounded-xl overflow-hidden border border-border/50 bg-background/50 p-0.5">
                  {[5, 10, 20].map((lev) => (
                    <button
                      key={lev}
                      onClick={() => setLeverage(lev)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                        leverage === lev
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {lev}X
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Quantity - better input styling */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Price</label>
                <div className="relative">
                  <Input 
                    value={selectedOptionData?.price || "—"} 
                    readOnly 
                    className="font-mono text-foreground bg-muted/40 border-border/40 h-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Quantity</label>
                <Input 
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="font-mono h-10 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Trade Button - with gradient and glow */}
            <button 
              onClick={handleTrade}
              disabled={!selectedOption || !quantity}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                tradeSide === "long" 
                  ? "text-background hover:scale-[0.98] active:scale-[0.96]" 
                  : "text-foreground hover:scale-[0.98] active:scale-[0.96]"
              }`}
              style={{
                background: tradeSide === "long" 
                  ? "linear-gradient(135deg, hsl(145 80% 42%) 0%, hsl(155 75% 32%) 100%)"
                  : "linear-gradient(135deg, hsl(0 85% 55%) 0%, hsl(350 80% 45%) 100%)",
                boxShadow: tradeSide === "long"
                  ? "0 4px 20px hsl(145 80% 42% / 0.35), inset 0 1px 0 hsl(145 80% 60% / 0.2)"
                  : "0 4px 20px hsl(0 85% 55% / 0.35), inset 0 1px 0 hsl(0 85% 70% / 0.2)"
              }}
            >
              <TrendingUp className={`h-4 w-4 ${tradeSide === "short" ? "rotate-180" : ""}`} />
              {tradeSide === "long" ? "Buy Long" : "Sell Short"} — {selectedOptionData?.label || "Select option"}
            </button>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Order Confirmation Dialog */}
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order Preview</DialogTitle>
        </DialogHeader>
        
        {orderDetails && selectedOptionData && (
          <div className="space-y-4">
            <div className="trading-card p-4 space-y-3">
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Event</span>
                <span className="text-sm text-right max-w-[200px] truncate">{event.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Option</span>
                <span className="text-sm">{selectedOptionData.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Side</span>
                <span className={`text-sm font-medium ${tradeSide === "long" ? "text-trading-green" : "text-trading-red"}`}>
                  {tradeSide === "long" ? "Buy | Long" : "Sell | Short"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Order Price</span>
                <span className="text-sm font-mono">{selectedOptionData.price} USDC</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Quantity</span>
                <span className="text-sm font-mono">{orderDetails.quantity}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Leverage</span>
                <span className="text-sm font-mono">{leverage}x</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Margin Required</span>
                <span className="text-sm font-mono">{orderDetails.marginRequired} USDC</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground text-sm">Est. Liq. Price</span>
                <span className="text-sm font-mono">{orderDetails.liqPrice} USDC</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground text-sm">Est. Fee</span>
                <span className="text-sm font-mono">{orderDetails.estimatedFee} USDC</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className={`flex-1 ${
                  tradeSide === "long" 
                    ? "bg-trading-green hover:bg-trading-green/90" 
                    : "bg-trading-red hover:bg-trading-red/90"
                }`}
                onClick={handleConfirmOrder}
              >
                {tradeSide === "long" ? "Buy Long" : "Sell Short"} - Win ${orderDetails.potentialWin}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};
