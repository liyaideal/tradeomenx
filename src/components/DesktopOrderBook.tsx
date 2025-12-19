import { useState } from "react";
import { ChevronDown, Flag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OrderBookEntry {
  price: string;
  amount: string;
  total?: string;
}

interface RecentTrade {
  price: string;
  amount: string;
  time: string;
  side: "buy" | "sell";
}

interface DesktopOrderBookProps {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  currentPrice: string;
  priceChange?: string;
  isPositive?: boolean;
}

// Generate mock recent trades
const generateMockTrades = (basePrice: number): RecentTrade[] => {
  const trades: RecentTrade[] = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const price = (basePrice + (Math.random() - 0.5) * 0.01).toFixed(4);
    const amount = (Math.random() * 5000 + 100).toFixed(0);
    const time = new Date(now.getTime() - i * 15000);
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
    
    trades.push({
      price,
      amount: parseInt(amount).toLocaleString(),
      time: timeStr,
      side: Math.random() > 0.5 ? "buy" : "sell"
    });
  }
  
  return trades;
};

export const DesktopOrderBook = ({ 
  asks, 
  bids, 
  currentPrice, 
  priceChange = "88,132.18",
  isPositive = false 
}: DesktopOrderBookProps) => {
  const [activeTab, setActiveTab] = useState<"orderbook" | "trades">("orderbook");
  const [viewMode, setViewMode] = useState<"both" | "bids" | "asks">("both");
  const recentTrades = generateMockTrades(parseFloat(currentPrice));

  // Extended data for single-view modes
  const extendedBids = [...bids, ...bids.slice(0, 8)];
  const extendedAsks = [...asks, ...asks.slice(0, 8)];

  return (
    <div className="flex flex-col h-full bg-background border-l border-border/30">
      {/* Header Tabs */}
      <div className="flex items-center px-3 py-2 border-b border-border/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("orderbook")}
            className={`text-sm font-medium transition-all ${
              activeTab === "orderbook" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveTab("trades")}
            className={`text-sm font-medium transition-all ${
              activeTab === "trades" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent Trades
          </button>
        </div>
      </div>

      {activeTab === "orderbook" ? (
        <>
          {/* View Toggle & Depth */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              {/* View mode icons */}
              <button 
                onClick={() => setViewMode("both")}
                className={`w-5 h-5 flex items-center justify-center ${viewMode === "both" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="w-3 h-0.5 bg-trading-red" />
                  <div className="w-3 h-0.5 bg-trading-red" />
                  <div className="w-3 h-0.5 bg-trading-green" />
                  <div className="w-3 h-0.5 bg-trading-green" />
                </div>
              </button>
              <button 
                onClick={() => setViewMode("bids")}
                className={`w-5 h-5 flex items-center justify-center ${viewMode === "bids" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="w-3 h-0.5 bg-trading-green" />
                  <div className="w-3 h-0.5 bg-trading-green" />
                  <div className="w-3 h-0.5 bg-trading-green" />
                </div>
              </button>
              <button 
                onClick={() => setViewMode("asks")}
                className={`w-5 h-5 flex items-center justify-center ${viewMode === "asks" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="w-3 h-0.5 bg-trading-red" />
                  <div className="w-3 h-0.5 bg-trading-red" />
                  <div className="w-3 h-0.5 bg-trading-red" />
                </div>
              </button>
            </div>
            <button className="flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded">
              0.1
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-3 text-xs text-muted-foreground px-3 py-1">
            <span>Price(USDT)</span>
            <span className="text-right">Qty(BTC)</span>
            <span className="text-right">Total(BTC)</span>
          </div>

          {viewMode === "both" && (
            <>
              {/* Asks (Sell orders) - reversed to show lowest ask at bottom */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {[...asks].reverse().map((ask, index) => {
                  const maxTotal = Math.max(...asks.map(a => parseFloat(a.total || a.amount)));
                  const total = parseFloat(ask.total || ask.amount);
                  const widthPercent = (total / maxTotal) * 100;
                  
                  return (
                    <div
                      key={`ask-${index}`}
                      className="relative grid grid-cols-3 text-xs px-3 py-0.5 hover:bg-muted/30 cursor-pointer"
                    >
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-trading-red/10"
                        style={{ width: `${widthPercent}%` }}
                      />
                      <span className="relative price-red">{ask.price}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{ask.amount}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{ask.total || ask.amount}</span>
                    </div>
                  );
                })}
              </div>

              {/* Current Price */}
              <div className="px-3 py-2 border-y border-border/30">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold font-mono ${isPositive ? 'text-trading-green' : 'text-trading-red'}`}>
                    {isPositive ? '↑' : '↓'} {currentPrice}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-trading-yellow font-mono flex items-center gap-1 cursor-help border-b border-dashed border-trading-yellow">
                          <Flag className="w-3 h-3" /> {currentPrice}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3">
                        <p className="text-sm">Mark price is derived by index price and funding rate, and reflects the fair market price. Liquidation is triggered by mark price.</p>
                        <p className="text-sm text-trading-yellow mt-2 cursor-pointer">Click here for details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Bids (Buy orders) */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {bids.map((bid, index) => {
                  const maxTotal = Math.max(...bids.map(b => parseFloat(b.total || b.amount)));
                  const total = parseFloat(bid.total || bid.amount);
                  const widthPercent = (total / maxTotal) * 100;
                  
                  return (
                    <div
                      key={`bid-${index}`}
                      className="relative grid grid-cols-3 text-xs px-3 py-0.5 hover:bg-muted/30 cursor-pointer"
                    >
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-trading-green/10"
                        style={{ width: `${widthPercent}%` }}
                      />
                      <span className="relative price-green">{bid.price}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{bid.amount}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{bid.total || bid.amount}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === "bids" && (
            <>
              {/* Bids Only View */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {extendedBids.map((bid, index) => {
                  const maxTotal = Math.max(...extendedBids.map(b => parseFloat(b.total || b.amount)));
                  const total = parseFloat(bid.total || bid.amount);
                  const widthPercent = (total / maxTotal) * 100;
                  
                  return (
                    <div
                      key={`bid-${index}`}
                      className="relative grid grid-cols-3 text-xs px-3 py-0.5 hover:bg-muted/30 cursor-pointer"
                    >
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-trading-green/10"
                        style={{ width: `${widthPercent}%` }}
                      />
                      <span className="relative price-green">{bid.price}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{bid.amount}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{bid.total || bid.amount}</span>
                    </div>
                  );
                })}
              </div>

              {/* Current Price */}
              <div className="px-3 py-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono text-trading-green">
                    ↑ {currentPrice}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-trading-yellow font-mono flex items-center gap-1 cursor-help border-b border-dashed border-trading-yellow">
                          <Flag className="w-3 h-3" /> {currentPrice}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3">
                        <p className="text-sm">Mark price is derived by index price and funding rate, and reflects the fair market price. Liquidation is triggered by mark price.</p>
                        <p className="text-sm text-trading-yellow mt-2 cursor-pointer">Click here for details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </>
          )}

          {viewMode === "asks" && (
            <>
              {/* Asks Only View */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {extendedAsks.map((ask, index) => {
                  const maxTotal = Math.max(...extendedAsks.map(a => parseFloat(a.total || a.amount)));
                  const total = parseFloat(ask.total || ask.amount);
                  const widthPercent = (total / maxTotal) * 100;
                  
                  return (
                    <div
                      key={`ask-${index}`}
                      className="relative grid grid-cols-3 text-xs px-3 py-0.5 hover:bg-muted/30 cursor-pointer"
                    >
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-trading-red/10"
                        style={{ width: `${widthPercent}%` }}
                      />
                      <span className="relative price-red">{ask.price}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{ask.amount}</span>
                      <span className="relative text-right text-muted-foreground font-mono">{ask.total || ask.amount}</span>
                    </div>
                  );
                })}
              </div>

              {/* Current Price */}
              <div className="px-3 py-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono text-trading-red">
                    ↓ {currentPrice}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-trading-yellow font-mono flex items-center gap-1 cursor-help border-b border-dashed border-trading-yellow">
                          <Flag className="w-3 h-3" /> {currentPrice}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3">
                        <p className="text-sm">Mark price is derived by index price and funding rate, and reflects the fair market price. Liquidation is triggered by mark price.</p>
                        <p className="text-sm text-trading-yellow mt-2 cursor-pointer">Click here for details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </>
          )}

          {/* Buy/Sell Ratio */}
          <div className="px-3 py-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs px-1 border border-trading-green text-trading-green">B</span>
                <span className="text-xs text-trading-green font-medium">{viewMode === "bids" ? "94%" : viewMode === "asks" ? "60%" : "40%"}</span>
              </div>
              <div className="flex-1 h-1.5 bg-muted rounded overflow-hidden flex">
                <div className="bg-trading-green" style={{ width: viewMode === "bids" ? '94%' : viewMode === "asks" ? '60%' : '40%' }} />
                <div className="bg-trading-red" style={{ width: viewMode === "bids" ? '6%' : viewMode === "asks" ? '40%' : '60%' }} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-trading-red font-medium">{viewMode === "bids" ? "6%" : viewMode === "asks" ? "40%" : "60%"}</span>
                <span className="text-xs px-1 border border-trading-red text-trading-red">S</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Recent Trades Column Headers */}
          <div className="grid grid-cols-3 text-xs text-muted-foreground px-3 py-2">
            <span>Price(USDT)</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Time</span>
          </div>

          {/* Recent Trades List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {recentTrades.map((trade, index) => (
              <div
                key={`trade-${index}`}
                className="grid grid-cols-3 text-xs px-3 py-1 hover:bg-muted/30 cursor-pointer"
              >
                <span className={trade.side === "buy" ? "price-green" : "price-red"}>
                  {trade.price}
                </span>
                <span className="text-right text-muted-foreground font-mono">{trade.amount}</span>
                <span className="text-right text-muted-foreground font-mono">{trade.time}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
