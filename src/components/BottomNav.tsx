import { useState } from "react";
import { Home, BarChart3, TrendingUp, Trophy, User, LogOut, Settings, HelpCircle, Wallet, ChevronRight, Gift, Users, Lightbulb, Award } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { toast } from "sonner";
import { MobileDrawer, MobileDrawerList, MobileDrawerListItem } from "@/components/ui/mobile-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SPORTS_LINK } from "@/lib/worldCup";

// Stylized soccer-ball emblem used for the central "Sports" entry.
const SoccerBallIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2L14.5 6.5L19.5 7L16 11L17 16L12 14L7 16L8 11L4.5 7L9.5 6.5L12 2Z" fill="currentColor" opacity="0.2" />
    <path d="M12 7L10 10H14L12 7Z" fill="currentColor" />
    <path d="M7 11L5 14L8 15L9 12L7 11Z" fill="currentColor" />
    <path d="M17 11L19 14L16 15L15 12L17 11Z" fill="currentColor" />
    <path d="M10 17H14L15 20H9L10 17Z" fill="currentColor" />
  </svg>
);


const navItems = [
  { icon: Home, label: "Home", path: "/", disabled: false },
  { icon: BarChart3, label: "Events", path: "/events", disabled: false },
  { icon: Trophy, label: "Sports", path: "__sports__", disabled: false, featured: true, external: true },
  { icon: TrendingUp, label: "Trade", path: "/trade", disabled: false },
];

// Haptic feedback utility
const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30;
    navigator.vibrate(duration);
  }
};

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { balance, trialBalance, user, username, avatarUrl, profile } = useUserProfile();
  const [authSheetOpen, setAuthSheetOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      setProfileSheetOpen(false);
      navigate("/");
    }
  };

  const isActive = (path: string) => {
    if (path === "/trade") {
      return location.pathname.startsWith("/trade") || location.pathname === "/order-preview";
    }
    if (path === "/events") {
      // Events dropdown controls both active and resolved, so highlight Events for both
      return location.pathname === "/events" || location.pathname.startsWith("/resolved");
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 px-4 py-3 pb-6 z-[200]">
      <div className="flex justify-around items-end max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const isFeatured = item.featured;
          
          if (isFeatured) {
            const wcPhase = getWorldCupPhase();
            const showLive = wcPhase === "live";
            const showSoon = wcPhase === "teaser";
            return (
              <button
                key={item.path}
                onClick={() => {
                  triggerHaptic('medium');
                  window.open(SPORTS_LINK, "_blank", "noopener,noreferrer");
                }}
                className="relative flex flex-col items-center"
              >
                {/* Gold glow halo */}
                <div className="absolute -top-2 w-14 h-14 rounded-full blur-xl bg-yellow-400/40" />

                {/* Icon container - elevated */}
                <div className="relative -mt-6 mb-1">
                  <Trophy className="w-9 h-9 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]" />
                  {showLive && (
                    <span
                      className="absolute -top-1 -right-1 px-1.5 py-px rounded-full text-[8px] font-bold tracking-wider uppercase bg-red-600 text-white animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.7)]"
                    >
                      LIVE
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => {
                if (!item.disabled) {
                  triggerHaptic('light');
                  navigate(item.path, { replace: true });
                }
              }}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                active 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground scale-100 hover:scale-105"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-all duration-300 ${
                active ? "text-primary" : ""
              }`} />
              <span className={`text-xs transition-all duration-300 ${
                active ? "font-semibold" : "font-medium"
              }`}>{item.label}</span>
            </button>
          );
        })}

        {/* Profile/Login button - rightmost */}
        {user ? (
          <button
            onClick={() => {
              triggerHaptic('light');
              setProfileSheetOpen(true);
            }}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              location.pathname === "/portfolio"
                ? "text-primary scale-110" 
                : "text-muted-foreground scale-100 hover:scale-105"
            }`}
          >
            <Avatar className="w-6 h-6 border border-border">
              <AvatarImage src={avatarUrl || undefined} alt="User" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || <User className="w-3 h-3" />}
              </AvatarFallback>
            </Avatar>
            <span className={`text-xs transition-all duration-300 ${
              location.pathname === "/portfolio" ? "font-semibold" : "font-medium"
            }`}>Me</span>
          </button>
        ) : (
          <button
            onClick={() => {
              triggerHaptic('light');
              setAuthSheetOpen(true);
            }}
            className="flex flex-col items-center gap-1 transition-all duration-300 text-muted-foreground hover:text-foreground hover:scale-105"
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Me</span>
          </button>
        )}
      </div>

      {/* Auth Sheet for mobile */}
      <AuthSheet open={authSheetOpen} onOpenChange={setAuthSheetOpen} />

      {/* Profile Drawer for logged in users - updated */}
      <MobileDrawer open={profileSheetOpen} onOpenChange={setProfileSheetOpen} hideCloseButton>
        {/* User Info Section */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-xl">
          <Avatar className="w-12 h-12 border-2 border-primary/50">
            <AvatarImage src={avatarUrl || undefined} alt="User" />
            <AvatarFallback className="bg-primary/20 text-primary">
              {username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {username || "Trader"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || profile?.email || "Account"}</p>
          </div>
        </div>

        {/* Equity Card - Tappable to go to Wallet page */}
        <div 
          onClick={() => {
            setProfileSheetOpen(false);
            navigate("/wallet");
          }}
          role="button"
          tabIndex={0}
          className="w-full mb-4 p-4 bg-trading-green/10 border border-trading-green/30 rounded-xl hover:bg-trading-green/20 transition-colors active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-trading-green" />
              <span className="text-sm text-muted-foreground">Equity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-trading-green font-mono">
                ${(balance + trialBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <MobileDrawerList>
          <MobileDrawerListItem
            icon={User}
            label="Portfolio"
            onClick={() => {
              setProfileSheetOpen(false);
              navigate("/portfolio");
            }}
          />
          <MobileDrawerListItem
            icon={Award}
            label="Leaderboard"
            onClick={() => {
              setProfileSheetOpen(false);
              navigate("/leaderboard");
            }}
          />
          <MobileDrawerListItem
            icon={Gift}
            label="Rewards"
            onClick={() => {
              setProfileSheetOpen(false);
              navigate("/rewards");
            }}
          />
          <MobileDrawerListItem
            icon={Users}
            label="Referral"
            onClick={() => {
              setProfileSheetOpen(false);
              navigate("/referral");
            }}
          />
          <MobileDrawerListItem
            icon={Settings}
            label="Settings"
            onClick={() => {
              setProfileSheetOpen(false);
              navigate("/settings");
            }}
          />
          <MobileDrawerListItem
            icon={HelpCircle}
            label="Help & Support"
            onClick={() => {
              setProfileSheetOpen(false);
              window.open("https://discord.gg/qXssm2crf9", "_blank", "noopener,noreferrer");
            }}
          />
          <MobileDrawerListItem
            icon={Lightbulb}
            label="Insights"
            onClick={() => {
              setProfileSheetOpen(false);
              navigate("/insights");
            }}
          />
        </MobileDrawerList>

        <div className="h-px bg-border/50 my-2" />

        <MobileDrawerList>
          <MobileDrawerListItem
            icon={LogOut}
            label="Sign Out"
            onClick={handleSignOut}
            className="text-trading-red hover:bg-trading-red/10"
          />
        </MobileDrawerList>
      </MobileDrawer>
    </nav>
  );
};
