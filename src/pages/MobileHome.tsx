import { useNavigate } from "react-router-dom";
import { Globe, Bell, ChevronRight, BarChart3, Clock, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import omenxLogo from "@/assets/omenx-logo.svg";

// Mock user data
const userData = {
  name: "Liya",
  weeklyPnL: "+$34.56",
  weeklyPnLPercent: "+1.9%",
  availableBalance: "$2,345.67",
};

// Mock positions data
const positionsData = [
  {
    id: "1",
    title: "Will Trump win the 2024 election?",
    side: "Long" as const,
    price: "$68.5",
    unrealizedPnL: "+$45.20",
    roi: "+8.6%",
    isProfit: true,
  },
  {
    id: "2",
    title: "Bitcoin price above $100k?",
    side: "Short" as const,
    price: "$32.1",
    unrealizedPnL: "-$12.45",
    roi: "-3.2%",
    isProfit: false,
  },
];

// Mock hot markets data
const hotMarketsData = [
  {
    id: "1",
    category: "Politics",
    categoryColor: "bg-muted text-foreground",
    title: "When will government shutdown end?",
    options: [
      { label: "November 4-7", price: "$52.3" },
      { label: "November 12-15", price: "$28.1" },
    ],
    volume: "$1.4M",
    countdown: "94D 2h 15m",
  },
  {
    id: "2",
    category: "Crypto",
    categoryColor: "bg-trading-yellow/20 text-trading-yellow",
    title: "Will Ethereum price break $5000?",
    options: [
      { label: "Yes", price: "$52.3" },
      { label: "No", price: "$28.1" },
    ],
    volume: "$2.1M",
    countdown: "12D 5h 30m",
  },
  {
    id: "3",
    category: "Finance",
    categoryColor: "bg-trading-green/20 text-trading-green",
    title: "Will Fed raise rates next meeting?",
    options: [
      { label: "Yes", price: "$52.3" },
      { label: "No", price: "$28.1" },
    ],
    volume: "$1.8M",
    countdown: "8D 14h 22m",
  },
  {
    id: "4",
    category: "Sports",
    categoryColor: "bg-trading-red/20 text-trading-red",
    title: "Super Bowl Champion Prediction 2025",
    options: [
      { label: "Chiefs", price: "$52.3" },
      { label: "Bills", price: "$526.3" },
    ],
    volume: "$0.9M",
    countdown: "45D 8h 12m",
  },
];

// Mock settlement soon data
const settlementSoonData = [
  {
    id: "1",
    category: "Finance",
    categoryColor: "bg-trading-green/20 text-trading-green",
    title: "Will Fed cut rates in December?",
    options: [
      { label: "YES", price: "$78.3" },
      { label: "NO", price: "$22.1" },
    ],
    settlesIn: "2h 15m",
  },
];

const MobileHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <img src={omenxLogo} alt="OMENX" className="h-4 w-auto" />
            </div>
            <span className="font-semibold text-foreground">OMENX</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-trading-red rounded-full" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-trading-green to-trading-purple" />
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* User Stats Card */}
        <div className="trading-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Hello, {userData.name}!</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">7-Day P&L</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-trading-green">{userData.weeklyPnL}</span>
                <span className="text-sm text-trading-green">({userData.weeklyPnLPercent})</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Available Balance</span>
            <div className="text-2xl font-bold text-foreground">{userData.availableBalance}</div>
          </div>
          <Button className="w-full bg-muted hover:bg-muted/80 text-foreground">
            Redeem Points
          </Button>
        </div>

        {/* My Positions Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">My Positions ({positionsData.length})</h3>
            <button className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {positionsData.map((position) => (
              <div
                key={position.id}
                className="flex-shrink-0 w-[200px] trading-card p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground line-clamp-2 flex-1">{position.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-xs px-2 py-0.5 ${
                      position.side === "Long" 
                        ? "bg-trading-green/20 text-trading-green border-trading-green/30" 
                        : "bg-trading-red/20 text-trading-red border-trading-red/30"
                    }`}
                  >
                    {position.side}
                  </Badge>
                  <span className="text-sm font-mono text-foreground">{position.price}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <span className="text-xs text-muted-foreground">Unrealized P&L</span>
                    <div className={`text-sm font-medium ${position.isProfit ? "text-trading-green" : "text-trading-red"}`}>
                      {position.unrealizedPnL}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">ROI</span>
                    <div className={`text-sm font-medium ${position.isProfit ? "text-trading-green" : "text-trading-red"}`}>
                      {position.roi}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Markets Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-lg">🔥</span> Hot Markets
            </h3>
            <button 
              onClick={() => navigate("/events")}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              More <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {hotMarketsData.map((market, index) => (
              <div
                key={market.id}
                className="trading-card p-4 space-y-3 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <Badge className={`text-xs ${market.categoryColor} border-0`}>
                    {market.category}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1"
                    onClick={() => navigate("/trade")}
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Trade
                  </Button>
                </div>
                <h4 className="font-medium text-foreground">{market.title}</h4>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {market.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex-shrink-0 min-w-[120px] bg-muted/50 rounded-lg p-3"
                    >
                      <span className="text-xs text-muted-foreground">{option.label}</span>
                      <div className="text-lg font-bold font-mono text-foreground">{option.price}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    <span>Volume: {market.volume}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-trading-yellow">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{market.countdown}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Settlement Soon Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚩</span>
            <div>
              <h3 className="font-semibold text-foreground">Settlement Soon</h3>
              <p className="text-xs text-muted-foreground">Last chance to trade</p>
            </div>
          </div>
          <div className="space-y-3">
            {settlementSoonData.map((market) => (
              <div
                key={market.id}
                className="trading-card p-4 space-y-3 border-trading-yellow/30"
              >
                <div className="flex items-start justify-between">
                  <Badge className={`text-xs ${market.categoryColor} border-0`}>
                    {market.category}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1"
                    onClick={() => navigate("/trade")}
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Trade
                  </Button>
                </div>
                <h4 className="font-medium text-foreground">{market.title}</h4>
                <div className="flex gap-2">
                  {market.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex-1 bg-muted/50 rounded-lg p-3"
                    >
                      <span className="text-xs text-muted-foreground">{option.label}</span>
                      <div className="text-lg font-bold font-mono text-foreground">{option.price}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-trading-yellow text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Settles in {market.settlesIn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <button className="trading-card p-4 flex flex-col items-center gap-2 hover:bg-card-hover transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Learning Center</span>
          </button>
          <button className="trading-card p-4 flex flex-col items-center gap-2 hover:bg-card-hover transition-colors">
            <div className="w-10 h-10 rounded-full bg-trading-green/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-trading-green" />
            </div>
            <span className="text-sm font-medium text-foreground">Invite Friends</span>
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default MobileHome;
