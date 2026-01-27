import { useMemo, useState } from "react";
import { Eye, EyeOff, Info, ChevronRight, ShieldCheck, AlertTriangle, Ban, Zap } from "lucide-react";
import { useSupabasePositions } from "@/hooks/useSupabasePositions";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RiskLevel = "SAFE" | "WARNING" | "RESTRICTION" | "LIQUIDATION";

interface AccountRiskIndicatorProps {
  variant?: "compact" | "full";
}

export const AccountRiskIndicator = ({ variant = "compact" }: AccountRiskIndicatorProps) => {
  const { positions } = useSupabasePositions();
  const { balance } = useUserProfile();
  const [showValues, setShowValues] = useState(true);

  // Calculate account-level margin metrics based on proper risk model
  const riskMetrics = useMemo(() => {
    // Total Assets = current balance (before any unrealized PnL)
    const totalAssets = balance;
    
    // Calculate total exposure and margins from positions
    const totalExposure = positions.reduce((sum, pos) => {
      const size = Number(pos.size) || 0;
      const entryPrice = Number(pos.entry_price) || 0;
      return sum + (size * entryPrice);
    }, 0);
    
    // Initial Margin (IM) = sum of all position margins
    const imTotal = positions.reduce((sum, pos) => sum + (Number(pos.margin) || 0), 0);
    
    // Maintenance Margin (MM) = 50% of IM (standard ratio)
    const mmTotal = imTotal * 0.5;
    
    // Unrealized PnL from all positions
    const unrealizedPnL = positions.reduce((sum, pos) => sum + (Number(pos.pnl) || 0), 0);
    
    // Equity = Total Assets + Unrealized PnL
    const equity = totalAssets + unrealizedPnL;
    
    // Risk Ratio = IM / Equity (as percentage)
    // This is the key metric for determining risk level
    const riskRatio = equity > 0 ? (imTotal / equity) * 100 : 0;
    
    // Determine risk level based on risk ratio thresholds
    let riskLevel: RiskLevel = "SAFE";
    if (riskRatio >= 100) {
      riskLevel = "LIQUIDATION";
    } else if (riskRatio >= 95) {
      riskLevel = "RESTRICTION";
    } else if (riskRatio >= 80) {
      riskLevel = "WARNING";
    }
    
    // Available margin for new positions
    const availableMargin = Math.max(equity - imTotal, 0);
    
    // Distance to liquidation (how much more can you lose)
    const distanceToLiquidation = Math.max(equity - imTotal, 0);
    
    return {
      totalAssets,
      totalExposure,
      equity,
      imTotal,
      mmTotal,
      riskRatio: Math.min(riskRatio, 150), // Cap display at 150%
      riskLevel,
      availableMargin,
      distanceToLiquidation,
      unrealizedPnL,
      hasPositions: positions.length > 0,
    };
  }, [positions, balance]);

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
      case "SAFE": return <ShieldCheck className="w-3.5 h-3.5" />;
      case "WARNING": return <AlertTriangle className="w-3.5 h-3.5" />;
      case "RESTRICTION": return <Ban className="w-3.5 h-3.5" />;
      case "LIQUIDATION": return <Zap className="w-3.5 h-3.5" />;
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

  // Calculate progress bar width - maps 0-100% risk ratio to visual width
  const getProgressWidth = (ratio: number) => {
    return Math.min(ratio, 100);
  };

  if (variant === "compact") {
    const riskMessage = getRiskMessage(riskMetrics.riskLevel);
    
    return (
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Unified Trading Account</span>
            <button
              onClick={() => setShowValues(!showValues)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[280px]">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Margin Mode */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Margin Mode</span>
          <span className="text-xs text-foreground">Cross Margin</span>
        </div>

        {/* Account Equity */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Account Equity</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-foreground">
              {showValues ? `$${riskMetrics.equity.toFixed(2)}` : "****"}
            </span>
            {riskMetrics.unrealizedPnL !== 0 && showValues && (
              <span className={`text-[10px] font-mono ${riskMetrics.unrealizedPnL >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
                ({riskMetrics.unrealizedPnL >= 0 ? '+' : ''}{riskMetrics.unrealizedPnL.toFixed(2)})
              </span>
            )}
          </div>
        </div>

        {/* Risk Ratio - Main Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Risk Ratio</span>
              <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${getRiskBgColor(riskMetrics.riskLevel)}/20 ${getRiskColor(riskMetrics.riskLevel)}`}>
                {getRiskIcon(riskMetrics.riskLevel)}
                {riskMetrics.riskLevel}
              </span>
            </div>
            <span className={`text-xs font-mono font-semibold ${getRiskColor(riskMetrics.riskLevel)}`}>
              {showValues ? `${riskMetrics.riskRatio.toFixed(2)}%` : "****"}
            </span>
          </div>
          
          {/* Risk Progress Bar with threshold markers */}
          <div className="relative">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getRiskBgColor(riskMetrics.riskLevel)}`}
                style={{ width: `${getProgressWidth(riskMetrics.riskRatio)}%` }}
              />
            </div>
            {/* Threshold markers */}
            <div className="absolute top-0 left-[80%] w-px h-2 bg-trading-yellow/50" />
            <div className="absolute top-0 left-[95%] w-px h-2 bg-orange-500/50" />
          </div>
          
          {/* Threshold labels */}
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>0%</span>
            <span className="text-trading-yellow">80%</span>
            <span className="text-orange-500">95%</span>
            <span className="text-trading-red">100%</span>
          </div>
        </div>

        {/* IM & MM Summary */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/30">
          <div>
            <span className="text-[10px] text-muted-foreground">Initial Margin</span>
            <p className="text-xs font-mono text-foreground">
              {showValues ? `$${riskMetrics.imTotal.toFixed(2)}` : "****"}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">Maint. Margin</span>
            <p className="text-xs font-mono text-foreground">
              {showValues ? `$${riskMetrics.mmTotal.toFixed(2)}` : "****"}
            </p>
          </div>
        </div>

        {/* Risk Status Message - only show if not SAFE */}
        {riskMetrics.riskLevel !== "SAFE" && riskMetrics.hasPositions && (
          <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
            riskMetrics.riskLevel === "LIQUIDATION" 
              ? "bg-trading-red/10 text-trading-red border border-trading-red/30"
              : riskMetrics.riskLevel === "RESTRICTION"
              ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
              : "bg-trading-yellow/10 text-trading-yellow border border-trading-yellow/30"
          }`}>
            <span>{riskMessage.icon}</span>
            <span>{riskMessage.text}</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant with more details (for future use)
  const riskMessage = getRiskMessage(riskMetrics.riskLevel);
  
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Account Risk Status</span>
          <button
            onClick={() => setShowValues(!showValues)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getRiskBgColor(riskMetrics.riskLevel)}/20 ${getRiskColor(riskMetrics.riskLevel)}`}>
          {getRiskIcon(riskMetrics.riskLevel)}
          <span className="text-xs font-medium">{riskMetrics.riskLevel}</span>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-muted-foreground">Account Equity</span>
          <p className="text-lg font-mono font-semibold text-foreground">
            {showValues ? `$${riskMetrics.equity.toFixed(2)}` : "****"}
          </p>
          {riskMetrics.unrealizedPnL !== 0 && showValues && (
            <span className={`text-xs font-mono ${riskMetrics.unrealizedPnL >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
              {riskMetrics.unrealizedPnL >= 0 ? '+' : ''}{riskMetrics.unrealizedPnL.toFixed(2)} PnL
            </span>
          )}
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Risk Ratio (IM/Equity)</span>
          <p className={`text-lg font-mono font-semibold ${getRiskColor(riskMetrics.riskLevel)}`}>
            {showValues ? `${riskMetrics.riskRatio.toFixed(2)}%` : "****"}
          </p>
        </div>
      </div>

      {/* Risk Progress Bar */}
      <div className="space-y-2">
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getRiskBgColor(riskMetrics.riskLevel)}`}
              style={{ width: `${getProgressWidth(riskMetrics.riskRatio)}%` }}
            />
          </div>
          {/* Threshold markers */}
          <div className="absolute top-0 left-[80%] w-0.5 h-3 bg-trading-yellow" />
          <div className="absolute top-0 left-[95%] w-0.5 h-3 bg-orange-500" />
        </div>
        
        <div className="flex justify-between text-[10px]">
          <span className="text-trading-green">SAFE</span>
          <span className="text-trading-yellow">WARNING (80%)</span>
          <span className="text-orange-500">RESTRICT (95%)</span>
          <span className="text-trading-red">LIQ (100%)</span>
        </div>
      </div>

      {/* Margin Details */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
        <div>
          <span className="text-xs text-muted-foreground">Initial Margin</span>
          <p className="text-sm font-mono text-foreground">
            {showValues ? `$${riskMetrics.imTotal.toFixed(2)}` : "****"}
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Maint. Margin</span>
          <p className="text-sm font-mono text-foreground">
            {showValues ? `$${riskMetrics.mmTotal.toFixed(2)}` : "****"}
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Available</span>
          <p className="text-sm font-mono text-foreground">
            {showValues ? `$${riskMetrics.availableMargin.toFixed(2)}` : "****"}
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
  );
};
