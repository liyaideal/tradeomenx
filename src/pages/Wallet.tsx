import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ChevronRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";

export default function Wallet() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { balance, user } = useUserProfile();
  
  // Mock data - would come from backend
  const accountStats = {
    equity: balance,
    available: balance * 0.7,
    unrealizedPnl: 1250.50,
    realizedPnl: 3420.80,
  };

  // Mock transaction history
  const transactions = [
    { id: 1, type: "deposit", amount: 1000, method: "USDC", date: "2024-01-08", status: "completed" },
    { id: 2, type: "trade_profit", amount: 250.50, event: "BTC > $100K", date: "2024-01-07", status: "completed" },
    { id: 3, type: "trade_loss", amount: -120.00, event: "ETH > $4K", date: "2024-01-06", status: "completed" },
    { id: 4, type: "withdraw", amount: -500, method: "USDC", date: "2024-01-05", status: "completed" },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Wallet</h1>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Equity</span>
          </div>
          <div className="text-4xl font-bold font-mono mb-6">
            ${formatCurrency(accountStats.equity)}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-trading-green hover:bg-trading-green/90 text-background font-semibold rounded-xl h-12"
              onClick={() => {/* TODO: Open deposit modal */}}
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-border/50 hover:bg-muted/50 rounded-xl h-12"
              onClick={() => {/* TODO: Open withdraw modal */}}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Account Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-1">Available</div>
            <div className="text-lg font-semibold font-mono">
              ${formatCurrency(accountStats.available)}
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-1">In Positions</div>
            <div className="text-lg font-semibold font-mono">
              ${formatCurrency(accountStats.equity - accountStats.available)}
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3" />
              Unrealized P&L
            </div>
            <div className={`text-lg font-semibold font-mono ${
              accountStats.unrealizedPnl >= 0 ? "text-trading-green" : "text-trading-red"
            }`}>
              {accountStats.unrealizedPnl >= 0 ? "+" : ""}${formatCurrency(accountStats.unrealizedPnl)}
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingDown className="w-3 h-3" />
              Realized P&L
            </div>
            <div className={`text-lg font-semibold font-mono ${
              accountStats.realizedPnl >= 0 ? "text-trading-green" : "text-trading-red"
            }`}>
              {accountStats.realizedPnl >= 0 ? "+" : ""}${formatCurrency(accountStats.realizedPnl)}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Recent Activity</h2>
            </div>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          
          <div className="bg-card border border-border/50 rounded-xl divide-y divide-border/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "deposit" ? "bg-trading-green/20" :
                    tx.type === "withdraw" ? "bg-trading-red/20" :
                    tx.amount >= 0 ? "bg-trading-green/20" : "bg-trading-red/20"
                  }`}>
                    {tx.type === "deposit" ? (
                      <ArrowDownLeft className="w-5 h-5 text-trading-green" />
                    ) : tx.type === "withdraw" ? (
                      <ArrowUpRight className="w-5 h-5 text-trading-red" />
                    ) : tx.amount >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-trading-green" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-trading-red" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {tx.type === "deposit" ? "Deposit" :
                       tx.type === "withdraw" ? "Withdraw" :
                       tx.event || "Trade"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.method || tx.date}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-semibold font-mono ${
                  tx.amount >= 0 ? "text-trading-green" : "text-trading-red"
                }`}>
                  {tx.amount >= 0 ? "+" : ""}${formatCurrency(Math.abs(tx.amount))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {isMobile && <BottomNav />}
    </div>
  );
}
