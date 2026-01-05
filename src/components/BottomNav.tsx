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
                className="relative flex flex-col items-center -mt-4"
              >
                {/* Glow effect */}
                <div className="absolute w-12 h-12 rounded-full bg-red-500/25 blur-xl animate-pulse" />
                
                {/* Icon with glow */}
                <div className="relative">
                  <Trophy className={`w-7 h-7 transition-all duration-300 ${
                    active 
                      ? "text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" 
                      : "text-red-500/70 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                  }`} />
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
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
