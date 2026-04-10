import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Loader2, Clock, Zap, AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";
import { usePositions } from "@/hooks/usePositions";
import { useSettlements } from "@/hooks/useSettlements";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
import { AirdropPositionCard } from "@/components/AirdropPositionCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Desktop table row for an airdrop
const AirdropStatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { className: string; label: string }> = {
    pending: {
      className: "border-trading-yellow/50 text-trading-yellow bg-trading-yellow/10",
      label: "Pending",
    },
    activated: {
      className: "border-trading-green/50 text-trading-green bg-trading-green/10",
      label: "Activated",
    },
    expired: {
      className: "border-border text-muted-foreground bg-muted/50",
      label: "Expired",
    },
    settled: {
      className: "border-primary/50 text-primary bg-primary/10",
      label: "Settled",
    },
  };
  const c = config[status] || config.expired;
  return (
    <Badge variant="outline" className={`text-[10px] ${c.className}`}>
      {c.label}
    </Badge>
  );
};

export default function PortfolioAirdrops() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useUserProfile();
  const { airdrops, pendingAirdrops, activatedAirdrops, expiredAirdrops, isLoading, activateAirdrop, isActivating } = useAirdropPositions();
  const { positions } = usePositions();
  const { data: settlements = [] } = useSettlements();

  const handleTabChange = (tab: TabType) => {
    if (tab === "positions") {
      navigate("/portfolio");
    } else if (tab === "settlements") {
      navigate("/portfolio/settlements");
    }
  };

  const isGuest = !authLoading && !user;

  const totalValue = useMemo(() => {
    return airdrops.reduce((sum, a) => sum + a.airdropValue, 0);
  }, [airdrops]);

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
              activeTab="airdrops"
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

      <AuthGateOverlay title="Sign in to view your airdrops" description="Track your H2E airdrop positions by signing in to your account.">
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
              Hedge-to-Earn airdrop positions from your external accounts
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
              Positions ({positions.length})
            </button>
            <button
              onClick={() => navigate("/portfolio/settlements")}
              className="py-2 px-4 text-sm font-medium transition-all text-muted-foreground"
            >
              Settlements ({settlements.length})
            </button>
            <button
              className="py-2 px-4 text-sm font-medium transition-all text-primary border-b-2 border-primary"
            >
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                Airdrops ({airdrops.length})
              </span>
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-3 grid-cols-3">
          <div className="bg-card rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Gift className="w-3.5 h-3.5 shrink-0" />
              <span>Total Value</span>
            </div>
            <p className="text-xl font-bold font-mono text-trading-green mt-3">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Pending</span>
            </div>
            <p className="text-xl font-bold font-mono text-foreground mt-3">{pendingAirdrops.length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Activated</span>
            </div>
            <p className="text-xl font-bold font-mono text-foreground mt-3">{activatedAirdrops.length}</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && airdrops.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No airdrops yet</p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              Connect an external account to start receiving counter-position airdrops
            </p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/settings")}>
              Connect Account
            </Button>
          </div>
        )}

        {/* Airdrop List */}
        {!isLoading && airdrops.length > 0 && (
          isMobile ? (
            <div className="space-y-3">
              {airdrops.map((airdrop) => (
                <div
                  key={airdrop.id}
                  className={airdrop.status === "activated" ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (airdrop.status === "activated") {
                      navigate(`/trade?event=${airdrop.counterEventId}`);
                    }
                  }}
                >
                  <AirdropPositionCard
                    airdrop={airdrop}
                    onActivate={activateAirdrop}
                    isActivating={isActivating}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Market</TableHead>
                    <TableHead className="text-muted-foreground">Side</TableHead>
                    <TableHead className="text-muted-foreground text-right">Value</TableHead>
                    <TableHead className="text-muted-foreground text-right">Price</TableHead>
                    <TableHead className="text-muted-foreground">Source</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {airdrops.map((airdrop) => (
                    <TableRow key={airdrop.id} className="border-border/50">
                      <TableCell>
                        <div className="max-w-[220px]">
                          <div className="font-medium text-foreground truncate">{airdrop.counterEventName}</div>
                          <div className="text-xs text-muted-foreground">{airdrop.counterOptionLabel}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            airdrop.counterSide === "long"
                              ? "border-trading-green/50 text-trading-green bg-trading-green/10"
                              : "border-trading-red/50 text-trading-red bg-trading-red/10"
                          }`}
                        >
                          {airdrop.counterSide === "long" ? "Long" : "Short"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-trading-green">
                        ${airdrop.airdropValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${airdrop.counterPrice.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs max-w-[160px] truncate">
                        {airdrop.externalSide} @ ${airdrop.externalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <AirdropStatusBadge status={airdrop.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {airdrop.status === "pending" ? (
                          <Button
                            size="sm"
                            onClick={() => activateAirdrop(airdrop.id)}
                            disabled={isActivating}
                            className="btn-primary h-7 text-xs gap-1"
                          >
                            <Zap className="w-3 h-3" />
                            Activate
                          </Button>
                        ) : airdrop.status === "activated" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => navigate(`/trade?event=${airdrop.counterEventId}`)}
                          >
                            View
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : null}
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
