import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, BarChart3, Share2, ChevronLeft, Sparkles, Zap, Download, Send, Copy, Check, X, ChevronUp, User, Palette, Eye, EyeOff, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { LaurelWreath, SmallLaurelBadge } from "@/components/LaurelWreath";
import { useToast } from "@/hooks/use-toast";
import * as htmlToImage from "html-to-image";
import omenxLogo from "@/assets/omenx-logo.svg";

// Desktop Top 3 Assets
import desktopChampion from "@/assets/leaderboard/desktop-champion.svg";
import desktopRunnerUp from "@/assets/leaderboard/desktop-runner-up.svg";
import desktopBronze from "@/assets/leaderboard/desktop-bronze.svg";

// Mobile Medal Assets
import medalGold from "@/assets/leaderboard/medal-gold.svg";
import medalSilver from "@/assets/leaderboard/medal-silver.svg";
import medalBronze from "@/assets/leaderboard/medal-bronze.svg";
import avatarExample from "@/assets/leaderboard/avatar-example-1.svg";

type SortType = "pnl" | "roi" | "volume";

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  pnl: number;
  roi: number;
  volume: number;
  trades: number;
}

// Mock data for leaderboard
const mockLeaderboardData: LeaderboardUser[] = [
  { rank: 1, username: "CryptoWhale", avatar: avatarExample, pnl: 125430, roi: 342.5, volume: 2450000, trades: 156 },
  { rank: 2, username: "TradingMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master", pnl: 89250, roi: 287.3, volume: 1890000, trades: 234 },
  { rank: 3, username: "ProfitHunter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hunter", pnl: 67890, roi: 198.7, volume: 1560000, trades: 189 },
  { rank: 4, username: "AlphaTrader", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alpha", pnl: 45670, roi: 156.2, volume: 980000, trades: 145 },
  { rank: 5, username: "MarketMaker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maker", pnl: 34560, roi: 134.8, volume: 890000, trades: 178 },
  { rank: 6, username: "DiamondHands", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diamond", pnl: 28900, roi: 112.4, volume: 750000, trades: 98 },
  { rank: 7, username: "MoonShot", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moon", pnl: 23450, roi: 98.6, volume: 680000, trades: 167 },
  { rank: 8, username: "BullRunner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bull", pnl: 19870, roi: 87.3, volume: 590000, trades: 134 },
  { rank: 9, username: "SmartMoney", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=smart", pnl: 15690, roi: 76.5, volume: 480000, trades: 112 },
  { rank: 10, username: "TrendSurfer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trend", pnl: 12340, roi: 65.2, volume: 390000, trades: 89 },
  { rank: 11, username: "Hodler", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hodler", pnl: 10200, roi: 58.3, volume: 320000, trades: 76 },
  { rank: 12, username: "BlockBuster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=block", pnl: 8900, roi: 52.1, volume: 280000, trades: 68 },
  { rank: 13, username: "CryptoNinja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser", pnl: 2340, roi: 23.5, volume: 45000, trades: 28 },
];

const CURRENT_USER_USERNAME = "CryptoNinja";

const sortTabs: { key: SortType; label: string; icon: React.ElementType }[] = [
  { key: "pnl", label: "PnL", icon: DollarSign },
  { key: "roi", label: "ROI %", icon: TrendingUp },
  { key: "volume", label: "Volume", icon: BarChart3 },
];

// ============ DESKTOP TOP 3 COMPONENT ============
const DesktopTopThree = ({ users, sortType }: { users: LeaderboardUser[]; sortType: SortType }) => {
  const getValue = (user: LeaderboardUser) => {
    switch (sortType) {
      case "pnl": return `$${user.pnl.toLocaleString()}`;
      case "roi": return `${user.roi.toFixed(1)}%`;
      case "volume": return `$${user.volume.toLocaleString()}`;
    }
  };

  const getAsset = (rank: number) => {
    switch (rank) {
      case 1: return desktopChampion;
      case 2: return desktopRunnerUp;
      case 3: return desktopBronze;
      default: return desktopBronze;
    }
  };

  return (
    <div className="flex justify-center items-end gap-4 mb-8">
      {/* 2nd Place - Left */}
      <div className="flex flex-col items-center order-1">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <img src={getAsset(2)} alt="Runner Up" className="absolute inset-0 w-full h-full object-contain" />
          <Avatar className="relative w-20 h-20 border-2 border-gray-400/50">
            <AvatarImage src={users[1]?.avatar} alt={users[1]?.username} />
            <AvatarFallback>{users[1]?.username?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center mt-2">
          <p className="font-semibold text-foreground text-sm">{users[1]?.username}</p>
          <p className="font-mono font-bold text-gray-400 text-lg">{getValue(users[1])}</p>
        </div>
      </div>

      {/* 1st Place - Center */}
      <div className="flex flex-col items-center order-2">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <img src={getAsset(1)} alt="Champion" className="absolute inset-0 w-full h-full object-contain" />
          <Avatar className="relative w-24 h-24 border-2 border-yellow-500/50">
            <AvatarImage src={users[0]?.avatar} alt={users[0]?.username} />
            <AvatarFallback>{users[0]?.username?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center mt-2">
          <p className="font-semibold text-foreground">{users[0]?.username}</p>
          <p className="font-mono font-bold text-yellow-400 text-xl">{getValue(users[0])}</p>
        </div>
      </div>

      {/* 3rd Place - Right */}
      <div className="flex flex-col items-center order-3">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <img src={getAsset(3)} alt="Bronze" className="absolute inset-0 w-full h-full object-contain" />
          <Avatar className="relative w-16 h-16 border-2 border-amber-600/50">
            <AvatarImage src={users[2]?.avatar} alt={users[2]?.username} />
            <AvatarFallback>{users[2]?.username?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center mt-2">
          <p className="font-semibold text-foreground text-sm">{users[2]?.username}</p>
          <p className="font-mono font-bold text-amber-600 text-lg">{getValue(users[2])}</p>
        </div>
      </div>
    </div>
  );
};

// ============ MOBILE TOP 3 COMPONENT ============
const MobileTopThree = ({ users, sortType }: { users: LeaderboardUser[]; sortType: SortType }) => {
  const getValue = (user: LeaderboardUser) => {
    switch (sortType) {
      case "pnl": return `$${user.pnl.toLocaleString()}`;
      case "roi": return `${user.roi.toFixed(1)}%`;
      case "volume": return `$${user.volume.toLocaleString()}`;
    }
  };

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1: return medalGold;
      case 2: return medalSilver;
      case 3: return medalBronze;
      default: return medalBronze;
    }
  };

  const getGlowColor = (rank: number) => {
    switch (rank) {
      case 1: return "shadow-[0_0_30px_rgba(255,215,0,0.5)]";
      case 2: return "shadow-[0_0_25px_rgba(192,192,192,0.4)]";
      case 3: return "shadow-[0_0_25px_rgba(205,127,50,0.4)]";
      default: return "";
    }
  };

  const getBorderColor = (rank: number) => {
    switch (rank) {
      case 1: return "border-yellow-500";
      case 2: return "border-gray-400";
      case 3: return "border-amber-600";
      default: return "border-border";
    }
  };

  const getValueColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-400";
      case 2: return "text-gray-300";
      case 3: return "text-amber-500";
      default: return "text-foreground";
    }
  };

  return (
    <div className="flex justify-center items-end gap-3 mb-6 px-2">
      {/* 2nd Place - Left */}
      <div className="flex flex-col items-center order-1">
        <div className="relative mb-2">
          <div className={`absolute inset-0 rounded-full blur-xl opacity-50 scale-150 bg-gray-400/20`} />
          <div className={`relative ${getGlowColor(2)} rounded-full`}>
            <Avatar className={`w-16 h-16 border-2 ${getBorderColor(2)}`}>
              <AvatarImage src={users[1]?.avatar} alt={users[1]?.username} />
              <AvatarFallback>{users[1]?.username?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <img 
            src={getMedal(2)} 
            alt="Silver" 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8"
          />
        </div>
        <p className="font-medium text-foreground text-xs mt-3 truncate max-w-[80px]">{users[1]?.username}</p>
        <p className={`font-mono font-bold text-sm ${getValueColor(2)}`}>{getValue(users[1])}</p>
      </div>

      {/* 1st Place - Center */}
      <div className="flex flex-col items-center order-2 -mt-4">
        <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400 mb-1 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
        <div className="relative mb-2">
          <div className={`absolute inset-0 rounded-full blur-xl opacity-60 scale-150 bg-yellow-400/30`} />
          <div className={`relative ${getGlowColor(1)} rounded-full`}>
            <Avatar className={`w-20 h-20 border-2 ${getBorderColor(1)}`}>
              <AvatarImage src={users[0]?.avatar} alt={users[0]?.username} />
              <AvatarFallback>{users[0]?.username?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <img 
            src={getMedal(1)} 
            alt="Gold" 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10"
          />
        </div>
        <p className="font-semibold text-foreground text-sm mt-3 truncate max-w-[90px]">{users[0]?.username}</p>
        <p className={`font-mono font-bold text-lg ${getValueColor(1)}`}>{getValue(users[0])}</p>
      </div>

      {/* 3rd Place - Right */}
      <div className="flex flex-col items-center order-3">
        <div className="relative mb-2">
          <div className={`absolute inset-0 rounded-full blur-xl opacity-50 scale-150 bg-amber-600/20`} />
          <div className={`relative ${getGlowColor(3)} rounded-full`}>
            <Avatar className={`w-14 h-14 border-2 ${getBorderColor(3)}`}>
              <AvatarImage src={users[2]?.avatar} alt={users[2]?.username} />
              <AvatarFallback>{users[2]?.username?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <img 
            src={getMedal(3)} 
            alt="Bronze" 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7"
          />
        </div>
        <p className="font-medium text-foreground text-xs mt-3 truncate max-w-[70px]">{users[2]?.username}</p>
        <p className={`font-mono font-bold text-sm ${getValueColor(3)}`}>{getValue(users[2])}</p>
      </div>
    </div>
  );
};

// ============ LEADERBOARD ROW COMPONENT ============
const LeaderboardRow = ({ 
  user, 
  sortType, 
  index,
  isCurrentUser 
}: { 
  user: LeaderboardUser; 
  sortType: SortType; 
  index: number;
  isCurrentUser?: boolean;
}) => {
  const getValue = () => {
    switch (sortType) {
      case "pnl": return `$${user.pnl.toLocaleString()}`;
      case "roi": return `${user.roi.toFixed(1)}%`;
      case "volume": return `$${user.volume.toLocaleString()}`;
    }
  };

  return (
    <div 
      id={isCurrentUser ? "current-user-row" : undefined}
      className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 group animate-fade-in overflow-hidden ${
        isCurrentUser 
          ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/50 ring-1 ring-primary/30" 
          : "bg-gradient-to-r from-card/80 via-card/60 to-transparent border-border/30 hover:border-primary/30"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Rank */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 border border-border/50">
        <span className="font-bold text-foreground">{user.rank}</span>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className={`h-10 w-10 border ${isCurrentUser ? "border-primary/50" : "border-border/50"}`}>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
              {user.username}
            </h4>
            {isCurrentUser && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                YOU
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{user.trades} trades</p>
        </div>
      </div>

      {/* Value */}
      <div className="text-right">
        <div className={`font-mono font-bold ${isCurrentUser ? "text-primary" : "text-trading-green"}`}>
          {getValue()}
        </div>
        <div className="text-xs text-muted-foreground">
          {sortType === "pnl" && `${user.roi.toFixed(1)}% ROI`}
          {sortType === "roi" && `$${user.pnl.toLocaleString()} PnL`}
          {sortType === "volume" && `${user.roi.toFixed(1)}% ROI`}
        </div>
      </div>
    </div>
  );
};

// ============ MY RANK BAR COMPONENT ============
const MyRankBar = ({ user, sortType, onClick }: { user: LeaderboardUser; sortType: SortType; onClick: () => void }) => {
  const getValue = () => {
    switch (sortType) {
      case "pnl": return `$${user.pnl.toLocaleString()}`;
      case "roi": return `${user.roi.toFixed(1)}%`;
      case "volume": return `$${user.volume.toLocaleString()}`;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 cursor-pointer"
    >
      <div className="relative bg-gradient-to-r from-card/95 via-card/90 to-primary/10 backdrop-blur-md border border-primary/40 rounded-2xl p-4 shadow-[0_0_30px_hsl(260_60%_55%/0.3)] transition-all duration-300 hover:scale-[1.02] hover:border-primary/60 overflow-hidden">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
        
        <div className="relative flex items-center gap-3">
          {/* User icon */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary to-primary/50 rounded-full blur-sm opacity-50" />
            <Avatar className="relative h-12 w-12 border-2 border-primary/50">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">My Ranking</span>
              <ChevronUp className="w-4 h-4 text-primary animate-bounce" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-sm font-bold text-primary">#{user.rank}</span>
                </div>
                <span className="font-semibold text-foreground">{user.username}</span>
              </div>
            </div>
          </div>

          {/* Value */}
          <div className="text-right">
            <div className="font-mono font-bold text-primary text-lg">
              {getValue()}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.roi.toFixed(1)}% ROI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ SHARE MODAL & CARD COMPONENTS (PRESERVED FROM ORIGINAL) ============
const getRankColors = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        gradient: "from-yellow-400 via-yellow-500 to-amber-600",
        glow: "shadow-[0_0_40px_rgba(255,215,0,0.4)]",
        border: "border-yellow-500/50",
        text: "text-yellow-400",
        leaf: "#FFD700",
        bg: "bg-gradient-to-b from-yellow-500/20 to-transparent",
      };
    case 2:
      return {
        gradient: "from-slate-300 via-slate-400 to-slate-500",
        glow: "shadow-[0_0_30px_rgba(192,192,192,0.3)]",
        border: "border-slate-400/50",
        text: "text-slate-300",
        leaf: "#C0C0C0",
        bg: "bg-gradient-to-b from-slate-400/20 to-transparent",
      };
    case 3:
      return {
        gradient: "from-amber-600 via-amber-700 to-orange-800",
        glow: "shadow-[0_0_30px_rgba(205,127,50,0.3)]",
        border: "border-amber-600/50",
        text: "text-amber-500",
        leaf: "#CD7F32",
        bg: "bg-gradient-to-b from-amber-600/20 to-transparent",
      };
    default:
      return {
        gradient: "from-slate-500 to-slate-600",
        glow: "",
        border: "border-border/50",
        text: "text-muted-foreground",
        leaf: "#666",
        bg: "",
      };
  }
};

type CardTheme = "default" | "neon" | "brutal" | "gold";
type StatKey = "pnl" | "roi" | "volume";

interface CardThemeConfig {
  name: string;
  bgStyle: string;
  borderStyle: string;
  glowEffects: boolean;
  sparkles: boolean;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  pnlColor: string;
  roiColor: string;
  volumeColor: string;
  sparkleColors: [string, string, string];
  rankBadgeBg: string;
}

const cardThemes: Record<CardTheme, CardThemeConfig> = {
  default: {
    name: "Default",
    bgStyle: "from-card via-background to-primary/5",
    borderStyle: "border-primary/30",
    glowEffects: true,
    sparkles: true,
    badgeBg: "bg-trading-green/20",
    badgeBorder: "border-trading-green/30",
    badgeText: "text-trading-green",
    pnlColor: "text-trading-green",
    roiColor: "text-primary",
    volumeColor: "text-foreground",
    sparkleColors: ["text-yellow-400/60", "text-trading-green/50", "text-primary/40"],
    rankBadgeBg: "from-slate-500 to-slate-600",
  },
  neon: {
    name: "Neon",
    bgStyle: "from-purple-950/90 via-background to-cyan-950/50",
    borderStyle: "border-cyan-400/50",
    glowEffects: true,
    sparkles: true,
    badgeBg: "bg-cyan-400/20",
    badgeBorder: "border-cyan-400/40",
    badgeText: "text-cyan-400",
    pnlColor: "text-cyan-400",
    roiColor: "text-purple-400",
    volumeColor: "text-pink-300",
    sparkleColors: ["text-cyan-400/60", "text-purple-400/50", "text-pink-400/40"],
    rankBadgeBg: "from-cyan-500 to-purple-500",
  },
  brutal: {
    name: "Brutal",
    bgStyle: "from-black via-zinc-950 to-black",
    borderStyle: "border-white border-4",
    glowEffects: true,
    sparkles: false,
    badgeBg: "bg-white",
    badgeBorder: "border-white",
    badgeText: "text-black",
    pnlColor: "text-lime-400",
    roiColor: "text-white",
    volumeColor: "text-white",
    sparkleColors: ["text-white/60", "text-white/40", "text-white/20"],
    rankBadgeBg: "from-white to-zinc-200",
  },
  gold: {
    name: "Gold",
    bgStyle: "from-yellow-950/40 via-background to-amber-950/30",
    borderStyle: "border-yellow-500/40",
    glowEffects: true,
    sparkles: true,
    badgeBg: "bg-yellow-500/20",
    badgeBorder: "border-yellow-500/40",
    badgeText: "text-yellow-400",
    pnlColor: "text-yellow-400",
    roiColor: "text-amber-400",
    volumeColor: "text-orange-300",
    sparkleColors: ["text-yellow-400/60", "text-amber-400/50", "text-orange-400/40"],
    rankBadgeBg: "from-yellow-500 to-amber-600",
  },
};

const themeGlowColors: Record<CardTheme, { primary: string; secondary: string; tertiary: string }> = {
  default: { primary: "from-yellow-500/20", secondary: "from-trading-green/20", tertiary: "bg-primary/5" },
  neon: { primary: "from-cyan-500/30", secondary: "from-purple-500/30", tertiary: "bg-pink-500/10" },
  brutal: { primary: "from-white/10", secondary: "from-lime-400/20", tertiary: "bg-white/5" },
  gold: { primary: "from-yellow-400/30", secondary: "from-amber-500/20", tertiary: "bg-orange-500/10" },
};

interface ShareableCardProps {
  user: LeaderboardUser;
  cardRef?: React.RefObject<HTMLDivElement>;
  onShare?: () => void;
  isGenerating?: boolean;
  theme?: CardTheme;
  visibleStats?: StatKey[];
  hideShareHint?: boolean;
}

const ShareableCard = ({ 
  user, 
  cardRef, 
  onShare, 
  isGenerating, 
  theme = "default",
  visibleStats = ["pnl", "roi", "volume"],
  hideShareHint = false
}: ShareableCardProps) => {
  const colors = getRankColors(user.rank);
  const themeConfig = cardThemes[theme];
  const glowColors = themeGlowColors[theme];
  
  const stats = [
    { key: "pnl" as StatKey, label: "PnL", value: `$${user.pnl.toLocaleString()}`, color: themeConfig.pnlColor, icon: true },
    { key: "roi" as StatKey, label: "ROI", value: `${user.roi.toFixed(1)}%`, color: themeConfig.roiColor, icon: false },
    { key: "volume" as StatKey, label: "Volume", value: `$${user.volume.toLocaleString()}`, color: themeConfig.volumeColor, icon: false },
  ];
  
  const displayedStats = stats.filter(s => visibleStats.includes(s.key));
  const gridCols = displayedStats.length === 1 ? "grid-cols-1" : displayedStats.length === 2 ? "grid-cols-2" : "grid-cols-3";
  const rankBadgeGradient = user.rank <= 3 ? colors.gradient : themeConfig.rankBadgeBg;
  
  return (
    <div 
      ref={cardRef}
      onClick={onShare}
      className={`relative overflow-hidden rounded-2xl border ${themeConfig.borderStyle} bg-gradient-to-br ${themeConfig.bgStyle} p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isGenerating ? 'pointer-events-none' : ''}`}
      style={{ backgroundColor: 'hsl(222 47% 6%)' }}
    >
      {themeConfig.glowEffects && (
        <>
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${glowColors.primary} to-transparent rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${glowColors.secondary} to-transparent rounded-full blur-2xl`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${glowColors.tertiary} rounded-full blur-3xl`} />
        </>
      )}
      
      {themeConfig.sparkles && (
        <>
          <Sparkles className={`absolute top-4 right-4 w-5 h-5 ${themeConfig.sparkleColors[0]} animate-pulse`} />
          <Sparkles className={`absolute bottom-8 right-12 w-4 h-4 ${themeConfig.sparkleColors[1]}`} />
          <Sparkles className={`absolute top-12 left-8 w-3 h-3 ${themeConfig.sparkleColors[2]}`} />
        </>
      )}
      
      {isGenerating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Generating...</span>
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <img src={omenxLogo} alt="OMENX" className="h-6" />
          <div className={`px-3 py-1 rounded-full ${themeConfig.badgeBg} border ${themeConfig.badgeBorder}`}>
            <span className={`text-xs font-semibold ${themeConfig.badgeText}`}>Top Ranking</span>
          </div>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="absolute -inset-6 flex items-center justify-center">
              <LaurelWreath color={colors.leaf} size="lg" className="opacity-60" />
            </div>
            <div className={`absolute -inset-2 bg-gradient-to-br ${colors.gradient} rounded-full blur-md opacity-50`} />
            <Avatar className={`relative h-20 w-20 border-3 ${colors.border}`}>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            {user.rank === 1 && (
              <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl text-foreground mb-1">{user.username}</h3>
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-br ${rankBadgeGradient}`}>
                <span className="font-bold text-background text-sm">#{user.rank}</span>
              </div>
              <span className="text-sm text-muted-foreground">Global Ranking</span>
            </div>
          </div>
        </div>

        {displayedStats.length > 0 && (
          <div className={`grid ${gridCols} gap-3`}>
            {displayedStats.map((stat) => (
              <div key={stat.key} className="text-center p-4 rounded-xl bg-muted/50 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                <div className={`flex items-center justify-center gap-1 font-mono font-bold ${stat.color}`}>
                  {stat.icon && <Zap className="w-3 h-3" />}
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {!hideShareHint && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Share2 className="w-3 h-3" />
            <span>Tap to share</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface CardCustomizationProps {
  theme: CardTheme;
  onThemeChange: (theme: CardTheme) => void;
  visibleStats: StatKey[];
  onStatsChange: (stats: StatKey[]) => void;
}

const CardCustomization = ({ theme, onThemeChange, visibleStats, onStatsChange }: CardCustomizationProps) => {
  const themes: CardTheme[] = ["default", "neon", "brutal", "gold"];
  const allStats: { key: StatKey; label: string }[] = [
    { key: "pnl", label: "PnL" },
    { key: "roi", label: "ROI" },
    { key: "volume", label: "Volume" },
  ];
  
  const toggleStat = (stat: StatKey) => {
    if (visibleStats.includes(stat)) {
      if (visibleStats.length > 1) {
        onStatsChange(visibleStats.filter(s => s !== stat));
      }
    } else {
      onStatsChange([...visibleStats, stat]);
    }
  };
  
  return (
    <div className="space-y-4 mb-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Palette className="w-4 h-4 text-primary" />
          <span>Card Style</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                theme === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
              }`}
            >
              {cardThemes[t].name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Eye className="w-4 h-4 text-primary" />
          <span>Show Stats</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allStats.map((stat) => {
            const isVisible = visibleStats.includes(stat.key);
            return (
              <button
                key={stat.key}
                onClick={() => toggleStat(stat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isVisible
                    ? "bg-trading-green/20 text-trading-green border border-trading-green/30"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/30"
                }`}
              >
                {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {stat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LeaderboardUser;
  cardRef: React.RefObject<HTMLDivElement>;
  theme: CardTheme;
  onThemeChange: (theme: CardTheme) => void;
  visibleStats: StatKey[];
  onStatsChange: (stats: StatKey[]) => void;
}

const ShareModal = ({ 
  isOpen, 
  onClose, 
  user, 
  cardRef,
  theme,
  onThemeChange,
  visibleStats,
  onStatsChange
}: ShareModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const modalCardRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    if (!modalCardRef.current) return;
    
    setIsGenerating(true);
    try {
      const blob = await htmlToImage.toBlob(modalCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0c14',
      });
      if (blob) {
        setImageBlob(blob);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(generateImage, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, theme, visibleStats]);

  if (!isOpen) return null;

  const shareText = `🏆 Check out my ranking on OMENX Leaderboard! #${user.rank} with $${user.pnl.toLocaleString()} PnL and ${user.roi.toFixed(1)}% ROI! 🚀`;
  const shareUrl = window.location.href;

  const handleDownload = () => {
    if (!imageBlob) return;
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omenx-rank-${user.rank}-${user.username}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Image saved!", description: "Ranking card saved to your device" });
  };

  const handleCopyImage = async () => {
    if (!imageBlob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': imageBlob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Image copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Please download the image instead", variant: "destructive" });
    }
  };

  const handleShareX = () => {
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank');
  };

  const handleShareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      toast({ title: "Sharing not supported", description: "Use the social media buttons instead" });
      return;
    }

    try {
      const shareData: ShareData = {
        title: 'OMENX Leaderboard',
        text: shareText,
        url: shareUrl,
      };

      if (imageBlob && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'ranking.png', { type: 'image/png' })] })) {
        shareData.files = [new File([imageBlob], `omenx-rank-${user.rank}.png`, { type: 'image/png' })];
      }

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast({ title: "Share failed", description: "Please try another method" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h3 className="text-lg font-bold text-foreground mb-2">Share Your Rank</h3>
        <p className="text-sm text-muted-foreground mb-4">Customize and share your achievement</p>

        <CardCustomization 
          theme={theme}
          onThemeChange={onThemeChange}
          visibleStats={visibleStats}
          onStatsChange={onStatsChange}
        />

        <div className="relative mb-4">
          <div ref={modalCardRef}>
            <ShareableCard 
              user={user}
              theme={theme}
              visibleStats={visibleStats}
              isGenerating={isGenerating}
              hideShareHint={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleDownload}
            disabled={!imageBlob || isGenerating}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium">Save</span>
          </button>
          <button
            onClick={() => window.open('https://discord.gg/lovable-dev', '_blank')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/30 transition-colors"
          >
            <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="text-sm font-medium text-[#5865F2]">Discord</span>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShareX}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-sm font-medium text-foreground">X</span>
          </button>
          <button
            onClick={handleShareTelegram}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/30 transition-colors"
          >
            <Send className="w-5 h-5 text-[#0088cc]" />
            <span className="text-sm font-medium text-[#0088cc]">Telegram</span>
          </button>
        </div>

        <button
          onClick={handleNativeShare}
          className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">More Options</span>
        </button>
      </div>
    </div>
  );
};

// ============ MAIN LEADERBOARD COMPONENT ============
export default function Leaderboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sortType, setSortType] = useState<SortType>("pnl");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareImageBlob, setShareImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardTheme, setCardTheme] = useState<CardTheme>("default");
  const [visibleStats, setVisibleStats] = useState<StatKey[]>(["pnl", "roi", "volume"]);
  const cardRef = useRef<HTMLDivElement>(null);

  const sortedData = [...mockLeaderboardData].sort((a, b) => {
    switch (sortType) {
      case "pnl": return b.pnl - a.pnl;
      case "roi": return b.roi - a.roi;
      case "volume": return b.volume - a.volume;
    }
  }).map((user, idx) => ({ ...user, rank: idx + 1 }));

  const topThree = sortedData.slice(0, 3);
  const restOfList = sortedData.slice(3);
  
  const currentUser = sortedData.find(user => user.username === CURRENT_USER_USERNAME);
  const isCurrentUserInTopThree = currentUser && currentUser.rank <= 3;

  const scrollToCurrentUser = () => {
    const element = document.getElementById('current-user-row');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-primary');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-primary');
      }, 1500);
    }
  };

  const handleShareCard = async () => {
    if (!cardRef.current || isGenerating) return;

    setIsGenerating(true);
    try {
      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0c14',
      });

      if (blob) {
        setShareImageBlob(blob);
        setIsShareModalOpen(true);
      } else {
        toast({ title: "Failed to generate image", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({ title: "Failed to generate image", description: "Please try again", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const content = (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-full blur-[100px]" />
      <div className="absolute top-40 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute top-60 left-0 w-48 h-48 bg-trading-green/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        )}

        {/* Neon Title */}
        <div className="text-center pt-4 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              LEADERBOARD
            </span>
          </h1>
          <div className="mt-2 h-1 w-48 md:w-64 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        {/* Sort Tabs */}
        <div className="flex justify-center gap-2 mb-6 px-4">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortType(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                sortType === tab.key
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(260_60%_55%/0.4)]"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 3 Section */}
        <div className="px-4 mb-6">
          {isMobile ? (
            <MobileTopThree users={topThree} sortType={sortType} />
          ) : (
            <DesktopTopThree users={topThree} sortType={sortType} />
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-4 px-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <span className="text-xs font-semibold text-primary/80 px-3 uppercase tracking-wider">Top Ranking</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Leaderboard List */}
        <div className="px-4 pb-24 md:pb-8 max-w-2xl mx-auto">
          <div className="space-y-3">
            {restOfList.map((user, index) => (
              <LeaderboardRow 
                key={user.rank} 
                user={user} 
                sortType={sortType} 
                index={index}
                isCurrentUser={user.username === CURRENT_USER_USERNAME}
              />
            ))}
          </div>

          {/* Shareable Card Section */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share Your Rank
            </h3>
            
            <ShareableCard 
              user={currentUser || topThree[0]} 
              cardRef={cardRef}
              onShare={handleShareCard}
              isGenerating={isGenerating}
              theme={cardTheme}
              visibleStats={visibleStats}
            />
            <p className="text-center text-sm text-muted-foreground mt-4">
              Tap to customize and share your ranking card
            </p>
          </div>
          
          {/* Spacer for fixed elements */}
          <div className="h-32 md:h-24" />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={currentUser || topThree[0]}
        cardRef={cardRef}
        theme={cardTheme}
        onThemeChange={setCardTheme}
        visibleStats={visibleStats}
        onStatsChange={setVisibleStats}
      />
    </div>
  );

  if (isMobile) {
    return (
      <>
        {content}
        {currentUser && !isCurrentUserInTopThree && (
          <MyRankBar user={currentUser} sortType={sortType} onClick={scrollToCurrentUser} />
        )}
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
        {currentUser && !isCurrentUserInTopThree && (
          <MyRankBar user={currentUser} sortType={sortType} onClick={scrollToCurrentUser} />
        )}
      </div>
    </>
  );
}
