import { useState } from "react";
import { TrendingUp, TrendingDown, Pencil, AlertTriangle } from "lucide-react";
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
import { TRADING_TERMS } from "@/lib/tradingTerms";

interface PositionCardProps {
  type: "long" | "short";
  event: string;
  option: string;
  entryPrice: string;
  markPrice: string;
  size: string;
  margin: string;
  pnl: string;
  pnlPercent: string;
  leverage: string;
  takeProfit?: string;
  stopLoss?: string;
}

export const PositionCard = ({
  type,
  event,
  option,
  entryPrice,
  markPrice,
  size,
  margin,
  pnl,
  pnlPercent,
  leverage,
  takeProfit: initialTp = "",
  stopLoss: initialSl = "",
}: PositionCardProps) => {
  const isProfitable = !pnl.startsWith("-");
  const [tpSlOpen, setTpSlOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  // Use saved state to persist values after dialog closes
  const [savedTp, setSavedTp] = useState(initialTp);
  const [savedSl, setSavedSl] = useState(initialSl);
  const [savedTpMode, setSavedTpMode] = useState<"%" | "$">("$");
  const [savedSlMode, setSavedSlMode] = useState<"%" | "$">("$");
  const [tpValue, setTpValue] = useState(initialTp);
  const [slValue, setSlValue] = useState(initialSl);
  const [tpMode, setTpMode] = useState<"%" | "$">("$");
  const [slMode, setSlMode] = useState<"%" | "$">("$");
  const { toast } = useToast();

  const handleClosePosition = () => {
    toast({
      title: "Position Closed",
      description: `Your ${type} position on ${option} has been closed.`,
    });
    setCloseDialogOpen(false);
  };

  const handleSave = () => {
    setSavedTp(tpValue);
    setSavedSl(slValue);
    setSavedTpMode(tpMode);
    setSavedSlMode(slMode);
    toast({
      title: "TP/SL Updated",
      description: `Take Profit: ${tpValue ? (tpMode === "%" ? `+${tpValue}%` : `$${tpValue}`) : "Not set"}, Stop Loss: ${slValue ? (slMode === "%" ? `-${slValue}%` : `$${slValue}`) : "Not set"}`,
    });
    setTpSlOpen(false);
  };

  const handleCancel = () => {
    setTpValue(savedTp);
    setSlValue(savedSl);
    setTpMode(savedTpMode);
    setSlMode(savedSlMode);
    setTpSlOpen(false);
  };

  const handleOpenDialog = () => {
    setTpValue(savedTp);
    setSlValue(savedSl);
    setTpMode(savedTpMode);
    setSlMode(savedSlMode);
    setTpSlOpen(true);
  };

  const hasTpSl = savedTp || savedSl;
  
  // Format display with unit
  const formatTpSl = (value: string, mode: "%" | "$", isProfit: boolean) => {
    if (!value) return "";
    if (mode === "%") {
      return isProfit ? `+${value}%` : `-${value}%`;
    }
    return `$${value}`;
  };
  
  // Parse numeric values for calculation
  const parsePrice = (price: string) => {
    return parseFloat(price.replace(/[$,]/g, '')) || 0;
  };
  
  const parsedEntryPrice = parsePrice(entryPrice);
  const parsedMargin = parsePrice(margin);
  const parsedSize = parseFloat(size.replace(/,/g, '')) || 0;
  const leverageNum = parseFloat(leverage.replace('x', '')) || 1;
  
  // Calculate estimated P&L based on TP/SL
  const calculateEstimatedPnl = (value: string, mode: "%" | "$", isProfit: boolean) => {
    if (!value || !parsedMargin) return null;
    const numValue = parseFloat(value) || 0;
    if (numValue === 0) return null;
    
    if (mode === "%") {
      // Percentage mode: PnL = margin * (percentage / 100)
      const pnl = parsedMargin * (numValue / 100) * leverageNum;
      return isProfit ? pnl : -pnl;
    } else {
      // Price mode: Calculate based on price difference
      const targetPrice = numValue;
      if (parsedEntryPrice === 0 || parsedSize === 0) return null;
      const priceDiff = targetPrice - parsedEntryPrice;
      const pnl = type === "long" 
        ? priceDiff * parsedSize 
        : -priceDiff * parsedSize;
      return pnl;
    }
  };
  
  const tpEstimatedPnl = calculateEstimatedPnl(tpValue, tpMode, true);
  const slEstimatedPnl = calculateEstimatedPnl(slValue, slMode, false);
  
  const formatPnl = (pnl: number | null) => {
    if (pnl === null) return "";
    const sign = pnl >= 0 ? "+" : "";
    return `${sign}$${Math.abs(pnl).toFixed(2)}`;
  };

  return (
    <>
      <div className="bg-card rounded-xl p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                type === "long"
                  ? "bg-trading-green/20 text-trading-green"
                  : "bg-trading-red/20 text-trading-red"
              }`}
            >
              {type === "long" ? "Long" : "Short"}
            </span>
            <span className="text-xs text-muted-foreground">{leverage}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            isProfitable ? "text-trading-green" : "text-trading-red"
          }`}>
            {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {pnl} ({pnlPercent})
          </div>
        </div>

        {/* Event Info */}
        <div className="mb-2">
          <h3 className="font-medium text-foreground text-sm">{event}</h3>
          <p className="text-xs text-muted-foreground">{option}</p>
        </div>

        {/* Position Details */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div>
            <span className="text-[10px] text-muted-foreground block">{TRADING_TERMS.QTY}</span>
            <span className="font-mono text-xs">{size}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Entry</span>
            <span className="font-mono text-xs">{entryPrice}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Mark</span>
            <span className="font-mono text-xs">{markPrice}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">{TRADING_TERMS.MARGIN}</span>
            <span className="font-mono text-xs">{margin}</span>
          </div>
        </div>

        {/* TP/SL Row - Always visible */}
        <div className="flex items-center justify-between py-2 mb-2 border-y border-border/30">
          <span className="text-[10px] text-muted-foreground">{TRADING_TERMS.TPSL}</span>
          <button 
            onClick={handleOpenDialog}
            className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
          >
            {hasTpSl ? (
              <>
                {savedTp && <span className="text-trading-green font-mono">{formatTpSl(savedTp, savedTpMode, true)}</span>}
                {savedTp && savedSl && <span className="text-muted-foreground">/</span>}
                {savedSl && <span className="text-trading-red font-mono">{formatTpSl(savedSl, savedSlMode, false)}</span>}
              </>
            ) : (
              <span className="text-muted-foreground">--</span>
            )}
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>

        {/* Actions at bottom */}
        <div className="flex gap-2">
          <button 
            onClick={handleOpenDialog}
            className="flex-1 py-1.5 text-[10px] font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            {hasTpSl ? `Edit ${TRADING_TERMS.TPSL}` : `Add ${TRADING_TERMS.TPSL}`}
          </button>
          <button 
            onClick={() => setCloseDialogOpen(true)}
            className="flex-1 py-1.5 text-[10px] font-medium bg-trading-red/20 text-trading-red rounded-lg hover:bg-trading-red/30 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* TP/SL Edit Dialog */}
      <Dialog open={tpSlOpen} onOpenChange={setTpSlOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base">Edit {TRADING_TERMS.TPSL}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Position Info */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Position</span>
                <span className={type === "long" ? "text-trading-green" : "text-trading-red"}>
                  {type === "long" ? "Long" : "Short"} {leverage}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{TRADING_TERMS.ENTRY_PRICE}</span>
                <span className="font-mono">{entryPrice}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{TRADING_TERMS.MARK_PRICE}</span>
                <span className="font-mono">{markPrice}</span>
              </div>
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-trading-green font-medium">Take Profit</label>
                {tpEstimatedPnl !== null && (
                  <span className={`text-xs font-mono ${tpEstimatedPnl >= 0 ? "text-trading-green" : "text-trading-red"}`}>
                    Est. P&L: {formatPnl(tpEstimatedPnl)}
                  </span>
                )}
              </div>
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
              <div className="flex items-center justify-between">
                <label className="text-xs text-trading-red font-medium">Stop Loss</label>
                {slEstimatedPnl !== null && (
                  <span className={`text-xs font-mono ${slEstimatedPnl >= 0 ? "text-trading-green" : "text-trading-red"}`}>
                    Est. P&L: {formatPnl(slEstimatedPnl)}
                  </span>
                )}
              </div>
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
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleSave}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Position Confirmation Dialog */}
      <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <AlertDialogContent className="max-w-sm bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-trading-red" />
              Close Position
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to close this position?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 my-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Position</span>
              <span className={type === "long" ? "text-trading-green" : "text-trading-red"}>
                {type === "long" ? "Long" : "Short"} {leverage}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{TRADING_TERMS.CONTRACT}</span>
              <span className="font-medium">{option}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{TRADING_TERMS.QTY}</span>
              <span className="font-mono">{size}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{TRADING_TERMS.ENTRY_PRICE}</span>
              <span className="font-mono">{entryPrice}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{TRADING_TERMS.MARK_PRICE}</span>
              <span className="font-mono">{markPrice}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{TRADING_TERMS.UNREALIZED_PNL}</span>
              <span className={`font-mono font-medium ${isProfitable ? "text-trading-green" : "text-trading-red"}`}>
                {pnl} ({pnlPercent})
              </span>
            </div>
          </div>

          <AlertDialogFooter className="flex gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClosePosition}
              className="flex-1 bg-trading-red hover:bg-trading-red/90 text-white"
            >
              Close Position
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
