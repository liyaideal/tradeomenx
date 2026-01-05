import { useNavigate, useLocation } from "react-router-dom";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { useOrdersStore, Order } from "@/stores/useOrdersStore";

interface OrderDetail {
  label: string;
  value: string;
  highlight?: "green" | "red" | "purple";
}

interface OrderCalculations {
  notionalValue: string;
  marginRequired: string;
  estimatedFee: string;
  total: string;
  quantity: string;
  potentialWin: string;
  liqPrice: string;
}

export default function OrderPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useOrdersStore();
  const orderData = location.state || {};
  const orderCalculations: OrderCalculations = orderData.orderCalculations || {
    notionalValue: "0.00",
    marginRequired: "0.00",
    estimatedFee: "0.00",
    total: "0.00",
    quantity: "0",
    potentialWin: "0",
    liqPrice: "0.0000",
  };

  const isBuy = orderData.side === "buy";
  
  // Get event and option from order data or use defaults
  const eventName = orderData.event || "Elon Musk # tweets December 12 - December 19, 2025?";
  const optionLabel = orderData.option || "200-219";

  const orderDetails: OrderDetail[] = [
    { label: "Event", value: eventName },
    { label: "Option", value: optionLabel },
    { label: "Side", value: isBuy ? "Buy | Long" : "Sell | Short", highlight: isBuy ? "green" : "red" },
    { label: "Margin type", value: orderData.marginType || "Cross" },
    { label: "Type", value: orderData.orderType || "Market" },
    { label: "Order Price", value: `${orderData.price || "0.0000"} USDC` },
    { label: "Order Cost", value: `${orderData.amount || "0.00"} USDC` },
    { label: "Notional value", value: `${orderCalculations.notionalValue} USDC` },
    { label: "Leverage", value: orderData.leverage || "10x" },
    { label: "Margin required", value: `${orderCalculations.marginRequired} USDC` },
    { label: "TP/SL", value: "--" },
    { label: "Estimated Liq. Price", value: `${orderCalculations.liqPrice} USDC` },
  ];

  const potentialWin = parseInt(orderCalculations.potentialWin) || 0;

  const handleConfirm = () => {
    // Create new order and add to orders list
    const newOrder: Order = {
      type: isBuy ? "buy" : "sell",
      orderType: (orderData.orderType as "Limit" | "Market") || "Market",
      event: eventName,
      option: optionLabel,
      price: `$${orderData.price || "0.0000"}`,
      amount: parseInt(orderCalculations.quantity).toLocaleString(),
      total: `$${orderCalculations.total}`,
      time: "Just now",
      status: "Pending",
    };
    addOrder(newOrder);
    toast.success("Order placed successfully!");
    navigate("/trade");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <MobileHeader title="Order preview" />

      {/* Order Details Card */}
      <div className="px-4 py-4 animate-fade-in">
        <div className="trading-card p-4">
          <div className="space-y-0">
            {orderDetails.map((detail, index) => (
              <div
                key={detail.label}
                className={`flex justify-between gap-4 py-3 ${
                  index !== orderDetails.length - 1 ? "border-b border-border/20" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-muted-foreground text-sm flex-shrink-0">{detail.label}</span>
                <span
                  className={`font-medium text-sm text-right ${
                    detail.highlight === "green"
                      ? "text-trading-green"
                      : detail.highlight === "red"
                      ? "text-trading-red"
                      : detail.highlight === "purple"
                      ? "text-trading-purple"
                      : "text-foreground"
                  }`}
                >
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-20 left-0 right-0 bg-background px-4 py-3">
        <button
          onClick={handleConfirm}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] animate-slide-up ${
            isBuy ? "bg-trading-green text-trading-green-foreground" : "bg-trading-red text-foreground"
          }`}
        >
          {isBuy ? "Buy Long" : "Sell Short"} - to win $ {potentialWin.toLocaleString()}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
