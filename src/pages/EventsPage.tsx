import { useState, useMemo } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { EventCard, EventData } from "@/components/EventCard";
import { EventStatsOverview } from "@/components/EventStatsOverview";
import { EventFilters, EventStatusFilter } from "@/components/EventFilters";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { activeEvents, eventOptionsMap } from "@/data/events";
import omenxLogo from "@/assets/omenx-logo.svg";

// Transform activeEvents to EventData format for EventCard
const transformedEvents: EventData[] = activeEvents.map((event) => {
  const options = eventOptionsMap[event.id] || [];
  return {
    id: event.id,
    title: event.name,
    status: event.endTime > new Date() ? "active" : "locked",
    hasMultipleOptions: options.length > 2,
    settlementDate: event.ends,
    options: options.map(opt => ({
      id: opt.id,
      label: opt.label,
      price: opt.price,
    })),
    totalVolume: event.volume,
    volume24h: "$0.1M",
    participants: Math.floor(Math.random() * 200 + 100),
  };
});

const EventsPage = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isMobile = useIsMobile();
  
  // Show back button only if user navigated here (PUSH), not if they used bottom nav or direct URL
  const showBackButton = navigationType === "PUSH";
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [settlementFilter, setSettlementFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("volume");
  const [isLoading, setIsLoading] = useState(false);

  // Filter events
  const filteredEvents = transformedEvents.filter((event) => {
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false;
    }
    // Add more filter logic here for settlement and category
    return true;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "volume") {
      return parseFloat(b.totalVolume.replace(/[$M,]/g, "")) - parseFloat(a.totalVolume.replace(/[$M,]/g, ""));
    }
    if (sortBy === "participants") {
      return b.participants - a.participants;
    }
    return 0;
  });

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/trade?event=${eventId}`);
  };

  return (
    <div className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
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
              <img src={omenxLogo} alt="OMENX" className="h-4 w-auto" />
            </div>
            <EventFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              settlementFilter={settlementFilter}
              onSettlementFilterChange={setSettlementFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>
        </header>
      ) : (
        <EventsDesktopHeader />
      )}

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-7xl mx-auto"} space-y-8`}>
        {/* Page Title with more personality */}
        <div className="relative">
          {!isMobile && (
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
          )}
          <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
            Explore Events
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-lg">
            Discover prediction markets and trade on real-world outcomes with leverage
          </p>
        </div>

        {/* Stats Overview - Hidden for now, uncomment when more data available */}
        {/* {!isMobile && <EventStatsOverview />} */}

        {/* Filters - Desktop */}
        {!isMobile && (
          <EventFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            settlementFilter={settlementFilter}
            onSettlementFilterChange={setSettlementFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        )}

        {/* Events Grid */}
        <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-2"}`}>
          {sortedEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <EventCard
                event={event}
                onEventClick={handleEventClick}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your filters or check back later for new events.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {sortedEvents.length > 0 && (
          <div className="flex justify-center pt-6">
            <Button 
              variant="outline" 
              className="gap-2 border-border/50 hover:border-primary hover:text-primary transition-colors" 
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Loading..." : "Load More Events"}
            </Button>
          </div>
        )}
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
};

export default EventsPage;
