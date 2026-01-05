import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    Pending: "bg-amber-500/20 text-amber-400",
    "Partially Filled": "bg-cyan-500/20 text-cyan-400",
    Filled: "bg-trading-green/20 text-trading-green",
    Cancelled: "bg-trading-red/20 text-trading-red",
  };

  const handleCancelOrder = () => {
    toast({
      title: "Order Cancelled",
      description: `Your ${type} order for ${option} has been cancelled.`,
    });
    setCancelDialogOpen(false);
  };

  return (
    <>
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
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[status]}`}>
            {status}
          </span>
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

        {/* Footer with time and action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {status === "Pending" || status === "Partially Filled" ? (
            <button 
              onClick={() => setCancelDialogOpen(true)}
              className="px-3 py-1.5 text-[10px] font-medium bg-trading-red/20 text-trading-red rounded-lg hover:bg-trading-red/30 transition-colors"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="max-w-sm bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-trading-red" />
              Cancel Order
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to cancel this order?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 my-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Order Type</span>
              <span className={type === "buy" ? "text-trading-green font-medium" : "text-trading-red font-medium"}>
                {type === "buy" ? "Buy" : "Sell"} {orderType}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Contract</span>
              <span className="font-medium">{option}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Price</span>
              <span className="font-mono">{price}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono">{amount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono">{total}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className={statusColors[status].split(' ')[1]}>{status}</span>
            </div>
          </div>

          <AlertDialogFooter className="flex gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelOrder}
              className="flex-1 bg-trading-red hover:bg-trading-red/90 text-white"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};