import { useNavigate } from "react-router-dom";
import { ChevronRight, BarChart3, Clock, GraduationCap, Users, TrendingUp, Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { toast } from "sonner";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { activeEvents, eventOptionsMap } from "@/data/events";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getCategoryFromName, CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { profile, username } = useUserProfile();

  // Format balance for display
  const formatBalance = (balance: number | null | undefined) => {
    if (balance == null) return "$0.00";
    return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Mock P&L data (could be calculated from positions in the future)
  const weeklyPnL = "+$34.56";
  const weeklyPnLPercent = "+1.9%";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - 主入口页：Logo + 右侧功能按钮 */}
      <MobileHeader 
        showLogo 
        rightContent={
          <div className="flex items-center gap-1">
            {/* 语言切换 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={() => toast("Language switched to English")}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("语言已切换为中文")}>
                  🇨🇳 中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("日本語に切り替えました")}>
                  🇯🇵 日本語
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* 通知 */}
            <button 
              className="p-2 rounded-full hover:bg-muted/50 transition-colors relative"
              onClick={() => toast("Notifications coming soon!")}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {/* 未读红点 */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-trading-red rounded-full" />
            </button>
          </div>
        }
      />

      <main className="px-4 py-4 space-y-6">
        {/* User Stats Card */}
        <div className="trading-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Hello, {username || 'Trader'}!</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">7-Day P&L</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-trading-green">{weeklyPnL}</span>
                <span className="text-sm text-trading-green">({weeklyPnLPercent})</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Available Balance</span>
            <div className="text-2xl font-bold text-foreground">{formatBalance(profile?.trial_balance)}</div>
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
              const options = eventOptionsMap[event.id] || [];
              const countdown = getCountdown(event.endTime);
              const categoryInfo = getCategoryFromName(event.name);
              
              return (
                <div
                  key={event.id}
                  className="trading-card p-4 space-y-3 animate-fade-in cursor-pointer hover:bg-card-hover transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/trade?event=${event.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <h4 className="font-medium text-foreground">{event.name}</h4>
                      <Badge className={`mt-1.5 text-[10px] font-medium border-0 px-2 py-0.5 ${CATEGORY_STYLES[categoryInfo.label as CategoryType]?.class || CATEGORY_STYLES.general.class}`}>
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trade?event=${event.id}`);
                      }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trade
                    </Button>
                  </div>
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
                const options = eventOptionsMap[event.id] || [];
                const countdown = getCountdown(event.endTime);
                const categoryInfo = getCategoryFromName(event.name);
                
                return (
                  <div
                    key={event.id}
                    className="trading-card p-4 space-y-3 border-trading-yellow/30 cursor-pointer hover:bg-card-hover transition-colors"
                    onClick={() => navigate(`/trade?event=${event.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <h4 className="font-medium text-foreground">{event.name}</h4>
                        <Badge className={`mt-1.5 text-[10px] font-medium border-0 px-2 py-0.5 ${CATEGORY_STYLES[categoryInfo.label as CategoryType]?.class || CATEGORY_STYLES.general.class}`}>
                          {categoryInfo.label}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trade?event=${event.id}`);
                        }}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        Trade
                      </Button>
                    </div>
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
