import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { OptionChips } from "@/components/OptionChips";
import { CandlestickChart } from "@/components/CandlestickChart";
import { OrderBook } from "@/components/OrderBook";
import { OrderCard } from "@/components/OrderCard";
import { PositionCard } from "@/components/PositionCard";

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

const mockOrders = [
  {
    type: "buy" as const,
    orderType: "Limit" as const,
    event: "Elon Musk # tweets December 12 - December 19, 2025?",
    option: "200-219",
    probability: "35%",
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
    probability: "12%",
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

const tabs = ["Order Book", "Trades history", "Orders", "Positions"];

export default function TradingCharts() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("2");
  const [activeTab, setActiveTab] = useState("Charts");
  const [bottomTab, setBottomTab] = useState("Order Book");

  // Get selected option data
  const selectedOptionData = useMemo(() => {
    return options.find(opt => opt.id === selectedOption) || options[1];
  }, [selectedOption]);

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

  // Set end time to December 19, 2025 23:59:59
  const endTime = new Date("2025-12-19T23:59:59");

  return (
    <div className="min-h-screen bg-background pb-40">
      <MobileHeader 
        title="Elon Musk # tweets December 12 - December 19, 2025?" 
        endTime={endTime}
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
      <div className="flex px-4 border-b border-border/30 mt-1">
        {["Charts", "Trade"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Trade") navigate("/trade/order");
            }}
            className={`py-3 mr-6 text-sm font-medium transition-all ${
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
          <div className="text-3xl font-bold font-mono tracking-tight">{selectedOptionData.price}</div>
          <div className={`text-sm font-mono ${priceChange.isPositive ? "text-trading-green" : "text-trading-red"}`}>
            {priceChange.isPositive ? "+" : ""}{priceChange.change} ({priceChange.isPositive ? "+" : ""}{priceChange.percentage}%)
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
      <CandlestickChart basePrice={parseFloat(selectedOptionData.price)} />

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
          {mockOrders.map((order, index) => (
            <OrderCard key={index} {...order} />
          ))}
        </div>
      )}

      {bottomTab === "Positions" && (
        <div className="px-4 py-3 space-y-3">
          {mockPositions.map((position, index) => (
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
            onClick={() => navigate("/trade/order")}
            className="flex-1 bg-trading-green text-trading-green-foreground font-semibold rounded-lg py-2.5 text-sm transition-all active:scale-[0.98]"
          >
            Buy | Long
          </button>
          <button
            onClick={() => navigate("/trade/order")}
            className="flex-1 bg-trading-red text-foreground font-semibold rounded-lg py-2.5 text-sm transition-all active:scale-[0.98]"
          >
            Sell | Short
          </button>
        </div>
      </div>
    </div>
  );
}
