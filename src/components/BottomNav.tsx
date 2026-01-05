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
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 px-4 py-3 pb-6 z-50">
      <div className="flex justify-around items-end max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const isFeatured = item.featured;
          
          if (isFeatured) {
            return (
              <button
                key={item.path}
                onClick={() => !item.disabled && navigate(item.path, { replace: true })}
                className="relative flex flex-col items-center"
              >
                {/* Glow effect behind icon - stronger when active */}
                <div className={`absolute -top-2 w-14 h-14 rounded-full blur-xl transition-all duration-300 ${
                  active 
                    ? "bg-trading-purple/50 scale-125" 
                    : "bg-trading-purple/20 animate-pulse"
                }`} />
                
                {/* Icon container - elevated, larger when active */}
                <div className="relative -mt-6 mb-1">
                  <Trophy className={`transition-all duration-300 ${
                    active 
                      ? "w-9 h-9 text-trading-purple drop-shadow-[0_0_20px_rgba(139,92,246,1)]" 
                      : "w-7 h-7 text-trading-purple/70 drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]"
                  }`} />
                </div>
                
                {/* Label - aligned with others */}
                <span className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  active 
                    ? "text-trading-purple drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" 
                    : "text-trading-purple/60"
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
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
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
