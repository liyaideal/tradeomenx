import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { OptionChips } from "@/components/OptionChips";
import { TradeForm } from "@/components/TradeForm";
import { OrderCard } from "@/components/OrderCard";
import { PositionCard } from "@/components/PositionCard";
import { useOrdersStore } from "@/stores/useOrdersStore";

const options = [
  { id: "1", label: "140-159", price: "0.0534" },
  { id: "2", label: "160-179", price: "0.1234" },
  { id: "3", label: "200-219", price: "0.3456" },
  { id: "4", label: "220-239", price: "0.2834" },
  { id: "5", label: "240-259", price: "0.1942" },
];

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

export default function TradeOrder() {
  const navigate = useNavigate();
  const { orders } = useOrdersStore();
  const [selectedOption, setSelectedOption] = useState("2");
  const [activeTab, setActiveTab] = useState("Trade");
  const [bottomTab, setBottomTab] = useState("Orders");

  // Get selected option data
  const selectedOptionData = useMemo(() => {
    return options.find(opt => opt.id === selectedOption) || options[1];
  }, [selectedOption]);

  // Generate order book data based on selected option's price
  const orderBookData = useMemo(() => {
    const basePrice = parseFloat(selectedOptionData.price);
    return generateOrderBookData(basePrice);
  }, [selectedOptionData.price]);

  return (
    <div className="min-h-screen bg-background pb-8 overflow-x-hidden">
      <MobileHeader
        title="Elon Musk # tweets December 12 - December 19, 2025?"
        subtitle="23:47:15"
        showActions
        tweetCount={254}
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
              if (tab === "Charts") navigate("/trade");
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
            eventName="Elon Musk # tweets December 12 - December 19, 2025?"
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
        {bottomTab === "Positions" && mockPositions.map((position, index) => (
          <PositionCard key={index} {...position} />
        ))}
      </div>
    </div>
  );
}
