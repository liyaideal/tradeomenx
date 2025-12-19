import { Trash2 } from "lucide-react";

interface OrderCardProps {
  type: "buy" | "sell";
  orderType: "Limit" | "Market";
  event: string;
  option: string;
  probability: string;
  price: string;
  amount: string;
  total: string;
  time: string;
  status: "Pending" | "Partially Filled" | "Filled" | "Cancelled";
}

export const OrderCard = ({
  type,
  orderType,
  event,
  option,
  probability,
  price,
  amount,
  total,
  time,
  status,
}: OrderCardProps) => {
  const statusColors = {
    Pending: "bg-amber-500/20 text-amber-400",
    "Partially Filled": "bg-cyan-500/20 text-cyan-400",
    Filled: "bg-trading-green/20 text-trading-green",
    Cancelled: "bg-trading-red/20 text-trading-red",
  };

  return (
    <div className="bg-card rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              type === "buy"
                ? "bg-trading-green/20 text-trading-green"
                : "bg-trading-red/20 text-trading-red"
            }`}
          >
            {type === "buy" ? "Buy" : "Sell"}
          </span>
          <span className="text-sm text-muted-foreground">{orderType}</span>
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Event Info */}
      <div className="mb-2">
        <h3 className="font-medium text-foreground text-sm">{event}</h3>
        <p className="text-xs text-muted-foreground">
          {option} · {probability}
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-3 gap-3 mb-2">
        <div>
          <span className="text-[10px] text-muted-foreground block">Price</span>
          <span className="font-mono text-xs">{price}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Amount</span>
          <span className="font-mono text-xs">{amount}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">
            {orderType === "Market" ? "Est. Total" : "Total"}
          </span>
          <span className="font-mono text-xs">{total}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground">{time}</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};
