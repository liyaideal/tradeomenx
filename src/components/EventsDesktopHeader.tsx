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
import omenxLogo from "@/assets/omenx-logo.svg";

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
  balance?: number;
}

export const EventsDesktopHeader = ({ balance = 2345.67 }: EventsDesktopHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState("EN");

  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/30">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button 
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={omenxLogo} alt="OMENX" className="h-8" />
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
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
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
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
