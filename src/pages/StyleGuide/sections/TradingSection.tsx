import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Ban } from "lucide-react";
import { SectionWrapper } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";
import { CATEGORY_STYLES, getCategoryFromName } from "@/lib/categoryUtils";
import { OptionChips } from "@/components/OptionChips";
import { cn } from "@/lib/utils";

interface TradingSectionProps {
  isMobile: boolean;
}

export const TradingSection = ({ isMobile }: TradingSectionProps) => {
  const [selectedOption, setSelectedOption] = useState("opt1");
  
  // Account Risk Playground
  const [riskTotalAssets, setRiskTotalAssets] = useState(100);
  const [riskUnrealizedPnL, setRiskUnrealizedPnL] = useState(0);
  const [riskIMTotal, setRiskIMTotal] = useState(50);

  const playgroundRiskMetrics = useMemo(() => {
    const equity = riskTotalAssets + riskUnrealizedPnL;
    const riskRatio = equity > 0 ? (riskIMTotal / equity) * 100 : 0;
    
    let riskLevel: "SAFE" | "WARNING" | "RESTRICTION" | "LIQUIDATION" = "SAFE";
    if (riskRatio >= 100) riskLevel = "LIQUIDATION";
    else if (riskRatio >= 95) riskLevel = "RESTRICTION";
    else if (riskRatio >= 80) riskLevel = "WARNING";
    
    return { equity, riskRatio: Math.min(riskRatio, 150), riskLevel };
  }, [riskTotalAssets, riskUnrealizedPnL, riskIMTotal]);

  const mockOptions = [
    { id: "opt1", label: "Yes", price: "0.65" },
    { id: "opt2", label: "No", price: "0.35" },
    { id: "opt3", label: ">$100k", price: "0.42" },
  ];

  return (
    <div className="space-y-12">
      {/* Trading Colors */}
      <SectionWrapper
        id="trading-colors"
        title="Trading Color Semantics"
        platform="shared"
        description="Consistent color usage for trading contexts"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Color Meaning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
              <div className="p-4 bg-trading-green/10 border border-trading-green/30 rounded-lg text-center">
                <TrendingUp className="h-6 w-6 text-trading-green mx-auto mb-2" />
                <p className="text-sm font-medium text-trading-green">Green</p>
                <p className="text-xs text-muted-foreground">Profit, Buy, Success</p>
              </div>
              <div className="p-4 bg-trading-red/10 border border-trading-red/30 rounded-lg text-center">
                <TrendingDown className="h-6 w-6 text-trading-red mx-auto mb-2" />
                <p className="text-sm font-medium text-trading-red">Red</p>
                <p className="text-xs text-muted-foreground">Loss, Sell, Error</p>
              </div>
              <div className="p-4 bg-trading-yellow/10 border border-trading-yellow/30 rounded-lg text-center">
                <AlertTriangle className="h-6 w-6 text-trading-yellow mx-auto mb-2" />
                <p className="text-sm font-medium text-trading-yellow">Yellow</p>
                <p className="text-xs text-muted-foreground">Warning, Pending</p>
              </div>
              <div className="p-4 bg-trading-purple/10 border border-trading-purple/30 rounded-lg text-center">
                <ShieldCheck className="h-6 w-6 text-trading-purple mx-auto mb-2" />
                <p className="text-sm font-medium text-trading-purple">Purple</p>
                <p className="text-xs text-muted-foreground">Brand, Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Category Labels */}
      <SectionWrapper
        id="category-labels"
        title="Event Category Labels"
        platform="shared"
        description="Consistent category styling for prediction events"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Category Badge Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(CATEGORY_STYLES).map(([key, style]) => {
                const categoryClass = style.class;
                return (
                  <Badge key={key} className={categoryClass}>
                    {key}
                  </Badge>
                );
              })}
            </div>
            <CodePreview 
              code={`import { CATEGORY_STYLES, getCategoryFromName } from "@/lib/categoryUtils";

const category = getCategoryFromName(eventName);
const style = CATEGORY_STYLES[category];

<Badge className={style.badge}>
  {style.icon} {style.label}
</Badge>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Option Chips */}
      <SectionWrapper
        id="option-chips"
        title="Option Chips"
        platform="shared"
        description="Selection chips for event options with price display"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Option Chips Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-xl p-6 mb-4">
              <OptionChips
                options={mockOptions}
                selectedId={selectedOption}
                onSelect={setSelectedOption}
              />
            </div>
            <CodePreview 
              code={`<OptionChips
  options={[
    { id: "opt1", label: "Yes", price: "0.65" },
    { id: "opt2", label: "No", price: "0.35" },
  ]}
  selectedId={selectedOption}
  onSelect={setSelectedOption}
/>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Account Risk Indicator */}
      <SectionWrapper
        id="account-risk"
        title="Account Risk Indicator"
        platform="shared"
        description="4-tier risk classification based on Risk Ratio (IM / Equity × 100)"
      >
        {/* Risk Model Documentation */}
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Risk Model Overview</CardTitle>
            <CardDescription>Equity = Balance + Unrealized PnL | Risk Ratio = Initial Margin / Equity × 100</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
              <div className="p-4 bg-trading-green/10 border border-trading-green/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-trading-green" />
                  <span className="text-sm font-medium text-trading-green">SAFE</span>
                </div>
                <p className="text-2xl font-mono font-bold text-trading-green">&lt; 80%</p>
                <p className="text-xs text-muted-foreground mt-1">Normal trading allowed</p>
              </div>
              <div className="p-4 bg-trading-yellow/10 border border-trading-yellow/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-trading-yellow" />
                  <span className="text-sm font-medium text-trading-yellow">WARNING</span>
                </div>
                <p className="text-2xl font-mono font-bold text-trading-yellow">80-95%</p>
                <p className="text-xs text-muted-foreground mt-1">Reduce positions suggested</p>
              </div>
              <div className="p-4 bg-trading-red/10 border border-trading-red/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="h-4 w-4 text-trading-red" />
                  <span className="text-sm font-medium text-trading-red">RESTRICTION</span>
                </div>
                <p className="text-2xl font-mono font-bold text-trading-red">95-100%</p>
                <p className="text-xs text-muted-foreground mt-1">Close-only mode</p>
              </div>
              <div className="p-4 bg-trading-red/20 border border-trading-red/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-trading-red animate-pulse" />
                  <span className="text-sm font-medium text-trading-red">LIQUIDATION</span>
                </div>
                <p className="text-2xl font-mono font-bold text-trading-red">≥ 100%</p>
                <p className="text-xs text-muted-foreground mt-1">Forced liquidation triggered</p>
              </div>
            </div>
            
            {/* Margin Terms */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Key Terms</h4>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div>
                  <p className="text-xs text-muted-foreground">Initial Margin (IM)</p>
                  <p className="text-sm">Entry threshold - margin required to open a position</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maintenance Margin (MM)</p>
                  <p className="text-sm">Survival line - minimum margin to keep position open</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Simulator */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Risk Level Simulator</CardTitle>
            <CardDescription>Adjust values to test risk tier transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Preview */}
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-xl border",
                  playgroundRiskMetrics.riskLevel === "SAFE" && "bg-trading-green/5 border-trading-green/20",
                  playgroundRiskMetrics.riskLevel === "WARNING" && "bg-trading-yellow/5 border-trading-yellow/20",
                  playgroundRiskMetrics.riskLevel === "RESTRICTION" && "bg-trading-red/5 border-trading-red/20",
                  playgroundRiskMetrics.riskLevel === "LIQUIDATION" && "bg-trading-red/10 border-trading-red/30"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Account Risk</span>
                    <Badge className={cn(
                      playgroundRiskMetrics.riskLevel === "SAFE" && "bg-trading-green/10 text-trading-green",
                      playgroundRiskMetrics.riskLevel === "WARNING" && "bg-trading-yellow/10 text-trading-yellow",
                      playgroundRiskMetrics.riskLevel === "RESTRICTION" && "bg-trading-red/10 text-trading-red",
                      playgroundRiskMetrics.riskLevel === "LIQUIDATION" && "bg-trading-red/20 text-trading-red"
                    )}>
                      {playgroundRiskMetrics.riskLevel}
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(playgroundRiskMetrics.riskRatio, 100)} 
                    className={cn(
                      "h-2",
                      playgroundRiskMetrics.riskLevel === "SAFE" && "[&>div]:bg-trading-green",
                      playgroundRiskMetrics.riskLevel === "WARNING" && "[&>div]:bg-trading-yellow",
                      (playgroundRiskMetrics.riskLevel === "RESTRICTION" || playgroundRiskMetrics.riskLevel === "LIQUIDATION") && "[&>div]:bg-trading-red"
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Risk Ratio</span>
                    <span className="font-mono">{playgroundRiskMetrics.riskRatio.toFixed(1)}%</span>
                  </div>
                  
                  {/* Calculated Values */}
                  <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Equity</span>
                      <p className="font-mono font-medium">${playgroundRiskMetrics.equity.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Formula</span>
                      <p className="font-mono text-muted-foreground">{riskIMTotal} / {playgroundRiskMetrics.equity.toFixed(0)} × 100</p>
                    </div>
                  </div>
                </div>

                {/* Risk Level Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-trading-green" />
                    <span>SAFE: &lt; 80%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-trading-yellow" />
                    <span>WARNING: 80-95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-trading-red" />
                    <span>RESTRICTION: 95-100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-trading-red animate-pulse" />
                    <span>LIQUIDATION: ≥ 100%</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Total Assets</Label>
                    <span className="text-xs font-mono">${riskTotalAssets}</span>
                  </div>
                  <Slider value={[riskTotalAssets]} onValueChange={([v]) => setRiskTotalAssets(v)} min={10} max={500} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Unrealized PnL</Label>
                    <span className={cn("text-xs font-mono", riskUnrealizedPnL >= 0 ? "text-trading-green" : "text-trading-red")}>
                      {riskUnrealizedPnL >= 0 ? "+" : ""}${riskUnrealizedPnL}
                    </span>
                  </div>
                  <Slider value={[riskUnrealizedPnL]} onValueChange={([v]) => setRiskUnrealizedPnL(v)} min={-100} max={100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Initial Margin (IM)</Label>
                    <span className="text-xs font-mono">${riskIMTotal}</span>
                  </div>
                  <Slider value={[riskIMTotal]} onValueChange={([v]) => setRiskIMTotal(v)} min={0} max={200} />
                </div>
                
                {/* Quick Presets */}
                <div className="pt-4 border-t border-border/50">
                  <Label className="text-xs mb-2 block">Quick Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => { setRiskTotalAssets(100); setRiskUnrealizedPnL(20); setRiskIMTotal(50); }}>
                      Safe Example
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => { setRiskTotalAssets(100); setRiskUnrealizedPnL(-10); setRiskIMTotal(75); }}>
                      Warning Example
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => { setRiskTotalAssets(100); setRiskUnrealizedPnL(-20); setRiskIMTotal(85); }}>
                      Liquidation Risk
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Trading Card Style */}
      <SectionWrapper
        id="trading-cards"
        title="Trading Card Style"
        platform="shared"
        description="Card styling for trading interfaces"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Trading Card</CardTitle>
            <CardDescription>Use the .trading-card class for trading UI cards</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The trading-card class applies subtle gradient background, proper borders, and hover states.
            </p>
            <CodePreview 
              code={`<Card className="trading-card">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
};
