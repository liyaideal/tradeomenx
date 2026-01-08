import { useMemo, useState } from "react";
import { PriceHistoryPoint } from "@/hooks/useResolvedEventDetail";
import { format } from "date-fns";

interface PriceHistoryChartProps {
  priceHistory: Record<string, PriceHistoryPoint[]>;
  options: { id: string; label: string; is_winner: boolean; final_price: number | null; price: number }[];
  isMobile?: boolean;
}

const OPTION_COLORS = [
  "hsl(145 80% 42%)", // trading-green
  "hsl(0 85% 55%)",   // trading-red
  "hsl(260 65% 58%)", // trading-purple
  "hsl(48 100% 55%)", // trading-yellow
];

interface TooltipData {
  x: number;
  y: number;
  price: number;
  date: string;
  label: string;
  color: string;
}

export const PriceHistoryChart = ({ priceHistory, options, isMobile = false }: PriceHistoryChartProps) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [visibleOptions, setVisibleOptions] = useState<Set<string>>(new Set(options.map(o => o.id)));

  // Toggle option visibility
  const toggleOption = (optionId: string) => {
    setVisibleOptions(prev => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        // Don't allow hiding all options
        if (next.size > 1) {
          next.delete(optionId);
        }
      } else {
        next.add(optionId);
      }
      return next;
    });
  };

  // Convert price history to USD prices and generate mock data if needed
  const chartData = useMemo(() => {
    const hasRealData = Object.values(priceHistory).some(arr => arr.length > 0);
    
    if (hasRealData) {
      return priceHistory;
    }

    // Generate mock price history in USD for visualization
    const mockData: Record<string, PriceHistoryPoint[]> = {};
    const pointCount = 30;
    const now = new Date();

    options.forEach((option) => {
      const points: PriceHistoryPoint[] = [];
      const finalUsdPrice = option.final_price ?? option.price * 100;
      
      let price = finalUsdPrice * (0.3 + Math.random() * 0.4);
      
      for (let i = 0; i < pointCount; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (pointCount - i));
        
        const change = (Math.random() - 0.5) * finalUsdPrice * 0.1;
        price = Math.max(0.01, price + change);
        
        if (i > pointCount * 0.7) {
          price = price + (finalUsdPrice - price) * 0.2;
        }
        
        points.push({
          price: Number(price.toFixed(4)),
          recorded_at: date.toISOString(),
        });
      }
      
      mockData[option.id] = points;
    });

    return mockData;
  }, [priceHistory, options]);

  // Calculate chart dimensions
  const chartHeight = isMobile ? 200 : 240;
  const chartWidth = 1000;
  const padding = { top: 20, right: 60, bottom: 45, left: 50 };

  // Find min/max prices across VISIBLE options only
  const visiblePrices = Object.entries(chartData)
    .filter(([optionId]) => visibleOptions.has(optionId))
    .flatMap(([, points]) => points.map(p => p.price));
  
  const dataMin = visiblePrices.length > 0 ? Math.min(...visiblePrices) : 0;
  const dataMax = visiblePrices.length > 0 ? Math.max(...visiblePrices) : 100;
  const priceBuffer = (dataMax - dataMin) * 0.1 || 1;
  const minPrice = Math.max(0, dataMin - priceBuffer);
  const maxPrice = dataMax + priceBuffer;
  const priceRange = maxPrice - minPrice;

  const priceToY = (price: number) => {
    return padding.top + (chartHeight - padding.top - padding.bottom) * (1 - (price - minPrice) / priceRange);
  };

  const indexToX = (index: number, total: number) => {
    return padding.left + ((chartWidth - padding.left - padding.right) * index) / (total - 1);
  };

  // Generate price labels (USD)
  const priceLabels = [maxPrice, (maxPrice + minPrice) / 2, minPrice];

  // Get time labels from first available option's data
  const timeLabels = useMemo(() => {
    const firstOptionId = options[0]?.id;
    const points = chartData[firstOptionId] || [];
    if (points.length === 0) return [];
    
    // Show 4-6 time labels depending on data points
    const labelCount = isMobile ? 4 : 6;
    const step = Math.max(1, Math.floor((points.length - 1) / (labelCount - 1)));
    const labels: { index: number; date: string }[] = [];
    
    for (let i = 0; i < points.length; i += step) {
      labels.push({
        index: i,
        date: format(new Date(points[i].recorded_at), isMobile ? "M/d" : "MMM d"),
      });
    }
    
    // Always include last point
    if (labels.length > 0 && labels[labels.length - 1].index !== points.length - 1) {
      labels.push({
        index: points.length - 1,
        date: format(new Date(points[points.length - 1].recorded_at), isMobile ? "M/d" : "MMM d"),
      });
    }
    
    return labels;
  }, [chartData, options, isMobile]);

  // Calculate price change percentage for each option
  const priceChanges = useMemo(() => {
    return options.map((option, index) => {
      const points = chartData[option.id] || [];
      if (points.length < 2) return { optionId: option.id, change: 0, startPrice: 0, endPrice: 0 };
      
      const startPrice = points[0].price;
      const endPrice = points[points.length - 1].price;
      const change = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
      
      return {
        optionId: option.id,
        change,
        startPrice,
        endPrice,
        color: OPTION_COLORS[index % OPTION_COLORS.length],
      };
    });
  }, [chartData, options]);

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No price history available
      </div>
    );
  }

  const handleMouseMove = (
    e: React.MouseEvent<SVGCircleElement>,
    point: PriceHistoryPoint,
    option: typeof options[0],
    colorIndex: number
  ) => {
    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTooltip({
      x,
      y,
      price: point.price,
      date: format(new Date(point.recorded_at), "MMM d, yyyy"),
      label: option.label,
      color: OPTION_COLORS[colorIndex % OPTION_COLORS.length],
    });
  };

  return (
    <div className="space-y-3">
      {/* Interactive Legend with Price Change */}
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isVisible = visibleOptions.has(option.id);
          const color = OPTION_COLORS[index % OPTION_COLORS.length];
          const changeData = priceChanges.find(p => p.optionId === option.id);
          const change = changeData?.change ?? 0;
          const isPositive = change >= 0;
          
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${
                isVisible 
                  ? "bg-muted/40 hover:bg-muted/60" 
                  : "bg-muted/10 opacity-50 hover:opacity-70"
              }`}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-opacity ${isVisible ? "" : "opacity-30"}`}
                style={{ backgroundColor: color }}
              />
              <span className={`text-xs ${
                option.is_winner 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              } ${!isVisible ? "line-through" : ""}`}>
                {option.label}
                {option.is_winner && " ✓"}
              </span>
              {isVisible && (
                <span className={`text-[10px] font-mono font-semibold ${
                  isPositive ? "text-trading-green" : "text-trading-red"
                }`}>
                  {isPositive ? "+" : ""}{change.toFixed(1)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Price Change Summary Cards */}
      <div className={`grid gap-2 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
        {options.map((option, index) => {
          const changeData = priceChanges.find(p => p.optionId === option.id);
          if (!changeData || !visibleOptions.has(option.id)) return null;
          
          const { change, startPrice, endPrice } = changeData;
          const isPositive = change >= 0;
          const color = OPTION_COLORS[index % OPTION_COLORS.length];
          
          return (
            <div
              key={option.id}
              className="flex flex-col gap-1 p-2 rounded-lg bg-muted/20 border border-border/30"
            >
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] text-muted-foreground truncate">
                  {option.label}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  ${startPrice.toFixed(2)} → ${endPrice.toFixed(2)}
                </span>
                <span className={`text-xs font-mono font-bold ${
                  isPositive ? "text-trading-green" : "text-trading-red"
                }`}>
                  {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Grid lines */}
          {priceLabels.map((price, i) => (
            <line
              key={`grid-${i}`}
              x1={padding.left}
              y1={priceToY(price)}
              x2={chartWidth - padding.right}
              y2={priceToY(price)}
              stroke="hsl(222 25% 18%)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}

          {/* X-axis time labels */}
          {timeLabels.map((label, i) => {
            const firstOptionId = options[0]?.id;
            const points = chartData[firstOptionId] || [];
            const x = indexToX(label.index, points.length);
            
            return (
              <g key={`time-${i}`}>
                {/* Vertical tick */}
                <line
                  x1={x}
                  y1={chartHeight - padding.bottom}
                  x2={x}
                  y2={chartHeight - padding.bottom + 5}
                  stroke="hsl(222 25% 25%)"
                  strokeWidth="1"
                />
                {/* Date text */}
                <text
                  x={x}
                  y={chartHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: "10px", fontFamily: "monospace" }}
                >
                  {label.date}
                </text>
              </g>
            );
          })}

          {/* Price lines for each option */}
          {options.map((option, optionIndex) => {
            const points = chartData[option.id] || [];
            if (points.length < 2) return null;
            if (!visibleOptions.has(option.id)) return null;

            const color = OPTION_COLORS[optionIndex % OPTION_COLORS.length];
            const pathD = points
              .map((point, i) => {
                const x = indexToX(i, points.length);
                const y = priceToY(point.price);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ");

            return (
              <g key={option.id}>
                {/* Line path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth={option.is_winner ? 3 : 2}
                  opacity={option.is_winner ? 1 : 0.7}
                />
                
                {/* Interactive points */}
                {points.map((point, i) => (
                  <circle
                    key={i}
                    cx={indexToX(i, points.length)}
                    cy={priceToY(point.price)}
                    r={i === points.length - 1 ? 5 : 4}
                    fill={i === points.length - 1 ? color : "transparent"}
                    stroke={color}
                    strokeWidth={2}
                    className="cursor-pointer transition-all hover:fill-current"
                    style={{ fill: i === points.length - 1 ? color : "transparent" }}
                    onMouseEnter={(e) => handleMouseMove(e, point, option, optionIndex)}
                    onMouseMove={(e) => handleMouseMove(e, point, option, optionIndex)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none px-3 py-2 rounded-lg shadow-lg border border-border/50 bg-popover text-popover-foreground"
            style={{
              left: `${(tooltip.x / (document.querySelector('svg')?.getBoundingClientRect().width || chartWidth)) * 100}%`,
              top: `${(tooltip.y / chartHeight) * 100 - 15}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tooltip.color }}
              />
              <span className="text-xs font-medium">{tooltip.label}</span>
            </div>
            <div className="text-sm font-mono font-semibold">${tooltip.price.toFixed(2)}</div>
            <div className="text-[10px] text-muted-foreground">{tooltip.date}</div>
          </div>
        )}

        {/* Y-axis labels - showing USD prices */}
        {priceLabels.map((price, i) => (
          <span
            key={`label-${i}`}
            className="absolute text-[10px] font-mono text-muted-foreground"
            style={{
              right: `${(padding.right / chartWidth) * 100 - 2}%`,
              top: `${(priceToY(price) / chartHeight) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            ${price.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
};
