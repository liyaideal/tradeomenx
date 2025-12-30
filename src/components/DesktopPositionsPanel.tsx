import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

interface Position {
  contracts: string;
  qty: string;
  value: string;
  entryPrice: string;
  markPrice: string;
  liqPrice: string;
  positionMargin: string;
  unrealizedPnl: string;
  unrealizedPnlPercent: string;
  realizedPnl: string;
  tp: string;
  sl: string;
  trailingStop: string;
  adl: number;
  reverse: boolean;
  closeBy: string;
  type: "long" | "short";
  leverage: string;
}

interface Order {
  contracts: string;
  type: string;
  qty: string;
  price: string;
  value: string;
  filledQty: string;
  orderPrice: string;
  triggerPrice: string;
  sl: string;
  tp: string;
  reduceOnly: boolean;
  postOnly: boolean;
  status: string;
  createdAt: string;
}

const mockPositions: Position[] = [
  {
    contracts: "TRUMP 2028",
    qty: "100",
    value: "$5,000",
    entryPrice: "0.50",
    markPrice: "0.52",
    liqPrice: "0.10",
    positionMargin: "$500",
    unrealizedPnl: "+$200",
    unrealizedPnlPercent: "+4%",
    realizedPnl: "$0",
    tp: "",
    sl: "",
    trailingStop: "--",
    adl: 2,
    reverse: false,
    closeBy: "Limit",
    type: "long",
    leverage: "10x",
  },
];
const mockOrders: Order[] = [];

export const DesktopPositionsPanel = () => {
  const [activeTab, setActiveTab] = useState("Positions");
  const [tpSlOpen, setTpSlOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [tpValue, setTpValue] = useState("");
  const [slValue, setSlValue] = useState("");
  const [tpMode, setTpMode] = useState<"%" | "$">("$");
  const [slMode, setSlMode] = useState<"%" | "$">("$");
  const { toast } = useToast();
  
  const tabs = [
    { id: "Positions", label: "Positions", count: mockPositions.length },
    { id: "Orders", label: "Current Orders", count: mockOrders.length },
  ];

  const positionColumns = [
    "Contracts",
    "Qty",
    "Value",
    "Entry Price",
    "Mark Price",
    "Liq. Price",
    "Position Margin",
    "Unrealized P&L (%)",
    "Realized P&L",
    "TP/SL",
    "Trailing Stop",
    "ADL",
    "Reverse",
    "Close By",
  ];

  const handleEditTpSl = (position: Position) => {
    setEditingPosition(position);
    setTpValue(position.tp || "");
    setSlValue(position.sl || "");
    setTpSlOpen(true);
  };

  const handleSave = () => {
    toast({
      title: "TP/SL Updated",
      description: `Take Profit: ${tpValue || "Not set"}, Stop Loss: ${slValue || "Not set"}`,
    });
    setTpSlOpen(false);
    setEditingPosition(null);
  };

  const handleCancel = () => {
    setTpValue("");
    setSlValue("");
    setTpSlOpen(false);
    setEditingPosition(null);
  };

  return (
    <div className="bg-background border-t border-border/30">
      {/* Tabs */}
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

      {/* Content */}
      <div className="min-h-[120px]">
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
                {mockPositions.length === 0 ? (
                  <tr>
                    <td colSpan={positionColumns.length} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No open positions
                    </td>
                  </tr>
                ) : (
                  mockPositions.map((position, index) => (
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
                          <span className="font-medium">{position.contracts}</span>
                          <span className="text-xs text-muted-foreground">{position.leverage}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm font-mono">{position.qty}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.value}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.entryPrice}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.markPrice}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.liqPrice}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.positionMargin}</td>
                      <td className={`px-3 py-2 text-sm font-mono ${
                        position.unrealizedPnl.startsWith("+") ? "text-trading-green" : "text-trading-red"
                      }`}>
                        {position.unrealizedPnl} ({position.unrealizedPnlPercent})
                      </td>
                      <td className="px-3 py-2 text-sm font-mono">{position.realizedPnl}</td>
                      <td className="px-3 py-2 text-sm">
                        <button
                          onClick={() => handleEditTpSl(position)}
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
                      <td className="px-3 py-2 text-sm font-mono">{position.trailingStop}</td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-3 rounded-sm ${
                                level <= position.adl ? "bg-trading-yellow" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <button className="px-2 py-1 text-xs bg-muted rounded hover:bg-muted/80">
                          Reverse
                        </button>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <button className="px-2 py-1 text-xs bg-trading-red/20 text-trading-red rounded hover:bg-trading-red/30">
                          Close
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No open orders
          </div>
        )}

      </div>

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
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-medium">{editingPosition.contracts}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Entry Price</span>
                  <span className="font-mono">{editingPosition.entryPrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mark Price</span>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
