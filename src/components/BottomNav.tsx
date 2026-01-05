import { Home, BarChart3, TrendingUp, Trophy, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/", disabled: false },
  { icon: BarChart3, label: "Events", path: "/events", disabled: false },
  { icon: Trophy, label: "Ranks", path: "/leaderboard", disabled: false, featured: true },
  { icon: TrendingUp, label: "Trade", path: "/trade", disabled: false },
  { icon: User, label: "Portfolio", path: "/portfolio", disabled: true },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 px-4 py-2 pb-6 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const isFeatured = item.featured;
          
          if (isFeatured) {
            return (
              <button
                key={item.path}
                onClick={() => !item.disabled && navigate(item.path, { replace: true })}
                className="relative flex flex-col items-center -mt-6"
              >
                {/* Outer glow */}
                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 via-orange-500/15 to-yellow-500/10 blur-xl animate-pulse" />
                
                {/* Hexagon container */}
                <div className="relative">
                  <svg width="56" height="64" viewBox="0 0 56 64" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                    <defs>
                      <linearGradient id="hexInner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                      </linearGradient>
                    </defs>
                    
                    {/* Inner hexagon only */}
                    <polygon 
                      points="28,4 50,17 50,47 28,60 6,47 6,17" 
                      fill="url(#hexInner)"
                      stroke={active ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.15)"}
                      strokeWidth="1"
                    />
                  </svg>
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className={`w-6 h-6 ${active ? "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "text-red-500/70"}`} />
                  </div>
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                  active 
                    ? "text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]" 
                    : "text-red-500/60"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => !item.disabled && navigate(item.path, { replace: true })}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-all duration-200 ${
                active ? "text-trading-purple" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "text-trading-purple" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
