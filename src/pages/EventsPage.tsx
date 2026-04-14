import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, RefreshCw, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { FloatingRewardsButton } from "@/components/rewards/FloatingRewardsButton";
import { RewardsWelcomeModal } from "@/components/rewards/RewardsWelcomeModal";
import { AirdropHomepageModal } from "@/components/AirdropHomepageModal";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { useMarketListData, MarketRow } from "@/hooks/useMarketListData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { EventTabs, EventTab } from "@/components/events/EventTabs";
import { FilterChips, FilterState } from "@/components/events/FilterChips";
import { ViewMode } from "@/components/events/ViewToggle";
import { MarketListView } from "@/components/events/MarketListView";
import { MarketGridView } from "@/components/events/MarketGridView";
import { HotShelf } from "@/components/events/HotShelf";

// Persist view preference
const getStoredView = (): ViewMode => {
  try {
    return (localStorage.getItem("events_view") as ViewMode) || "list";
  } catch {
    return "list";
  }
};

const EventsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data
  const { events: dbEvents, isLoading, refetch } = useActiveEvents();
  const markets = useMarketListData(dbEvents);
  const { isWatched, toggle: toggleWatch } = useWatchlist();

  // Tab from URL
  const [activeTab, setActiveTab] = useState<EventTab>(
    () => (searchParams.get("tab") as EventTab) || "all"
  );

  // View mode: mobile forces grid
  const [view, setView] = useState<ViewMode>(() =>
    isMobile ? "grid" : getStoredView()
  );

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    chain: "all",
    expiry: "all",
    leverage: "all",
    sort: "volume",
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Force grid on mobile
  useEffect(() => {
    if (isMobile) setView("grid");
  }, [isMobile]);

  // Filter & sort markets
  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    // Tab-level filtering (category tabs)
    if (activeTab === "watchlist") {
      result = result.filter((m) => isWatched(m.eventId));
    } else if (activeTab === "crypto") {
      result = result.filter((m) => m.category === "crypto");
    } else if (activeTab === "macro") {
      result = result.filter((m) => m.category === "finance" || m.category === "macro");
    } else if (activeTab === "sports") {
      result = result.filter((m) => m.category === "sports");
    } else if (activeTab === "politics") {
      result = result.filter((m) => m.category === "politics");
    }
    // "all" and "hot" show everything (hot has its own layout)

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.eventName.toLowerCase().includes(q) ||
          m.optionLabel.toLowerCase().includes(q)
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
        case "volume": return b.volume24h - a.volume24h;
        case "price": return b.markPrice - a.markPrice;
        case "change": return Math.abs(b.change24h) - Math.abs(a.change24h);
        case "oi": return b.openInterest - a.openInterest;
        case "funding": return Math.abs(b.fundingRate) - Math.abs(a.fundingRate);
        default: return 0;
      }
    });

    return result;
  }, [markets, activeTab, filters, isWatched]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const effectiveView: ViewMode = isMobile ? "grid" : view;

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
        markets={filteredMarkets}
        isWatched={isWatched}
        onToggleWatch={toggleWatch}
      />
    ) : (
      <MarketGridView
        markets={filteredMarkets}
        isWatched={isWatched}
        onToggleWatch={toggleWatch}
      />
    );
  };

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
      {isMobile ? <MobileHeader showLogo /> : <EventsDesktopHeader />}

      <main className={`${isMobile ? "px-4 py-4" : "px-8 py-6 max-w-[1400px] mx-auto"} space-y-4`}>
        {/* Tabs */}
        <EventTabs active={activeTab} onChange={setActiveTab} />

        {/* Filters */}
        <FilterChips
          filters={filters}
          onChange={setFilters}
          view={view}
          onViewChange={setView}
          showViewToggle={!isMobile}
        />

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

        {/* Refresh */}
        {!isLoading && filteredMarkets.length > 0 && activeTab !== "hot" && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/50 hover:border-primary hover:text-primary"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
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
