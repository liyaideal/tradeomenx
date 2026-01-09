import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Trophy, ChevronRight, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettlements } from "@/hooks/useSettlements";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type TabType = "positions" | "settlements";

// Portfolio Tab 下拉组件
const PortfolioTabDropdown = ({
  activeTab,
  onTabChange,
  positionsCount,
  settlementsCount,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  positionsCount: number;
  settlementsCount: number;
}) => {
  const tabOptions: { value: TabType; label: string }[] = [
    { value: "positions", label: `Positions (${positionsCount})` },
    { value: "settlements", label: `Settlements (${settlementsCount})` },
  ];

  return (
    <Select value={activeTab} onValueChange={(v) => onTabChange(v as TabType)}>
      <SelectTrigger className="w-[140px] bg-secondary border-border/50 h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {tabOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function PortfolioSettlements() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: settlements = [], isLoading } = useSettlements();

  // Calculate settlements stats
  const settlementsStats = useMemo(() => {
    const totalPnl = settlements.reduce((sum, s) => {
      const pnlValue = parseFloat(s.pnl.replace(/[$,+]/g, "")) || 0;
      return sum + pnlValue;
    }, 0);

    const winCount = settlements.filter((s) => s.result === "win").length;
    const winRate = settlements.length > 0 
      ? ((winCount / settlements.length) * 100).toFixed(0)
      : "0";

    return {
      totalPnl,
      winCount,
      winRate,
      totalCount: settlements.length,
    };
  }, [settlements]);

  const handleTabChange = (tab: TabType) => {
    if (tab === "positions") {
      navigate("/portfolio");
    }
  };

  const handleSettlementAction = (id: string) => {
    navigate(`/portfolio/settlement/${id}`);
  };

  const isProfitable = (pnl: string) => !pnl.startsWith("-");

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
          showLogo
          rightContent={
            <PortfolioTabDropdown
              activeTab="settlements"
              onTabChange={handleTabChange}
              positionsCount={0}
              settlementsCount={settlements.length}
            />
          }
        />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-7xl mx-auto"} space-y-8`}>
        {/* Page Title */}
        <div className="relative">
          {!isMobile && (
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
          )}
          <div>
            <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
              Portfolio
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5 max-w-lg">
              Track your open positions and settlement history
            </p>
          </div>
        </div>

        {/* Desktop Tabs */}
        {!isMobile && (
          <div className="flex border-b border-border">
            <button
              onClick={() => navigate("/portfolio")}
              className="py-2 px-4 text-sm font-medium transition-all text-muted-foreground"
            >
              Positions
            </button>
            <button
              className="py-2 px-4 text-sm font-medium transition-all text-primary border-b-2 border-primary"
            >
              Settlements ({settlements.length})
            </button>
          </div>
        )}

        {/* Settlements Stats Cards */}
        <div className={`grid gap-3 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
          {/* Realized P&L */}
          <div className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realized P&L</span>
            </div>
            <div
              className={`text-lg font-bold font-mono ${
                settlementsStats.totalPnl >= 0 ? "text-trading-green" : "text-trading-red"
              }`}
            >
              {settlementsStats.totalPnl >= 0 ? "+" : ""}${Math.abs(settlementsStats.totalPnl).toFixed(2)}
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Win Rate</span>
            </div>
            <div className="text-lg font-bold font-mono text-foreground">
              {settlementsStats.winRate}%
            </div>
          </div>

          {/* Wins */}
          <div className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Wins</span>
            </div>
            <div className="text-lg font-bold font-mono text-trading-green">
              {settlementsStats.winCount}
            </div>
          </div>

          {/* Losses */}
          <div className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Losses</span>
            </div>
            <div className="text-lg font-bold font-mono text-trading-red">
              {settlementsStats.totalCount - settlementsStats.winCount}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && settlements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No settlements yet</p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              Your closed trades will appear here
            </p>
          </div>
        )}

        {/* Settlements List */}
        {!isLoading && settlements.length > 0 && (
          isMobile ? (
            <div className="space-y-3">
              {settlements.map((settlement) => (
                <div
                  key={settlement.id}
                  onClick={() => handleSettlementAction(settlement.id)}
                  className="bg-card rounded-xl p-3 cursor-pointer hover:bg-card/80 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          settlement.result === "win"
                            ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                            : "border-trading-red/50 text-trading-red bg-trading-red/10"
                        }`}
                      >
                        {settlement.result === "win" ? "Win" : "Loss"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {settlement.settledAt}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        isProfitable(settlement.pnl)
                          ? "text-trading-green"
                          : "text-trading-red"
                      }`}
                    >
                      {isProfitable(settlement.pnl) ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {settlement.pnl}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="mb-2">
                    <div className="text-sm font-medium text-foreground line-clamp-1">
                      {settlement.event}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {settlement.option}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      Size: <span className="font-mono">{settlement.size}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Event</TableHead>
                    <TableHead className="text-muted-foreground">Option</TableHead>
                    <TableHead className="text-muted-foreground">Result</TableHead>
                    <TableHead className="text-muted-foreground text-right">Size</TableHead>
                    <TableHead className="text-muted-foreground text-right">P&L</TableHead>
                    <TableHead className="text-muted-foreground text-right">Settled</TableHead>
                    <TableHead className="text-muted-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow
                      key={settlement.id}
                      className="border-border/50 cursor-pointer"
                      onClick={() => handleSettlementAction(settlement.id)}
                    >
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {settlement.event}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {settlement.option}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            settlement.result === "win"
                              ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                              : "border-trading-red/50 text-trading-red bg-trading-red/10"
                          }`}
                        >
                          {settlement.result === "win" ? "Win" : "Loss"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {settlement.size}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono font-medium ${
                          isProfitable(settlement.pnl)
                            ? "text-trading-green"
                            : "text-trading-red"
                        }`}
                      >
                        {settlement.pnl}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {settlement.settledAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        )}
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
}
