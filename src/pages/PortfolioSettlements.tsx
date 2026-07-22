import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Trophy, ChevronRight } from "lucide-react";
import { EmptyState, LoadingState, ErrorState } from "@/components/states";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettlements } from "@/hooks/useSettlements";
import { useEventDisplayLookup } from "@/hooks/useEventDisplayLookup";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";
import { usePositions } from "@/hooks/usePositions";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
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
import { STATUS_STYLES } from "@/lib/statusStyles";
import { ProductLineBadge } from "@/lib/productLineBadge";

type TabType = "positions" | "settlements" | "airdrops";

// Portfolio Tab 下拉组件
const PortfolioTabDropdown = ({
  activeTab,
  onTabChange,
  positionsCount,
  settlementsCount,
  airdropsCount,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  positionsCount: number;
  settlementsCount: number;
  airdropsCount: number;
}) => {
  const tabOptions: { value: TabType; label: string }[] = [
    { value: "positions", label: `Positions (${positionsCount})` },
    { value: "settlements", label: `Settlements (${settlementsCount})` },
    { value: "airdrops", label: `Airdrops (${airdropsCount})` },
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
  const { user, isLoading: authLoading } = useUserProfile();
  const { data: settlements = [], isLoading, isError, refetch } = useSettlements();
  const { airdrops } = useAirdropPositions();
  const { positions } = usePositions();
  const resolveDisplayOption = useEventDisplayLookup();

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
    } else if (tab === "airdrops") {
      navigate("/portfolio/airdrops");
    }
  };

  const handleSettlementAction = (id: string) => {
    navigate(`/portfolio/settlement/${id}`);
  };

  const isProfitable = (pnl: string) => !pnl.startsWith("-");

  const isGuest = !authLoading && !user;

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
              positionsCount={positions.length}
              settlementsCount={settlements.length}
              airdropsCount={airdrops.length}
            />
          }
        />
      ) : (
        <EventsDesktopHeader />
      )}

      <AuthGateOverlay title="Sign in to view your settlements" description="Track your settlement history by signing in to your account.">
      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-7xl mx-auto"} space-y-8`}>
        {/* Page Title */}
        {!isMobile && <PageHeader title="Portfolio" subtitle="Track your open positions and settlement history" />}

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
            <button
              onClick={() => navigate("/portfolio/airdrops")}
              className="py-2 px-4 text-sm font-medium transition-all text-muted-foreground"
            >
              Airdrops ({airdrops.length})
            </button>
          </div>
        )}

        {/* Settlements Stats Cards - Only 2 cards */}
        <div className={`grid gap-3 mb-6 grid-cols-2`}>
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
        </div>

        {/* Loading State */}
        {isLoading && <LoadingState label="Loading settlements…" />}

        {/* Error State */}
        {!isLoading && isError && (
          <ErrorState
            title="Couldn't load settlements"
            description="Something went wrong fetching your settlements."
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && settlements.length === 0 && (
          <EmptyState
            variant="card"
            icon={Trophy}
            title="No settlements yet"
            description="Your closed trades will appear here."
          />
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
                          settlement.result === "win" ? STATUS_STYLES.success.badge : STATUS_STYLES.error.badge
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
                      {resolveDisplayOption(settlement.event, settlement.option)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      {TRADING_TERMS.QTY}: <span className="font-mono">{settlement.size}</span>
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
                    <TableHead className="text-muted-foreground text-right">{TRADING_TERMS.QTY}</TableHead>
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
                        {resolveDisplayOption(settlement.event, settlement.option)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            settlement.result === "win" ? STATUS_STYLES.success.badge : STATUS_STYLES.error.badge
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
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View
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
      </AuthGateOverlay>

      {isMobile && <BottomNav />}
    </div>
  );
}
