import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  // Mobile Filter Sheet
  if (isMobile) {
    return (
      <div className="flex items-center justify-between gap-2">
        {/* Status Dropdown */}
        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as EventStatusFilter)}>
          <SelectTrigger className="w-[100px] bg-muted/50">
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

        {/* Filter Sheet Trigger */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
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
                className="w-full" 
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop Filters
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground mr-1">Status:</span>
          {statusOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant={statusFilter === opt.value ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                statusFilter === opt.value
                  ? "bg-trading-purple hover:bg-trading-purple/90"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => onStatusFilterChange(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>

        {/* Settlement Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Settlement:</span>
          <Select value={settlementFilter} onValueChange={onSettlementFilterChange}>
            <SelectTrigger className="w-[130px] bg-muted/50 h-8">
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
          <span className="text-sm text-muted-foreground">Category:</span>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-[140px] bg-muted/50 h-8">
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
        <span className="text-sm text-muted-foreground">Sort:</span>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[130px] bg-muted/50 h-8">
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
