import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MobileTradingLayout, TradingContextData } from "@/components/MobileTradingLayout";
import { CandlestickChart } from "@/components/CandlestickChart";
import { OrderBook } from "@/components/OrderBook";
import { OrderCard } from "@/components/OrderCard";
import { PositionCard } from "@/components/PositionCard";
import { usePositions } from "@/hooks/usePositions";
import { useOrders } from "@/hooks/useOrders";
import { useAnimatedOrderBook } from "@/hooks/useAnimatedOrderBook";
import { useAnimatedTradesHistory } from "@/hooks/useAnimatedTradesHistory";
import { tradingStats } from "@/lib/tradingUtils";
import { TRADING_TERMS } from "@/lib/tradingTerms";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";

const bottomTabs = ["Order Book", "Trades history", "Orders", "Positions"];

interface TradingChartsContentProps {
  selectedEvent: TradingContextData['selectedEvent'];
  selectedOptionData: TradingContextData['selectedOptionData'];
}

function TradingChartsContent({ selectedEvent, selectedOptionData }: TradingChartsContentProps) {
  const navigate = useNavigate();
  const { positions, isLoading: positionsLoading } = usePositions();
  // Use unified orders hook - Supabase for logged-in users, local for guests
  const { orders, isLoading: ordersLoading } = useOrders();
  const { profile } = useUserProfile();
  
  const [bottomTab, setBottomTab] = useState("Order Book");

  // Use animated order book with live updates
  const orderBookData = useAnimatedOrderBook({
    basePrice: parseFloat(selectedOptionData.price),
    depth: 8,
    updateInterval: 600,
    volatility: 0.25,
  });

  // Use animated trades history with live updates
  const { trades: tradesHistory, newTradeIndex } = useAnimatedTradesHistory({
    basePrice: parseFloat(selectedOptionData.price),
    initialCount: 20,
    newTradeInterval: 1200,
  });

  // Calculate price change (mock data)
  const priceChange = useMemo(() => {
    const change = (Math.random() * 0.02 - 0.01).toFixed(4);
    const percentage = ((parseFloat(change) / parseFloat(selectedOptionData.price)) * 100).toFixed(2);
    const isPositive = parseFloat(change) >= 0;
    return { change, percentage, isPositive };
  }, [selectedOptionData.price]);

  return (
    <div className="pb-40">
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
            {TRADING_TERMS.MARK_PRICE} {selectedOptionData.price}
          </div>
        </div>

        {/* Right: Stats - Vertical Layout */}
        <div className="flex flex-col gap-1">
          {tradingStats.map((stat) => (
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
        {bottomTabs.map((tab) => {
          const count = tab === "Orders" ? orders.length : tab === "Positions" ? positions.length : null;
          return (
            <button
              key={tab}
              onClick={() => setBottomTab(tab)}
              className={`py-3 mr-4 text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                bottomTab === tab
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
              {count !== null && count > 0 && (
                <span className="bg-primary/20 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
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
              <div 
                key={`${trade.time}-${index}`} 
                className={cn(
                  "grid grid-cols-3 text-xs py-1.5 transition-all duration-300",
                  index === newTradeIndex && (trade.isBuy 
                    ? "bg-trading-green/25 animate-fade-in" 
                    : "bg-trading-red/25 animate-fade-in"
                  )
                )}
              >
                <span className={cn(
                  "font-mono transition-all duration-200",
                  trade.isBuy ? "text-trading-green" : "text-trading-red",
                  index === newTradeIndex && "font-semibold"
                )}>
                  {trade.price}
                </span>
                <span className={cn(
                  "text-center font-mono transition-all duration-200",
                  index === newTradeIndex ? "text-foreground" : "text-muted-foreground"
                )}>
                  {trade.amount}
                </span>
                <span className={cn(
                  "text-right font-mono transition-all duration-200",
                  index === newTradeIndex ? "text-foreground" : "text-muted-foreground"
                )}>
                  {trade.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {bottomTab === "Orders" && (
        <div className="px-4 py-3 space-y-3">
          {ordersLoading ? (
            <div className="text-center text-muted-foreground py-4">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">No open orders</div>
          ) : (
            orders.map((order, index) => (
              <OrderCard key={order.id || index} {...order} />
            ))
          )}
        </div>
      )}

      {bottomTab === "Positions" && (
        <div className="px-4 py-3 space-y-3">
          {positionsLoading ? (
            <div className="text-center text-muted-foreground py-4">Loading positions...</div>
          ) : positions.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">No open positions</div>
          ) : (
            positions.map((position, index) => (
              <PositionCard 
                key={position.id} 
                type={position.type}
                event={position.event}
                option={position.option}
                entryPrice={position.entryPrice}
                markPrice={position.markPrice}
                size={position.sizeDisplay}
                margin={position.margin}
                pnl={position.pnl}
                pnlPercent={position.pnlPercent}
                leverage={position.leverage}
                takeProfit={position.tp}
                stopLoss={position.sl}
              />
            ))
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/30 px-4 py-3 z-50">
        <div className="text-center text-xs text-muted-foreground mb-2">
          Available {profile?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'} USDC
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

export default function TradingCharts() {
  return (
    <MobileTradingLayout activeTab="Charts">
      {(context) => (
        <TradingChartsContent 
          selectedEvent={context.selectedEvent} 
          selectedOptionData={context.selectedOptionData} 
        />
      )}
    </MobileTradingLayout>
  );
}
