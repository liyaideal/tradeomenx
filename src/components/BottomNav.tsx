import { useState } from "react";
import { Home, BarChart3, TrendingUp, Trophy, User, LogIn, LogOut, Settings, HelpCircle, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBalance } from "@/hooks/useBalance";

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
  const { balance, user } = useBalance();
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
              <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {user.email?.charAt(0).toUpperCase() || <User className="w-3 h-3" />}
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

      {/* Profile Sheet for logged in users */}
      <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8 bg-background border-t border-border/50">
          {/* Drag handle */}
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
          
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="sr-only">Profile Menu</SheetTitle>
          </SheetHeader>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-xl">
            <Avatar className="w-12 h-12 border-2 border-primary/50">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user?.email?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.user_metadata?.username || user?.user_metadata?.full_name || "Trader"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "Anonymous User"}</p>
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
          <div className="space-y-1">
            <button
              onClick={() => {
                setProfileSheetOpen(false);
                navigate("/portfolio");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Portfolio</span>
            </button>
            
            <button
              onClick={() => {
                setProfileSheetOpen(false);
                navigate("/settings");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Settings</span>
            </button>
            
            <button
              onClick={() => {
                setProfileSheetOpen(false);
                toast.info("Help & Support coming soon");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Help & Support</span>
            </button>

            <div className="h-px bg-border/50 my-2" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-trading-red/10 transition-colors text-left text-trading-red"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
