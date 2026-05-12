import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, User, Trophy, LogOut, LogIn, Gift, Users, Settings, HelpCircle, Briefcase, Shield } from "lucide-react";
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
import { showRewardsPausedToast } from "@/lib/rewardsPause";

// Regular nav items (without Leaderboard)
const navItems = [
  { label: "Events", path: "/events" },
  { label: "Resolved", path: "/resolved" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Insights", path: "/insights" },
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
  const { balance, trialBalance, user, username, avatarUrl } = useUserProfile();

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
      
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-3 px-4 py-3 lg:px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex min-w-0 items-center gap-4 xl:gap-8">
          {/* Logo */}
          <button 
            onClick={() => navigate("/style-guide")}
            className="flex flex-shrink-0 items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-[1.02]"
          >
            <Logo size="lg" />
          </button>

          {/* Navigation Tabs */}
          <nav className="flex min-w-0 items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative px-3 py-2 xl:px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(260_60%_55%/0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
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
              className={`relative ml-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 xl:px-4 ${
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
        <div className="flex min-w-0 items-center gap-2 xl:gap-4">
          {/* Custom right content */}
          {rightContent}
          {/* Discord */}
          <a
            href="https://discord.gg/qXssm2crf9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-muted/30 hover:bg-[#5865F2]/15 hover:border-[#5865F2]/40 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-muted-foreground hover:fill-[#5865F2] transition-colors">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.8733.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
            </svg>
          </a>

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
              {/* Equity - only show when logged in */}
              <button 
                onClick={() => navigate("/wallet")}
                className="flex min-w-0 items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 transition-all duration-200 hover:border-trading-green/30 hover:bg-trading-green/5 xl:px-4"
              >
                <span className="hidden text-sm text-muted-foreground xl:inline">Equity:</span>
                <span className="text-sm font-bold text-trading-green font-mono">
                  ${(balance + trialBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </button>

              {/* Profile Avatar with Username - logged in */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50 xl:gap-2.5 xl:px-3">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarImage src={avatarUrl || undefined} alt="User" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[64px] truncate text-sm font-medium text-foreground xl:max-w-[100px]">
                      {username || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/portfolio")}>
                    <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                    Portfolio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={showRewardsPausedToast}>
                    <Gift className="w-4 h-4 mr-2 text-primary" />
                    Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={showRewardsPausedToast}>
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Referral
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings/transparency")}>
                    <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                    Transparency Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open("https://discord.gg/qXssm2crf9", "_blank", "noopener,noreferrer")}>
                    <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground" />
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
