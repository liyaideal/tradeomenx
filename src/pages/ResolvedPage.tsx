import { useState } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { Logo } from "@/components/Logo";
import { MobileStatusDropdown } from "@/components/EventFilters";
import { ResolvedEventCard } from "@/components/ResolvedEventCard";
import { 
  ResolvedFilters, 
  MobileResolvedFilterDrawer,
  TimeRangeFilter,
  SortByOption 
} from "@/components/ResolvedFilters";
import { useResolvedEvents } from "@/hooks/useResolvedEvents";

const ResolvedPage = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isMobile = useIsMobile();
  
  const showBackButton = navigationType === "PUSH";
  
  // Filter states
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortByOption>("settlement");
  const [displayCount, setDisplayCount] = useState(10);

  // Fetch resolved events
  const { data: events = [], isLoading, refetch } = useResolvedEvents({
    timeRange,
    category,
    search,
    sortBy,
  });

  const displayedEvents = events.slice(0, displayCount);
  const hasMore = events.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/resolved/${eventId}`);
  };

  return (
    <div 
      className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
      style={{
        background: isMobile 
          ? "hsl(222 47% 6%)" 
          : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(260 50% 15% / 0.3) 0%, hsl(222 47% 6%) 70%)"
      }}
    >
      {/* Header */}
      {isMobile ? (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Logo size="md" />
            </div>
            {/* Status dropdown - shows "Resolved" */}
            <MobileStatusDropdown
              statusFilter="resolved"
              onStatusFilterChange={(status) => {
                if (status === "active") {
                  navigate("/events");
                }
              }}
            />
          </div>
        </header>
      ) : (
        <EventsDesktopHeader />
      )}

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-7xl mx-auto"} space-y-8`}>
        {/* Page Title */}
        <div className="relative">
          {!isMobile && (
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
                Resolved Events
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-lg">
                View results from all completed prediction events
              </p>
            </div>
            {/* Mobile Filter Button */}
            {isMobile && (
              <MobileResolvedFilterDrawer
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                category={category}
                onCategoryChange={setCategory}
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortByChange={setSortBy}
              />
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        {!isMobile && (
          <ResolvedFilters
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            category={category}
            onCategoryChange={setCategory}
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && displayedEvents.length > 0 && (
          <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {displayedEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ResolvedEventCard
                  event={event}
                  onClick={() => handleEventClick(event.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No resolved events found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search || category !== "all" || timeRange !== "all"
                ? "Try adjusting your filters to find more events."
                : "There are no resolved events yet. Check back later!"}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && hasMore && (
          <div className="flex justify-center pt-6">
            <Button 
              variant="outline" 
              className="gap-2 border-border/50 hover:border-primary hover:text-primary transition-colors" 
              onClick={handleLoadMore}
            >
              <RefreshCw className="h-4 w-4" />
              Load More
            </Button>
          </div>
        )}
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
};

export default ResolvedPage;
