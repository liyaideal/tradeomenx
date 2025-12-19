import { useState, useMemo, useEffect } from "react";
import { BarChart2, Copy } from "lucide-react";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  remainingDays?: number; // T_remain in days
}

const TIMEFRAMES = ["1m", "5m", "15m", "1H", "4H", "1D", "ALL"] as const;
type Timeframe = typeof TIMEFRAMES[number];

// Determine default timeframe based on remaining time
const getDefaultTimeframe = (remainingDays: number): Timeframe => {
  if (remainingDays <= 7) return "15m";
  if (remainingDays <= 30) return "1H";
  if (remainingDays <= 180) return "4H";
  return "1D";
};

// Generate mock candles - in production this would come from API
const generateMockCandles = (timeframe: Timeframe, count: number = 80): Candle[] => {
  const candles: Candle[] = [];
  let price = 0.68 + Math.random() * 0.08;
  
  const getTimeLabel = (index: number): string => {
    if (timeframe === "ALL") {
      const date = new Date();
      date.setDate(date.getDate() - (count - index));
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (timeframe === "1D") {
      const date = new Date();
      date.setDate(date.getDate() - (count - index));
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (timeframe === "4H") {
      const hour = (index * 4) % 24;
      return `${hour.toString().padStart(2, "0")}:00`;
    }
    if (timeframe === "1H") {
      const hour = index % 24;
      return `${hour.toString().padStart(2, "0")}:00`;
    }
    if (timeframe === "15m") {
      const minute = (index * 15) % 60;
      const hour = Math.floor((index * 15) / 60) % 24;
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    }
    if (timeframe === "5m") {
      const minute = (index * 5) % 60;
      const hour = Math.floor((index * 5) / 60) % 24;
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    }
    // 1m
    const minute = index % 60;
    const hour = Math.floor(index / 60) % 24;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  // Volatility based on timeframe
  const volatility = timeframe === "ALL" ? 0.015 : 
                     timeframe === "1D" ? 0.012 : 
                     timeframe === "4H" ? 0.008 : 
                     timeframe === "1H" ? 0.006 : 
                     timeframe === "15m" ? 0.004 : 
                     timeframe === "5m" ? 0.003 : 0.002;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.45) * volatility; // Slight upward bias
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    candles.push({ 
      time: getTimeLabel(i), 
      open, 
      high, 
      low, 
      close 
    });
    price = close;
  }
  
  return candles;
};

export const CandlestickChart = ({ remainingDays = 25 }: CandlestickChartProps) => {
  const defaultTimeframe = getDefaultTimeframe(remainingDays);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(defaultTimeframe);
  const [chartMode, setChartMode] = useState<"candle" | "line">("candle");
  
  // Auto-switch to line for ALL timeframe
  useEffect(() => {
    if (selectedTimeframe === "ALL") {
      setChartMode("line");
    } else {
      setChartMode("candle");
    }
  }, [selectedTimeframe]);

  const candleCount = selectedTimeframe === "ALL" ? 120 : 80;
  const candles = useMemo(
    () => generateMockCandles(selectedTimeframe, candleCount), 
    [selectedTimeframe, candleCount]
  );
  
  // Calculate price range with symmetric padding (10% on each side)
  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;
  const adjustedRange = adjustedMax - adjustedMin;
  
  const chartHeight = 200;
  const chartPadding = { top: 10, bottom: 25, left: 45, right: 10 };
  const drawHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  
  // Calculate candle dimensions - fill 4/5 of width, leave 1/5 for future
  const visibleWidth = 320;
  const candleAreaWidth = visibleWidth * 0.85;
  const candleWidth = selectedTimeframe === "ALL" ? 2 : Math.max(4, candleAreaWidth / candleCount - 2);
  const candleGap = selectedTimeframe === "ALL" ? 1 : 2;

  const priceToY = (price: number) => {
    return chartPadding.top + drawHeight - ((price - adjustedMin) / adjustedRange) * drawHeight;
  };

  // Generate price labels (5 labels evenly distributed)
  const priceLabels = useMemo(() => {
    const labels = [];
    for (let i = 0; i <= 4; i++) {
      labels.push(adjustedMax - (adjustedRange * i / 4));
    }
    return labels;
  }, [adjustedMax, adjustedRange]);

  // Get time labels to display (every ~10 candles)
  const timeLabels = useMemo(() => {
    const step = Math.max(1, Math.floor(candles.length / 8));
    return candles.filter((_, i) => i % step === 0);
  }, [candles]);

  const svgWidth = candles.length * (candleWidth + candleGap) + chartPadding.left + chartPadding.right;

  return (
    <div className="px-4 py-2">
      {/* Timeframe selector */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="flex bg-muted/50 rounded-md p-0.5 overflow-x-auto scrollbar-hide">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2 py-1 text-xs rounded whitespace-nowrap transition-all ${
                  selectedTimeframe === tf
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setChartMode(chartMode === "candle" ? "line" : "candle")}
            className={`p-1.5 transition-colors ${chartMode === "candle" ? "text-foreground" : "text-muted-foreground"}`}
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex h-[180px]">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-[10px] text-muted-foreground font-mono pr-1 py-2 w-10">
            {priceLabels.map((label, i) => (
              <span key={i}>{label.toFixed(4)}</span>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 relative overflow-x-auto scrollbar-hide">
            <svg 
              width={svgWidth} 
              height={chartHeight}
              className="min-w-full"
            >
              {/* Grid lines */}
              {priceLabels.map((price, i) => (
                <line
                  key={`grid-${i}`}
                  x1={chartPadding.left}
                  y1={priceToY(price)}
                  x2={svgWidth - chartPadding.right}
                  y2={priceToY(price)}
                  stroke="hsl(222 30% 18%)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
              
              {chartMode === "line" || selectedTimeframe === "ALL" ? (
                // Line chart for ALL or when line mode selected
                <path
                  d={candles.map((candle, index) => {
                    const x = chartPadding.left + index * (candleWidth + candleGap) + candleWidth / 2;
                    const y = priceToY(candle.close);
                    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke="hsl(142 71% 45%)"
                  strokeWidth="1.5"
                />
              ) : (
                // Candlestick chart
                candles.map((candle, index) => {
                  const x = chartPadding.left + index * (candleWidth + candleGap);
                  const isGreen = candle.close >= candle.open;
                  const bodyTop = priceToY(Math.max(candle.open, candle.close));
                  const bodyBottom = priceToY(Math.min(candle.open, candle.close));
                  const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
                  
                  return (
                    <g key={index}>
                      {/* Wick */}
                      <line
                        x1={x + candleWidth / 2}
                        y1={priceToY(candle.high)}
                        x2={x + candleWidth / 2}
                        y2={priceToY(candle.low)}
                        stroke={isGreen ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
                        strokeWidth="1"
                      />
                      {/* Body */}
                      <rect
                        x={x}
                        y={bodyTop}
                        width={candleWidth}
                        height={bodyHeight}
                        fill={isGreen ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
                        rx="0.5"
                      />
                    </g>
                  );
                })
              )}

              {/* Current price line */}
              {candles.length > 0 && (
                <>
                  <line
                    x1={chartPadding.left}
                    y1={priceToY(candles[candles.length - 1].close)}
                    x2={svgWidth - chartPadding.right}
                    y2={priceToY(candles[candles.length - 1].close)}
                    stroke="hsl(142 71% 45%)"
                    strokeWidth="0.5"
                    strokeDasharray="3,3"
                    opacity="0.6"
                  />
                  <text
                    x={svgWidth - chartPadding.right - 2}
                    y={priceToY(candles[candles.length - 1].close) - 4}
                    fill="hsl(142 71% 45%)"
                    fontSize="9"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {candles[candles.length - 1].close.toFixed(4)}
                  </text>
                </>
              )}
            </svg>
            
          </div>
        </div>

        {/* X-axis labels - fixed at bottom */}
        <div className="flex justify-between px-10 mt-1 text-[9px] text-muted-foreground font-mono">
          {timeLabels.slice(0, 8).map((candle, i) => (
            <span key={i}>{candle.time}</span>
          ))}
        </div>
      </div>

      {/* Timeframe info */}
      {selectedTimeframe === "ALL" && (
        <div className="text-[10px] text-muted-foreground text-center mt-1">
          Showing full history from market creation
        </div>
      )}
    </div>
  );
};