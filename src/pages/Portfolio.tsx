import { useState, useMemo } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { ArrowUpDown, TrendingUp, TrendingDown, Wallet, BarChart3, ChevronRight, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type SortField = "pnl" | "size" | "event" | null;
type SortDirection = "asc" | "desc";
type TabType = "positions" | "settlements";

// Mock settlements data - to be replaced with real data later
const mockSettlements = [
  {
    id: 1,
    event: "Bitcoin price on December 31, 2025?",
    option: "$95,000-$100,000",
    side: "long" as const,
    entryPrice: "$0.3200",
    exitPrice: "$1.0000",
    size: "2,500",
    pnl: "+$1,700.00",
    pnlPercent: "+212.5%",
    leverage: "10x",
    settledAt: "2025-12-31",
    result: "win" as const,
  },
  {
    id: 2,
    event: "Fed interest rate December 2025?",
    option: "25bp Cut",
    side: "short" as const,
    entryPrice: "$0.4500",
    exitPrice: "$0.0000",
    size: "1,500",
    pnl: "-$675.00",
    pnlPercent: "-100%",
    leverage: "10x",
    settledAt: "2025-12-18",
    result: "lose" as const,
  },
  {
    id: 3,
    event: "Elon Musk tweets Dec 5-12?",
    option: "180-199",
    side: "long" as const,
    entryPrice: "$0.2800",
    exitPrice: "$1.0000",
    size: "3,000",
    pnl: "+$2,160.00",
    pnlPercent: "+257.1%",
    leverage: "10x",
    settledAt: "2025-12-12",
    result: "win" as const,
  },
];

export default function Portfolio() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { positions } = usePositionsStore();
  const [activeTab, setActiveTab] = useState<TabType>("positions");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Calculate positions stats
  const positionsStats = useMemo(() => {
    const totalPnl = positions.reduce((sum, pos) => {
      const pnlValue = parseFloat(pos.pnl.replace(/[$,+]/g, "")) || 0;
      return sum + pnlValue;
    }, 0);

    const totalMargin = positions.reduce((sum, pos) => {
      const marginValue = parseFloat(pos.margin.replace(/[$,]/g, "")) || 0;
      return sum + marginValue;
    }, 0);

    const profitableCount = positions.filter(
      (pos) => !pos.pnl.startsWith("-")
    ).length;

    return {
      totalPnl,
      totalMargin,
      positionCount: positions.length,
      profitableCount,
    };
  }, [positions]);

  // Calculate settlements stats
  const settlementsStats = useMemo(() => {
    const totalPnl = mockSettlements.reduce((sum, s) => {
      const pnlValue = parseFloat(s.pnl.replace(/[$,+]/g, "")) || 0;
      return sum + pnlValue;
    }, 0);

    const winCount = mockSettlements.filter((s) => s.result === "win").length;
    const winRate = mockSettlements.length > 0 
      ? ((winCount / mockSettlements.length) * 100).toFixed(0)
      : "0";

    // Find best trade (highest positive P&L)
    const bestTrade = mockSettlements.reduce((best, s) => {
      const pnlValue = parseFloat(s.pnl.replace(/[$,+]/g, "")) || 0;
      const bestValue = parseFloat(best.pnl.replace(/[$,+]/g, "")) || 0;
      return pnlValue > bestValue ? s : best;
    }, mockSettlements[0]);

    const bestTradePnl = bestTrade 
      ? parseFloat(bestTrade.pnl.replace(/[$,+]/g, "")) || 0
      : 0;

    return {
      totalPnl,
      winCount,
      winRate,
      totalCount: mockSettlements.length,
      bestTradePnl,
    };
  }, []);

  // Sort positions
  const sortedPositions = useMemo(() => {
    if (!sortField) return positions;

    return [...positions].sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortField) {
        case "pnl":
          aValue = parseFloat(a.pnl.replace(/[$,+]/g, "")) || 0;
          bValue = parseFloat(b.pnl.replace(/[$,+]/g, "")) || 0;
          break;
        case "size":
          aValue = parseFloat(a.size.replace(/,/g, "")) || 0;
          bValue = parseFloat(b.size.replace(/,/g, "")) || 0;
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [positions, sortField, sortDirection]);

  // Sort settlements
  const sortedSettlements = useMemo(() => {
    if (!sortField) return mockSettlements;

    return [...mockSettlements].sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortField) {
        case "pnl":
          aValue = parseFloat(a.pnl.replace(/[$,+]/g, "")) || 0;
          bValue = parseFloat(b.pnl.replace(/[$,+]/g, "")) || 0;
          break;
        case "size":
          aValue = parseFloat(a.size.replace(/,/g, "")) || 0;
          bValue = parseFloat(b.size.replace(/,/g, "")) || 0;
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handlePositionAction = (index: number) => {
    navigate("/trade/order", {
      state: { tab: "Positions", highlightPosition: index },
    });
  };

  const handleSettlementAction = (id: number) => {
    // TODO: Navigate to settlement detail page when designed
    console.log("Settlement detail:", id);
  };

  const isProfitable = (pnl: string) => !pnl.startsWith("-");

  const showBackButton = navigationType === "PUSH";

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
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Logo size="md" />
            </div>
            <span className="text-sm font-medium">Portfolio</span>
          </div>
        </header>
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

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("positions")}
            className={`py-2 px-4 text-sm font-medium transition-all ${
              activeTab === "positions"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab("settlements")}
            className={`py-2 px-4 text-sm font-medium transition-all ${
              activeTab === "settlements"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Settlements ({mockSettlements.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "positions" && (
          <>
            {/* Positions Stats Cards */}
            <div className={`grid gap-3 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Unrealized P&L</span>
                </div>
                <div
                  className={`text-lg font-bold font-mono ${
                    positionsStats.totalPnl >= 0 ? "text-trading-green" : "text-trading-red"
                  }`}
                >
                  {positionsStats.totalPnl >= 0 ? "+" : ""}${Math.abs(positionsStats.totalPnl).toFixed(2)}
                </div>
              </div>

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Total Margin</span>
                </div>
                <div className="text-lg font-bold font-mono">
                  ${positionsStats.totalMargin.toFixed(2)}
                </div>
              </div>

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Open Positions</span>
                </div>
                <div className="text-lg font-bold">{positionsStats.positionCount}</div>
              </div>

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Profitable</span>
                </div>
                <div className="text-lg font-bold text-trading-green">
                  {positionsStats.profitableCount}/{positionsStats.positionCount}
                </div>
              </div>
            </div>

            {isMobile ? (
              /* Mobile: Card View */
              <div className="space-y-3">
                {sortedPositions.map((position, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            position.type === "long"
                              ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                              : "border-trading-red/50 text-trading-red bg-trading-red/10"
                          }`}
                        >
                          {position.type === "long" ? "Long" : "Short"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {position.leverage}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold ${
                          isProfitable(position.pnl)
                            ? "text-trading-green"
                            : "text-trading-red"
                        }`}
                      >
                        {isProfitable(position.pnl) ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {position.pnl} ({position.pnlPercent})
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="mb-2">
                      <h3 className="font-medium text-sm line-clamp-1">
                        {position.event}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {position.option}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Size
                        </span>
                        <span className="font-mono text-xs">{position.size}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Entry
                        </span>
                        <span className="font-mono text-xs">
                          {position.entryPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Mark
                        </span>
                        <span className="font-mono text-xs">
                          {position.markPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Margin
                        </span>
                        <span className="font-mono text-xs">{position.margin}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handlePositionAction(index)}
                    >
                      Action
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop: Table View */
              <div className="bg-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Contract</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("size")}
                      >
                        <div className="flex items-center gap-1">
                          Size
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Mark Price</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("pnl")}
                      >
                        <div className="flex items-center gap-1">
                          P&L
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead>TP/SL</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPositions.map((position, index) => (
                      <TableRow key={index} className="cursor-pointer">
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm line-clamp-1">
                              {position.option}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {position.event}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                position.type === "long"
                                  ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                                  : "border-trading-red/50 text-trading-red bg-trading-red/10"
                              }`}
                            >
                              {position.type === "long" ? "Long" : "Short"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {position.leverage}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {position.size}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {position.entryPrice}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {position.markPrice}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {position.margin}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-mono text-sm font-medium ${
                              isProfitable(position.pnl)
                                ? "text-trading-green"
                                : "text-trading-red"
                            }`}
                          >
                            {position.pnl}
                            <span className="text-xs ml-1 opacity-70">
                              ({position.pnlPercent})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono">
                            {position.tp || position.sl ? (
                              <span>
                                {position.tp && (
                                  <span className="text-trading-green">
                                    {position.tpMode === "%" ? `+${position.tp}%` : `$${position.tp}`}
                                  </span>
                                )}
                                {position.tp && position.sl && " / "}
                                {position.sl && (
                                  <span className="text-trading-red">
                                    {position.slMode === "%" ? `-${position.sl}%` : `$${position.sl}`}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handlePositionAction(index)}
                          >
                            Action
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {activeTab === "settlements" && (
          <>
            {/* Settlements Stats Cards */}
            <div className={`grid gap-3 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
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

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Win Rate</span>
                </div>
                <div className="text-lg font-bold text-trading-green">
                  {settlementsStats.winRate}%
                </div>
              </div>

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Total Settlements</span>
                </div>
                <div className="text-lg font-bold">{settlementsStats.totalCount}</div>
              </div>

              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Best Trade</span>
                </div>
                <div className="text-lg font-bold font-mono text-trading-green">
                  +${settlementsStats.bestTradePnl.toFixed(2)}
                </div>
              </div>
            </div>

            {isMobile ? (
              /* Mobile: Card View */
              <div className="space-y-3">
                {sortedSettlements.map((settlement) => (
                  <div
                    key={settlement.id}
                    className="bg-card rounded-xl p-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            settlement.side === "long"
                              ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                              : "border-trading-red/50 text-trading-red bg-trading-red/10"
                          }`}
                        >
                          {settlement.side === "long" ? "Long" : "Short"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            settlement.result === "win"
                              ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                              : "border-trading-red/50 text-trading-red bg-trading-red/10"
                          }`}
                        >
                          {settlement.result === "win" ? "WIN" : "LOSE"}
                        </Badge>
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
                      <h3 className="font-medium text-sm line-clamp-1">
                        {settlement.event}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {settlement.option}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Entry
                        </span>
                        <span className="font-mono text-xs">
                          {settlement.entryPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Exit
                        </span>
                        <span className="font-mono text-xs">
                          {settlement.exitPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Size
                        </span>
                        <span className="font-mono text-xs">{settlement.size}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Settled
                        </span>
                        <span className="text-xs">{settlement.settledAt}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleSettlementAction(settlement.id)}
                    >
                      View Details
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop: Table View */
              <div className="bg-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Contract</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("size")}
                      >
                        <div className="flex items-center gap-1">
                          Size
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("pnl")}
                      >
                        <div className="flex items-center gap-1">
                          P&L
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead>Settled At</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSettlements.map((settlement) => (
                      <TableRow key={settlement.id} className="cursor-pointer">
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm line-clamp-1">
                              {settlement.option}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {settlement.event}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                settlement.side === "long"
                                  ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                                  : "border-trading-red/50 text-trading-red bg-trading-red/10"
                              }`}
                            >
                              {settlement.side === "long" ? "Long" : "Short"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {settlement.leverage}
                            </span>
                          </div>
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
                            {settlement.result === "win" ? "WIN" : "LOSE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {settlement.entryPrice}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {settlement.exitPrice}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {settlement.size}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-mono text-sm font-medium ${
                              isProfitable(settlement.pnl)
                                ? "text-trading-green"
                                : "text-trading-red"
                            }`}
                          >
                            {settlement.pnl}
                            <span className="text-xs ml-1 opacity-70">
                              ({settlement.pnlPercent})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {settlement.settledAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleSettlementAction(settlement.id)}
                          >
                            Details
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
}
