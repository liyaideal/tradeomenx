import { useNavigate } from "react-router-dom";
import { Globe, Bell, ChevronRight, BarChart3, Clock, GraduationCap, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { activeEvents, eventOptionsMap } from "@/data/events";
import { getCategoryInfo } from "@/lib/categoryUtils";

// Mock user data
const userData = {
  name: "Liya",
  weeklyPnL: "+$34.56",
  weeklyPnLPercent: "+1.9%",
  availableBalance: "$2,345.67",
};

// Helper to calculate countdown from endTime
const getCountdown = (endTime: Date) => {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}D ${hours}h ${minutes}m`;
  return `${hours}h ${minutes}m`;
};

const MobileHome = () => {
  const navigate = useNavigate();
  const { positions } = usePositionsStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate("/style-guide")} className="cursor-pointer">
            <Logo size="md" />
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
          <Button 
            className="w-full bg-muted hover:bg-muted/80 text-foreground"
            onClick={() => toast("Get ready! You'll soon be able to swap your earnings for points.")}
          >
            Redeem Points
          </Button>
        </div>

        {/* My Positions Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">My Positions ({positions.length})</h3>
            <button 
              onClick={() => navigate("/trade/order", { state: { tab: "Positions" } })}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {positions.slice(0, 5).map((position, index) => {
              const isProfit = position.pnl.startsWith("+");
              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-[200px] trading-card p-3 space-y-2 cursor-pointer hover:bg-card-hover transition-colors"
                  onClick={() => navigate("/trade/order", { state: { tab: "Positions", highlightPosition: index } })}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground line-clamp-2 flex-1">{position.event}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${
                        position.type === "long" 
                          ? "bg-trading-green/20 text-trading-green border-trading-green/30" 
                          : "bg-trading-red/20 text-trading-red border-trading-red/30"
                      }`}
                    >
                      {position.type === "long" ? "Long" : "Short"}
                    </Badge>
                    <span className="text-sm font-mono text-foreground">{position.option}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div>
                      <span className="text-xs text-muted-foreground">Unrealized P&L</span>
                      <div className={`text-sm font-medium ${isProfit ? "text-trading-green" : "text-trading-red"}`}>
                        {position.pnl}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">ROI</span>
                      <div className={`text-sm font-medium ${isProfit ? "text-trading-green" : "text-trading-red"}`}>
                        {position.pnlPercent}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            {activeEvents.slice(0, 4).map((event, index) => {
              const categoryInfo = getCategoryInfo(event.icon);
              const options = eventOptionsMap[event.id] || [];
              const countdown = getCountdown(event.endTime);
              
              return (
                <div
                  key={event.id}
                  className="trading-card p-4 space-y-3 animate-fade-in cursor-pointer hover:bg-card-hover transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/trade?event=${event.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <Badge className={`text-xs ${categoryInfo.color} border-0`}>
                      {categoryInfo.category}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trade?event=${event.id}`);
                      }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trade
                    </Button>
                  </div>
                  <h4 className="font-medium text-foreground">{event.name}</h4>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className="flex-shrink-0 min-w-[100px] bg-muted/50 rounded-lg p-2.5"
                      >
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{option.label}</span>
                        <div className="text-base font-bold font-mono text-foreground">${option.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BarChart3 className="h-3.5 w-3.5 text-primary" />
                      <span>Volume: {event.volume}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-trading-yellow">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{countdown}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
            {/* Show the event closest to settlement */}
            {activeEvents
              .filter(e => e.endTime.getTime() > Date.now())
              .sort((a, b) => a.endTime.getTime() - b.endTime.getTime())
              .slice(0, 1)
              .map((event) => {
                const categoryInfo = getCategoryInfo(event.icon);
                const options = eventOptionsMap[event.id] || [];
                const countdown = getCountdown(event.endTime);
                
                return (
                  <div
                    key={event.id}
                    className="trading-card p-4 space-y-3 border-trading-yellow/30"
                  >
                    <div className="flex items-start justify-between">
                      <Badge className={`text-xs ${categoryInfo.color} border-0`}>
                        {categoryInfo.category}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1"
                        onClick={() => navigate("/trade")}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        Trade
                      </Button>
                    </div>
                    <h4 className="font-medium text-foreground">{event.name}</h4>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {options.map((option) => (
                        <div
                          key={option.id}
                          className="flex-shrink-0 min-w-[100px] bg-muted/50 rounded-lg p-2.5"
                        >
                          <span className="text-[10px] text-muted-foreground line-clamp-1">{option.label}</span>
                          <div className="text-base font-bold font-mono text-foreground">${option.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-trading-yellow text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Settles in {countdown}</span>
                    </div>
                  </div>
                );
              })}
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
