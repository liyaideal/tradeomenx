import { useState } from "react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import { MobileHeader } from "@/components/MobileHeader";
import { OptionChips } from "@/components/OptionChips";
import { EventSelectorSheet } from "@/components/EventSelectorSheet";
import { useEvents } from "@/hooks/useEvents";
import { TradingEvent, EventOption } from "@/data/events";

interface MobileTradingLayoutProps {
  activeTab: "Charts" | "Trade";
  children: React.ReactNode;
}

// Context for sharing trading state with child components
interface TradingContextData {
  selectedEvent: TradingEvent;
  selectedOption: string;
  selectedOptionData: EventOption;
  options: EventOption[];
}

export function MobileTradingLayout({ activeTab, children }: MobileTradingLayoutProps) {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || undefined;
  
  // Determine back navigation behavior:
  // - If user navigated here via PUSH (from another page like /events), go back to previous page
  // - If user came via bottom toolbar (REPLACE/POP), go back to home
  const isPushNavigation = navigationType === "PUSH";
  const backTo = isPushNavigation ? undefined : "/";
  
  const { 
    selectedEvent, 
    options, 
    selectedOption, 
    setSelectedOption, 
    selectedOptionData,
    setSelectedEvent,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    filteredEvents,
    showFavoritesOnly,
    toggleShowFavoritesOnly,
  } = useEvents(eventId);
  
  const [eventSheetOpen, setEventSheetOpen] = useState(false);

  // Handle event selection and update URL
  const handleEventSelect = (event: TradingEvent) => {
    setSelectedEvent(event);
    const basePath = activeTab === "Charts" ? "/trade" : "/trade/order";
    navigate(`${basePath}?event=${event.id}`, { replace: true });
    setEventSheetOpen(false);
    setSearchQuery("");
  };

  const handleTabChange = (tab: "Charts" | "Trade") => {
    if (tab === activeTab) return;
    const path = tab === "Charts" 
      ? `/trade?event=${selectedEvent.id}` 
      : `/trade/order?event=${selectedEvent.id}`;
    navigate(path);
  };

  // Create context data for children
  const contextData: TradingContextData = {
    selectedEvent,
    selectedOption,
    selectedOptionData,
    options,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Event Selector Sheet */}
      <EventSelectorSheet
        open={eventSheetOpen}
        onOpenChange={setEventSheetOpen}
        selectedEvent={selectedEvent}
        filteredEvents={filteredEvents}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        toggleShowFavoritesOnly={toggleShowFavoritesOnly}
        onEventSelect={handleEventSelect}
      />

      <MobileHeader 
        title={selectedEvent.name}
        endTime={selectedEvent.endTime}
        showActions
        showBack={true}
        backTo={backTo}
        tweetCount={selectedEvent.tweetCount}
        onTitleClick={() => setEventSheetOpen(true)}
        isFavorite={favorites.has(selectedEvent.id)}
        onFavoriteToggle={() => toggleFavorite(selectedEvent.id)}
      />

      {/* Option Chips */}
      <OptionChips
        options={options}
        selectedId={selectedOption}
        onSelect={setSelectedOption}
      />

      {/* Charts/Trade Tabs */}
      <div className="flex px-4 border-b border-border/30">
        {(["Charts", "Trade"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-2 mr-6 text-sm font-medium transition-all ${
              activeTab === tab
                ? "text-trading-purple border-b-2 border-trading-purple"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render children with context */}
      {typeof children === "function" 
        ? (children as (data: TradingContextData) => React.ReactNode)(contextData)
        : children}
    </div>
  );
}

// Hook to access trading context from child pages
export function useMobileTradingContext() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || undefined;
  return useEvents(eventId);
}
