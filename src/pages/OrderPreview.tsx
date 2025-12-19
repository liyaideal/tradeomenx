import { useNavigate, useLocation } from "react-router-dom";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";

interface OrderDetail {
  label: string;
  value: string;
  highlight?: "green" | "purple";
}

export default function OrderPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};

  const orderDetails: OrderDetail[] = [
    { label: "Event", value: "Fed decision in December?" },
    { label: "Option", value: "25 bps decrease" },
    { label: "Side", value: "Buy | Long", highlight: "green" },
    { label: "Margin type", value: orderData.marginType || "Cross" },
    { label: "Type", value: orderData.orderType || "Market" },
    { label: "Order Price", value: "0.7234 USDC" },
    { label: "Order Cost", value: "100 USDC" },
    { label: "Notional value", value: "1000.52 USDC" },
    { label: "Leverage", value: orderData.leverage || "10X" },
    { label: "Margin required", value: "3.48 USDC" },
    { label: "TP/SL", value: "--" },
    { label: "Estimated Liq. Price", value: "0.01 USDC" },
  ];

  const potentialWin = 1428;

  const handleConfirm = () => {
    // In a real app, this would submit the order
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
                className={`flex justify-between py-3 ${
                  index !== orderDetails.length - 1 ? "border-b border-border/20" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-muted-foreground text-sm">{detail.label}</span>
                <span
                  className={`font-medium text-sm ${
                    detail.highlight === "green"
                      ? "text-trading-green"
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
      <div className="fixed bottom-20 left-0 right-0 bg-background px-4 py-4">
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.98] bg-trading-green text-trading-green-foreground animate-slide-up"
        >
          Buy Long - to win $ {potentialWin.toLocaleString()}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
