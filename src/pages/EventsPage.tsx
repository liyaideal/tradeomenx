import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, RefreshCw, Star, ChevronDown } from "lucide-react";
import { MobileStatusDropdown } from "@/components/EventFilters";
import { MobileActiveFilterDrawer } from "@/components/events/FilterChips";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { FloatingRewardsButton } from "@/components/rewards/FloatingRewardsButton";
import { RewardsWelcomeModal } from "@/components/rewards/RewardsWelcomeModal";
import { AirdropHomepageModal } from "@/components/AirdropHomepageModal";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { useMarketListData, EventRow, ChgTimeframe, getChange, getVolume } from "@/hooks/useMarketListData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { EventTabs, EventTab } from "@/components/events/EventTabs";
import { FilterChips, FilterState } from "@/components/events/FilterChips";
import { ViewMode } from "@/components/events/ViewToggle";
import { ChgTimeframePicker } from "@/components/events/ChgTimeframePicker";
import { MarketListView } from "@/components/events/MarketListView";
import { MarketGridView } from "@/components/events/MarketGridView";
import { HotShelf } from "@/components/events/HotShelf";

// Persist view preference
const getStoredView = (): ViewMode => {
  try {
    const stored = localStorage.getItem("events_view") as ViewMode;
    if (stored === "list" || stored === "grid-a" || stored === "grid-b") return stored;
    if (stored === "grid") return "grid-a";
    return "list";
  } catch {
    return "list";
  }
};

const PAGE_SIZE_DESKTOP = 20;
const PAGE_SIZE_MOBILE = 10;

const EventsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data
  const { events: dbEvents, isLoading, refetch } = useActiveEvents();
  const markets = useMarketListData(dbEvents);
  const { isWatched, toggle: toggleWatch } = useWatchlist();

  // Tab from URL
  const [activeTab, setActiveTab] = useState<string>(
    () => searchParams.get("tab") || "all"
  );

  // View mode: mobile forces grid-a
  const [view, setView] = useState<ViewMode>(() =>
    isMobile ? "grid-a" : getStoredView()
  );

  // Change timeframe
  const [chgTimeframe, setChgTimeframe] = useState<ChgTimeframe>("24h");

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    expiry: "all",
    sort: "volume",
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP;

  // Reset page when filters/tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters, chgTimeframe]);

  // Sync tab → URL
  useEffect(() => {
    const current = searchParams.get("tab") || "all";
    if (current !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab]);

  // Persist view
  useEffect(() => {
    if (!isMobile) localStorage.setItem("events_view", view);
  }, [view, isMobile]);

  // Default to grid-a on mobile (only on mount)
  useEffect(() => {
    if (isMobile && view !== "grid-a" && view !== "grid-b") setView("grid-a");
  }, [isMobile]);

  // Filter & sort markets
  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    // Tab-level filtering (category tabs)
    if (activeTab === "watchlist") {
      result = result.filter((m) => isWatched(m.eventId));
    } else if (activeTab !== "all" && activeTab !== "hot") {
      result = result.filter((m) => m.category === activeTab);
    }

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.eventName.toLowerCase().includes(q) ||
          m.children.some((c) => c.optionLabel.toLowerCase().includes(q))
      );
    }

    // Expiry filter
    if (filters.expiry !== "all") {
      const now = Date.now();
      result = result.filter((m) => {
        if (!m.expiry) return false;
        const diff = m.expiry.getTime() - now;
        switch (filters.expiry) {
          case "24h": return diff <= 86400000 && diff > 0;
          case "7d": return diff <= 7 * 86400000 && diff > 0;
          case "30d": return diff <= 30 * 86400000 && diff > 0;
          case "30d+": return diff > 30 * 86400000;
          default: return true;
        }
      });
    }

    // Sort
    const sortKey = filters.sort;
    result.sort((a, b) => {
      switch (sortKey) {
        case "volume": return getVolume(b, chgTimeframe) - getVolume(a, chgTimeframe);
        case "change": return Math.abs(getChange(b, chgTimeframe)) - Math.abs(getChange(a, chgTimeframe));
        case "oi": return b.openInterest - a.openInterest;
        default: return 0;
      }
    });

    return result;
  }, [markets, activeTab, filters, isWatched, chgTimeframe]);

  // Visible markets (cumulative load more)
  const visibleMarkets = useMemo(() => {
    return filteredMarkets.slice(0, currentPage * pageSize);
  }, [filteredMarkets, currentPage, pageSize]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const effectiveView: ViewMode = isMobile ? (view === "grid-b" ? "grid-b" : "grid-a") : view;

  const renderContent = () => {
    if (activeTab === "hot") {
      return (
        <HotShelf
          markets={markets}
          view={effectiveView}
          isWatched={isWatched}
          onToggleWatch={toggleWatch}
        />
      );
    }

    // Watchlist empty state
    if (activeTab === "watchlist" && filteredMarkets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Star className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-base font-medium text-foreground mb-1">No watchlist items</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Click ⭐ to save markets you're interested in for quick access.
          </p>
        </div>
      );
    }

    if (filteredMarkets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <RefreshCw className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
        </div>
      );
    }

    return effectiveView === "list" ? (
      <MarketListView
        markets={visibleMarkets}
        isWatched={isWatched}
        onToggleWatch={toggleWatch}
        chgTimeframe={chgTimeframe}
      />
    ) : (
      <MarketGridView
        markets={visibleMarkets}
        isWatched={isWatched}
        onToggleWatch={toggleWatch}
        chgTimeframe={chgTimeframe}
        viewMode={effectiveView}
      />
    );
  };

  const hasMore = visibleMarkets.length < filteredMarkets.length;

  return (
    <div
      className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
      style={{
        background: isMobile
          ? "hsl(222 47% 6%)"
          : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(260 50% 15% / 0.3) 0%, hsl(222 47% 6%) 70%)",
      }}
    >
      {/* Header */}
      {isMobile ? (
        <MobileHeader
          showLogo
          rightContent={
            <MobileStatusDropdown
              statusFilter="active"
              onStatusFilterChange={(status) => {
                if (status === "resolved") navigate("/resolved");
              }}
            />
          }
        />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-7xl mx-auto"} space-y-6`}>
        {/* Page Title */}
        <div className="relative">
          {!isMobile && (
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
                Explore Events
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                Real-time markets, real-time edge
              </p>
            </div>
            {isMobile && (
              <div className="flex items-center gap-2">
                <ChgTimeframePicker value={chgTimeframe} onChange={setChgTimeframe} compact />
                <MobileActiveFilterDrawer filters={filters} onChange={setFilters} />
              </div>
            )}
          </div>
        </div>

        {/* Tabs + Timeframe picker */}
        <div className="flex items-center justify-between gap-3">
          <EventTabs active={activeTab} onChange={setActiveTab} categories={[...new Set(markets.map((m) => m.category))]} />
          {!isMobile && <ChgTimeframePicker value={chgTimeframe} onChange={setChgTimeframe} />}
        </div>

        {/* Desktop Filters */}
        {!isMobile && (
          <FilterChips
            filters={filters}
            onChange={setFilters}
            view={view}
            onViewChange={setView}
            showViewToggle
          />
        )}

        {/* Search indicator */}
        {filters.search.trim() && (
          <p className="text-xs text-muted-foreground">
            Showing results for "<span className="text-foreground">{filters.search}</span>"
          </p>
        )}

        {/* Main content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading markets...</p>
          </div>
        ) : (
          renderContent()
        )}

        {/* Load More */}
        {!isLoading && hasMore && activeTab !== "hot" && (
          <div className="flex flex-col items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground border-border/60"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronDown className="h-4 w-4" />
              Load More
              <span className="text-xs font-mono opacity-60">
                {visibleMarkets.length}/{filteredMarkets.length}
              </span>
            </Button>
          </div>
        )}
      </main>

      {isMobile && <BottomNav />}
      {!isMobile && <RewardsWelcomeModal />}
      {!isMobile && <FloatingRewardsButton className="bottom-8 right-8" />}
      {!isMobile && <AirdropHomepageModal />}
    </div>
  );
};

export default EventsPage;
