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
                {/* Outer glow ring */}
                <div className="absolute w-20 h-20 -top-1 rounded-full bg-gradient-to-br from-red-500/30 via-orange-500/20 to-yellow-500/10 blur-xl animate-pulse" />
                
                {/* Hexagon container */}
                <div className="relative">
                  {/* Hexagon shape with gradient border */}
                  <svg width="56" height="64" viewBox="0 0 56 64" className="drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={active ? "#ef4444" : "#dc2626"} />
                        <stop offset="50%" stopColor={active ? "#f97316" : "#ea580c"} />
                        <stop offset="100%" stopColor={active ? "#eab308" : "#ca8a04"} />
                      </linearGradient>
                      <linearGradient id="hexInner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                      </linearGradient>
                      <filter id="innerGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Outer hexagon (border) */}
                    <polygon 
                      points="28,2 52,16 52,48 28,62 4,48 4,16" 
                      fill="url(#hexGradient)"
                      className={active ? "opacity-100" : "opacity-80"}
                    />
                    
                    {/* Inner hexagon (background) */}
                    <polygon 
                      points="28,6 48,18 48,46 28,58 8,46 8,18" 
                      fill="url(#hexInner)"
                    />
                    
                    {/* Inner glow line */}
                    <polygon 
                      points="28,8 46,19 46,45 28,56 10,45 10,19" 
                      fill="none"
                      stroke={active ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.2)"}
                      strokeWidth="1"
                    />
                  </svg>
                  
                  {/* Icon centered in hexagon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className={`w-6 h-6 ${active ? "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "text-red-500/80"}`} />
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full opacity-60" />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full opacity-60" />
                </div>
                
                {/* Label with war-style font */}
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                  active 
                    ? "text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]" 
                    : "text-red-500/70"
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
