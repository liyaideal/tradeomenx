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
  const chartHeight = isMobile ? 180 : 220;
  const chartWidth = 1000;
  const padding = { top: 20, right: 60, bottom: 30, left: 50 };

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
      {/* Interactive Legend */}
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isVisible = visibleOptions.has(option.id);
          const color = OPTION_COLORS[index % OPTION_COLORS.length];
          
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
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
            </button>
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
