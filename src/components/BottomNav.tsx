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
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-md border-t border-border/30 px-4 py-2 pb-6 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto relative">
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
                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-orange-500/30 via-red-500/40 to-pink-500/30 blur-xl animate-pulse" />
                
                {/* Main button container */}
                <div className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                  active 
                    ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-[0_0_25px_rgba(239,68,68,0.6)]" 
                    : "bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-600/80 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                }`}>
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/20" />
                  
                  {/* Icon */}
                  <Trophy className={`w-6 h-6 transition-all duration-300 ${
                    active 
                      ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                      : "text-white/90"
                  }`} />
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                  active 
                    ? "text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]" 
                    : "text-red-400/70"
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator dots */}
                {active && (
                  <div className="absolute -bottom-1 flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => !item.disabled && navigate(item.path, { replace: true })}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-all duration-200 ${
                active ? "text-trading-purple" : "text-muted-foreground"
              } ${item.disabled ? "opacity-50" : ""}`}
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
