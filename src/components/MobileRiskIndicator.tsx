import { useState, useMemo } from "react";
import { ShieldCheck, AlertTriangle, Ban, Zap, Eye, EyeOff, Info, ChevronRight } from "lucide-react";
import { MobileDrawer } from "@/components/ui/mobile-drawer";
import { useSupabasePositions } from "@/hooks/useSupabasePositions";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type RiskLevel = "SAFE" | "WARNING" | "RESTRICTION" | "LIQUIDATION";

interface RiskMetrics {
  totalAssets: number;
  totalExposure: number;
  equity: number;
  imTotal: number;
  mmTotal: number;
  riskRatio: number;
  riskLevel: RiskLevel;
  availableMargin: number;
  distanceToLiquidation: number;
  unrealizedPnL: number;
  hasPositions: boolean;
}

function useRiskMetrics(): RiskMetrics {
  const { positions } = useSupabasePositions();
  const { balance } = useUserProfile();

  return useMemo(() => {
    const totalAssets = balance;
    
    const totalExposure = positions.reduce((sum, pos) => {
      const size = Number(pos.size) || 0;
      const entryPrice = Number(pos.entry_price) || 0;
      return sum + (size * entryPrice);
    }, 0);
    
    const imTotal = positions.reduce((sum, pos) => sum + (Number(pos.margin) || 0), 0);
    const mmTotal = imTotal * 0.5;
    const unrealizedPnL = positions.reduce((sum, pos) => sum + (Number(pos.pnl) || 0), 0);
    const equity = totalAssets + unrealizedPnL;
    const riskRatio = equity > 0 ? (imTotal / equity) * 100 : 0;
    
    let riskLevel: RiskLevel = "SAFE";
    if (riskRatio >= 100) {
      riskLevel = "LIQUIDATION";
    } else if (riskRatio >= 95) {
      riskLevel = "RESTRICTION";
    } else if (riskRatio >= 80) {
      riskLevel = "WARNING";
    }
    
    const availableMargin = Math.max(equity - imTotal, 0);
    const distanceToLiquidation = Math.max(equity - imTotal, 0);
    
    return {
      totalAssets,
      totalExposure,
      equity,
      imTotal,
      mmTotal,
      riskRatio: Math.min(riskRatio, 150),
      riskLevel,
      availableMargin,
      distanceToLiquidation,
      unrealizedPnL,
      hasPositions: positions.length > 0,
    };
  }, [positions, balance]);
}

// Get color based on risk level
const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case "SAFE": return "text-trading-green";
    case "WARNING": return "text-trading-yellow";
    case "RESTRICTION": return "text-orange-500";
    case "LIQUIDATION": return "text-trading-red";
  }
};

const getRiskBgColor = (level: RiskLevel) => {
  switch (level) {
    case "SAFE": return "bg-trading-green";
    case "WARNING": return "bg-trading-yellow";
    case "RESTRICTION": return "bg-orange-500";
    case "LIQUIDATION": return "bg-trading-red";
  }
};

const getRiskIcon = (level: RiskLevel) => {
  switch (level) {
    case "SAFE": return <ShieldCheck className="w-3 h-3" />;
    case "WARNING": return <AlertTriangle className="w-3 h-3" />;
    case "RESTRICTION": return <Ban className="w-3 h-3" />;
    case "LIQUIDATION": return <Zap className="w-3 h-3" />;
  }
};

const getRiskMessage = (level: RiskLevel) => {
  switch (level) {
    case "SAFE": 
      return { icon: "✅", text: "Normal trading available" };
    case "WARNING": 
      return { icon: "⚠️", text: "Opening restricted, consider reducing" };
    case "RESTRICTION": 
      return { icon: "🚨", text: "Close-only mode, no new positions" };
    case "LIQUIDATION": 
      return { icon: "💥", text: "Liquidation triggered!" };
  }
};

/**
 * Compact MM indicator badge that opens full account risk drawer
 */
export function MobileRiskIndicator() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const riskMetrics = useRiskMetrics();

  // MM ratio = MM / Equity
  const mmRatio = riskMetrics.equity > 0 
    ? (riskMetrics.mmTotal / riskMetrics.equity) * 100 
    : 0;

  return (
    <>
      {/* Compact MM Badge */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted transition-colors"
      >
        <span className="text-[10px] text-muted-foreground">MM</span>
        <span className={`text-xs font-mono font-medium ${getRiskColor(riskMetrics.riskLevel)}`}>
          {mmRatio.toFixed(2)}%
        </span>
      </button>

      {/* Full Account Risk Drawer */}
      <AccountRiskDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        riskMetrics={riskMetrics}
      />
    </>
  );
}

interface AccountRiskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskMetrics: RiskMetrics;
}

function AccountRiskDrawer({ open, onOpenChange, riskMetrics }: AccountRiskDrawerProps) {
  const [showValues, setShowValues] = useState(true);
  const riskMessage = getRiskMessage(riskMetrics.riskLevel);

  const getProgressWidth = (ratio: number) => Math.min(ratio, 100);

  return (
    <MobileDrawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4 pb-6">
        {/* Title with icons on the right */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Unified Trading Account</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowValues(!showValues)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="w-[280px] p-3">
                <div className="space-y-2 text-xs">
                  <p><strong>Risk Ratio</strong> = IM / Equity</p>
                  <p><strong>IM (Initial Margin):</strong> Entry threshold - determines if you can open positions.</p>
                  <p><strong>MM (Maintenance Margin):</strong> Survival line - determines if you'll be liquidated.</p>
                  <p><strong>Equity:</strong> Your real wealth - determines how much you can still lose.</p>
                  <div className="pt-1 border-t border-border/50 space-y-1">
                    <p className="text-trading-green">SAFE: &lt;80% - Normal trading</p>
                    <p className="text-trading-yellow">WARNING: 80-95% - Reduce positions</p>
                    <p className="text-orange-500">RESTRICTION: 95-100% - Close only</p>
                    <p className="text-trading-red">LIQUIDATION: ≥100% - Force close</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Margin Mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Margin Mode</span>
          <button className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
            Cross Margin
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Account Equity */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Account Equity</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold text-foreground">
              {showValues ? `$${riskMetrics.equity.toFixed(2)}` : "****"}
            </span>
            {riskMetrics.unrealizedPnL !== 0 && showValues && (
              <span className={`text-xs font-mono ${riskMetrics.unrealizedPnL >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
                ({riskMetrics.unrealizedPnL >= 0 ? '+' : ''}{riskMetrics.unrealizedPnL.toFixed(2)})
              </span>
            )}
          </div>
        </div>

        {/* Risk Ratio - Main Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Ratio</span>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${getRiskBgColor(riskMetrics.riskLevel)}/20 ${getRiskColor(riskMetrics.riskLevel)}`}>
                {getRiskIcon(riskMetrics.riskLevel)}
                {riskMetrics.riskLevel}
              </span>
            </div>
            <span className={`text-sm font-mono font-semibold ${getRiskColor(riskMetrics.riskLevel)}`}>
              {showValues ? `${riskMetrics.riskRatio.toFixed(2)}%` : "****"}
            </span>
          </div>
          
          {/* Risk Progress Bar with threshold markers */}
          <div className="relative">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getRiskBgColor(riskMetrics.riskLevel)}`}
                style={{ width: `${getProgressWidth(riskMetrics.riskRatio)}%` }}
              />
            </div>
            {/* Threshold markers */}
            <div className="absolute top-0 left-[80%] w-px h-2.5 bg-trading-yellow/70" />
            <div className="absolute top-0 left-[95%] w-px h-2.5 bg-orange-500/70" />
          </div>
          
          {/* Threshold labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0%</span>
            <span className="text-trading-yellow">80%</span>
            <span className="text-orange-500">95%</span>
            <span className="text-trading-red">100%</span>
          </div>
        </div>

        {/* IM & MM Summary */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/30">
          <div>
            <span className="text-xs text-muted-foreground">Initial Margin</span>
            <p className="text-base font-mono text-foreground">
              {showValues ? `$${riskMetrics.imTotal.toFixed(2)}` : "****"}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Maint. Margin</span>
            <p className="text-base font-mono text-foreground">
              {showValues ? `$${riskMetrics.mmTotal.toFixed(2)}` : "****"}
            </p>
          </div>
        </div>

        {/* Risk Status Message */}
        {riskMetrics.hasPositions && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            riskMetrics.riskLevel === "LIQUIDATION" 
              ? "bg-trading-red/10 text-trading-red border border-trading-red/30"
              : riskMetrics.riskLevel === "RESTRICTION"
              ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
              : riskMetrics.riskLevel === "WARNING"
              ? "bg-trading-yellow/10 text-trading-yellow border border-trading-yellow/30"
              : "bg-trading-green/10 text-trading-green border border-trading-green/30"
          }`}>
            <span className="text-lg">{riskMessage.icon}</span>
            <span>{riskMessage.text}</span>
          </div>
        )}
      </div>
    </MobileDrawer>
  );
}
