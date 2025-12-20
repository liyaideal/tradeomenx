import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, ArrowLeftRight, Star, Info, Flag, Search, ExternalLink, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CandlestickChart } from "@/components/CandlestickChart";
import { DesktopOrderBook } from "@/components/DesktopOrderBook";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

// Mock active events data
const activeEvents = [
  { id: "1", name: "Elon Musk # tweets December 12 - December 19, 2025?", icon: "🐦", ends: "Dec 25, 2025", endTime: new Date("2025-12-25T23:59:59"), volume: "$2.45M", tweetCount: 156 },
  { id: "2", name: "Bitcoin price on December 31, 2025?", icon: "₿", ends: "Dec 31, 2025", endTime: new Date("2025-12-31T23:59:59"), volume: "$5.12M" },
  { id: "3", name: "ETH/BTC ratio end of Q4 2025?", icon: "⟠", ends: "Dec 31, 2025", endTime: new Date("2025-12-31T23:59:59"), volume: "$1.89M" },
  { id: "4", name: "Fed interest rate decision January 2026?", icon: "🏦", ends: "Jan 29, 2026", endTime: new Date("2026-01-29T23:59:59"), volume: "$3.21M" },
  { id: "5", name: "S&P 500 closing price December 2025?", icon: "📈", ends: "Dec 31, 2025", endTime: new Date("2025-12-31T23:59:59"), volume: "$4.56M" },
];

// Countdown hook
const useCountdown = (endTime: Date | undefined) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference <= 0) {
        return "00:00:00";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

const options = [
  { id: "1", label: "140-159", price: "0.0534" },
  { id: "2", label: "160-179", price: "0.1234" },
  { id: "3", label: "200-219", price: "0.3456" },
  { id: "4", label: "220-239", price: "0.2834" },
  { id: "5", label: "240-259", price: "0.1942" },
];

const generateOrderBookData = (basePrice: number) => {
  const asks = [];
  const bids = [];
  
  let cumulativeAsk = 0;
  let cumulativeBid = 0;
  
  for (let i = 0; i < 12; i++) {
    const askPrice = (basePrice + 0.0005 * (i + 1)).toFixed(4);
    const bidPrice = (basePrice - 0.0005 * (i + 1)).toFixed(4);
    const askAmount = Math.floor(Math.random() * 50000 + 500).toString();
    const bidAmount = Math.floor(Math.random() * 50000 + 500).toString();
    
    cumulativeAsk += parseInt(askAmount);
    cumulativeBid += parseInt(bidAmount);
    
    asks.push({ 
      price: askPrice, 
      amount: parseInt(askAmount).toLocaleString(),
      total: cumulativeAsk.toLocaleString()
    });
    bids.push({ 
      price: bidPrice, 
      amount: parseInt(bidAmount).toLocaleString(),
      total: cumulativeBid.toLocaleString()
    });
  }
  
  return { asks, bids };
};

const mockOrders = [
  {
    type: "buy" as const,
    orderType: "Limit" as const,
    event: "Elon Musk # tweets December 12 - December 19, 2025?",
    option: "200-219",
    price: "$0.3456",
    amount: "1,500",
    total: "$518",
    time: "2 mins ago",
    status: "Pending" as const,
  },
  {
    type: "sell" as const,
    orderType: "Limit" as const,
    event: "Elon Musk # tweets December 12 - December 19, 2025?",
    option: "160-179",
    price: "$0.1150",
    amount: "2,300",
    total: "$265",
    time: "5 mins ago",
    status: "Pending" as const,
  },
];

const mockPositions = [
  {
    type: "long" as const,
    event: "Elon Musk # tweets December 12 - December 19, 2025?",
    option: "200-219",
    entryPrice: "$0.3200",
    markPrice: "$0.3456",
    size: "2,500",
    margin: "$80.00",
    pnl: "+$64.00",
    pnlPercent: "+8.0%",
    leverage: "10x",
  },
  {
    type: "short" as const,
    event: "Elon Musk # tweets December 12 - December 19, 2025?",
    option: "140-159",
    entryPrice: "$0.0600",
    markPrice: "$0.0534",
    size: "5,000",
    margin: "$30.00",
    pnl: "+$33.00",
    pnlPercent: "+11.0%",
    leverage: "10x",
  },
];

export default function DesktopTrading() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("2");
  const [bottomTab, setBottomTab] = useState<"Orders" | "Positions">("Orders");
  const [chartTab, setChartTab] = useState<"Chart" | "Event Info">("Chart");
  
  // Trade form state
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [marginType, setMarginType] = useState<"Cross" | "Isolated">("Cross");
  const [marginDropdownOpen, setMarginDropdownOpen] = useState(false);
  const [leverage, setLeverage] = useState(10);
  const [orderType, setOrderType] = useState<"Limit" | "Market">("Market");
  const [amount, setAmount] = useState("0.00");
  const [sliderValue, setSliderValue] = useState([0]);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpsl, setTpsl] = useState(false);
  const [inputMode, setInputMode] = useState<"amount" | "qty">("amount");
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(activeEvents[0]);
  const [orderPreviewOpen, setOrderPreviewOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const countdown = useCountdown(selectedEvent.endTime);

  const toggleFavorite = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
        toast.success("Removed from favorites");
      } else {
        newFavorites.add(eventId);
        toast.success("Added to favorites");
      }
      return newFavorites;
    });
  };
  const available = 2453.42;
  const feeRate = 0.0005; // 0.05% trading fee

  const selectedOptionData = useMemo(() => {
    return options.find(opt => opt.id === selectedOption) || options[1];
  }, [selectedOption]);
  
  const orderBookData = useMemo(() => {
    const basePrice = parseFloat(selectedOptionData.price);
    return generateOrderBookData(basePrice);
  }, [selectedOptionData.price]);

  const priceChange = useMemo(() => {
    const change = (Math.random() * 0.02 - 0.01).toFixed(4);
    const percentage = ((parseFloat(change) / parseFloat(selectedOptionData.price)) * 100).toFixed(2);
    const isPositive = parseFloat(change) >= 0;
    return { change, percentage, isPositive };
  }, [selectedOptionData.price]);

  // Calculate order values based on amount and leverage
  const orderCalculations = useMemo(() => {
    const amountValue = parseFloat(amount) || 0;
    const price = parseFloat(selectedOptionData.price);
    
    // Notional value = amount * leverage
    const notionalValue = amountValue * leverage;
    
    // Margin required = notional value / leverage = amount (same as input)
    const marginRequired = amountValue;
    
    // Estimated fee = notional value * fee rate
    const estimatedFee = notionalValue * feeRate;
    
    // Total = margin required + fee
    const total = marginRequired + estimatedFee;
    
    // Quantity = notional value / price
    const quantity = price > 0 ? notionalValue / price : 0;
    
    // Potential win = (1 - price) * quantity (if price goes to 1)
    const potentialWin = (1 - price) * quantity;
    
    // Estimated liquidation price
    const liqPrice = price > 0 ? (price * (1 - 1 / leverage * 0.9)).toFixed(4) : "0.0000";
    
    return {
      notionalValue: notionalValue.toFixed(2),
      marginRequired: marginRequired.toFixed(2),
      estimatedFee: estimatedFee.toFixed(2),
      total: total.toFixed(2),
      quantity: quantity.toFixed(0),
      potentialWin: potentialWin.toFixed(0),
      liqPrice,
    };
  }, [amount, leverage, selectedOptionData.price]);

  const orderDetails = useMemo(() => [
    { label: "Event", value: selectedEvent.name },
    { label: "Option", value: selectedOptionData.label },
    { label: "Side", value: side === "buy" ? "Buy | Long" : "Sell | Short", highlight: side === "buy" ? "green" : "red" as const },
    { label: "Margin type", value: marginType },
    { label: "Type", value: orderType },
    { label: "Order Price", value: `${selectedOptionData.price} USDC` },
    { label: "Order Cost", value: `${amount} USDC` },
    { label: "Notional value", value: `${orderCalculations.notionalValue} USDC` },
    { label: "Leverage", value: `${leverage}X` },
    { label: "Margin required", value: `${orderCalculations.marginRequired} USDC` },
    { label: "TP/SL", value: tpsl ? "Set" : "--" },
    { label: "Estimated Liq. Price", value: `${orderCalculations.liqPrice} USDC` },
  ], [selectedEvent, selectedOptionData, side, marginType, orderType, amount, leverage, tpsl, orderCalculations]);

  const handlePreview = () => {
    setOrderPreviewOpen(true);
  };

  const handleConfirmOrder = () => {
    setOrderPreviewOpen(false);
    toast.success("Order placed successfully!");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center gap-4 px-4 py-2 bg-background border-b border-border/30">
        <div className="flex items-center gap-3 flex-1 min-w-0 relative">
          {/* Event Dropdown Trigger */}
          <button 
            onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
            className="flex items-center gap-2 min-w-0 hover:bg-muted/30 rounded-lg p-1 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground truncate">
                  {selectedEvent.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${eventDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <span className="w-1.5 h-1.5 bg-trading-red rounded-full animate-pulse" />
                <span>Ends in</span>
                <span className="text-trading-red font-mono font-medium">{countdown}</span>
              </div>
            </div>
          </button>
          
          {/* Tweet Count Badge - Separate from dropdown trigger */}
          {selectedEvent.tweetCount !== undefined && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Current Tweets</span>
                  </div>
                  <span className="text-sm text-orange-500 font-mono font-bold">{selectedEvent.tweetCount}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tweet Count</span>
                    <span className="text-lg font-bold text-orange-500">{selectedEvent.tweetCount}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Period</span>
                      <span>Dec 12 - Dec 19, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last updated</span>
                      <span>Just now</span>
                    </div>
                  </div>
                  <a
                    href="https://x.com/elonmusk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on X (Twitter)
                  </a>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Event Dropdown */}
          {eventDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-background border border-border rounded-lg shadow-xl w-[500px]">
              {/* Search Input */}
              <div className="p-3 border-b border-border/30">
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={eventSearchQuery}
                    onChange={(e) => setEventSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <Star className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Events List Header */}
              <div className="grid grid-cols-3 text-xs text-muted-foreground px-4 py-2 border-b border-border/30">
                <span>Event</span>
                <span className="text-right">End Date</span>
                <span className="text-right">Volume</span>
              </div>

              {/* Events List */}
              <div className="max-h-[300px] overflow-y-auto">
                {activeEvents
                  .filter(event => event.name.toLowerCase().includes(eventSearchQuery.toLowerCase()))
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setEventDropdownOpen(false);
                        setEventSearchQuery("");
                      }}
                      className={`w-full grid grid-cols-3 items-center px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                        selectedEvent.id === event.id ? "bg-muted/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => toggleFavorite(event.id, e)}
                          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <Star 
                            className={`w-4 h-4 transition-colors ${
                              favorites.has(event.id) 
                                ? "text-trading-yellow fill-trading-yellow" 
                                : "text-muted-foreground hover:text-trading-yellow"
                            }`} 
                          />
                        </button>
                        <span className="text-sm font-medium truncate">{event.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-right">{event.ends}</span>
                      <span className="text-xs font-mono text-right">{event.volume}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <div className="text-muted-foreground">24h Volume</div>
            <div className="font-mono font-medium">$2.45M</div>
          </div>
          <div>
            <div className="text-muted-foreground">Funding Rate</div>
            <div className="font-mono font-medium text-trading-green">+0.05%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Next Funding</div>
            <div className="font-mono font-medium">28min</div>
          </div>
        </div>
        
        {/* Favorite Star - Far right */}
        <Star className="w-5 h-5 text-muted-foreground hover:text-trading-yellow cursor-pointer flex-shrink-0" />

      </header>

      {/* Option Chips Row */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 overflow-x-auto scrollbar-hide">
        <span className="text-xs text-muted-foreground flex-shrink-0">Select Option:</span>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedOption === option.id
                ? "bg-trading-purple/20 border border-trading-purple text-foreground"
                : "bg-muted border border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{option.label}</span>
            <span className={`ml-2 font-mono ${selectedOption === option.id ? "text-trading-purple" : ""}`}>
              ${option.price}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Section: Chart + Order Book + Positions */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top: Chart + Order Book (separate containers, tops aligned) */}
          <div className="flex min-h-[600px] gap-1 p-1">
            {/* Chart Area or Event Info - separate container */}
            <div className="flex-1 flex flex-col min-w-0 bg-background rounded border border-border/30">
              {/* Chart / Event Info Tabs */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-border/30">
                {(["Chart", "Event Info"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setChartTab(tab)}
                    className={`text-sm font-medium transition-all ${
                      chartTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {chartTab === "Chart" ? (
                <>
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-border/30">
                    <span className="text-2xl font-bold font-mono">{selectedOptionData.price}</span>
                    <span className={`text-sm font-mono ${priceChange.isPositive ? "text-trading-green" : "text-trading-red"}`}>
                      {priceChange.isPositive ? "+" : ""}{priceChange.percentage}%
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-trading-yellow font-mono flex items-center gap-1 cursor-help border-b border-dashed border-trading-yellow">
                            <Flag className="w-3 h-3" /> {selectedOptionData.price}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3">
                          <p className="text-sm">Mark price is derived by index price and funding rate, and reflects the fair market price. Liquidation is triggered by mark price.</p>
                          <p className="text-sm text-trading-yellow mt-2 cursor-pointer">Click here for details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex-1 min-h-0">
                    <CandlestickChart remainingDays={7} basePrice={parseFloat(selectedOptionData.price)} />
                  </div>
                </>
              ) : (
                <div className="flex-1 p-6 overflow-auto">
                  <div className="space-y-6">
                    {/* Event Header */}
                    <div>
                      <h2 className="text-xl font-bold">Elon Musk # tweets December 12 - December 19, 2025?</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Predict how many tweets Elon Musk will post during the specified period.
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Event End Date</div>
                        <div className="font-medium">Dec 19, 2025 23:59:59 UTC</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Current Tweet Count</div>
                        <div className="font-medium">254 tweets</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Total Volume</div>
                        <div className="font-medium">$2.45M</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">Open Interest</div>
                        <div className="font-medium">$1.2M</div>
                      </div>
                    </div>

                    {/* Resolution Source */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-xs text-muted-foreground mb-2">Resolution Source</div>
                      <p className="text-sm">
                        This market will be resolved based on the official tweet count from Elon Musk's verified X (Twitter) account (@elonmusk) as of the end date. Only original tweets count, excluding retweets and replies.
                      </p>
                    </div>

                    {/* Rules */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-xs text-muted-foreground mb-2">Market Rules</div>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-trading-purple">•</span>
                          <span>Counting period: December 12, 2025 00:00:00 UTC to December 19, 2025 23:59:59 UTC</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-trading-purple">•</span>
                          <span>Only original tweets from @elonmusk are counted</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-trading-purple">•</span>
                          <span>Deleted tweets that were posted during the period still count</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-trading-purple">•</span>
                          <span>Market settles within 24 hours after the end date</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Book - separate container */}
            <div className="w-[280px] flex-shrink-0 bg-background rounded border border-border/30">
              <DesktopOrderBook 
                asks={orderBookData.asks}
                bids={orderBookData.bids}
                currentPrice={selectedOptionData.price}
                priceChange={selectedOptionData.price}
                isPositive={priceChange.isPositive}
              />
            </div>
          </div>

          {/* Bottom: Positions Panel */}
          <div className="border-t border-border/30 flex-shrink-0">
            <div className="flex items-center gap-1 px-4 border-b border-border/30">
              {(["Positions", "Current Orders"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab === "Current Orders" ? "Orders" : "Positions")}
                  className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    (bottomTab === "Orders" && tab === "Current Orders") || 
                    (bottomTab === "Positions" && tab === "Positions")
                      ? "text-trading-purple border-b-2 border-trading-purple"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  <span className="ml-1 text-muted-foreground">
                    ({tab === "Current Orders" ? mockOrders.length : mockPositions.length})
                  </span>
                </button>
              ))}
            </div>

            <div>
              {bottomTab === "Orders" && (
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b border-border/30">
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Contracts</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Side</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Type</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Price</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Qty</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Value</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Status</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Time</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-6 text-center text-sm text-muted-foreground">No open orders</td>
                      </tr>
                    ) : (
                      mockOrders.map((order, index) => (
                        <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="px-4 py-2">
                            <div className="text-sm font-medium">{order.option}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[180px]">{order.event}</div>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${order.type === "buy" ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"}`}>
                              {order.type === "buy" ? "Buy" : "Sell"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{order.orderType}</td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{order.price}</td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{order.amount}</td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{order.total}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">{order.status}</span>
                          </td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">{order.time}</td>
                          <td className="px-4 py-2 text-center">
                            <button className="px-3 py-1 text-xs text-trading-red border border-trading-red/50 rounded hover:bg-trading-red/10">Cancel</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {bottomTab === "Positions" && (
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b border-border/30">
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Contracts</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Side</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Size</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Entry Price</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Mark Price</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Liq. Price</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Margin</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-right">Unrealized P&L</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-left">Leverage</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-center">TP/SL</th>
                      <th className="px-4 py-2 text-xs text-muted-foreground font-normal text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPositions.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-6 text-center text-sm text-muted-foreground">No open positions</td>
                      </tr>
                    ) : (
                      mockPositions.map((position, index) => (
                        <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="px-4 py-2">
                            <div className="text-sm font-medium">{position.option}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[180px]">{position.event}</div>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${position.type === "long" ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"}`}>
                              {position.type === "long" ? "Long" : "Short"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{position.size}</td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{position.entryPrice}</td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{position.markPrice}</td>
                          <td className="px-4 py-2 text-sm font-mono text-right text-muted-foreground">--</td>
                          <td className="px-4 py-2 text-sm font-mono text-right">{position.margin}</td>
                          <td className="px-4 py-2 text-right">
                            <span className={`text-sm font-mono ${position.pnl.startsWith("+") ? "text-trading-green" : "text-trading-red"}`}>{position.pnl}</span>
                            <span className={`text-xs ml-1 ${position.pnlPercent.startsWith("+") ? "text-trading-green" : "text-trading-red"}`}>({position.pnlPercent})</span>
                          </td>
                          <td className="px-4 py-2 text-sm">{position.leverage}</td>
                          <td className="px-4 py-2 text-center text-sm text-muted-foreground">--</td>
                          <td className="px-4 py-2 text-center">
                            <button className="px-3 py-1 text-xs text-foreground border border-border/50 rounded hover:bg-muted">Close</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Trade Form - separate container */}
        <div className="w-[280px] flex-shrink-0 flex flex-col m-1 bg-background rounded border border-border/30">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
            <span className="text-sm font-medium">Trade</span>
            <button className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Buy/Sell Toggle */}
            <div className="flex bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setSide("buy")}
                className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
                  side === "buy" ? "bg-trading-green text-trading-green-foreground" : "text-muted-foreground"
                }`}
              >
                Buy | Long
              </button>
              <button
                onClick={() => setSide("sell")}
                className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
                  side === "sell" ? "bg-trading-red text-foreground" : "text-muted-foreground"
                }`}
              >
                Sell | Short
              </button>
            </div>

            {/* Margin Mode */}
            <div className="flex items-center justify-between relative">
              <span className="text-xs text-muted-foreground">Margin Mode</span>
              <button 
                onClick={() => setMarginDropdownOpen(!marginDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded text-xs"
              >
                {marginType}
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {/* Margin Mode Dropdown */}
              {marginDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-background border border-border rounded-lg shadow-lg min-w-[140px]">
                  <button
                    onClick={() => {
                      setMarginType("Cross");
                      setMarginDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-muted transition-colors ${
                      marginType === "Cross" ? "text-trading-purple" : "text-foreground"
                    }`}
                  >
                    Cross
                  </button>
                  <div className="px-3 py-2 text-xs text-muted-foreground cursor-not-allowed flex items-center justify-between">
                    <span>Isolated</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded">Not Supported</span>
                  </div>
                </div>
              )}
            </div>

            {/* Leverage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Leverage</span>
                <span className="text-sm font-bold text-trading-purple">{leverage}x</span>
              </div>
              
              {/* Slider */}
              <Slider
                value={[leverage]}
                onValueChange={(value) => setLeverage(value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              
              {/* Quick Select Buttons */}
              <div className="flex gap-1.5">
                {[1, 5, 10, 20, 50].map((lev) => (
                  <button
                    key={lev}
                    onClick={() => setLeverage(lev)}
                    className={`flex-1 py-1 text-xs rounded transition-colors ${
                      leverage === lev 
                        ? "bg-trading-purple text-foreground" 
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lev}x
                  </button>
                ))}
              </div>
            </div>

            {/* Available Balance */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Available (USDC)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{available.toLocaleString()}</span>
                <button className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Order Type Tabs */}
            <div className="flex border-b border-border/30">
              {(["Limit", "Market"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`px-2 py-1.5 text-xs font-medium transition-all ${
                    orderType === type ? "text-foreground border-b-2 border-trading-purple" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Price Input (for Limit orders) */}
            {orderType === "Limit" && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Price</span>
                <div className="flex items-center bg-muted rounded-lg px-2.5 py-2">
                  <input
                    type="text"
                    defaultValue={selectedOptionData.price}
                    className="flex-1 bg-transparent outline-none font-mono text-sm"
                    placeholder="0.0000"
                  />
                  <span className="text-muted-foreground text-xs">USDC</span>
                </div>
              </div>
            )}

            {/* Amount/Qty Input */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{inputMode === "amount" ? "Amount" : "Qty"}</span>
                <button 
                  onClick={() => setInputMode(inputMode === "amount" ? "qty" : "amount")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center bg-muted rounded-lg px-2.5 py-2">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent outline-none font-mono text-sm"
                  placeholder="0.00"
                />
                {inputMode === "amount" && <span className="text-muted-foreground text-xs font-medium">USDC</span>}
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <Slider
                value={sliderValue}
                onValueChange={(val) => {
                  setSliderValue(val);
                  setAmount((available * val[0] / 100).toFixed(2));
                }}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                {["0%", "25%", "50%", "75%", "100%"].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${reduceOnly ? 'bg-trading-purple border-trading-purple' : 'border-muted-foreground'}`}>
                  {reduceOnly && <span className="text-[10px] text-foreground">✓</span>}
                </div>
                <input type="checkbox" checked={reduceOnly} onChange={(e) => setReduceOnly(e.target.checked)} className="hidden" />
                <span className="text-xs text-muted-foreground">Reduce only</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${tpsl ? 'bg-trading-purple border-trading-purple' : 'border-muted-foreground'}`}>
                  {tpsl && <span className="text-[10px] text-foreground">✓</span>}
                </div>
                <input type="checkbox" checked={tpsl} onChange={(e) => setTpsl(e.target.checked)} className="hidden" />
                <span className="text-xs text-muted-foreground">TP/SL</span>
              </label>
            </div>

            {/* Order Summary */}
            <div className="space-y-1 text-xs pt-2 border-t border-border/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notional val.</span>
                <span className={parseFloat(amount) > 0 ? "text-foreground font-mono" : "text-muted-foreground"}>
                  {parseFloat(amount) > 0 ? `${orderCalculations.notionalValue} USDC` : "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin req.</span>
                <span className={parseFloat(amount) > 0 ? "text-foreground font-mono" : "text-muted-foreground"}>
                  {parseFloat(amount) > 0 ? `${orderCalculations.marginRequired} USDC` : "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee (est.)</span>
                <span className={parseFloat(amount) > 0 ? "text-foreground font-mono" : "text-muted-foreground"}>
                  {parseFloat(amount) > 0 ? `${orderCalculations.estimatedFee} USDC` : "--"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/30">
                <span className="font-medium text-foreground">Total</span>
                <span className={parseFloat(amount) > 0 ? "text-foreground font-mono font-medium" : "text-muted-foreground"}>
                  {parseFloat(amount) > 0 ? `${orderCalculations.total} USDC` : "--"}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePreview}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
                side === "buy" ? "bg-trading-green text-trading-green-foreground" : "bg-trading-red text-foreground"
              }`}
            >
              {side === "buy" ? "Buy Long" : "Sell Short"} - to win $ {parseFloat(amount) > 0 ? parseInt(orderCalculations.potentialWin).toLocaleString() : "0"}
            </button>
          </div>
        </div>
      </div>

      {/* Order Preview Dialog */}
      <Dialog open={orderPreviewOpen} onOpenChange={setOrderPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Preview</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-0">
            {orderDetails.map((detail, index) => (
              <div
                key={detail.label}
                className={`flex justify-between py-3 ${
                  index !== orderDetails.length - 1 ? "border-b border-border/20" : ""
                }`}
              >
                <span className="text-muted-foreground text-sm">{detail.label}</span>
                <span
                  className={`font-medium text-sm ${
                    detail.highlight === "green"
                      ? "text-trading-green"
                      : detail.highlight === "red"
                      ? "text-trading-red"
                      : "text-foreground"
                  }`}
                >
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmOrder}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] mt-4 ${
              side === "buy" ? "bg-trading-green text-trading-green-foreground" : "bg-trading-red text-foreground"
            }`}
          >
            {side === "buy" ? "Buy Long" : "Sell Short"} - to win $ {parseFloat(amount) > 0 ? parseInt(orderCalculations.potentialWin).toLocaleString() : "0"}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
