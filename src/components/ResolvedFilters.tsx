import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileDrawer } from "@/components/ui/mobile-drawer";
import { Filter, Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type TimeRangeFilter = "all" | "month" | "quarter" | "year";
export type SortByOption = "settlement" | "volume" | "name";

interface ResolvedFiltersProps {
  timeRange: TimeRangeFilter;
  onTimeRangeChange: (value: TimeRangeFilter) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortByOption;
  onSortByChange: (value: SortByOption) => void;
}

const timeRangeOptions = [
  { value: "all", label: "All" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "crypto", label: "Crypto" },
  { value: "politics", label: "Politics" },
  { value: "finance", label: "Finance" },
  { value: "tech", label: "Tech" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
];

const sortOptions = [
  { value: "settlement", label: "By Settlement Time" },
  { value: "volume", label: "By Volume" },
  { value: "name", label: "By Name" },
];

// Mobile Filter Drawer
export const MobileResolvedFilterDrawer = ({
  timeRange,
  onTimeRangeChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
}: ResolvedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  const handleApply = () => {
    onSearchChange(localSearch);
    setIsOpen(false);
  };

  const handleReset = () => {
    onTimeRangeChange("all");
    onCategoryChange("all");
    onSortByChange("settlement");
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-full bg-muted/50"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="h-4 w-4" />
      </Button>
      
      <MobileDrawer
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Filters"
      >
        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter event name..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Time Range</label>
            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTimeRangeChange(option.value as TimeRangeFilter)}
                  className="flex-1 min-w-[70px]"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortByOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </MobileDrawer>
    </>
  );
};

// Desktop Filters
export const ResolvedFilters = ({
  timeRange,
  onTimeRangeChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
}: ResolvedFiltersProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <div className="bg-card/50 border border-border/40 rounded-xl p-5 space-y-4">
      {/* Time Range Pills */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Time Range:</span>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeRange === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeRangeChange(option.value as TimeRangeFilter)}
              className={`text-xs ${
                timeRange === option.value
                  ? "bg-primary text-primary-foreground"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search, Category, Sort */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Search:</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter event name..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-48 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Category:</span>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40 bg-background/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-muted-foreground">Sort:</span>
          <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortByOption)}>
            <SelectTrigger className="w-44 bg-background/50">
              <SelectValue placeholder="By Settlement Time" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
