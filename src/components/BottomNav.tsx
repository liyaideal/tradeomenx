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
                className="relative flex flex-col items-center -mt-8"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 -top-2 w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400/40 via-amber-500/30 to-orange-500/20 blur-xl animate-pulse" />
                
                {/* Main button */}
                <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  active 
                    ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg shadow-amber-500/40" 
                    : "bg-gradient-to-br from-yellow-500/80 via-amber-600/80 to-orange-600/80 shadow-md shadow-amber-500/20"
                }`}>
                  {/* Inner glow ring */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300/30 to-transparent" />
                  <Trophy className={`w-6 h-6 relative z-10 ${active ? "text-black" : "text-black/80"}`} />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-semibold mt-1 ${active ? "text-amber-400" : "text-amber-500/70"}`}>
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
