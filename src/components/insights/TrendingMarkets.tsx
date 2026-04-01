import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, DollarSign, BarChart3, Sparkles, Clock, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { EventWithOptions } from "@/hooks/useActiveEvents";
import { getCategoryInfo, CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";

type SortTab = "trending" | "volume" | "active" | "new" | "closing";

const tabs: { id: SortTab; label: string; icon: React.ElementType }[] = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "volume", label: "Top Volume", icon: DollarSign },
  { id: "active", label: "Most Active", icon: BarChart3 },
  { id: "new", label: "Newly Listed", icon: Sparkles },
  { id: "closing", label: "Closing Soon", icon: Clock },
];

// Generate mock 7d sparkline data
const generateSparkline = (currentPrice: number): number[] => {
  const points: number[] = [];
  let price = currentPrice * (0.85 + Math.random() * 0.15);
  for (let i = 0; i < 14; i++) {
    price += (currentPrice - price) * 0.1 + (Math.random() - 0.48) * 0.05;
    price = Math.max(0.01, Math.min(0.99, price));
    points.push(price);
  }
  points.push(currentPrice);
  return points;
};

const MiniSparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.01;
  const h = 28;
  const w = 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const color = positive ? "hsl(145 80% 42%)" : "hsl(0 85% 60%)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Mock volume/trader data per event
const getMockMetrics = (eventId: string) => {
  const hash = eventId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    volume24h: (hash % 500 + 20) * 1000,
    openInterest: (hash % 300 + 10) * 1000,
    traders: hash % 800 + 50,
  };
};

const formatVol = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
};

interface TrendingMarketsProps {
  events: EventWithOptions[];
  priceChanges: Map<string, { prev: number; current: number; change: number }>;
}

export const TrendingMarkets = ({ events, priceChanges }: TrendingMarketsProps) => {
  const [activeTab, setActiveTab] = useState<SortTab>("trending");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // Sort events based on active tab
  const sortedEvents = [...events].sort((a, b) => {
    switch (activeTab) {
      case "trending": {
        const aChange = Math.max(...a.options.map(o => Math.abs(priceChanges.get(o.id)?.change || 0)));
        const bChange = Math.max(...b.options.map(o => Math.abs(priceChanges.get(o.id)?.change || 0)));
        return bChange - aChange;
      }
      case "volume": {
        return getMockMetrics(b.id).volume24h - getMockMetrics(a.id).volume24h;
      }
      case "active": {
        return getMockMetrics(b.id).traders - getMockMetrics(a.id).traders;
      }
      case "new": {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      case "closing": {
        const aEnd = a.end_date ? new Date(a.end_date).getTime() : Infinity;
        const bEnd = b.end_date ? new Date(b.end_date).getTime() : Infinity;
        return aEnd - bEnd;
      }
      default: return 0;
    }
  });

  const displayed = showAll ? sortedEvents.slice(0, 50) : sortedEvents.slice(0, 10);

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Top Trending Markets</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border/30"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayed.map((event) => {
          const catInfo = getCategoryInfo(event.category);
          const catStyle = CATEGORY_STYLES[catInfo.label as CategoryType] || CATEGORY_STYLES.General;
          const metrics = getMockMetrics(event.id);
          const mainOption = event.options[0];
          const secondOption = event.options.length === 2 ? event.options[1] : null;
          const mainChange = mainOption ? priceChanges.get(mainOption.id) : null;
          const mainPrice = mainOption?.price || 0.5;
          const sparklineData = generateSparkline(mainPrice);
          const isPositive = (mainChange?.change || 0) >= 0;
          const closingDate = event.end_date ? new Date(event.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD";

          return (
            <div
              key={event.id}
              className="relative p-4 rounded-xl bg-card border border-border/30 hover:border-border/50 transition-colors group overflow-hidden"
            >
              {/* Background sparkline */}
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <MiniSparkline data={sparklineData} positive={isPositive} />
              </div>

              {/* Category badge */}
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${catStyle.class}`}>
                {catInfo.label}
              </span>

              {/* Event name */}
              <h3 className="text-sm font-semibold text-foreground mb-3 line-clamp-2 leading-snug">
                {event.name}
              </h3>

              {/* Options prices */}
              <div className="flex items-center gap-3 mb-2">
                {mainOption && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{mainOption.label}:</span>
                    <span className="text-sm font-bold text-foreground font-mono">${mainPrice.toFixed(2)}</span>
                    {mainChange && (
                      <span className={`text-[10px] font-medium ${mainChange.change >= 0 ? "text-trading-green" : "text-trading-red"}`}>
                        ({mainChange.change >= 0 ? "+" : ""}{mainChange.change.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                )}
                {secondOption && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{secondOption.label}:</span>
                    <span className="text-sm font-bold text-foreground font-mono">${secondOption.price.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Probability bar */}
              <div className="w-full h-1.5 rounded-full bg-muted/50 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${mainPrice * 100}%` }}
                />
              </div>

              {/* Metrics row */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                <span>Vol 24h: {formatVol(metrics.volume24h)}</span>
                <span>OI: {formatVol(metrics.openInterest)}</span>
                <span>Traders: {metrics.traders}</span>
                <span>Closes: {closingDate}</span>
              </div>

              {/* Trade button */}
              <button
                onClick={() => navigate("/trade")}
                className="relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                Trade Now <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* View All */}
      {!showAll && events.length > 10 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 w-full py-2.5 rounded-lg border border-border/30 text-sm text-muted-foreground hover:text-foreground hover:border-border/50 transition-colors"
        >
          View All ({events.length} markets)
        </button>
      )}
    </section>
  );
};
