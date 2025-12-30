import { useState } from "react";
import { TrendingUp, TrendingDown, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  // Use saved state to persist values after dialog closes
  const [savedTp, setSavedTp] = useState(initialTp);
  const [savedSl, setSavedSl] = useState(initialSl);
  const [tpValue, setTpValue] = useState(initialTp);
  const [slValue, setSlValue] = useState(initialSl);
  const [tpMode, setTpMode] = useState<"%" | "$">("$");
  const [slMode, setSlMode] = useState<"%" | "$">("$");
  const { toast } = useToast();

  const handleSave = () => {
    setSavedTp(tpValue);
    setSavedSl(slValue);
    toast({
      title: "TP/SL Updated",
      description: `Take Profit: ${tpValue || "Not set"}, Stop Loss: ${slValue || "Not set"}`,
    });
    setTpSlOpen(false);
  };

  const handleCancel = () => {
    setTpValue(savedTp);
    setSlValue(savedSl);
    setTpSlOpen(false);
  };

  const handleOpenDialog = () => {
    setTpValue(savedTp);
    setSlValue(savedSl);
    setTpSlOpen(true);
  };

  const hasTpSl = savedTp || savedSl;

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
            <span className="text-[10px] text-muted-foreground block">Size</span>
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
            <span className="text-[10px] text-muted-foreground block">Margin</span>
            <span className="font-mono text-xs">{margin}</span>
          </div>
        </div>

        {/* TP/SL Row - Always visible */}
        <div className="flex items-center justify-between py-2 mb-2 border-y border-border/30">
          <span className="text-[10px] text-muted-foreground">TP/SL</span>
          <button 
            onClick={handleOpenDialog}
            className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
          >
            {hasTpSl ? (
              <>
                {savedTp && <span className="text-trading-green font-mono">{savedTp}</span>}
                {savedTp && savedSl && <span className="text-muted-foreground">/</span>}
                {savedSl && <span className="text-trading-red font-mono">{savedSl}</span>}
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
            {hasTpSl ? "Edit TP/SL" : "Add TP/SL"}
          </button>
          <button className="flex-1 py-1.5 text-[10px] font-medium bg-trading-red/20 text-trading-red rounded-lg hover:bg-trading-red/30 transition-colors">
            Close
          </button>
        </div>
      </div>

      {/* TP/SL Edit Dialog */}
      <Dialog open={tpSlOpen} onOpenChange={setTpSlOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base">Edit TP/SL</DialogTitle>
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
                <span className="text-muted-foreground">Entry Price</span>
                <span className="font-mono">{entryPrice}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mark Price</span>
                <span className="font-mono">{markPrice}</span>
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
    </>
  );
};
