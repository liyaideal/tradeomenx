import { useMemo, useState } from "react";
import { PriceHistoryPoint } from "@/hooks/useResolvedEventDetail";
import { format } from "date-fns";

interface PriceHistoryChartProps {
  priceHistory: Record<string, PriceHistoryPoint[]>;
  options: { id: string; label: string; is_winner: boolean }[];
  isMobile?: boolean;
}

const OPTION_COLORS = [
  "hsl(145 80% 42%)", // trading-green
  "hsl(0 85% 55%)",   // trading-red
  "hsl(260 65% 58%)", // trading-purple
  "hsl(48 100% 55%)", // trading-yellow
];

export const PriceHistoryChart = ({ priceHistory, options, isMobile = false }: PriceHistoryChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ optionId: string; index: number } | null>(null);

  // Generate mock data if no real data exists
  const chartData = useMemo(() => {
    const hasRealData = Object.values(priceHistory).some(arr => arr.length > 0);
    
    if (hasRealData) {
      return priceHistory;
    }

    // Generate mock price history for visualization
    const mockData: Record<string, PriceHistoryPoint[]> = {};
    const pointCount = 30;
    const now = new Date();

    options.forEach((option, optionIndex) => {
      const points: PriceHistoryPoint[] = [];
      let price = 0.3 + Math.random() * 0.4;
      
      for (let i = 0; i < pointCount; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (pointCount - i));
        
        // Add some volatility
        const change = (Math.random() - 0.5) * 0.08;
        price = Math.max(0.01, Math.min(0.99, price + change));
        
        // If winner, trend toward 1.0 near the end
        if (option.is_winner && i > pointCount * 0.7) {
          price = price + (1.0 - price) * 0.15;
        }
        // If loser, trend toward 0.0 near the end
        if (!option.is_winner && i > pointCount * 0.7) {
          price = price * 0.85;
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
  const padding = { top: 20, right: 50, bottom: 30, left: 50 };

  // Find min/max prices across all options
  const allPrices = Object.values(chartData).flatMap(points => points.map(p => p.price));
  const minPrice = Math.max(0, Math.min(...allPrices) - 0.05);
  const maxPrice = Math.min(1, Math.max(...allPrices) + 0.05);
  const priceRange = maxPrice - minPrice;

  const priceToY = (price: number) => {
    return padding.top + (chartHeight - padding.top - padding.bottom) * (1 - (price - minPrice) / priceRange);
  };

  const indexToX = (index: number, total: number) => {
    return padding.left + ((chartWidth - padding.left - padding.right) * index) / (total - 1);
  };

  // Generate price labels
  const priceLabels = [maxPrice, (maxPrice + minPrice) / 2, minPrice];

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No price history available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: OPTION_COLORS[index % OPTION_COLORS.length] }}
            />
            <span className={`text-xs ${option.is_winner ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {option.label}
              {option.is_winner && " ✓"}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible"
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
                  opacity={option.is_winner ? 1 : 0.6}
                />
                
                {/* End point */}
                <circle
                  cx={indexToX(points.length - 1, points.length)}
                  cy={priceToY(points[points.length - 1].price)}
                  r={5}
                  fill={color}
                />
              </g>
            );
          })}
        </svg>

        {/* Y-axis labels - showing probability (0-1) */}
        {priceLabels.map((price, i) => (
          <span
            key={`label-${i}`}
            className="absolute text-[10px] font-mono text-muted-foreground"
            style={{
              right: `${(padding.right / chartWidth) * 100 + 1}%`,
              top: `${(priceToY(price) / chartHeight) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            {price.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
};
