import { Home, BarChart3, TrendingUp, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BarChart3, label: "Events", path: "/events" },
  { icon: TrendingUp, label: "Trade", path: "/trade" },
  { icon: User, label: "Portfolio", path: "/portfolio" },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/trade") {
      return location.pathname.startsWith("/trade") || location.pathname === "/order-preview";
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 px-4 py-2 pb-6 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
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
