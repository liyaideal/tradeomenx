import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";

const navItems = [
  { label: "Events", path: "/events" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Resolved", path: "/resolved" },
  { label: "Portfolio", path: "/portfolio" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "CN", label: "中文" },
  { code: "JP", label: "日本語" },
];

interface EventsDesktopHeaderProps {
  balance?: number;
}

export const EventsDesktopHeader = ({ balance = 2345.67 }: EventsDesktopHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState("EN");

  const currentPath = location.pathname;

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
          </nav>
        </div>

        {/* Right: Language + Balance + Profile */}
        <div className="flex items-center gap-4">
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

          {/* Balance */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50 transition-all duration-200 hover:border-trading-green/30 hover:bg-trading-green/5">
            <span className="text-sm text-muted-foreground">Balance:</span>
            <span className="text-sm font-bold text-trading-green font-mono">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Profile Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9 border-2 border-border/50">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/portfolio")}>
                Portfolio
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem className="text-trading-red">
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
