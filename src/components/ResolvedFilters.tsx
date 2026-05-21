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
import { Filter, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResolvedViewToggle, ResolvedViewMode } from "@/components/resolved/ResolvedViewToggle";

export interface ResolvedFiltersProps {
  viewMode: ResolvedViewMode;
  onViewModeChange: (value: ResolvedViewMode) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "crypto", label: "Crypto" },
  { value: "politics", label: "Politics" },
  { value: "finance", label: "Finance" },
  { value: "tech", label: "Tech" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
];

// Mobile Filter Drawer
export const MobileResolvedFilterDrawer = ({
  viewMode,
  onViewModeChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: ResolvedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  const handleApply = () => {
    onSearchChange(localSearch);
    setIsOpen(false);
  };

  const handleReset = () => {
    onViewModeChange("all");
    onCategoryChange("all");
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

      <MobileDrawer open={isOpen} onOpenChange={setIsOpen} title="Filters">
        <div className="space-y-6">
          {/* View Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">View</label>
            <div className="flex">
              <ResolvedViewToggle value={viewMode} onChange={onViewModeChange} />
            </div>
          </div>

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
  viewMode,
  onViewModeChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: ResolvedFiltersProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <div className="bg-card/50 border border-border/40 rounded-xl p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <ResolvedViewToggle value={viewMode} onChange={onViewModeChange} />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Search:</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter event name..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-56 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-muted-foreground">Category:</span>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-44 bg-background/50">
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
      </div>
    </div>
  );
};
