import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Scale, Loader2, CheckCircle2, AlertTriangle, ExternalLink, Activity } from "lucide-react";
import { useLiquidationAudit, type LiquidationStep } from "@/hooks/useLiquidationAudit";
import { format } from "date-fns";

const STEPS: { key: LiquidationStep; label: string }[] = [
  { key: "select", label: "Select Record" },
  { key: "fetching_oracle", label: "Fetch Oracle" },
  { key: "analyzing", label: "Analyze Deviation" },
  { key: "result", label: "Conclusion" },
];

const stepIndex = (s: LiquidationStep) => {
  const i = STEPS.findIndex((x) => x.key === s);
  return i < 0 ? 0 : i;
};

interface Props {
  onBack: () => void;
}

export const LiquidationAudit = ({ onBack }: Props) => {
  const { step, positions, selectedPosition, audit, isLoading, openSelector, selectPosition, reset } = useLiquidationAudit();

  const progress = step === "result" ? 100 : ((stepIndex(step) + 0.5) / STEPS.length) * 100;

  // --- Idle ---
  if (step === "idle") {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="trading-card p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Liquidation Price Audit</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Compare platform liquidation trigger prices against third-party oracle feeds to ensure price fairness.
            </p>
          </div>
          <Button onClick={openSelector} className="gap-2">
            <Activity className="w-4 h-4" /> Select a Closed Position
          </Button>
        </div>
      </div>
    );
  }

  // --- Select ---
  if (step === "select") {
    return (
      <div className="space-y-4">
        <button onClick={reset} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h3 className="font-semibold">Select a Losing Position to Audit</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : positions.length === 0 ? (
          <div className="trading-card p-8 text-center text-sm text-muted-foreground">No closed losing positions found.</div>
        ) : (
          <div className="space-y-2">
            {positions.map((pos) => (
              <button
                key={pos.id}
                onClick={() => selectPosition(pos)}
                className="trading-card p-4 w-full text-left hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{pos.event_name}</p>
                    <p className="text-xs text-muted-foreground">{pos.option_label} · {pos.side} · {pos.leverage}x</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-trading-red">{pos.pnl?.toFixed(2)} USDC</p>
                    <p className="text-[10px] text-muted-foreground">{pos.closed_at ? format(new Date(pos.closed_at), "MMM d, HH:mm") : ""}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Processing / Result ---
  const isProcessing = step === "fetching_oracle" || step === "analyzing";

  return (
    <div className="space-y-4">
      <button onClick={reset} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Progress */}
      <div className="trading-card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {STEPS.map((s, i) => (
            <span key={s.key} className={i <= stepIndex(step) ? "text-amber-400 font-medium" : ""}>
              {i + 1}. {s.label}
            </span>
          ))}
        </div>
        <Progress value={progress} className="h-1.5 bg-muted/30 [&>div]:bg-amber-400" />
      </div>

      {/* Position summary */}
      {selectedPosition && (
        <div className="trading-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Auditing Position</p>
          <p className="font-medium text-sm">{selectedPosition.event_name} — {selectedPosition.option_label}</p>
          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div><span className="text-muted-foreground">Side</span><br />{selectedPosition.side}</div>
            <div><span className="text-muted-foreground">Entry</span><br />{selectedPosition.entry_price.toFixed(4)}</div>
            <div><span className="text-muted-foreground">Close</span><br />{selectedPosition.mark_price.toFixed(4)}</div>
          </div>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="trading-card p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <p className="text-sm text-muted-foreground">
            {step === "fetching_oracle" ? "Fetching oracle price feeds…" : "Analyzing price deviation…"}
          </p>
        </div>
      )}

      {/* Result */}
      {step === "result" && audit && (
        <div className="space-y-3">
          {/* Verdict */}
          <div className={`trading-card p-5 border ${audit.conclusion === "fair" ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
            <div className="flex items-center gap-3">
              {audit.conclusion === "fair" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-lg">
                  {audit.conclusion === "fair" ? "Price is Fair" : "Deviation Detected"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {audit.conclusion === "fair"
                    ? "The platform's trigger price is within acceptable tolerance of oracle feeds."
                    : "The platform's trigger price deviates more than 1.5% from oracle feeds."}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="trading-card p-4 space-y-2">
            <h4 className="text-sm font-semibold mb-2">Price Comparison</h4>
            {[
              { label: "Platform Trigger Price", value: audit.platformPrice.toFixed(4) },
              { label: "Oracle Price", value: audit.oraclePrice.toFixed(4) },
              { label: "Absolute Deviation", value: audit.deviation.toFixed(6) },
              { label: "Deviation %", value: `${audit.deviationPercent.toFixed(4)}%`, highlight: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`font-mono ${row.highlight ? (audit.deviationPercent < 1.5 ? "text-emerald-400" : "text-amber-400") : ""}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Oracle details */}
          <div className="trading-card p-4 space-y-2">
            <h4 className="text-sm font-semibold mb-2">Oracle Details</h4>
            {[
              { label: "Source", value: audit.oracleSource },
              { label: "Oracle Timestamp", value: format(new Date(audit.oracleTimestamp), "yyyy-MM-dd HH:mm:ss") },
              { label: "Block Number", value: `#${audit.blockNumber.toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono text-foreground/80">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 flex-1" onClick={() => window.open(`https://basescan.org/block/${audit.blockNumber}`, "_blank")}>
              <ExternalLink className="w-3.5 h-3.5" /> View Block on BaseScan
            </Button>
            <Button variant="outline" size="sm" className="text-xs flex-1" onClick={reset}>
              Audit Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
