interface OrderBookEntry {
  price: string;
  amount: string;
  total?: string;
}

interface OrderBookProps {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  currentPrice: string;
  compact?: boolean;
}

export const OrderBook = ({ asks, bids, currentPrice, compact = false }: OrderBookProps) => {
  return (
    <div className="w-full">
      {!compact && (
        <div className="grid grid-cols-3 text-xs text-muted-foreground px-4 py-2 border-b border-border/30">
          <span>Price (USDC)</span>
          <span className="text-center">Amount</span>
          <span className="text-right">Total</span>
        </div>
      )}

      {/* Asks (Sell orders) */}
      <div className={`${compact ? "max-h-[200px]" : ""} overflow-y-auto scrollbar-hide`}>
        {asks.map((ask, index) => (
          <div
            key={`ask-${index}`}
            className="grid grid-cols-3 text-xs px-4 py-1.5 hover:bg-muted/30 transition-colors"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <span className="price-red">{ask.price}</span>
            <span className="text-center text-foreground font-mono">{ask.amount}</span>
            <span className="text-right text-muted-foreground font-mono">{ask.total || ask.amount}</span>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="px-4 py-3 bg-muted/20 border-y border-border/30">
        <div className="text-center">
          <span className="text-lg font-bold font-mono text-foreground">${currentPrice}</span>
          <div className="text-xs text-muted-foreground mt-0.5">Current Price</div>
        </div>
      </div>

      {/* Bids (Buy orders) */}
      <div className={`${compact ? "max-h-[200px]" : ""} overflow-y-auto scrollbar-hide`}>
        {bids.map((bid, index) => (
          <div
            key={`bid-${index}`}
            className="grid grid-cols-3 text-xs px-4 py-1.5 hover:bg-muted/30 transition-colors"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <span className="price-green">{bid.price}</span>
            <span className="text-center text-foreground font-mono">{bid.amount}</span>
            <span className="text-right text-muted-foreground font-mono">{bid.total || bid.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
