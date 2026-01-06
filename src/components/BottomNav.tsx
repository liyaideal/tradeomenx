import { useState } from "react";
import { Home, BarChart3, TrendingUp, Trophy, User, LogOut, Settings, HelpCircle, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { toast } from "sonner";
import { MobileDrawer, MobileDrawerList, MobileDrawerListItem } from "@/components/ui/mobile-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";

const navItems = [
  { icon: Home, label: "Home", path: "/", disabled: false },
  { icon: BarChart3, label: "Events", path: "/events", disabled: false },
  { icon: Trophy, label: "Ranks", path: "/leaderboard", disabled: false, featured: true },
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
  const { balance, user, username, avatarUrl, profile } = useUserProfile();
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
      return location.pathname === "/events";
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
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (!item.disabled) {
                    triggerHaptic('medium');
                    navigate(item.path, { replace: true });
                  }
                }}
                className="relative flex flex-col items-center"
              >
                {/* Glow effect - only when active */}
                {active && (
                  <div className="absolute -top-2 w-14 h-14 rounded-full blur-xl bg-primary/40" />
                )}
                
                {/* Icon container - elevated */}
                <div className="relative -mt-6 mb-1">
                  <Trophy className={`transition-all duration-300 ${
                    active 
                      ? "w-9 h-9 text-primary drop-shadow-[0_0_12px_hsl(var(--primary))]" 
                      : "w-7 h-7 text-muted-foreground"
                  }`} />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}>
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

      {/* Profile Drawer for logged in users */}
      <MobileDrawer open={profileSheetOpen} onOpenChange={setProfileSheetOpen} hideCloseButton>
        {/* User Info */}
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
            <p className="text-xs text-muted-foreground truncate">{user?.email || profile?.email || "Trial Account"}</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mb-4 p-4 bg-trading-green/10 border border-trading-green/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-trading-green" />
              <span className="text-sm text-muted-foreground">Trial Balance</span>
            </div>
            <span className="text-lg font-bold text-trading-green font-mono">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
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
              toast.info("Help & Support coming soon");
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
