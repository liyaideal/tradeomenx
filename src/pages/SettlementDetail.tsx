import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Trophy, TrendingUp, TrendingDown, Clock, Calendar, FileCheck, Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { ShareModal } from "@/components/ShareModal";
import { SettlementShareCard } from "@/components/settlement/SettlementShareCard";
import { SettlementPriceChart } from "@/components/settlement/SettlementPriceChart";
import { useSettlementDetail } from "@/hooks/useSettlementDetail";
import { format, formatDistanceStrict } from "date-fns";

export default function SettlementDetail() {
  const { settlementId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTradeHistory, setShowTradeHistory] = useState(false);

  // Fetch real settlement data
  const { data: settlement, isLoading, error } = useSettlementDetail({ settlementId });

  const isWin = settlement?.result === "win";
  const isLong = settlement?.side === "long";

  // Calculate P&L breakdown
  const pnlBreakdown = useMemo(() => {
    if (!settlement) return { avgEntryPrice: 0, entryCost: 0, exitValue: 0, grossPnl: 0, fee: 0, netPnl: 0 };
    
    const avgEntryPrice = settlement.trades.length > 0 && settlement.size > 0
      ? settlement.trades.reduce((sum, t) => sum + t.price * t.qty, 0) / settlement.size
      : settlement.entryPrice;
    const entryCost = settlement.size * avgEntryPrice;
    const exitValue = settlement.size * settlement.exitPrice;
    const grossPnl = isLong ? exitValue - entryCost : entryCost - exitValue;
    const netPnl = grossPnl - settlement.fee;
    
    return {
      avgEntryPrice,
      entryCost,
      exitValue,
      grossPnl,
      fee: settlement.fee,
      netPnl,
    };
  }, [settlement, isLong]);

  // Duration calculation
  const duration = useMemo(() => {
    if (!settlement) return "";
    return formatDistanceStrict(new Date(settlement.settledAt), new Date(settlement.openedAt));
  }, [settlement]);

  // Generate certificate ID
  const certificateId = useMemo(() => {
    if (!settlement) return "";
    const dateStr = format(new Date(settlement.settledAt), "yyMMdd");
    return `STL_${dateStr}_${settlement.id.substring(0, 6).toUpperCase()}`;
  }, [settlement]);

  const handleBack = () => {
    navigate("/portfolio");
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: "hsl(222 47% 6%)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-muted-foreground text-sm">Loading settlement...</span>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !settlement) {
    return (
      <div 
        className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
        style={{ background: "hsl(222 47% 6%)" }}
      >
        {isMobile ? (
          <MobileHeader showBack backTo="/portfolio" title="Settlement Detail" />
        ) : (
          <EventsDesktopHeader />
        )}
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium mb-2">Settlement not found</p>
            <p className="text-sm">This settlement may not exist or you don't have access to it.</p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            Back to Portfolio
          </Button>
        </div>
        {isMobile && <BottomNav />}
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
      style={{
        background: isMobile 
          ? "hsl(222 47% 6%)" 
          : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(260 50% 15% / 0.3) 0%, hsl(222 47% 6%) 70%)"
      }}
    >
      {/* Header */}
      {isMobile ? (
        <MobileHeader 
          showBack
          backTo="/portfolio"
          title="Settlement Detail"
          rightContent={
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          }
        />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-4xl mx-auto"} space-y-6`}>
        {/* Desktop: Back & Share buttons */}
        {!isMobile && (
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        )}

        {/* Core Info Card */}
        <div className={`bg-card rounded-2xl ${isMobile ? "p-4" : "p-6"} relative overflow-hidden`}>
          {/* Background glow for win */}
          {isWin && (
            <div className="absolute top-0 right-0 w-48 h-48 bg-trading-green/10 rounded-full blur-3xl" />
          )}
          
          <div className="relative">
            {/* Event & Option */}
            <div className="mb-4">
              <h1 className={`font-bold text-foreground leading-tight ${isMobile ? "text-lg" : "text-xl"} mb-2`}>
                {settlement.event}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={isLong 
                    ? "border-trading-green/50 text-trading-green bg-trading-green/10" 
                    : "border-trading-red/50 text-trading-red bg-trading-red/10"
                  }
                >
                  {isLong ? "Long" : "Short"} {settlement.leverage}x
                </Badge>
                <span className="text-muted-foreground text-sm">{settlement.option}</span>
              </div>
            </div>

            {/* Result & P&L */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              isWin ? "bg-trading-green/10 border border-trading-green/30" : "bg-trading-red/10 border border-trading-red/30"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isWin ? "bg-trading-green/20" : "bg-trading-red/20"}`}>
                  {isWin ? <Trophy className="w-5 h-5 text-trading-green" /> : <TrendingDown className="w-5 h-5 text-trading-red" />}
                </div>
                <div>
                  <span className={`text-xs uppercase tracking-wide ${isWin ? "text-trading-green/80" : "text-trading-red/80"}`}>
                    {isWin ? "You Won!" : "You Lost"}
                  </span>
                  <div className={`font-mono font-bold ${isMobile ? "text-xl" : "text-2xl"} ${isWin ? "text-trading-green" : "text-trading-red"}`}>
                    {isWin ? "+" : ""}{settlement.pnl >= 0 ? "+" : ""}${Math.abs(settlement.pnl).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className={`text-right font-mono ${isWin ? "text-trading-green" : "text-trading-red"}`}>
                <span className="text-lg font-bold">
                  {settlement.pnlPercent >= 0 ? "+" : ""}{settlement.pnlPercent.toFixed(1)}%
                </span>
                <div className="text-xs opacity-70">ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className={`bg-card rounded-2xl ${isMobile ? "p-4" : "p-6"}`}>
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            Price History
          </h2>
          <SettlementPriceChart 
            priceHistory={settlement.priceHistory}
            entryPrice={pnlBreakdown.avgEntryPrice}
            exitPrice={settlement.exitPrice}
            trades={settlement.trades}
            isMobile={isMobile}
          />
        </div>

        {/* Trade History */}
        <div className={`bg-card rounded-2xl ${isMobile ? "p-4" : "p-6"}`}>
          <button 
            onClick={() => setShowTradeHistory(!showTradeHistory)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Trade History
              <Badge variant="secondary" className="text-xs">{settlement.trades.length}</Badge>
            </h2>
            {showTradeHistory ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {showTradeHistory && (
            <div className="mt-4 space-y-0">
              {/* Table Header */}
              <div className={`grid ${isMobile ? "grid-cols-4" : "grid-cols-5"} gap-2 text-xs text-muted-foreground pb-2 border-b border-border`}>
                <span>Time</span>
                <span>Action</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Price</span>
                {!isMobile && <span className="text-right">Total</span>}
              </div>
              
              {/* Table Rows */}
              {settlement.trades.map((trade, idx) => (
                <div 
                  key={trade.id} 
                  className={`grid ${isMobile ? "grid-cols-4" : "grid-cols-5"} gap-2 py-3 text-sm ${
                    idx !== settlement.trades.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(trade.time), isMobile ? "MM/dd HH:mm" : "MMM dd, HH:mm")}
                  </span>
                  <span className={trade.action === "Open" ? "text-trading-green font-medium" : "text-primary font-medium"}>
                    {trade.action}
                  </span>
                  <span className="text-right font-mono">{trade.qty.toLocaleString()}</span>
                  <span className="text-right font-mono">${trade.price.toFixed(3)}</span>
                  {!isMobile && <span className="text-right font-mono">${trade.total.toLocaleString()}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* P&L Breakdown */}
        <div className={`bg-card rounded-2xl ${isMobile ? "p-4" : "p-6"}`}>
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            P&L Breakdown
          </h2>
          
          <div className="space-y-3">
            {/* Entry Cost */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-muted-foreground text-sm">Entry Cost</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({settlement.size.toLocaleString()} × ${pnlBreakdown.avgEntryPrice.toFixed(4)})
                </span>
              </div>
              <span className="font-mono text-trading-red">-${pnlBreakdown.entryCost.toFixed(2)}</span>
            </div>
            
            {/* Exit Value */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-muted-foreground text-sm">Exit Value</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({settlement.size.toLocaleString()} × ${settlement.exitPrice.toFixed(4)})
                </span>
              </div>
              <span className="font-mono text-trading-green">+${pnlBreakdown.exitValue.toFixed(2)}</span>
            </div>
            
            {/* Divider */}
            <div className="border-t border-border/50" />
            
            {/* Gross P&L */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Gross P&L</span>
              <span className={`font-mono ${pnlBreakdown.grossPnl >= 0 ? "text-trading-green" : "text-trading-red"}`}>
                {pnlBreakdown.grossPnl >= 0 ? "+" : ""}${pnlBreakdown.grossPnl.toFixed(2)}
              </span>
            </div>
            
            {/* Trading Fee */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Trading Fees</span>
              <span className="font-mono text-trading-red">-${pnlBreakdown.fee.toFixed(2)}</span>
            </div>
            
            {/* Divider */}
            <div className="border-t border-border" />
            
            {/* Net Profit */}
            <div className="flex justify-between items-center">
              <span className="font-semibold">Net Profit</span>
              <span className={`font-mono font-bold text-lg ${pnlBreakdown.netPnl >= 0 ? "text-trading-green" : "text-trading-red"}`}>
                {pnlBreakdown.netPnl >= 0 ? "+" : ""}${pnlBreakdown.netPnl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className={`bg-card rounded-2xl ${isMobile ? "p-4" : "p-6"}`}>
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Timeline
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Opened</span>
              <span className="text-sm font-medium">{format(new Date(settlement.openedAt), "MMM d, yyyy")}</span>
              <span className="text-xs text-muted-foreground block">{format(new Date(settlement.openedAt), "HH:mm")}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Settled</span>
              <span className="text-sm font-medium">{format(new Date(settlement.settledAt), "MMM d, yyyy")}</span>
              <span className="text-xs text-muted-foreground block">{format(new Date(settlement.settledAt), "HH:mm")}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Duration</span>
              <span className="text-sm font-medium">{duration}</span>
            </div>
          </div>
        </div>

        {/* Settlement Certificate */}
        <div className={`bg-card rounded-2xl ${isMobile ? "p-4" : "p-6"} border border-border/50`}>
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-muted-foreground" />
            Settlement Certificate
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Certificate ID</span>
              <span className="font-mono text-sm">{certificateId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Settlement Time</span>
              <span className="text-sm">{format(new Date(settlement.settledAt), "MMM d, yyyy HH:mm:ss")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Verification Status</span>
              <div className="flex items-center gap-1.5 text-trading-green">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isMobile && <BottomNav />}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Win"
        subtitle="Show off your trading success"
        shareText={`I just ${isWin ? "won" : "lost"} ${settlement.pnlPercent >= 0 ? "+" : ""}${settlement.pnlPercent.toFixed(1)}% on OMENX! 🚀`}
        shareUrl={`https://omenx.com/settlement/${settlementId}`}
        fileName={`omenx-settlement-${settlementId}`}
      >
        <SettlementShareCard
          event={settlement.event}
          option={settlement.option}
          side={settlement.side}
          result={settlement.result}
          pnl={settlement.pnl}
          pnlPercent={settlement.pnlPercent}
          entryPrice={pnlBreakdown.avgEntryPrice}
          exitPrice={settlement.exitPrice}
          leverage={settlement.leverage}
          settledAt={settlement.settledAt}
        />
      </ShareModal>
    </div>
  );
}
