import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, BarChart3, Share2, Crown, ChevronLeft, Sparkles, Zap, Download, Send, Copy, Check, X, ChevronUp, User, Palette, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { LaurelWreath, SmallLaurelBadge } from "@/components/LaurelWreath";
import { useToast } from "@/hooks/use-toast";
import * as htmlToImage from "html-to-image";
import omenxLogo from "@/assets/omenx-logo.svg";

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
  { rank: 1, username: "CryptoWhale", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=whale", pnl: 125430, roi: 342.5, volume: 2450000, trades: 156 },
  { rank: 2, username: "TradingMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master", pnl: 89250, roi: 287.3, volume: 1890000, trades: 234 },
  { rank: 3, username: "ProfitHunter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hunter", pnl: 67890, roi: 198.7, volume: 1560000, trades: 189 },
  { rank: 4, username: "AlphaTrader", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alpha", pnl: 45670, roi: 156.2, volume: 980000, trades: 145 },
  { rank: 5, username: "MarketMaker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maker", pnl: 34560, roi: 134.8, volume: 890000, trades: 178 },
  { rank: 6, username: "DiamondHands", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diamond", pnl: 28900, roi: 112.4, volume: 750000, trades: 98 },
  { rank: 7, username: "MoonShot", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moon", pnl: 23450, roi: 98.6, volume: 680000, trades: 167 },
  { rank: 8, username: "BullRunner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bull", pnl: 19870, roi: 87.3, volume: 590000, trades: 134 },
  { rank: 9, username: "SmartMoney", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=smart", pnl: 15690, roi: 76.5, volume: 480000, trades: 112 },
  { rank: 10, username: "TrendSurfer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trend", pnl: 12340, roi: 65.2, volume: 390000, trades: 89 },
  // More users for demo
  { rank: 11, username: "Hodler", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hodler", pnl: 10200, roi: 58.3, volume: 320000, trades: 76 },
  { rank: 12, username: "BlockBuster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=block", pnl: 8900, roi: 52.1, volume: 280000, trades: 68 },
  { rank: 13, username: "CryptoNinja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser", pnl: 2340, roi: 23.5, volume: 45000, trades: 28 },
];

// Current user ID (simulated - in real app this would come from auth)
const CURRENT_USER_USERNAME = "CryptoNinja";

const sortTabs: { key: SortType; label: string; icon: React.ElementType }[] = [
  { key: "pnl", label: "PnL", icon: DollarSign },
  { key: "roi", label: "ROI %", icon: TrendingUp },
  { key: "volume", label: "Volume", icon: BarChart3 },
];

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

const TopThreeCard = ({ user, sortType, position }: { user: LeaderboardUser; sortType: SortType; position: "left" | "center" | "right" }) => {
  const colors = getRankColors(user.rank);
  const isFirst = user.rank === 1;
  
  const getValue = () => {
    switch (sortType) {
      case "pnl":
        return `$${user.pnl.toLocaleString()}`;
      case "roi":
        return `${user.roi.toFixed(1)}%`;
      case "volume":
        return `$${user.volume.toLocaleString()}`;
    }
  };

  const podiumHeight = isFirst ? "h-28" : user.rank === 2 ? "h-20" : "h-16";
  const avatarSize = isFirst ? "h-24 w-24" : "h-20 w-20";
  const orderClass = position === "left" ? "order-1" : position === "center" ? "order-2" : "order-3";

  return (
    <div className={`flex flex-col items-center ${orderClass}`}>
      {/* Crown for #1 */}
      {isFirst && (
        <div className="relative mb-2 animate-pulse">
          <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
        </div>
      )}

      {/* Laurel Wreath + Avatar Container */}
      <div className="relative mb-3">
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-50 scale-150 ${colors.bg}`} />
        
        {/* Laurel Wreath behind avatar */}
        <div className="absolute -inset-4 flex items-center justify-center">
          <LaurelWreath 
            color={colors.leaf} 
            size={isFirst ? "lg" : "md"} 
            className="opacity-80"
          />
        </div>

        {/* Avatar */}
        <div className={`relative ${colors.glow} rounded-full`}>
          <div className={`absolute -inset-1 bg-gradient-to-br ${colors.gradient} rounded-full opacity-75 blur-sm`} />
          <Avatar className={`relative ${avatarSize} border-3 ${colors.border} ring-2 ring-background`}>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-lg">{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Rank Badge */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} font-bold text-sm mb-2 shadow-lg`}>
        <span className="text-background drop-shadow">{user.rank}</span>
        <span className="text-[10px] text-background/80">{user.rank === 1 ? "st" : user.rank === 2 ? "nd" : "rd"}</span>
      </div>

      {/* Username */}
      <h3 className={`font-semibold text-foreground ${isFirst ? "text-base" : "text-sm"} mb-1 truncate max-w-[100px] text-center`}>
        {user.username}
      </h3>

      {/* Value */}
      <div className={`flex items-center gap-1 font-mono font-bold ${colors.text} ${isFirst ? "text-xl" : "text-lg"}`}>
        <Zap className="w-4 h-4" />
        {getValue()}
      </div>

      {/* Podium */}
      <div className={`w-24 ${podiumHeight} mt-4 rounded-t-xl bg-gradient-to-b ${colors.gradient} opacity-80 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-background/80 text-2xl">
          {user.rank}
        </div>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
      </div>
    </div>
  );
};

const LeaderboardRow = ({ user, sortType, index, isCurrentUser, onScrollToUser }: { 
  user: LeaderboardUser; 
  sortType: SortType; 
  index: number;
  isCurrentUser?: boolean;
  onScrollToUser?: () => void;
}) => {
  const getValue = () => {
    switch (sortType) {
      case "pnl":
        return `$${user.pnl.toLocaleString()}`;
      case "roi":
        return `${user.roi.toFixed(1)}%`;
      case "volume":
        return `$${user.volume.toLocaleString()}`;
    }
  };

  return (
    <div 
      id={isCurrentUser ? "current-user-row" : undefined}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group animate-fade-in ${
        isCurrentUser 
          ? "bg-primary/10 border-primary/50 ring-2 ring-primary/30 shadow-[0_0_20px_hsl(260_60%_55%/0.2)]" 
          : "bg-card/60 border-border/30 hover:border-primary/30 hover:bg-card/80"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Rank with laurel */}
      <SmallLaurelBadge rank={user.rank} />

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className={`h-10 w-10 border transition-colors ${
          isCurrentUser ? "border-primary/50" : "border-border/50 group-hover:border-primary/30"
        }`}>
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
        <div className={`flex items-center justify-end gap-1 font-mono font-bold ${
          isCurrentUser ? "text-primary" : "text-trading-green"
        }`}>
          <Zap className="w-3 h-3" />
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

// Fixed bottom "My Rank" component
const MyRankBar = ({ user, sortType, onClick }: { user: LeaderboardUser; sortType: SortType; onClick: () => void }) => {
  const getValue = () => {
    switch (sortType) {
      case "pnl":
        return `$${user.pnl.toLocaleString()}`;
      case "roi":
        return `${user.roi.toFixed(1)}%`;
      case "volume":
        return `$${user.volume.toLocaleString()}`;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 cursor-pointer"
    >
      <div className="bg-card/95 backdrop-blur-md border border-primary/40 rounded-2xl p-4 shadow-[0_0_30px_hsl(260_60%_55%/0.3)] transition-all duration-300 hover:scale-[1.02] hover:border-primary/60">
        <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-1 font-mono font-bold text-primary text-lg">
              <Zap className="w-4 h-4" />
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

// Card theme types
type CardTheme = "default" | "neon" | "brutal" | "gold";
type StatKey = "pnl" | "roi" | "volume";

interface CardThemeConfig {
  name: string;
  bgStyle: string;
  borderStyle: string;
  glowEffects: boolean;
  sparkles: boolean;
  // Color scheme for stats and badges
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
  
  // Use theme-specific rank badge for non-top-3 users
  const rankBadgeGradient = user.rank <= 3 ? colors.gradient : themeConfig.rankBadgeBg;
  
  return (
    <div 
      ref={cardRef}
      onClick={onShare}
      className={`relative overflow-hidden rounded-2xl border ${themeConfig.borderStyle} bg-gradient-to-br ${themeConfig.bgStyle} p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isGenerating ? 'pointer-events-none' : ''}`}
      style={{ backgroundColor: 'hsl(222 47% 6%)' }}
    >
      {/* Background effects */}
      {themeConfig.glowEffects && (
        <>
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${glowColors.primary} to-transparent rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${glowColors.secondary} to-transparent rounded-full blur-2xl`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${glowColors.tertiary} rounded-full blur-3xl`} />
        </>
      )}
      
      {/* Sparkle decorations */}
      {themeConfig.sparkles && (
        <>
          <Sparkles className={`absolute top-4 right-4 w-5 h-5 ${themeConfig.sparkleColors[0]} animate-pulse`} />
          <Sparkles className={`absolute bottom-8 right-12 w-4 h-4 ${themeConfig.sparkleColors[1]}`} />
          <Sparkles className={`absolute top-12 left-8 w-3 h-3 ${themeConfig.sparkleColors[2]}`} />
        </>
      )}
      
      {/* Loading overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Generating...</span>
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <img src={omenxLogo} alt="OMENX" className="h-6" />
          <div className={`px-3 py-1 rounded-full ${themeConfig.badgeBg} border ${themeConfig.badgeBorder}`}>
            <span className={`text-xs font-semibold ${themeConfig.badgeText}`}>Top Ranking</span>
          </div>
        </div>

        {/* User info with Laurel */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            {/* Laurel behind */}
            <div className="absolute -inset-6 flex items-center justify-center">
              <LaurelWreath color={colors.leaf} size="lg" className="opacity-60" />
            </div>
            {/* Glow */}
            <div className={`absolute -inset-2 bg-gradient-to-br ${colors.gradient} rounded-full blur-md opacity-50`} />
            <Avatar className={`relative h-20 w-20 border-3 ${colors.border}`}>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            {/* Crown for #1 */}
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

        {/* Stats */}
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

        {/* Tap to share hint - hidden in modal preview */}
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

// Card Customization Panel
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
      // Don't allow removing all stats
      if (visibleStats.length > 1) {
        onStatsChange(visibleStats.filter(s => s !== stat));
      }
    } else {
      onStatsChange([...visibleStats, stat]);
    }
  };
  
  return (
    <div className="space-y-4 mb-4">
      {/* Theme Selection */}
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
      
      {/* Stats Toggle */}
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

// Share Modal Component
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

  // Generate image when modal opens or customization changes
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

  // Regenerate image when theme or stats change
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the card is rendered
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

      // Try to share with image if supported
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h3 className="text-lg font-bold text-foreground mb-2">Share Your Rank</h3>
        <p className="text-sm text-muted-foreground mb-4">Customize and share your achievement</p>

        {/* Customization Options */}
        <CardCustomization 
          theme={theme}
          onThemeChange={onThemeChange}
          visibleStats={visibleStats}
          onStatsChange={onStatsChange}
        />

        {/* Card Preview with Loading */}
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

        {/* Share Options */}
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

        {/* Social Media */}
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

        {/* Native Share (Mobile) */}
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
      case "pnl":
        return b.pnl - a.pnl;
      case "roi":
        return b.roi - a.roi;
      case "volume":
        return b.volume - a.volume;
    }
  }).map((user, idx) => ({ ...user, rank: idx + 1 }));

  const topThree = sortedData.slice(0, 3);
  const restOfList = sortedData.slice(3);
  
  // Find current user
  const currentUser = sortedData.find(user => user.username === CURRENT_USER_USERNAME);
  const isCurrentUserInTopThree = currentUser && currentUser.rank <= 3;

  const scrollToCurrentUser = () => {
    const element = document.getElementById('current-user-row');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a flash effect
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
      // Generate image from the card
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
    <div className="min-h-screen bg-background">
      {/* Hero Section with gradient background */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute top-60 left-1/4 w-48 h-48 bg-trading-green/10 rounded-full blur-3xl" />
        
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

          {/* Logo + Title with Neon Effect */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={omenxLogo} alt="OMENX" className="h-8" />
            </div>
            
            {/* Neon Leaderboard Title */}
            <div className="relative inline-block">
              {/* Outer glow - soft spread */}
              <div className="absolute inset-0 blur-3xl opacity-40">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#a855f7]">
                  LEADERBOARD
                </h1>
              </div>
              {/* Mid glow */}
              <div className="absolute inset-0 blur-xl opacity-60">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#c084fc]">
                  LEADERBOARD
                </h1>
              </div>
              {/* Inner glow */}
              <div className="absolute inset-0 blur-sm opacity-90">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#d8b4fe]">
                  LEADERBOARD
                </h1>
              </div>
              {/* Main text - hollow stroke effect */}
              <h1 
                className="relative text-4xl md:text-6xl font-black tracking-tight text-transparent"
                style={{
                  WebkitTextStroke: '2px #c084fc',
                  textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 40px #7c3aed, 0 0 80px #7c3aed'
                }}
              >
                LEADERBOARD
              </h1>
            </div>
            <p className="text-muted-foreground mt-4">
              Top traders this week
            </p>
          </div>

          {/* Sort Tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {sortTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSortType(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
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

          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-2 md:gap-6 mb-4 px-2">
            <TopThreeCard user={topThree[1]} sortType={sortType} position="left" />
            <TopThreeCard user={topThree[0]} sortType={sortType} position="center" />
            <TopThreeCard user={topThree[2]} sortType={sortType} position="right" />
          </div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="px-4 pb-24 md:pb-8 max-w-2xl mx-auto">
        {/* Top Ranking Label */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
          <span className="text-xs font-semibold text-primary px-3">◆ Top Ranking ◆</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
        </div>

        <div className="space-y-2">
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
        {/* Spacer for fixed MyRankBar */}
        <div className="h-28 md:h-24" />
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
      <div className="max-w-7xl mx-auto relative">
        {/* Page-specific Share button - absolute positioned */}
        <button 
          onClick={handleShareCard}
          className="absolute top-4 right-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share Rankings</span>
        </button>
        {content}
        {currentUser && !isCurrentUserInTopThree && (
          <MyRankBar user={currentUser} sortType={sortType} onClick={scrollToCurrentUser} />
        )}
      </div>
    </>
  );
}
