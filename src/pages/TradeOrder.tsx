import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { OptionChips } from "@/components/OptionChips";
import { TradeForm } from "@/components/TradeForm";
import { OrderCard } from "@/components/OrderCard";

const options = [
  { id: "1", label: "50+ bps decrease", price: "0.0234" },
  { id: "2", label: "25 bps decrease", price: "0.7234" },
];

const orderBookData = {
  asks: [
    { price: "0.7473", amount: "843" },
    { price: "0.7474", amount: "743" },
    { price: "0.7472", amount: "7476" },
    { price: "0.7477", amount: "775" },
    { price: "0.7479", amount: "2332" },
    { price: "0.747", amount: "23325" },
    { price: "0.746", amount: "54" },
    { price: "0.7475", amount: "45656" },
    { price: "0.7476", amount: "6776" },
    { price: "0.7478", amount: "76" },
  ],
  bids: [
    { price: "0.7543", amount: "4543" },
    { price: "0.75435", amount: "767" },
    { price: "0.7546", amount: "7878" },
    { price: "0.75436", amount: "7967" },
    { price: "0.75437", amount: "67565" },
    { price: "0.75438", amount: "67" },
    { price: "0.75439", amount: "568" },
    { price: "0.75430", amount: "56775" },
    { price: "0.75431", amount: "56778" },
    { price: "0.754", amount: "877656" },
  ],
};

const mockOrders = [
  {
    type: "buy" as const,
    orderType: "Limit" as const,
    event: "Fed decision in December?",
    option: "25 bps decrease",
    probability: "72%",
    price: "$0.7234",
    amount: "1,500",
    total: "$1,085",
    time: "2 mins ago",
    status: "Pending" as const,
  },
  {
    type: "sell" as const,
    orderType: "Market" as const,
    event: "Fed decision in December?",
    option: "No change",
    probability: "18%",
    price: "Market",
    amount: "2,300",
    total: "$412",
    time: "5 mins ago",
    status: "Partially Filled" as const,
  },
];

export default function TradeOrder() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("2");
  const [activeTab, setActiveTab] = useState("Trade");
  const [bottomTab, setBottomTab] = useState("Orders");

  return (
    <div className="min-h-screen bg-background pb-24">
      <MobileHeader
        title="Fed decision in December?"
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
      <div className="flex border-b border-border/30">
        {["Charts", "Trade"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Charts") navigate("/trade");
            }}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              activeTab === tab
                ? "text-trading-purple border-b-2 border-trading-purple"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Left: Trade Form + Price Info */}
        <div className="flex-1">
          {/* Price Header */}
          <div className="px-4 py-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="text-2xl font-bold font-mono">0.7234</div>
                <div className="text-xs text-muted-foreground">
                  Funding: -0.0001% / Next: in 28min
                </div>
              </div>
              <button className="flex items-center gap-1 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                Event Info
              </button>
            </div>
          </div>

          {/* Trade Form */}
          <TradeForm />
        </div>

        {/* Right: Order Book */}
        <div className="border-t lg:border-t-0 lg:border-l border-border/30 lg:w-[180px]">
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {/* Asks */}
            <div className="divide-y divide-border/10">
              {orderBookData.asks.map((ask, index) => (
                <div
                  key={`ask-${index}`}
                  className="flex justify-between px-3 py-1 text-xs"
                >
                  <span className="price-red">{ask.price}</span>
                  <span className="text-muted-foreground font-mono">{ask.amount}</span>
                </div>
              ))}
            </div>

            {/* Current Price */}
            <div className="px-3 py-2 bg-muted/20 text-center">
              <span className="text-lg font-bold font-mono">0.7531</span>
            </div>

            {/* Bids */}
            <div className="divide-y divide-border/10">
              {orderBookData.bids.map((bid, index) => (
                <div
                  key={`bid-${index}`}
                  className="flex justify-between px-3 py-1 text-xs"
                >
                  <span className="price-green">{bid.price}</span>
                  <span className="text-muted-foreground font-mono">{bid.amount}</span>
                </div>
              ))}
            </div>

            {/* Depth Selector */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-border/30">
              <span className="text-xs text-muted-foreground">Depth</span>
              <button className="flex items-center gap-1 text-xs">
                0.1
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders/Positions Tabs */}
      <div className="flex border-b border-border/30 px-4 mt-4">
        {["Orders", "Positions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setBottomTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-all ${
              bottomTab === tab
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-4">
        {mockOrders.map((order, index) => (
          <OrderCard key={index} {...order} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
