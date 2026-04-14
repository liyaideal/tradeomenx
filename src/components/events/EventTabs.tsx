import { cn } from "@/lib/utils";
import { Flame, Star } from "lucide-react";

export type EventTab = "all" | "hot" | "watchlist" | "crypto" | "macro" | "sports" | "politics";

const TABS: { key: EventTab; label: string; icon?: React.ReactNode }[] = [
  { key: "all", label: "All" },
  { key: "hot", label: "Hot", icon: <Flame className="h-3.5 w-3.5" /> },
  { key: "watchlist", label: "Watchlist", icon: <Star className="h-3.5 w-3.5" /> },
  { key: "crypto", label: "Crypto" },
  { key: "macro", label: "Macro" },
  { key: "sports", label: "Sports" },
  { key: "politics", label: "Politics" },
];

interface EventTabsProps {
  active: EventTab;
  onChange: (tab: EventTab) => void;
}

export const EventTabs = ({ active, onChange }: EventTabsProps) => (
  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-0.5">
    {TABS.map(({ key, label, icon }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
          active === key
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {icon}
        {label}
      </button>
    ))}
  </div>
);
