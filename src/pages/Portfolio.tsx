import { useState, useMemo } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { ArrowUpDown, TrendingUp, TrendingDown, Wallet, BarChart3, ChevronRight, Info, Percent, AlertTriangle, Loader2, LogIn } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePositionsStore } from "@/stores/usePositionsStore";
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
import { TRADING_TERMS } from "@/lib/tradingTerms";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SortField = "pnl" | "size" | "event" | null;
type SortDirection = "asc" | "desc";
type TabType = "positions" | "settlements";

// Portfolio Tab 下拉组件 - 类似 Events 的 Active/Resolved 切换
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

export default function Portfolio() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { user, isLoading: authLoading } = useUserProfile();
  const { positions } = usePositionsStore();
  const { data: settlements = [], isLoading: settlementsLoading } = useSettlements();
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

    // Calculate ROI: (Total Unrealized P&L / Total Margin) * 100
    const roi = totalMargin > 0 ? (totalPnl / totalMargin) * 100 : 0;

    // Calculate Liquidation Risk (mock: based on average margin utilization)
    // In real scenario, this would be based on maintenance margin vs current margin
    const avgLeverage = positions.length > 0
      ? positions.reduce((sum, pos) => sum + (typeof pos.leverage === 'number' ? pos.leverage : 10), 0) / positions.length
      : 0;
    // Higher leverage = higher risk, scale to 0-100%
    const liqRisk = Math.min(avgLeverage * 5, 100);

    return {
      totalPnl,
      totalMargin,
      roi,
      liqRisk,
    };
  }, [positions]);

  // Calculate settlements stats from real data
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
    if (!sortField) return settlements;

    return [...settlements].sort((a, b) => {
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
  }, [settlements, sortField, sortDirection]);

  // If not logged in, show login prompt
  if (!authLoading && !user) {
    return (
      <div 
        className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
        style={{
          background: isMobile 
            ? "hsl(222 47% 6%)" 
            : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(260 50% 15% / 0.3) 0%, hsl(222 47% 6%) 70%)"
        }}
      >
        {isMobile ? (
          <MobileHeader showLogo />
        ) : (
          <EventsDesktopHeader />
        )}
        
        <main className={`${isMobile ? "px-4" : "px-8 max-w-7xl mx-auto"} flex items-center justify-center`} style={{ minHeight: "calc(100vh - 200px)" }}>
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary/50 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Sign in to view your portfolio</h2>
              <p className="text-muted-foreground">
                Track your open positions and settlement history by signing in to your account.
              </p>
            </div>
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </main>

        {isMobile && <BottomNav />}
      </div>
    );
  }


  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handlePositionAction = (index: number) => {
    if (isMobile) {
      navigate("/trade/order", {
        state: { tab: "Positions", highlightPosition: index },
      });
    } else {
      navigate("/trade", {
        state: { tab: "Positions", highlightPosition: index },
      });
    }
  };

  const handleSettlementAction = (id: string) => {
    navigate(`/portfolio/settlement/${id}`);
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
      {/* Header - 主入口页：Logo + Tab下拉切换 */}
      {isMobile ? (
        <MobileHeader 
          showLogo
          rightContent={
            <PortfolioTabDropdown
              activeTab={activeTab}
              onTabChange={(tab) => tab === "settlements" ? navigate("/portfolio/settlements") : setActiveTab(tab)}
              positionsCount={positions.length}
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

        {/* Desktop Tabs - 桌面端保留原有tabs */}
        {!isMobile && (
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
              Settlements ({settlements.length})
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === "positions" && (
          <>
            {/* Positions Stats Cards */}
            <div className={`grid gap-3 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
              {/* Unrealized P&L */}
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Unrealized P&L</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </PopoverTrigger>
                      <PopoverContent className="text-xs w-64">
                        Total unrealized profit/loss across all open positions, calculated as (Mark Price - Entry Price) × Qty for each position.
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-64">
                        Total unrealized profit/loss across all open positions, calculated as (Mark Price - Entry Price) × Qty for each position.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div
                  className={`text-lg font-bold font-mono ${
                    positionsStats.totalPnl >= 0 ? "text-trading-green" : "text-trading-red"
                  }`}
                >
                  {positionsStats.totalPnl >= 0 ? "+" : ""}${Math.abs(positionsStats.totalPnl).toFixed(2)}
                </div>
              </div>

              {/* Total Margin */}
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Total Margin</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </PopoverTrigger>
                      <PopoverContent className="text-xs w-64">
                        Sum of margin locked in all open positions. This is your capital at risk.
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-64">
                        Sum of margin locked in all open positions. This is your capital at risk.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="text-lg font-bold font-mono">
                  ${positionsStats.totalMargin.toFixed(2)}
                </div>
              </div>

              {/* ROI % */}
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Percent className="w-3.5 h-3.5" />
                  <span>ROI %</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </PopoverTrigger>
                      <PopoverContent className="text-xs w-64">
                        Return on Investment. Calculated as (Unrealized P&L / Total Margin) × 100%. Shows the efficiency of your capital.
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-64">
                        Return on Investment. Calculated as (Unrealized P&L / Total Margin) × 100%. Shows the efficiency of your capital.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className={`text-lg font-bold font-mono ${
                  positionsStats.roi >= 0 ? "text-trading-green" : "text-trading-red"
                }`}>
                  {positionsStats.roi >= 0 ? "+" : ""}{positionsStats.roi.toFixed(2)}%
                </div>
              </div>

              {/* Liq. Risk */}
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Liq. Risk</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </PopoverTrigger>
                      <PopoverContent className="text-xs w-64">
                        Liquidation risk indicator based on average leverage. Higher leverage = higher risk of forced liquidation when price moves against you.
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-64">
                        Liquidation risk indicator based on average leverage. Higher leverage = higher risk of forced liquidation when price moves against you.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className={`text-lg font-bold ${
                  positionsStats.liqRisk > 70 ? "text-trading-red" : 
                  positionsStats.liqRisk > 40 ? "text-yellow-500" : "text-trading-green"
                }`}>
                  {positionsStats.liqRisk.toFixed(0)}%
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
                          {TRADING_TERMS.QTY}
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
                          {TRADING_TERMS.MARGIN}
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
                      {TRADING_TERMS.VIEW}
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
                      <TableHead className="w-[200px]">{TRADING_TERMS.CONTRACT}</TableHead>
                      <TableHead>{TRADING_TERMS.SIDE}</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("size")}
                      >
                        <div className="flex items-center gap-1">
                          {TRADING_TERMS.QTY}
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead>{TRADING_TERMS.ENTRY_PRICE}</TableHead>
                      <TableHead>{TRADING_TERMS.MARK_PRICE}</TableHead>
                      <TableHead>{TRADING_TERMS.MARGIN}</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("pnl")}
                      >
                        <div className="flex items-center gap-1">
                          {TRADING_TERMS.PNL}
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead>{TRADING_TERMS.TPSL}</TableHead>
                      <TableHead className="text-right">{TRADING_TERMS.ACTION}</TableHead>
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
                            {TRADING_TERMS.VIEW}
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
            <div className={`grid gap-3 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-2 max-w-lg"}`}>
              {/* Realized P&L */}
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Realized P&L</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </PopoverTrigger>
                      <PopoverContent className="text-xs w-64">
                        Total profit/loss from all settled (closed) positions. This is your actual realized gain or loss.
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-64">
                        Total profit/loss from all settled (closed) positions. This is your actual realized gain or loss.
                      </TooltipContent>
                    </Tooltip>
                  )}
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
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Win Rate</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </PopoverTrigger>
                      <PopoverContent className="text-xs w-64">
                        Percentage of winning trades. Calculated as (Winning Trades / Total Trades) × 100%.
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 cursor-pointer hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-64">
                        Percentage of winning trades. Calculated as (Winning Trades / Total Trades) × 100%.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="text-lg font-bold text-trading-green">
                  {settlementsStats.winRate}%
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
                          {TRADING_TERMS.QTY}
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
                      {TRADING_TERMS.VIEW}
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
                          {TRADING_TERMS.QTY}
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
                            {TRADING_TERMS.VIEW}
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
