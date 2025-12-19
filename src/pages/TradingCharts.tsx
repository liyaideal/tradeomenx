import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Copy } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { OptionChips } from "@/components/OptionChips";
import { CandlestickChart } from "@/components/CandlestickChart";
import { OrderBook } from "@/components/OrderBook";

const options = [
  { id: "1", label: "140-159", price: "0.0534" },
  { id: "2", label: "160-179", price: "0.1234" },
  { id: "3", label: "200-219", price: "0.3456" },
  { id: "4", label: "220-239", price: "0.2834" },
  { id: "5", label: "240-259", price: "0.1942" },
];

const stats = [
  { label: "24h Volume", value: "$2.45M" },
  { label: "Funding Rate", value: "+0.05%", isPositive: true },
];

const asks = [
  { price: "0.7456", amount: "2,150", total: "1,603" },
  { price: "0.7445", amount: "1,890", total: "1,407" },
  { price: "0.7432", amount: "3,200", total: "2,378" },
  { price: "0.7445", amount: "1,890", total: "1,407" },
  { price: "0.7432", amount: "3,200", total: "2,378" },
  { price: "0.7456", amount: "2,150", total: "1,603" },
  { price: "0.7445", amount: "1,890", total: "1,407" },
  { price: "0.7432", amount: "3,200", total: "2,378" },
];

const bids = [
  { price: "0.7230", amount: "1,450", total: "1,048" },
  { price: "0.7224", amount: "2,180", total: "1,575" },
  { price: "0.7210", amount: "1,750", total: "1,262" },
  { price: "0.7230", amount: "1,450", total: "1,048" },
  { price: "0.7224", amount: "2,180", total: "1,575" },
  { price: "0.7210", amount: "1,750", total: "1,262" },
  { price: "0.7224", amount: "2,180", total: "1,575" },
  { price: "0.7210", amount: "1,750", total: "1,262" },
];

const tabs = ["Order Book", "Trades history", "Orders", "Positions"];

export default function TradingCharts() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("2");
  const [activeTab, setActiveTab] = useState("Charts");
  const [bottomTab, setBottomTab] = useState("Order Book");

  return (
    <div className="min-h-screen bg-background pb-40">
      <MobileHeader 
        title="Elon Musk # tweets December 12 - December 19, 2025?" 
        subtitle="23:47:15"
        showActions 
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
        {/* Left: Price Display */}
        <div>
          <div className="text-3xl font-bold font-mono tracking-tight">0.7234</div>
          <div className="text-sm text-trading-green font-mono">
            +$0.0234 (+3.34%)
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
      <CandlestickChart />

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

      {/* Order Book */}
      <OrderBook asks={asks} bids={bids} currentPrice="0.7234" />

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