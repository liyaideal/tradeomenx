import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ViewToggle, ViewMode } from "./ViewToggle";
import { useIsMobile } from "@/hooks/use-mobile";

export interface FilterState {
  search: string;
  chain: string;
  expiry: string;
  leverage: string;
  sort: string;
}

interface FilterChipsProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  showViewToggle?: boolean;
}

const isActive = (val: string) => val !== "all" && val !== "";

export const FilterChips = ({
  filters,
  onChange,
  view,
  onViewChange,
  showViewToggle = true,
}: FilterChipsProps) => {
  const isMobile = useIsMobile();
  const update = (key: keyof FilterState, val: string) =>
    onChange({ ...filters, [key]: val });

  const hasActive =
    isActive(filters.chain) ||
    isActive(filters.expiry) ||
    isActive(filters.leverage) ||
    filters.sort !== "volume";

  const clearAll = () =>
    onChange({ ...filters, chain: "all", expiry: "all", leverage: "all", sort: "volume" });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Search events..."
          className="h-8 w-44 pl-8 text-xs bg-muted/50 border-border/40"
        />
      </div>

      {/* Chain */}
      {!isMobile && (
        <Select value={filters.chain} onValueChange={(v) => update("chain", v)}>
          <SelectTrigger
            className={`h-8 w-[90px] text-xs ${
              isActive(filters.chain) ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/50 border-border/40"
            }`}
          >
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chains</SelectItem>
            <SelectItem value="base">Base</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Expiry */}
      <Select value={filters.expiry} onValueChange={(v) => update("expiry", v)}>
        <SelectTrigger
          className={`h-8 w-[100px] text-xs ${
            isActive(filters.expiry) ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/50 border-border/40"
          }`}
        >
          <SelectValue placeholder="Expiry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Expiry</SelectItem>
          <SelectItem value="24h">&lt; 24h</SelectItem>
          <SelectItem value="7d">&lt; 7d</SelectItem>
          <SelectItem value="30d">&lt; 30d</SelectItem>
          <SelectItem value="30d+">&gt; 30d</SelectItem>
        </SelectContent>
      </Select>

      {/* Leverage */}
      {!isMobile && (
        <Select value={filters.leverage} onValueChange={(v) => update("leverage", v)}>
          <SelectTrigger
            className={`h-8 w-[100px] text-xs ${
              isActive(filters.leverage) ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/50 border-border/40"
            }`}
          >
            <SelectValue placeholder="Leverage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leverage</SelectItem>
            <SelectItem value="2x">2x</SelectItem>
            <SelectItem value="5x">5x</SelectItem>
            <SelectItem value="10x">10x</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Sort */}
      <Select value={filters.sort} onValueChange={(v) => update("sort", v)}>
        <SelectTrigger
          className={`h-8 w-[110px] text-xs ${
            filters.sort !== "volume" ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/50 border-border/40"
          }`}
        >
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="volume">Volume ↓</SelectItem>
          <SelectItem value="price">Price ↓</SelectItem>
          <SelectItem value="change">24h Change ↓</SelectItem>
          <SelectItem value="oi">OI ↓</SelectItem>
          <SelectItem value="funding">Funding ↓</SelectItem>
        </SelectContent>
      </Select>

      {hasActive && (
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground" onClick={clearAll}>
          <X className="h-3 w-3 mr-1" /> Clear
        </Button>
      )}

      <div className="flex-1" />

      {showViewToggle && <ViewToggle view={view} onChange={onViewChange} />}
    </div>
  );
};
