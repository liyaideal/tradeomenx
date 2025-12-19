import { useState } from "react";

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
  tpsl: string;
  trailingStop: string;
  adl: number;
  reverse: boolean;
  closeBy: string;
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

const mockPositions: Position[] = [];
const mockOrders: Order[] = [];

export const DesktopPositionsPanel = () => {
  const [activeTab, setActiveTab] = useState("Positions");
  
  const tabs = [
    { id: "Positions", label: "Positions", count: 0 },
    { id: "Orders", label: "Current Orders", count: 0 },
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
                      <td className="px-3 py-2 text-sm font-mono">{position.contracts}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.qty}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.value}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.entryPrice}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.markPrice}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.liqPrice}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.positionMargin}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.unrealizedPnl}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.realizedPnl}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.tpsl}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.trailingStop}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.adl}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.reverse ? "Yes" : "No"}</td>
                      <td className="px-3 py-2 text-sm font-mono">{position.closeBy}</td>
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
    </div>
  );
};
