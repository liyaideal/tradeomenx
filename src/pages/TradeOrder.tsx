import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExternalLink, ChevronDown, Search, Star, X } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { OptionChips } from "@/components/OptionChips";
import { TradeForm } from "@/components/TradeForm";
import { OrderCard } from "@/components/OrderCard";
import { PositionCard } from "@/components/PositionCard";
import { useOrdersStore } from "@/stores/useOrdersStore";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { useEvents } from "@/hooks/useEvents";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Generate order book data based on base price
const generateOrderBookData = (basePrice: number) => {
  const asks = [];
  const bids = [];
  
  for (let i = 0; i < 10; i++) {
    const askPrice = (basePrice + 0.0005 * (i + 1)).toFixed(4);
    const bidPrice = (basePrice - 0.0005 * (i + 1)).toFixed(4);
    const amount = Math.floor(Math.random() * 50000 + 500).toString();
    
    asks.push({ price: askPrice, amount });
    bids.push({ price: bidPrice, amount });
  }
  
  return { asks, bids };
};


export default function TradeOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || undefined;
  
  const { orders } = useOrdersStore();
  const { positions } = usePositionsStore();
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
  
  const [activeTab, setActiveTab] = useState("Trade");
  const [bottomTab, setBottomTab] = useState("Orders");
  const [eventSheetOpen, setEventSheetOpen] = useState(false);

  // Handle event selection and update URL
  const handleEventSelect = (event: typeof selectedEvent) => {
    setSelectedEvent(event);
    navigate(`/trade/order?event=${event.id}`, { replace: true });
    setEventSheetOpen(false);
    setSearchQuery("");
  };

  // Generate order book data based on selected option's price
  const orderBookData = useMemo(() => {
    const basePrice = parseFloat(selectedOptionData.price);
    return generateOrderBookData(basePrice);
  }, [selectedOptionData.price]);

  return (
    <div className="min-h-screen bg-background pb-8 overflow-x-hidden">
      {/* Event Selector Sheet */}
      <Sheet open={eventSheetOpen} onOpenChange={setEventSheetOpen}>
        <SheetContent side="bottom" className="h-[70vh] bg-background border-t border-border">
          <SheetHeader className="pb-4">
            <SheetTitle>Select Event</SheetTitle>
          </SheetHeader>
          
          {/* Search with Favorites Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={showFavoritesOnly ? "Search favorites..." : "Search events..."}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={toggleShowFavoritesOnly}
                className="p-1 rounded hover:bg-muted/50 transition-colors"
              >
                <Star className={`w-4 h-4 transition-colors ${
                  showFavoritesOnly 
                    ? "text-trading-yellow fill-trading-yellow" 
                    : "text-muted-foreground"
                }`} />
              </button>
            </div>
            {showFavoritesOnly && (
              <div className="mt-2 text-xs text-trading-yellow flex items-center gap-1">
                <Star className="w-3 h-3 fill-trading-yellow" />
                Showing favorites only ({filteredEvents.length})
              </div>
            )}
          </div>
          
          {/* Event List */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(70vh-160px)]">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                {showFavoritesOnly ? (
                  <>
                    <Star className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">No favorites yet</p>
                    <p className="text-xs text-muted-foreground/70">
                      Click the star icon next to events to add them to your favorites
                    </p>
                    <button
                      onClick={toggleShowFavoritesOnly}
                      className="mt-3 text-xs text-primary hover:underline"
                    >
                      View all events
                    </button>
                  </>
                ) : (
                  <>
                    <Search className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No events found</p>
                    <p className="text-xs text-muted-foreground/70">
                      Try a different search term
                    </p>
                  </>
                )}
              </div>
            ) : (
              filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className={`w-full p-3 rounded-lg text-left transition-colors flex items-center gap-3 ${
                    selectedEvent.id === event.id 
                      ? "bg-primary/10 border border-primary/30" 
                      : "bg-muted/30 hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(event.id, e);
                    }}
                    className="flex-shrink-0"
                  >
                    <Star 
                      className={`w-4 h-4 ${favorites.has(event.id) ? "text-trading-yellow fill-trading-yellow" : "text-muted-foreground"}`} 
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{event.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>Ends: {event.ends}</span>
                      <span>Volume: {event.volume}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <MobileHeader
        title={selectedEvent.name}
        endTime={selectedEvent.endTime}
        showActions
        showBack={true}
        backTo="/"
        tweetCount={selectedEvent.tweetCount}
        onTitleClick={() => setEventSheetOpen(true)}
      />

      {/* Option Chips */}
      <OptionChips
        options={options}
        selectedId={selectedOption}
        onSelect={setSelectedOption}
      />

      {/* Charts/Trade Tabs */}
      <div className="flex px-4 border-b border-border/30">
        {["Charts", "Trade"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Charts") navigate(`/trade?event=${selectedEvent.id}`);
            }}
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

      {/* Main Content Area - Two Column Layout */}
      <div className="flex w-full">
        {/* Left: Trade Form + Price Info */}
        <div className="flex-1 min-w-0 border-r border-border/30">
          {/* Price Header */}
          <div className="px-3 py-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground">Price</div>
                <div className="text-xl font-bold font-mono">{selectedOptionData.price}</div>
                <div className="text-[10px] text-muted-foreground">
                  Funding: -0.0001% / Next: in 28min
                </div>
              </div>
              <button className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ExternalLink className="w-3 h-3" />
                Event Info
              </button>
            </div>
          </div>

          {/* Trade Form */}
          <TradeForm 
            selectedPrice={selectedOptionData.price} 
            eventName={selectedEvent.name}
            optionLabel={selectedOptionData.label}
          />
        </div>

        {/* Right: Order Book */}
        <div className="w-[120px] flex-shrink-0">
          <div className="px-1.5 py-1.5">
            <div className="grid grid-cols-2 text-[9px] text-muted-foreground mb-1">
              <span>Price</span>
              <span className="text-right">Amount</span>
            </div>
          </div>
          
          {/* Asks */}
          <div className="overflow-y-auto scrollbar-hide">
            {orderBookData.asks.slice(0, 10).map((ask, index) => (
              <div
                key={`ask-${index}`}
                className="flex justify-between px-1.5 py-0.5 text-[10px]"
              >
                <span className="price-red">{ask.price}</span>
                <span className="text-muted-foreground font-mono">{ask.amount}</span>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="px-1.5 py-1.5 text-center">
            <span className="text-sm font-bold font-mono">{selectedOptionData.price}</span>
          </div>

          {/* Bids */}
          <div className="overflow-y-auto scrollbar-hide">
            {orderBookData.bids.slice(0, 10).map((bid, index) => (
              <div
                key={`bid-${index}`}
                className="flex justify-between px-1.5 py-0.5 text-[10px]"
              >
                <span className="price-green">{bid.price}</span>
                <span className="text-muted-foreground font-mono">{bid.amount}</span>
              </div>
            ))}
          </div>

          {/* Depth Selector */}
          <div className="flex items-center justify-between px-1.5 py-1.5 border-t border-border/30 mt-1">
            <span className="text-[9px] text-muted-foreground">Depth</span>
            <button className="flex items-center gap-0.5 text-[10px]">
              0.1
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders/Positions Tabs */}
      <div className="flex px-4 mt-2 border-b border-border/30">
        {["Orders", "Positions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setBottomTab(tab)}
            className={`py-2 mr-6 text-sm font-medium transition-all ${
              bottomTab === tab
                ? "text-trading-purple border-b-2 border-trading-purple"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders/Positions Content */}
      <div className="px-4 py-3 space-y-3">
        {bottomTab === "Orders" && orders.map((order, index) => (
          <OrderCard key={index} {...order} />
        ))}
        {bottomTab === "Positions" && positions.map((position, index) => (
          <PositionCard key={index} {...position} />
        ))}
      </div>
    </div>
  );
}
