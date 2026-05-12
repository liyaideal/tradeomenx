import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Globe,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  Gift,
  Users,
  Settings,
  HelpCircle,
  Briefcase,
  Shield,
  MessageCircle,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { showRewardsPausedToast } from "@/lib/rewardsPause";

// Main nav (4 items). Resolved is now an Events page tab; Leaderboard is a
// regular nav entry without trophy/purple-border decoration.
const navItems = [
  { label: "Events", path: "/events" },
  { label: "Insights", path: "/insights" },
  { label: "Leaderboard", path: "/leaderboard" },
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

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/30 backdrop-blur-md"
      style={{
        background:
          "linear-gradient(180deg, hsl(222 47% 8% / 0.98) 0%, hsl(222 47% 6% / 0.95) 100%)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-6 px-4 py-3 lg:px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex min-w-0 items-center gap-4 xl:gap-8">
          <button
            onClick={() => navigate("/style-guide")}
            className="flex flex-shrink-0 items-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:opacity-80"
          >
            <Logo size="lg" />
          </button>

          <nav className="flex min-w-0 items-center gap-1">
            {navItems.map((item) => {
              // Resolved (now an Events page tab) keeps Events highlighted.
              const isActive =
                currentPath === item.path ||
                (item.path === "/events" && currentPath.startsWith("/resolved"));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 xl:px-4 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(260_60%_55%/0.3)]"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-3 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Custom Content + Equity + Profile */}
        <div className="flex min-w-0 items-center gap-2 xl:gap-4">
          {rightContent}

          {user ? (
            <>
              <button
                onClick={() => navigate("/wallet")}
                className="flex min-w-0 items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 transition-all duration-200 hover:border-trading-green/30 hover:bg-trading-green/5 xl:px-4"
              >
                <span className="hidden text-sm text-muted-foreground xl:inline">
                  Equity:
                </span>
                <span className="font-mono text-sm font-bold text-trading-green">
                  ${(balance + trialBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50 xl:gap-2.5 xl:px-3">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarImage src={avatarUrl || undefined} alt="User" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {username?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase() || (
                            <User className="h-4 w-4" />
                          )}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[64px] truncate text-sm font-medium text-foreground xl:max-w-[100px]">
                      {username || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => navigate("/portfolio")}>
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    Portfolio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={showRewardsPausedToast}>
                    <Gift className="mr-2 h-4 w-4 text-primary" />
                    Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={showRewardsPausedToast}>
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Referral
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings/transparency")}
                  >
                    <Shield className="mr-2 h-4 w-4 text-emerald-400" />
                    Transparency Audit
                  </DropdownMenuItem>

                  {/* Language sub-menu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">Language</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {language}
                      </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                language === lang.code
                                  ? "text-primary"
                                  : "opacity-0"
                              }`}
                            />
                            {lang.code} — {lang.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        "https://discord.gg/qXssm2crf9",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-[#5865F2]" />
                    Join Discord
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        "https://discord.gg/qXssm2crf9",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-trading-red"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Compact language selector for guests (no avatar menu available) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="hidden items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground xl:flex"
                    aria-label="Language"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">{language}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={language === lang.code ? "bg-muted" : ""}
                    >
                      {lang.code} — {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setAuthDialogOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </header>
  );
};
