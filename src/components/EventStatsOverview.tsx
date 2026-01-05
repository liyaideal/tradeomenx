import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  changeType?: "positive" | "negative" | "neutral";
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
    },
    {
      label: "24H Volume",
      value: data.volume24h,
      change: data.volume24hChange,
      icon: <DollarSign className="h-4 w-4" />,
      changeType: "positive",
    },
    {
      label: "Active Traders",
      value: data.activeTraders.toLocaleString(),
      change: data.activeTradersChange,
      icon: <Users className="h-4 w-4" />,
      changeType: "positive",
    },
    {
      label: "Avg. Leverage",
      value: data.avgLeverage,
      change: data.avgLeverageNote,
      icon: <Zap className="h-4 w-4" />,
      changeType: "neutral",
    },
  ];

  return (
    <Card className="trading-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Event Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </div>
              <div className="text-xl font-bold font-mono text-foreground">
                {item.value}
              </div>
              {item.change && (
                <div 
                  className={`text-xs ${
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
      </CardContent>
    </Card>
  );
};
