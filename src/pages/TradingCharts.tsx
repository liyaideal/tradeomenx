import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, Search, Star, X } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { OptionChips } from "@/components/OptionChips";
import { CandlestickChart } from "@/components/CandlestickChart";
import { OrderBook } from "@/components/OrderBook";
import { OrderCard } from "@/components/OrderCard";
import { PositionCard } from "@/components/PositionCard";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { useOrdersStore } from "@/stores/useOrdersStore";
import { useEvents } from "@/hooks/useEvents";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


// Generate order book data based on base price
const generateOrderBookData = (basePrice: number) => {
  const asks = [];
  const bids = [];
  
  for (let i = 0; i < 8; i++) {
    const askPrice = (basePrice + 0.001 * (i + 1)).toFixed(4);
    const bidPrice = (basePrice - 0.001 * (i + 1)).toFixed(4);
    const amount = Math.floor(Math.random() * 5000 + 500).toLocaleString();
    const total = Math.floor(Math.random() * 3000 + 300).toLocaleString();
    
    asks.push({ price: askPrice, amount, total });
    bids.push({ price: bidPrice, amount, total });
  }
  
  return { asks, bids };
};

// Generate trades history data based on base price
const generateTradesHistory = (basePrice: number) => {
  const trades = [];
  const now = Date.now();
  
  for (let i = 0; i < 20; i++) {
    const isBuy = Math.random() > 0.5;
    const priceVariation = (Math.random() - 0.5) * 0.01;
    const price = (basePrice + priceVariation).toFixed(4);
    const amount = Math.floor(Math.random() * 5000 + 100).toLocaleString();
    const timeAgo = Math.floor(Math.random() * 300);
    
    trades.push({
      price,
      amount,
      time: new Date(now - timeAgo * 1000).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      isBuy,
    });
  }
  
  return trades;
};

const stats = [
  { label: "24h Volume", value: "$2.45M" },
  { label: "Funding Rate", value: "+0.05%", isPositive: true },
];

const tabs = ["Order Book", "Trades history", "Orders", "Positions"];

export default function TradingCharts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || undefined;
  
  const { positions } = usePositionsStore();
  const { orders } = useOrdersStore();
  const { 
    selectedEvent, 
    events,
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
  
  const [activeTab, setActiveTab] = useState("Charts");
  const [bottomTab, setBottomTab] = useState("Order Book");
  const [eventSheetOpen, setEventSheetOpen] = useState(false);

  // Handle event selection and update URL
  const handleEventSelect = (event: typeof selectedEvent) => {
    setSelectedEvent(event);
    navigate(`/trade?event=${event.id}`, { replace: true });
    setEventSheetOpen(false);
    setSearchQuery("");
  };

  // Generate order book data based on selected option's price
  const orderBookData = useMemo(() => {
    const basePrice = parseFloat(selectedOptionData.price);
    return generateOrderBookData(basePrice);
  }, [selectedOptionData.price]);

  // Generate trades history data
  const tradesHistory = useMemo(() => {
    const basePrice = parseFloat(selectedOptionData.price);
    return generateTradesHistory(basePrice);
  }, [selectedOptionData.price]);

  // Calculate price change (mock data)
  const priceChange = useMemo(() => {
    const change = (Math.random() * 0.02 - 0.01).toFixed(4);
    const percentage = ((parseFloat(change) / parseFloat(selectedOptionData.price)) * 100).toFixed(2);
    const isPositive = parseFloat(change) >= 0;
    return { change, percentage, isPositive };
  }, [selectedOptionData.price]);

  return (
    <div className="min-h-screen bg-background pb-40">
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
              if (tab === "Trade") navigate(`/trade/order?event=${selectedEvent.id}`);
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

      {/* Price + Stats Row - Horizontal Layout */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-border/20">
        {/* Left: Price Display */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight">{selectedOptionData.price}</span>
            <span className={`text-sm font-mono ${priceChange.isPositive ? "text-trading-green" : "text-trading-red"}`}>
              ({priceChange.isPositive ? "+" : ""}{priceChange.percentage}%)
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-0.5">
            Mark Price {selectedOptionData.price}
          </div>
        </div>

        {/* Right: Stats - Vertical Layout */}
        <div className="flex flex-col gap-1">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-right justify-end">
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              <span className={`font-mono text-xs font-semibold ${
                stat.isPositive ? "text-trading-green" : "text-foreground"
              }`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Candlestick Chart */}
      <div className="h-[450px]">
        <CandlestickChart basePrice={parseFloat(selectedOptionData.price)} />
      </div>

      {/* Bottom Tabs */}
      <div className="flex px-4 mt-2 border-b border-border/30">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setBottomTab(tab)}
            className={`py-3 mr-4 text-sm font-medium whitespace-nowrap transition-all ${
              bottomTab === tab
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {bottomTab === "Order Book" && (
        <OrderBook 
          asks={orderBookData.asks} 
          bids={orderBookData.bids} 
          currentPrice={selectedOptionData.price} 
        />
      )}

      {bottomTab === "Trades history" && (
        <div className="px-4">
          {/* Header */}
          <div className="grid grid-cols-3 text-xs text-muted-foreground py-2">
            <span>Price (USDT)</span>
            <span className="text-center">Amount</span>
            <span className="text-right">Time</span>
          </div>
          {/* Trades List */}
          <div className="space-y-0">
            {tradesHistory.map((trade, index) => (
              <div key={index} className="grid grid-cols-3 text-xs py-1.5">
                <span className={`font-mono ${trade.isBuy ? "text-trading-green" : "text-trading-red"}`}>
                  {trade.price}
                </span>
                <span className="text-center text-muted-foreground font-mono">{trade.amount}</span>
                <span className="text-right text-muted-foreground font-mono">{trade.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {bottomTab === "Orders" && (
        <div className="px-4 py-3 space-y-3">
          {orders.map((order, index) => (
            <OrderCard key={index} {...order} />
          ))}
        </div>
      )}

      {bottomTab === "Positions" && (
        <div className="px-4 py-3 space-y-3">
          {positions.map((position, index) => (
            <PositionCard key={index} {...position} />
          ))}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 px-4 py-3">
        <div className="text-center text-xs text-muted-foreground mb-2">
          Available 2,453.42 USDC
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/trade/order?event=${selectedEvent.id}`)}
            className="flex-1 bg-trading-green text-trading-green-foreground font-semibold rounded-lg py-2.5 text-sm transition-all active:scale-[0.98]"
          >
            Buy | Long
          </button>
          <button
            onClick={() => navigate(`/trade/order?event=${selectedEvent.id}`)}
            className="flex-1 bg-trading-red text-foreground font-semibold rounded-lg py-2.5 text-sm transition-all active:scale-[0.98]"
          >
            Sell | Short
          </button>
        </div>
      </div>
    </div>
  );
}
