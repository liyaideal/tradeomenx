import { useMemo } from "react";
import { Eye, EyeOff, Info, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSupabasePositions } from "@/hooks/useSupabasePositions";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface AccountRiskIndicatorProps {
  variant?: "compact" | "full";
}

export const AccountRiskIndicator = ({ variant = "compact" }: AccountRiskIndicatorProps) => {
  const { positions } = useSupabasePositions();
  const { balance } = useUserProfile();
  const [showValues, setShowValues] = useState(true);

  // Calculate account-level margin metrics
  const marginMetrics = useMemo(() => {
    // Sum up all position margins
    const totalMarginUsed = positions.reduce((sum, pos) => sum + Number(pos.margin), 0);
    
    // Total account equity (balance + unrealized PnL)
    const unrealizedPnL = positions.reduce((sum, pos) => sum + (Number(pos.pnl) || 0), 0);
    const totalEquity = balance + unrealizedPnL;
    
    // Initial Margin (IM) - margin required to maintain current positions
    // Typically 5-10% for leveraged positions
    const initialMarginRequired = totalMarginUsed;
    
    // Maintenance Margin (MM) - minimum margin before liquidation
    // Typically 50% of initial margin
    const maintenanceMargin = totalMarginUsed * 0.5;
    
    // Calculate usage percentages
    const imUsage = totalEquity > 0 ? (initialMarginRequired / totalEquity) * 100 : 0;
    const mmUsage = totalEquity > 0 ? (maintenanceMargin / totalEquity) * 100 : 0;
    
    // Risk level determination
    let riskLevel: "safe" | "warning" | "danger" = "safe";
    if (imUsage >= 80) {
      riskLevel = "danger";
    } else if (imUsage >= 50) {
      riskLevel = "warning";
    }
    
    return {
      totalMarginUsed,
      totalEquity,
      initialMarginRequired,
      maintenanceMargin,
      imUsage: Math.min(imUsage, 100),
      mmUsage: Math.min(mmUsage, 100),
      riskLevel,
      availableMargin: Math.max(totalEquity - initialMarginRequired, 0),
    };
  }, [positions, balance]);

  const getRiskColor = (usage: number) => {
    if (usage >= 80) return "text-trading-red";
    if (usage >= 50) return "text-trading-yellow";
    return "text-trading-green";
  };

  const getProgressColor = (usage: number) => {
    if (usage >= 80) return "bg-trading-red";
    if (usage >= 50) return "bg-trading-yellow";
    return "bg-trading-green";
  };

  if (variant === "compact") {
    return (
      <div className="bg-card/50 rounded-lg p-3 space-y-3 border border-border/30">
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
              <TooltipContent side="left" className="max-w-[200px]">
                <p className="text-xs">
                  IM (Initial Margin): Required margin to open/maintain positions.
                  MM (Maintenance Margin): Minimum margin before liquidation.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Margin Mode */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Margin Mode</span>
          <button className="flex items-center gap-1 text-xs text-foreground hover:text-muted-foreground transition-colors">
            Cross Margin
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Initial Margin */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Initial Margin</span>
            <span className={`text-xs font-mono ${getRiskColor(marginMetrics.imUsage)}`}>
              {showValues ? `${marginMetrics.imUsage.toFixed(2)}%` : "****"}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getProgressColor(marginMetrics.imUsage)}`}
              style={{ width: `${marginMetrics.imUsage}%` }}
            />
          </div>
        </div>

        {/* Maintenance Margin */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Maintenance Margin</span>
            <span className={`text-xs font-mono ${getRiskColor(marginMetrics.mmUsage)}`}>
              {showValues ? `${marginMetrics.mmUsage.toFixed(2)}%` : "****"}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getProgressColor(marginMetrics.mmUsage)}`}
              style={{ width: `${marginMetrics.mmUsage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full variant with more details
  return (
    <div className="bg-card/50 rounded-lg p-4 space-y-4 border border-border/30">
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[250px]">
              <div className="space-y-2 text-xs">
                <p><strong>Initial Margin (IM):</strong> The margin required to open and maintain your current positions.</p>
                <p><strong>Maintenance Margin (MM):</strong> The minimum margin required to avoid liquidation. If your equity falls below this, positions may be liquidated.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Margin Mode */}
      <div className="flex items-center justify-between py-2 border-b border-border/30">
        <span className="text-sm text-muted-foreground">Margin Mode</span>
        <button className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
          Cross Margin
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Equity & Available */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-muted-foreground">Account Equity</span>
          <p className="text-sm font-mono text-foreground">
            {showValues ? `$${marginMetrics.totalEquity.toFixed(2)}` : "****"}
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Available Margin</span>
          <p className="text-sm font-mono text-foreground">
            {showValues ? `$${marginMetrics.availableMargin.toFixed(2)}` : "****"}
          </p>
        </div>
      </div>

      {/* Initial Margin */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Initial Margin (IM)</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {showValues ? `$${marginMetrics.initialMarginRequired.toFixed(2)}` : "****"}
            </span>
            <span className={`text-sm font-mono font-medium ${getRiskColor(marginMetrics.imUsage)}`}>
              {showValues ? `${marginMetrics.imUsage.toFixed(2)}%` : "****"}
            </span>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressColor(marginMetrics.imUsage)}`}
            style={{ width: `${marginMetrics.imUsage}%` }}
          />
        </div>
      </div>

      {/* Maintenance Margin */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Maintenance Margin (MM)</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {showValues ? `$${marginMetrics.maintenanceMargin.toFixed(2)}` : "****"}
            </span>
            <span className={`text-sm font-mono font-medium ${getRiskColor(marginMetrics.mmUsage)}`}>
              {showValues ? `${marginMetrics.mmUsage.toFixed(2)}%` : "****"}
            </span>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressColor(marginMetrics.mmUsage)}`}
            style={{ width: `${marginMetrics.mmUsage}%` }}
          />
        </div>
      </div>

      {/* Risk Warning */}
      {marginMetrics.riskLevel !== "safe" && (
        <div className={`p-2 rounded-lg text-xs ${
          marginMetrics.riskLevel === "danger" 
            ? "bg-trading-red/10 text-trading-red border border-trading-red/30" 
            : "bg-trading-yellow/10 text-trading-yellow border border-trading-yellow/30"
        }`}>
          {marginMetrics.riskLevel === "danger" 
            ? "⚠️ High risk! Consider reducing positions or adding margin."
            : "⚡ Moderate risk. Monitor your margin levels closely."
          }
        </div>
      )}
    </div>
  );
};
