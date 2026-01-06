import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  MobileDrawer,
  MobileDrawerSection,
} from "@/components/ui/mobile-drawer";

export type EventStatusFilter = "all" | "active" | "locked";

interface EventFiltersProps {
  statusFilter: EventStatusFilter;
  onStatusFilterChange: (status: EventStatusFilter) => void;
  settlementFilter: string;
  onSettlementFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export const EventFilters = ({
  statusFilter,
  onStatusFilterChange,
  settlementFilter,
  onSettlementFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
}: EventFiltersProps) => {
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions: { value: EventStatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "locked", label: "Locked" },
  ];

  const settlementOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "next-month", label: "Next Month" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "crypto", label: "Crypto" },
    { value: "finance", label: "Finance" },
    { value: "politics", label: "Politics" },
    { value: "sports", label: "Sports" },
    { value: "tech", label: "Tech" },
  ];

  const sortOptions = [
    { value: "volume", label: "Volume ↓" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "newest", label: "Newest" },
    { value: "participants", label: "Participants" },
  ];

  // Mobile Filter Drawer
  if (isMobile) {
    return (
      <div className="flex items-center justify-between gap-2">
        {/* Status Dropdown */}
        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as EventStatusFilter)}>
          <SelectTrigger className="w-[100px] bg-secondary border-border/50 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Drawer Trigger */}
        <Button 
          variant="outline" 
          size="icon" 
          className="flex-shrink-0 border-border/50"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="h-4 w-4" />
        </Button>

        <MobileDrawer
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          title="Filters"
        >
          <MobileDrawerSection className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Settlement</label>
              <Select value={settlementFilter} onValueChange={onSettlementFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settlementOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Category</label>
              <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sort By</label>
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary-hover" 
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </MobileDrawerSection>
        </MobileDrawer>
      </div>
    );
  }

  // Desktop Filters
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap py-2">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Status Pills - with better styling */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Status:</span>
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStatusFilterChange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  statusFilter === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settlement Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Settlement:</span>
          <Select value={settlementFilter} onValueChange={onSettlementFilterChange}>
            <SelectTrigger className="w-[130px] bg-secondary/50 border-border/30 h-9 hover:bg-secondary transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settlementOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Category:</span>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-[150px] bg-secondary/50 border-border/30 h-9 hover:bg-secondary transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">Sort:</span>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[130px] bg-secondary/50 border-border/30 h-9 hover:bg-secondary transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};