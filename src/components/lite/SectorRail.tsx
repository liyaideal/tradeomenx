// ============================================================
// SectorRail — horizontal sector navigation for Lite surface.
// Fixed order: Sports · Stocks · Crypto · Macro · Entertainment.
// - Sports 卡 = 常驻外链入口（jumps to Sports sub-site, new tab, no event count）
// - 其他卡：只有当该 sector 有活跃事件时才显示；点击选中筛选事件流
// - 借用 Home v3 Tournaments rail 的形态，只借布局，不带任何 Tournaments / 世界杯残留
// ============================================================
import { ExternalLink, TrendingUp, LineChart, Coins, Landmark, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPORTS_LINK } from "@/lib/worldCup";
import type { EventWithOptions } from "@/hooks/useActiveEvents";

export type SectorKey = "stocks" | "crypto" | "macro" | "entertainment";

export interface SectorMeta {
  key: SectorKey;
  label: string;
  hook: string;
  Icon: typeof TrendingUp;
}

const SECTOR_META: Record<SectorKey, SectorMeta> = {
  stocks: {
    key: "stocks",
    label: "Stocks",
    hook: "New events every trading day · settles at market close",
    Icon: LineChart,
  },
  crypto: {
    key: "crypto",
    label: "Crypto",
    hook: "24/7 price events across BTC, ETH, SOL, and more",
    Icon: Coins,
  },
  macro: {
    key: "macro",
    label: "Macro",
    hook: "Central-bank calls, elections, macro data prints",
    Icon: Landmark,
  },
  entertainment: {
    key: "entertainment",
    label: "Entertainment",
    hook: "Box office, awards, culture-moment markets",
    Icon: Film,
  },
};

// Bucket an event into a Lite sector.
export const eventToSector = (event: EventWithOptions): SectorKey | null => {
  const productLines = (event.product_lines || []).map((p) => String(p).toLowerCase());
  if (productLines.includes("spot")) return "stocks";
  const cat = (event.category || "").toLowerCase();
  if (cat === "crypto") return "crypto";
  if (cat === "entertainment") return "entertainment";
  if (["finance", "politics", "market", "social"].includes(cat)) return "macro";
  // Sports events live in the Sports sub-site — do not surface here.
  if (cat === "sports") return null;
  return "macro";
};

export interface SectorRailProps {
  events: EventWithOptions[];
  selected: SectorKey;
  onSelect: (key: SectorKey) => void;
  className?: string;
}

export const SectorRail = ({
  events,
  selected,
  onSelect,
  className,
}: SectorRailProps) => {
  const counts = events.reduce<Record<string, number>>((acc, ev) => {
    const s = eventToSector(ev);
    if (s) acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const activeSectors: SectorMeta[] = (["stocks", "crypto", "macro", "entertainment"] as SectorKey[])
    .filter((k) => (counts[k] || 0) > 0)
    .map((k) => SECTOR_META[k]);

  return (
    <div className={cn("-mx-4 overflow-x-auto scrollbar-none", className)}>
      <div className="flex min-w-max gap-3 px-4">
        {/* Sports — always visible external launcher */}
        <button
          onClick={() =>
            window.open(SPORTS_LINK, "_blank", "noopener,noreferrer")
          }
          className="group flex w-[220px] flex-shrink-0 flex-col justify-between rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-amber-600/5 p-3 text-left transition-all hover:border-amber-500/60"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
              <TrendingUp className="h-4 w-4" />
              Sports
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-amber-500/70" />
          </div>
          <p className="text-xs leading-snug text-muted-foreground">
            World-class matches, simple YES / NO
          </p>
        </button>

        {activeSectors.map(({ key, label, hook, Icon }) => {
          const isActive = key === selected;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                "flex w-[220px] flex-shrink-0 flex-col justify-between rounded-xl border p-3 text-left transition-all",
                isActive
                  ? "border-primary/60 bg-primary/10 shadow-[0_0_18px_hsl(260_60%_55%/0.2)]"
                  : "border-border/40 bg-card hover:border-primary/40 hover:bg-card/80",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <span className="rounded-md bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {counts[key] || 0}
                </span>
              </div>
              <p className="text-xs leading-snug text-muted-foreground">{hook}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { SECTOR_META };
