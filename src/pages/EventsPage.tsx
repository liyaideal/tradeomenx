import { useState, useMemo } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { EventCard, EventData } from "@/components/EventCard";
import { EventStatsOverview } from "@/components/EventStatsOverview";
import { EventFilters, EventStatusFilter, MobileStatusDropdown, MobileFilterDrawer } from "@/components/EventFilters";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { FloatingRewardsButton } from "@/components/rewards/FloatingRewardsButton";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { format } from "date-fns";

const EventsPage = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isMobile = useIsMobile();
  
  // Fetch events from database
  const { events: dbEvents, isLoading: isLoadingEvents, refetch } = useActiveEvents();
  
  // Show back button only if user navigated here (PUSH), not if they used bottom nav or direct URL
  const showBackButton = navigationType === "PUSH";
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("active");
  const [settlementFilter, setSettlementFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("volume");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transform database events to EventData format for EventCard
  const transformedEvents: EventData[] = useMemo(() => {
    return dbEvents.map((event) => {
      const endDate = event.end_date ? new Date(event.end_date) : new Date();
      const isActive = endDate > new Date();
      
      return {
        id: event.id,
        title: event.name,
        status: isActive ? "active" : "locked",
        hasMultipleOptions: event.options.length > 2,
        settlementDate: event.end_date ? format(new Date(event.end_date), "MMM d, yyyy") : "TBD",
        options: event.options.map(opt => ({
          id: opt.id,
          label: opt.label,
          price: opt.price.toFixed(2),
        })),
        totalVolume: event.volume || "$0",
        volume24h: "$0.1M",
        participants: Math.floor(Math.random() * 200 + 100),
      };
    });
  }, [dbEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return transformedEvents.filter((event) => {
      // For "active" filter, show only active events
      if (statusFilter === "active" && event.status !== "active") {
        return false;
      }
      // Category filter could be added here
      return true;
    });
  }, [transformedEvents, statusFilter]);

  // Sort events
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      if (sortBy === "volume") {
        const volA = parseFloat(a.totalVolume.replace(/[$M,]/g, "")) || 0;
        const volB = parseFloat(b.totalVolume.replace(/[$M,]/g, "")) || 0;
        return volB - volA;
      }
      if (sortBy === "participants") {
        return b.participants - a.participants;
      }
      return 0;
    });
  }, [filteredEvents, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
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
        <MobileHeader
          showLogo
          rightContent={
            <MobileStatusDropdown
              statusFilter={statusFilter}
              onStatusFilterChange={(status) => {
                if (status === "resolved") {
                  navigate("/resolved");
                } else {
                  setStatusFilter(status);
                }
              }}
            />
          }
        />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-7xl mx-auto"} space-y-8`}>
        {/* Page Title with more personality */}
        <div className="relative">
          {!isMobile && (
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
                Explore Events
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-lg">
                Discover prediction markets and trade on real-world outcomes with leverage
              </p>
            </div>
            {/* Filter button at Explore Events level - Mobile only */}
            {isMobile && (
              <MobileFilterDrawer
                statusFilter={statusFilter}
                settlementFilter={settlementFilter}
                onSettlementFilterChange={setSettlementFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
              />
            )}
          </div>
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

        {/* Loading State */}
        {isLoadingEvents ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <>
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

            {/* Refresh Button */}
            {sortedEvents.length > 0 && (
              <div className="flex justify-center pt-6">
                <Button 
                  variant="outline" 
                  className="gap-2 border-border/50 hover:border-primary hover:text-primary transition-colors" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh Events"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {isMobile && <BottomNav />}
      
      {/* Floating Rewards Button */}
      <FloatingRewardsButton className={isMobile ? "bottom-24 right-4" : "bottom-8 right-8"} />
    </div>
  );
};

export default EventsPage;
