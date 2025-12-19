import { useState, useMemo } from "react";
import { CandlestickChart } from "@/components/CandlestickChart";
import { DesktopHeader } from "@/components/DesktopHeader";
import { DesktopOrderBook } from "@/components/DesktopOrderBook";
import { DesktopTradeForm } from "@/components/DesktopTradeForm";
import { DesktopPositionsPanel } from "@/components/DesktopPositionsPanel";

// Generate order book data based on base price
const generateOrderBookData = (basePrice: number) => {
  const asks = [];
  const bids = [];
  
  let cumulativeAsk = 0;
  let cumulativeBid = 0;
  
  for (let i = 0; i < 15; i++) {
    const askPrice = (basePrice * 1000 + (i + 1) * 0.1).toFixed(2);
    const bidPrice = (basePrice * 1000 - (i + 1) * 0.1).toFixed(2);
    const askAmount = (Math.random() * 0.5 + 0.001).toFixed(3);
    const bidAmount = (Math.random() * 0.5 + 0.001).toFixed(3);
    
    cumulativeAsk += parseFloat(askAmount);
    cumulativeBid += parseFloat(bidAmount);
    
    asks.push({ 
      price: parseFloat(askPrice).toLocaleString(), 
      amount: askAmount,
      total: cumulativeAsk.toFixed(3)
    });
    bids.push({ 
      price: parseFloat(bidPrice).toLocaleString(), 
      amount: bidAmount,
      total: cumulativeBid.toFixed(3)
    });
  }
  
  return { asks, bids };
};

export default function DesktopTrading() {
  const [selectedSymbol] = useState("BTCUSDT");
  const basePrice = 88.131;
  
  const orderBookData = useMemo(() => {
    return generateOrderBookData(basePrice);
  }, [basePrice]);

  const currentPrice = "88,131.30";

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Header with Stats */}
      <DesktopHeader 
        symbol={selectedSymbol}
        price={currentPrice}
        markPrice="88,132.18"
        indexPrice="88,155.51"
        change24h="+1,065.30"
        changePercent="+1.22%"
        high24h="89,483.50"
        low24h="84,408.10"
        volume24h="11,641,546,452.24"
        openInterest="48,516.803"
        fundingRate="0.0100%"
        countdown="06:26:01"
        isPositive={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools (optional, just placeholder) */}
        <div className="w-10 flex-shrink-0 bg-background border-r border-border/30 flex flex-col items-center py-2 gap-2">
          {[...Array(12)].map((_, i) => (
            <button 
              key={i}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded"
            >
              <div className="w-4 h-4 border border-current rounded-sm" />
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart Tabs */}
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/30">
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-foreground">Chart</button>
              <button className="text-sm text-muted-foreground hover:text-foreground">Overview</button>
              <button className="text-sm text-muted-foreground hover:text-foreground">Data</button>
              <button className="text-sm text-muted-foreground hover:text-foreground">Feed</button>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Standard</span>
              <span className="text-trading-yellow">TradingView</span>
              <span>Depth</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 px-4 py-2 overflow-hidden">
            <CandlestickChart remainingDays={7} basePrice={basePrice} />
          </div>
        </div>

        {/* Order Book */}
        <div className="w-[280px] flex-shrink-0">
          <DesktopOrderBook 
            asks={orderBookData.asks}
            bids={orderBookData.bids}
            currentPrice={currentPrice}
            priceChange="88,132.18"
            isPositive={false}
          />
        </div>

        {/* Trade Form */}
        <div className="w-[260px] flex-shrink-0">
          <DesktopTradeForm 
            selectedPrice={currentPrice}
            symbol="BTC"
          />
        </div>
      </div>

      {/* Bottom Positions Panel */}
      <DesktopPositionsPanel />
    </div>
  );
}
