import { useState } from "react";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, ExternalLink, CheckCircle, X, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrders } from "@/hooks/useOrders";
import { usePositions } from "@/hooks/usePositions";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { orderToPosition } from "@/lib/orderUtils";
import { TRADING_TERMS } from "@/lib/tradingTerms";
import { useRealtimePositionsPnL } from "@/hooks/useRealtimePositionsPnL";

export const DesktopPositionsPanel = () => {
  // Use unified hooks - Supabase for logged-in users, local for guests
  const { orders, cancelOrder, fillOrder, isCancelling, isFilling } = useOrders();
  const { positions, closePosition, updatePositionTpSl, isClosing, isUpdatingTpSl, refetch: refetchPositions } = usePositions();
  const { addPosition } = usePositionsStore(); // For local orders->positions simulation only
  const { calculateRealtimePnL, formatPnL, formatMarkPrice } = useRealtimePositionsPnL();
  
  const [activeTab, setActiveTab] = useState("Positions");
  const [tpSlOpen, setTpSlOpen] = useState(false);
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const [tpValue, setTpValue] = useState("");
  const [slValue, setSlValue] = useState("");
  const [tpMode, setTpMode] = useState<"%" | "$">("$");
  const [slMode, setSlMode] = useState<"%" | "$">("$");
  
  const [fillDialogOpen, setFillDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const tabs = [
    { id: "Positions", label: "Positions", count: positions.length },
    { id: "Orders", label: "Current Orders", count: orders.length },
  ];

  const positionColumns = [
    TRADING_TERMS.CONTRACTS,
    TRADING_TERMS.QTY,
    TRADING_TERMS.VALUE,
    TRADING_TERMS.ENTRY_PRICE,
    TRADING_TERMS.MARK_PRICE,
    TRADING_TERMS.MARGIN,
    `${TRADING_TERMS.UNREALIZED_PNL} (%)`,
    TRADING_TERMS.TPSL,
    TRADING_TERMS.ACTION,
  ];

  const orderColumns = [
    TRADING_TERMS.CONTRACTS,
    TRADING_TERMS.SIDE,
    TRADING_TERMS.ORDER_TYPE,
    TRADING_TERMS.PRICE,
    TRADING_TERMS.QTY,
    TRADING_TERMS.VALUE,
    TRADING_TERMS.STATUS,
    TRADING_TERMS.TIME,
    TRADING_TERMS.ACTION,
  ];

  const handleEditTpSl = (index: number, positionId: string) => {
    const position = positions[index];
    setEditingPositionIndex(index);
    setEditingPositionId(positionId);
    setTpValue(position.tp || "");
    setSlValue(position.sl || "");
    setTpMode(position.tpMode);
    setSlMode(position.slMode);
    setTpSlOpen(true);
  };

  const handleSaveTpSl = async () => {
    if (editingPositionIndex !== null && editingPositionId !== null) {
      await updatePositionTpSl(editingPositionId, editingPositionIndex, tpValue, slValue, tpMode, slMode);
      toast({
        title: "TP/SL Updated",
        description: `Take Profit: ${tpValue || "Not set"}, Stop Loss: ${slValue || "Not set"}`,
      });
    }
    setTpSlOpen(false);
    setEditingPositionIndex(null);
    setEditingPositionId(null);
  };

  const handleCancelTpSl = () => {
    setTpValue("");
    setSlValue("");
    setTpSlOpen(false);
    setEditingPositionIndex(null);
    setEditingPositionId(null);
  };

  const handleFillOrder = (index: number, orderId?: string) => {
    setSelectedOrderIndex(index);
    setSelectedOrderId(orderId || null);
    setFillDialogOpen(true);
  };

  const handleCancelOrder = (index: number, orderId?: string) => {
    setSelectedOrderIndex(index);
    setSelectedOrderId(orderId || null);
    setCancelDialogOpen(true);
  };

  const confirmFillOrder = async () => {
    if (selectedOrderIndex !== null) {
      const order = orders[selectedOrderIndex];
      try {
        if (selectedOrderId) {
          // Supabase order - use id
          await fillOrder(selectedOrderId);
          refetchPositions();
        } else {
          // Local order - use index
          const position = orderToPosition(order as any);
          addPosition(position);
          await fillOrder(selectedOrderIndex);
        }
        toast({
          title: "Order Filled",
          description: `${order.type === 'buy' ? 'Long' : 'Short'} position opened for ${order.option}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fill order",
          variant: "destructive",
        });
      }
    }
    setFillDialogOpen(false);
    setSelectedOrderIndex(null);
    setSelectedOrderId(null);
  };

  const confirmCancelOrder = async () => {
    if (selectedOrderIndex !== null) {
      const order = orders[selectedOrderIndex];
      try {
        if (selectedOrderId) {
          // Supabase order - use id
          await cancelOrder(selectedOrderId);
        } else {
          // Local order - use index
          await cancelOrder(selectedOrderIndex);
        }
        toast({
          title: "Order Cancelled",
          description: `Your ${order.type} order for ${order.option} has been cancelled.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel order",
          variant: "destructive",
        });
      }
    }
    setCancelDialogOpen(false);
    setSelectedOrderIndex(null);
    setSelectedOrderId(null);
  };

  const editingPosition = editingPositionIndex !== null ? positions[editingPositionIndex] : null;
  const selectedOrder = selectedOrderIndex !== null ? orders[selectedOrderIndex] : null;

  return (
    <div className="bg-background border-t border-border/30">
      {/* Tabs - always interactive */}
      <div className="flex items-center gap-1 px-4 border-b border-border/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "text-foreground border-b-2 border-trading-yellow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-1 text-muted-foreground">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content - auth gated */}
      <AuthGateOverlay title="Sign in to view positions" description="Log in or create an account to view and manage your trades.">
      <div className="min-h-[120px] max-h-[300px] overflow-hidden">
        {activeTab === "Positions" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  {positionColumns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-xs text-muted-foreground font-normal text-left whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={positionColumns.length} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No open positions
                    </td>
                  </tr>
                ) : (
                  positions.map((position, index) => {
                    // Calculate realtime PnL
                    const realtimePnL = calculateRealtimePnL(position);
                    const { pnlStr, pnlPercentStr } = formatPnL(realtimePnL.pnl, realtimePnL.pnlPercent);
                    const displayMarkPrice = realtimePnL.hasRealtimePrice 
                      ? formatMarkPrice(realtimePnL.markPrice) 
                      : position.markPrice;
                    const isProfitable = realtimePnL.pnl >= 0;
                    const isBinaryYesPosition = position.option.toLowerCase() === "yes";
                    return (
                      <tr key={index} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="px-3 py-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              position.type === "long"
                                ? "bg-trading-green/20 text-trading-green"
                                : "bg-trading-red/20 text-trading-red"
                            }`}>
                              {position.type === "long" ? "Long" : "Short"}
                            </span>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <span className="font-medium cursor-help border-b border-dashed border-muted-foreground hover:border-foreground transition-colors max-w-[150px] truncate inline-block">
                                  {position.option}
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64 p-3" side="bottom" align="start">
                                <p className="text-sm font-medium mb-1">{position.option}</p>
                                <p className="text-xs text-muted-foreground mb-2">{position.event}</p>
                                {isBinaryYesPosition && (
                                  <p className="text-xs text-muted-foreground mb-2 border-t border-border/30 pt-2">
                                    <span className="text-trading-yellow">💡</span> Binary event positions are unified under Yes. If you placed a No trade, the direction is automatically flipped (No Long → Yes Short, No Short → Yes Long).
                                  </p>
                                )}
                                <a 
                                  href="#" 
                                  className="text-sm text-primary flex items-center gap-1.5 hover:underline"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Go to this event
                                </a>
                              </HoverCardContent>
                            </HoverCard>
                            {isBinaryYesPosition && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 text-trading-yellow cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[250px]">
                                    <p className="text-xs">Binary event positions are unified under Yes. If you placed a No trade, the direction is automatically flipped.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <span className="text-xs text-muted-foreground">{position.leverage}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm font-mono">{position.sizeDisplay}</td>
                        <td className="px-3 py-2 text-sm font-mono">{position.margin}</td>
                        <td className="px-3 py-2 text-sm font-mono">{position.entryPrice}</td>
                        <td className="px-3 py-2 text-sm font-mono">{displayMarkPrice}</td>
                        <td className="px-3 py-2 text-sm font-mono">{position.margin}</td>
                        <td className={`px-3 py-2 text-sm font-mono ${
                          isProfitable ? "text-trading-green" : "text-trading-red"
                        }`}>
                          {pnlStr} ({pnlPercentStr})
                        </td>
                        <td className="px-3 py-2 text-sm">
                          <button
                            onClick={() => handleEditTpSl(index, position.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors group"
                          >
                            {position.tp || position.sl ? (
                              <span className="text-xs">
                                {position.tp && <span className="text-trading-green">TP: {position.tp}</span>}
                                {position.tp && position.sl && " / "}
                                {position.sl && <span className="text-trading-red">SL: {position.sl}</span>}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Add</span>
                            )}
                            <Pencil className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                          </button>
                        </td>
                        <td className="px-3 py-2 text-sm">
                          <button 
                            onClick={() => closePosition(position.id, index)}
                            className="px-2 py-1 text-xs bg-trading-red/20 text-trading-red rounded hover:bg-trading-red/30"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  {orderColumns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-xs text-muted-foreground font-normal text-left whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={orderColumns.length} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No open orders
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.id || index} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="px-3 py-2 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium max-w-[150px] truncate">{order.option}</span>
                          <span className="text-xs text-muted-foreground max-w-[150px] truncate">{order.event}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          order.type === "buy"
                            ? "bg-trading-green/20 text-trading-green"
                            : "bg-trading-red/20 text-trading-red"
                        }`}>
                          {order.type === "buy" ? "Buy" : "Sell"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-muted-foreground">{order.orderType}</td>
                      <td className="px-3 py-2 text-sm font-mono">{order.price}</td>
                      <td className="px-3 py-2 text-sm font-mono">{order.amount}</td>
                      <td className="px-3 py-2 text-sm font-mono">{order.total}</td>
                      <td className="px-3 py-2 text-sm">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-muted-foreground">{order.time}</td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleFillOrder(index, order.id)}
                            disabled={isFilling}
                            className="h-6 px-2 text-xs text-trading-green hover:bg-trading-green/10"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Fill
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelOrder(index, order.id)}
                            disabled={isCancelling}
                            className="h-6 px-2 text-xs text-trading-red hover:bg-trading-red/10"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </AuthGateOverlay>

      {/* Bottom Ticker Bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 bg-muted/30 border-t border-border/30 text-xs overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">BTCUSDT-09JAN26</span>
          <span className="text-muted-foreground">0%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-trading-green">NEW</span>
          <span className="text-muted-foreground">DOGEUSDT-09JAN26</span>
          <span className="text-muted-foreground">0%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-trading-green">NEW</span>
          <span className="text-muted-foreground">ETHUSDT-09JAN26</span>
          <span className="text-muted-foreground">0%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground">BTCUSDT</span>
          <span className="text-trading-green">+1.22%</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground">Rewards Hub</button>
          <button className="text-muted-foreground hover:text-foreground">Announcements</button>
          <button className="text-trading-green hover:underline">Customer Service</button>
        </div>
      </div>

      {/* TP/SL Edit Dialog */}
      <Dialog open={tpSlOpen} onOpenChange={setTpSlOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base">Edit TP/SL</DialogTitle>
          </DialogHeader>
          
          {editingPosition && (
            <div className="space-y-4">
              {/* Position Info */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Position</span>
                  <span className={editingPosition.type === "long" ? "text-trading-green" : "text-trading-red"}>
                    {editingPosition.type === "long" ? "Long" : "Short"} {editingPosition.leverage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{TRADING_TERMS.CONTRACT}</span>
                  <span className="font-medium">{editingPosition.option}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{TRADING_TERMS.ENTRY_PRICE}</span>
                  <span className="font-mono">{editingPosition.entryPrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{TRADING_TERMS.MARK_PRICE}</span>
                  <span className="font-mono">{editingPosition.markPrice}</span>
                </div>
              </div>

              {/* Take Profit */}
              <div className="space-y-2">
                <label className="text-xs text-trading-green font-medium">Take Profit</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={tpValue}
                      onChange={(e) => setTpValue(e.target.value)}
                      placeholder="0"
                      className="w-full bg-muted border-0 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex bg-muted rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => setTpMode("%")}
                      className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                        tpMode === "%" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => setTpMode("$")}
                      className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                        tpMode === "$" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      $
                    </button>
                  </div>
                </div>
              </div>

              {/* Stop Loss */}
              <div className="space-y-2">
                <label className="text-xs text-trading-red font-medium">Stop Loss</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={slValue}
                      onChange={(e) => setSlValue(e.target.value)}
                      placeholder="0"
                      className="w-full bg-muted border-0 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex bg-muted rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => setSlMode("%")}
                      className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                        slMode === "%" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => setSlMode("$")}
                      className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                        slMode === "$" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      $
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelTpSl}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSaveTpSl}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fill Order Dialog */}
      <AlertDialog open={fillDialogOpen} onOpenChange={setFillDialogOpen}>
        <AlertDialogContent className="max-w-sm bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-trading-green" />
              Fill Order
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Simulate this order being filled? It will create a new position.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedOrder && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 my-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Order Type</span>
                <span className={selectedOrder.type === "buy" ? "text-trading-green font-medium" : "text-trading-red font-medium"}>
                  {selectedOrder.type === "buy" ? "Buy" : "Sell"} {selectedOrder.orderType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-medium">{selectedOrder.option}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Price</span>
                <span className="font-mono">{selectedOrder.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono">{selectedOrder.amount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total</span>
                <span className="font-mono">{selectedOrder.total}</span>
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmFillOrder}
              className="flex-1 bg-trading-green hover:bg-trading-green/90 text-white"
            >
              Fill Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Order Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="max-w-sm bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="w-5 h-5 text-trading-red" />
              Cancel Order
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to cancel this order?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedOrder && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 my-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Order Type</span>
                <span className={selectedOrder.type === "buy" ? "text-trading-green font-medium" : "text-trading-red font-medium"}>
                  {selectedOrder.type === "buy" ? "Buy" : "Sell"} {selectedOrder.orderType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-medium">{selectedOrder.option}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Price</span>
                <span className="font-mono">{selectedOrder.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono">{selectedOrder.amount}</span>
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelOrder}
              className="flex-1 bg-trading-red hover:bg-trading-red/90 text-white"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
