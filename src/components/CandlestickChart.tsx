import { useState } from "react";
import { ChevronDown, BarChart2, Copy } from "lucide-react";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const generateMockCandles = (): Candle[] => {
  const candles: Candle[] = [];
  let price = 0.71;
  const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  
  times.forEach((time) => {
    const change = (Math.random() - 0.5) * 0.02;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 0.008;
    const low = Math.min(open, close) - Math.random() * 0.008;
    
    candles.push({ time, open, high, low, close });
    price = close;
  });
  
  return candles;
};

const timeframes = ["1H", "4H", "1D", "1W"];

export const CandlestickChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const candles = generateMockCandles();
  
  const minPrice = Math.min(...candles.map(c => c.low)) - 0.005;
  const maxPrice = Math.max(...candles.map(c => c.high)) + 0.005;
  const priceRange = maxPrice - minPrice;
  
  const chartHeight = 180;
  const candleWidth = 10;
  const candleGap = 6;

  const priceToY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  const priceLabels = [0.735, 0.73, 0.725, 0.72, 0.715, 0.71, 0.705];

  return (
    <div className="px-4 py-2">
      {/* Timeframe selector */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            Price
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="flex bg-muted/50 rounded-md p-0.5 ml-2">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2 py-1 text-xs rounded transition-all ${
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
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <BarChart2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[180px] flex">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-[10px] text-muted-foreground font-mono pr-2 py-1">
          {priceLabels.map((label) => (
            <span key={label}>{label.toFixed(3)}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox={`0 0 ${candles.length * (candleWidth + candleGap) + 20} ${chartHeight}`} preserveAspectRatio="none">
            {candles.map((candle, index) => {
              const x = index * (candleWidth + candleGap) + 10;
              const isGreen = candle.close >= candle.open;
              const bodyTop = priceToY(Math.max(candle.open, candle.close));
              const bodyBottom = priceToY(Math.min(candle.open, candle.close));
              const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
              
              return (
                <g key={index}>
                  {/* Wick */}
                  <line
                    x1={x + candleWidth / 2}
                    y1={priceToY(candle.high)}
                    x2={x + candleWidth / 2}
                    y2={priceToY(candle.low)}
                    stroke={isGreen ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isGreen ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between px-2 mt-2 text-[10px] text-muted-foreground font-mono">
            {candles.map((candle, i) => (
              <span key={i}>{candle.time}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};