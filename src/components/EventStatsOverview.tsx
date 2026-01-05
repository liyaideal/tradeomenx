import { TrendingUp, DollarSign, Users, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  changeType?: "positive" | "negative" | "neutral";
  iconColor: string;
}

interface EventStatsOverviewProps {
  stats?: {
    activeEvents: number;
    activeEventsChange?: string;
    volume24h: string;
    volume24hChange?: string;
    activeTraders: number;
    activeTradersChange?: string;
    avgLeverage: string;
    avgLeverageNote?: string;
  };
}

export const EventStatsOverview = ({ stats }: EventStatsOverviewProps) => {
  const isMobile = useIsMobile();

  const defaultStats = {
    activeEvents: 4,
    activeEventsChange: "+2 today",
    volume24h: "$2.4M",
    volume24hChange: "+14.5%",
    activeTraders: 1247,
    activeTradersChange: "+12.3%",
    avgLeverage: "6.8X",
    avgLeverageNote: "Recommended 5X",
  };

  const data = stats || defaultStats;

  const statItems: StatItem[] = [
    {
      label: "Active Events",
      value: String(data.activeEvents),
      change: data.activeEventsChange,
      icon: <TrendingUp className="h-4 w-4" />,
      changeType: "positive",
      iconColor: "icon-container-primary",
    },
    {
      label: "24H Volume",
      value: data.volume24h,
      change: data.volume24hChange,
      icon: <DollarSign className="h-4 w-4" />,
      changeType: "positive",
      iconColor: "icon-container-green",
    },
    {
      label: "Active Traders",
      value: data.activeTraders.toLocaleString(),
      change: data.activeTradersChange,
      icon: <Users className="h-4 w-4" />,
      changeType: "positive",
      iconColor: "icon-container-primary",
    },
    {
      label: "Avg. Leverage",
      value: data.avgLeverage,
      change: data.avgLeverageNote,
      icon: <Zap className="h-4 w-4" />,
      changeType: "neutral",
      iconColor: "icon-container-yellow",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 p-[1px]">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl" />
      
      <div className="relative rounded-2xl bg-card/80 backdrop-blur-sm p-6">
        {/* Header with subtle glow */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-1 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold text-foreground">Event Overview</h2>
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
          {statItems.map((item, index) => (
            <div
              key={index}
              className="stats-card p-4 group"
            >
              {/* Icon + Label Row */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`icon-container w-8 h-8 ${item.iconColor}`}>
                  {item.icon}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {item.label}
                </span>
              </div>

              {/* Value */}
              <div className="text-2xl font-bold font-mono text-foreground mb-1 group-hover:text-primary transition-colors">
                {item.value}
              </div>

              {/* Change indicator */}
              {item.change && (
                <div 
                  className={`text-xs font-medium ${
                    item.changeType === "positive" 
                      ? "text-trading-green" 
                      : item.changeType === "negative" 
                      ? "text-trading-red" 
                      : "text-muted-foreground"
                  }`}
                >
                  {item.change}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};