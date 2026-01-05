import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, TrendingUp, DollarSign, BarChart3, Share2, Crown, Medal, Award, ChevronLeft, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";

type SortType = "pnl" | "roi" | "volume";

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  pnl: number;
  roi: number;
  volume: number;
  trades: number;
  badge?: "gold" | "silver" | "bronze";
}

// Mock data for leaderboard
const mockLeaderboardData: LeaderboardUser[] = [
  { rank: 1, username: "CryptoWhale", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=whale", pnl: 125430, roi: 342.5, volume: 2450000, trades: 156, badge: "gold" },
  { rank: 2, username: "TradingMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master", pnl: 89250, roi: 287.3, volume: 1890000, trades: 234, badge: "silver" },
  { rank: 3, username: "ProfitHunter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hunter", pnl: 67890, roi: 198.7, volume: 1560000, trades: 189, badge: "bronze" },
  { rank: 4, username: "AlphaTrader", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alpha", pnl: 45670, roi: 156.2, volume: 980000, trades: 145 },
  { rank: 5, username: "MarketMaker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maker", pnl: 34560, roi: 134.8, volume: 890000, trades: 178 },
  { rank: 6, username: "DiamondHands", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diamond", pnl: 28900, roi: 112.4, volume: 750000, trades: 98 },
  { rank: 7, username: "MoonShot", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moon", pnl: 23450, roi: 98.6, volume: 680000, trades: 167 },
  { rank: 8, username: "BullRunner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bull", pnl: 19870, roi: 87.3, volume: 590000, trades: 134 },
  { rank: 9, username: "SmartMoney", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=smart", pnl: 15690, roi: 76.5, volume: 480000, trades: 112 },
  { rank: 10, username: "TrendSurfer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trend", pnl: 12340, roi: 65.2, volume: 390000, trades: 89 },
];

const sortTabs: { key: SortType; label: string; icon: React.ElementType }[] = [
  { key: "pnl", label: "PnL", icon: DollarSign },
  { key: "roi", label: "ROI %", icon: TrendingUp },
  { key: "volume", label: "Volume", icon: BarChart3 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5" />;
    case 2:
      return <Medal className="w-5 h-5" />;
    case 3:
      return <Award className="w-5 h-5" />;
    default:
      return null;
  }
};

const getRankGradient = (rank: number) => {
  switch (rank) {
    case 1:
      return "from-yellow-400 via-yellow-500 to-amber-600";
    case 2:
      return "from-slate-300 via-slate-400 to-slate-500";
    case 3:
      return "from-amber-600 via-amber-700 to-orange-800";
    default:
      return "";
  }
};

const TopThreeCard = ({ user, sortType }: { user: LeaderboardUser; sortType: SortType }) => {
  const isFirst = user.rank === 1;
  const gradientClass = getRankGradient(user.rank);
  
  const getValue = () => {
    switch (sortType) {
      case "pnl":
        return `+$${user.pnl.toLocaleString()}`;
      case "roi":
        return `+${user.roi.toFixed(1)}%`;
      case "volume":
        return `$${user.volume.toLocaleString()}`;
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${isFirst ? "order-2 -mt-4" : user.rank === 2 ? "order-1" : "order-3"}`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass} opacity-20 blur-2xl rounded-full scale-150`} />
      
      {/* Rank badge */}
      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${gradientClass} text-background font-bold text-sm mb-2 shadow-lg`}>
        {user.rank}
      </div>

      {/* Avatar with ring */}
      <div className={`relative mb-3 ${isFirst ? "scale-110" : ""}`}>
        <div className={`absolute -inset-1 bg-gradient-to-br ${gradientClass} rounded-full blur-sm opacity-75`} />
        <Avatar className={`relative ${isFirst ? "h-20 w-20" : "h-16 w-16"} border-2 border-background`}>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        {/* Crown for #1 */}
        {isFirst && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-400">
            <Crown className="w-6 h-6 fill-yellow-400" />
          </div>
        )}
      </div>

      {/* Username */}
      <h3 className={`font-semibold text-foreground ${isFirst ? "text-base" : "text-sm"} mb-1 truncate max-w-24`}>
        {user.username}
      </h3>

      {/* Value */}
      <div className={`font-mono font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent ${isFirst ? "text-lg" : "text-base"}`}>
        {getValue()}
      </div>

      {/* Trophy icon */}
      <div className={`mt-2 text-gradient-to-r ${gradientClass}`}>
        {getRankIcon(user.rank)}
      </div>
    </div>
  );
};

const LeaderboardRow = ({ user, sortType, index }: { user: LeaderboardUser; sortType: SortType; index: number }) => {
  const getValue = () => {
    switch (sortType) {
      case "pnl":
        return `+$${user.pnl.toLocaleString()}`;
      case "roi":
        return `+${user.roi.toFixed(1)}%`;
      case "volume":
        return `$${user.volume.toLocaleString()}`;
    }
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Rank */}
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-bold text-sm">
        {user.rank}
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-border/50">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h4 className="font-medium text-foreground truncate">{user.username}</h4>
          <p className="text-xs text-muted-foreground">{user.trades} trades</p>
        </div>
      </div>

      {/* Value */}
      <div className="text-right">
        <div className="font-mono font-bold text-trading-green">{getValue()}</div>
        <div className="text-xs text-muted-foreground">
          {sortType === "pnl" && `${user.roi.toFixed(1)}% ROI`}
          {sortType === "roi" && `$${user.pnl.toLocaleString()} PnL`}
          {sortType === "volume" && `${user.roi.toFixed(1)}% ROI`}
        </div>
      </div>
    </div>
  );
};

const ShareableCard = ({ user }: { user: LeaderboardUser }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-background to-primary/5 p-6">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-trading-green/20 to-transparent rounded-full blur-2xl" />
      
      {/* Sparkle decorations */}
      <Sparkles className="absolute top-4 right-4 w-5 h-5 text-primary/40" />
      <Sparkles className="absolute bottom-8 right-12 w-4 h-4 text-trading-green/40" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">OMENX Leaderboard</span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-sm opacity-75" />
            <Avatar className="relative h-16 w-16 border-2 border-background">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-bold text-xl text-foreground">{user.username}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-background font-bold text-xs">
                #{user.rank}
              </div>
              <span className="text-sm text-muted-foreground">Global Ranking</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/30">
            <div className="text-xs text-muted-foreground mb-1">PnL</div>
            <div className="font-mono font-bold text-trading-green">+${user.pnl.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/30">
            <div className="text-xs text-muted-foreground mb-1">ROI</div>
            <div className="font-mono font-bold text-primary">+{user.roi.toFixed(1)}%</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/30">
            <div className="text-xs text-muted-foreground mb-1">Trades</div>
            <div className="font-mono font-bold text-foreground">{user.trades}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sortType, setSortType] = useState<SortType>("pnl");

  const sortedData = [...mockLeaderboardData].sort((a, b) => {
    switch (sortType) {
      case "pnl":
        return b.pnl - a.pnl;
      case "roi":
        return b.roi - a.roi;
      case "volume":
        return b.volume - a.volume;
    }
  });

  const topThree = sortedData.slice(0, 3);
  const restOfList = sortedData.slice(3);

  const content = (
    <div className="min-h-screen bg-background">
      {/* Hero Section with gradient background */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-trading-green/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 px-4 pt-6 pb-8">
          {/* Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Live Rankings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top traders this week
            </p>
          </div>

          {/* Sort Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {sortTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSortType(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  sortType === tab.key
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(260_60%_55%/0.3)]"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 md:gap-8 mb-8 px-4">
            {topThree.map((user) => (
              <TopThreeCard key={user.rank} user={user} sortType={sortType} />
            ))}
          </div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="px-4 pb-24 md:pb-8 max-w-2xl mx-auto">
        <div className="space-y-3">
          {restOfList.map((user, index) => (
            <LeaderboardRow key={user.rank} user={user} sortType={sortType} index={index} />
          ))}
        </div>

        {/* Shareable Card Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Your Rank
          </h3>
          <ShareableCard user={topThree[0]} />
          <p className="text-center text-sm text-muted-foreground mt-4">
            Tap to share your ranking card on social media
          </p>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {content}
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <EventsDesktopHeader />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end px-6 py-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share Rankings</span>
          </button>
        </div>
        {content}
      </div>
    </>
  );
}
