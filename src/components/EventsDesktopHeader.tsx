import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, User, Trophy, LogOut, LogIn, Gift } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useUserProfile } from "@/hooks/useUserProfile";

// Regular nav items (without Leaderboard)
const navItems = [
  { label: "Events", path: "/events" },
  { label: "Resolved", path: "/resolved" },
  { label: "Portfolio", path: "/portfolio" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "CN", label: "中文" },
  { code: "JP", label: "日本語" },
];

interface EventsDesktopHeaderProps {
  rightContent?: React.ReactNode;
}

export const EventsDesktopHeader = ({ rightContent }: EventsDesktopHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState("EN");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { balance, user, username, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const currentPath = location.pathname;
  const isLeaderboardActive = currentPath === "/leaderboard";

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 backdrop-blur-md"
      style={{
        background: "linear-gradient(180deg, hsl(222 47% 8% / 0.98) 0%, hsl(222 47% 6% / 0.95) 100%)"
      }}
    >
      {/* Subtle brand accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button 
            onClick={() => navigate("/style-guide")}
            className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-[1.02]"
          >
            <Logo size="xl" />
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(260_60%_55%/0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Leaderboard - Special featured button with icon */}
            <button
              onClick={() => navigate("/leaderboard")}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ml-1 ${
                isLeaderboardActive
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-[0_0_20px_hsl(260_60%_55%/0.4)]"
                  : "text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/50"
              }`}
            >
              <Trophy className={`w-4 h-4 ${isLeaderboardActive ? "text-primary-foreground" : "text-primary"}`} />
              <span>Leaderboard</span>
              {isLeaderboardActive && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Right: Custom Content + Language + Balance + Profile */}
        <div className="flex items-center gap-4">
          {/* Custom right content */}
          {rightContent}
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{language}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-muted" : ""}
                >
                  {lang.code} - {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              {/* Balance - only show when logged in */}
              <button 
                onClick={() => navigate("/wallet")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50 transition-all duration-200 hover:border-trading-green/30 hover:bg-trading-green/5 cursor-pointer"
              >
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-sm font-bold text-trading-green font-mono">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </button>

              {/* Profile Avatar with Username - logged in */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarImage src={avatarUrl || undefined} alt="User" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {username || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/portfolio")}>
                    Portfolio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/rewards")}>
                    <Gift className="w-4 h-4 mr-2 text-primary" />
                    Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-trading-red">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Login Button - not logged in */
            <Button
              onClick={() => setAuthDialogOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </header>
  );
};
