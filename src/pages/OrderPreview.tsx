import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { useOrdersStore, Order } from "@/stores/useOrdersStore";
import { usePositionsStore, Position } from "@/stores/usePositionsStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { executeTrade } from "@/services/tradingService";
import { Loader2 } from "lucide-react";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { BinaryEventHint, isNoOption } from "@/components/BinaryEventHint";

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
  const { addPosition } = usePositionsStore();
  const { balance, user, deductBalance } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSheetOpen, setAuthSheetOpen] = useState(false);

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
  const totalCost = parseFloat(orderCalculations.total) || 0;

  // 检查是否为二元事件（Yes/No）- 如果选项是 Yes 或 No 则认为是二元事件
  const isBinaryOrder = useMemo(() => {
    const label = optionLabel.toLowerCase();
    return label === "yes" || label === "no";
  }, [optionLabel]);

  // 如果是 No 选项，显示特殊提示
  const showBinaryHint = isBinaryOrder && isNoOption(optionLabel);

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
    { label: "TP/SL", value: orderData.tpsl ? "Set" : "--" },
    { label: "Estimated Liq. Price", value: `${orderCalculations.liqPrice} USDC` },
    { label: "Available Balance", value: `${balance.toFixed(2)} USDC`, highlight: balance >= totalCost ? "green" : "red" },
  ];

  const potentialWin = parseInt(orderCalculations.potentialWin) || 0;

  const handleConfirm = async () => {
    // Check if user is logged in
    if (!user) {
      setAuthSheetOpen(true);
      return;
    }

    // Check if user has enough balance
    if (balance < totalCost) {
      toast.error(`Insufficient balance. You need ${totalCost.toFixed(2)} USDC but only have ${balance.toFixed(2)} USDC.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute trade in database
      const tradeData = {
        eventName,
        optionLabel,
        side: orderData.side as "buy" | "sell",
        orderType: (orderData.orderType as "Market" | "Limit") || "Market",
        price: parseFloat(orderData.price) || 0,
        amount: parseFloat(orderData.amount) || 0,
        quantity: parseInt(orderCalculations.quantity) || 0,
        leverage: parseInt(orderData.leverage) || 10,
        margin: parseFloat(orderCalculations.marginRequired) || 0,
        fee: parseFloat(orderCalculations.estimatedFee) || 0,
        tpValue: orderData.tpsl?.tp ? parseFloat(orderData.tpsl.tp.value) : undefined,
        tpMode: orderData.tpsl?.tp?.mode === "pct" ? "%" as const : "$" as const,
        slValue: orderData.tpsl?.sl ? parseFloat(orderData.tpsl.sl.value) : undefined,
        slMode: orderData.tpsl?.sl?.mode === "pct" ? "%" as const : "$" as const,
      };

      await executeTrade(user.id, tradeData);

      // Deduct balance
      const deducted = await deductBalance(totalCost);
      if (!deducted) {
        throw new Error("Failed to deduct balance");
      }

      // Add to local stores for immediate UI update
      const newOrder: Order = {
        type: isBuy ? "buy" : "sell",
        orderType: (orderData.orderType as "Limit" | "Market") || "Market",
        event: eventName,
        option: optionLabel,
        price: `$${orderData.price || "0.0000"}`,
        amount: parseInt(orderCalculations.quantity).toLocaleString(),
        total: `$${orderCalculations.total}`,
        time: "Just now",
        status: "Filled",
      };
      addOrder(newOrder);

      // Add position to local store
      const newPosition: Position = {
        type: isBuy ? "long" : "short",
        event: eventName,
        option: optionLabel,
        entryPrice: `$${orderData.price || "0.0000"}`,
        markPrice: `$${orderData.price || "0.0000"}`,
        size: parseInt(orderCalculations.quantity).toLocaleString(),
        margin: `$${orderCalculations.marginRequired}`,
        pnl: "$0.00",
        pnlPercent: "0.0%",
        leverage: orderData.leverage || "10x",
        tp: orderData.tpsl?.tp?.value || "",
        sl: orderData.tpsl?.sl?.value || "",
        tpMode: orderData.tpsl?.tp?.mode === "pct" ? "%" : "$",
        slMode: orderData.tpsl?.sl?.mode === "pct" ? "%" : "$",
      };
      addPosition(newPosition);

      toast.success("Order executed successfully!");
      navigate("/trade");
    } catch (error: any) {
      console.error("Order execution error:", error);
      toast.error(error.message || "Failed to execute order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <MobileHeader title="Order preview" showLogo={false} />

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
          
          {/* Binary Event Hint - 二元事件仓位合并提示 */}
          {showBinaryHint && (
            <div className="mt-4 pt-3 border-t border-border/30">
              <BinaryEventHint variant="inline" />
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-20 left-0 right-0 bg-background px-4 py-3">
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] animate-slide-up flex items-center justify-center gap-2 ${
            isBuy ? "bg-trading-green text-trading-green-foreground" : "bg-trading-red text-foreground"
          } ${isSubmitting ? "opacity-70" : ""}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {isBuy ? "Buy Long" : "Sell Short"} - to win $ {potentialWin.toLocaleString()}
            </>
          )}
        </button>
      </div>

      {/* Auth Sheet for login */}
      <AuthSheet open={authSheetOpen} onOpenChange={setAuthSheetOpen} />

      <BottomNav />
    </div>
  );
}
