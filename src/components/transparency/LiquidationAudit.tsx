import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Scale, Loader2, CheckCircle2, AlertTriangle, ExternalLink, Activity, Link2, ShieldCheck } from "lucide-react";
import { useLiquidationAudit, type LiquidationStep } from "@/hooks/useLiquidationAudit";
import { format } from "date-fns";

/** Smart price formatter: uses enough decimals so the value is never $0.0000 */
const fmtPrice = (v: number) => {
  if (v === 0) return "$0.00";
  const abs = Math.abs(v);
  if (abs >= 1) return `$${v.toFixed(4)}`;
  // For small prices, use toPrecision to keep significant digits
  return `$${v.toPrecision(4)}`;
};

const STEPS: { key: LiquidationStep; label: string }[] = [
  { key: "select", label: "Select Position" },
  { key: "fetching_chain", label: "On-Chain Log" },
  { key: "fetching_oracle", label: "Oracle Feed" },
  { key: "analyzing", label: "Analysis" },
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

  /* ── Idle ── */
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
              Retrieve the on-chain liquidation snapshot, cross-reference it with third-party oracle prices, and verify that the forced closure was executed fairly by the smart contract.
            </p>
          </div>
          <Button onClick={openSelector} className="gap-2">
            <Activity className="w-4 h-4" /> Select a Closed Position
          </Button>
        </div>
      </div>
    );
  }

  /* ── Select ── */
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

  /* ── Processing / Result ── */
  const isProcessing = step === "fetching_chain" || step === "fetching_oracle" || step === "analyzing";
  const processingLabel: Record<string, string> = {
    fetching_chain: "Fetching PositionLiquidated event from on-chain logs\u2026",
    fetching_oracle: "Querying Chainlink / Pyth oracle historical price\u2026",
    analyzing: "Comparing mark price against fair market price\u2026",
  };

  return (
    <div className="space-y-4">
      <button onClick={reset} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Progress stepper */}
      <div className="trading-card p-4 space-y-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
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
          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
            <div><span className="text-muted-foreground">Side</span><br /><span className="font-medium">{selectedPosition.side}</span></div>
            <div><span className="text-muted-foreground">Entry</span><br /><span className="font-mono">{fmtPrice(selectedPosition.entry_price)}</span></div>
            <div><span className="text-muted-foreground">Close</span><br /><span className="font-mono">{fmtPrice(selectedPosition.mark_price)}</span></div>
            <div><span className="text-muted-foreground">P&L</span><br /><span className="font-mono text-trading-red">{selectedPosition.pnl?.toFixed(2)}</span></div>
          </div>
        </div>
      )}

      {/* Processing spinner */}
      {isProcessing && (
        <div className="trading-card p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <p className="text-sm text-muted-foreground">{processingLabel[step] ?? "Processing\u2026"}</p>
        </div>
      )}

      {/* ═══════════════════ RESULT ═══════════════════ */}
      {step === "result" && audit && (
        <div className="space-y-4">

          {/* ── Module A: On-Chain Liquidation Snapshot ── */}
          <div className="trading-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">On-Chain Liquidation Snapshot</h4>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center py-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">System Mark Price at Liquidation</p>
                <p className="text-4xl font-bold font-mono text-trading-red">
                  ${audit.onchainMarkPrice.toFixed(4)}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  { label: "Event", value: `PositionLiquidated` },
                  { label: "Transaction", value: audit.txHash, mono: true, truncate: true },
                  { label: "Block", value: `#${audit.blockNumber.toLocaleString()}` },
                  { label: "Contract", value: audit.contractAddress, mono: true, truncate: true },
                  { label: "Timestamp", value: format(new Date(audit.liquidatedAt), "yyyy-MM-dd HH:mm:ss 'UTC'") },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/20">
                    <span className="text-muted-foreground shrink-0">{row.label}</span>
                    <span className={`${row.mono ? "font-mono" : ""} ${row.truncate ? "truncate max-w-[200px]" : ""} text-foreground/80`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] gap-1 text-muted-foreground w-full"
                onClick={() => window.open(`https://basescan.org/tx/${audit.txHash}`, "_blank")}
              >
                <ExternalLink className="w-3 h-3" /> View Transaction on BaseScan
              </Button>
            </div>
          </div>

          {/* ── Module B: Oracle Fair Price ── */}
          <div className="trading-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Fair Market Price (Oracle)</h4>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center py-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Global Spot Fair Price</p>
                <p className="text-4xl font-bold font-mono text-emerald-400">
                  ${audit.oraclePrice.toFixed(4)}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  { label: "Oracle Source", value: audit.oracleSource },
                  { label: "Feed Contract", value: audit.oracleFeedAddress, mono: true, truncate: true },
                  { label: "Queried At", value: format(new Date(audit.oracleTimestamp), "yyyy-MM-dd HH:mm:ss 'UTC'") },
                  { label: "Price Deviation", value: `${audit.deviation.toFixed(6)} ($${audit.deviationPercent.toFixed(4)}%)`, highlight: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/20">
                    <span className="text-muted-foreground shrink-0">{row.label}</span>
                    <span className={`${row.mono ? "font-mono" : ""} ${row.truncate ? "truncate max-w-[200px]" : ""} ${"highlight" in row && row.highlight ? (audit.deviationPercent < 1.5 ? "text-emerald-400 font-medium" : "text-amber-400 font-medium") : "text-foreground/80"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Module C: Conclusion ── */}
          <div className={`trading-card overflow-hidden border ${audit.conclusion === "fair" ? "border-emerald-400/30" : "border-amber-400/30"}`}>
            <div className={`px-4 py-3 border-b border-border/30 flex items-center gap-2 ${audit.conclusion === "fair" ? "bg-emerald-400/5" : "bg-amber-400/5"}`}>
              {audit.conclusion === "fair" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <h4 className="text-sm font-semibold">
                {audit.conclusion === "fair" ? "Verified: Liquidation is Fair" : "Attention: Price Deviation Detected"}
              </h4>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm leading-relaxed text-foreground/90">
                At the time of liquidation, the on-chain system mark price was{" "}
                <span className="font-mono font-bold text-trading-red">${audit.onchainMarkPrice.toFixed(4)}</span>,
                while the global fair market price reported by {audit.oracleSource} was{" "}
                <span className="font-mono font-bold text-emerald-400">${audit.oraclePrice.toFixed(4)}</span>.
                {" "}The price deviation is{" "}
                <span className={`font-mono font-bold ${audit.deviationPercent < 1.5 ? "text-emerald-400" : "text-amber-400"}`}>
                  {audit.deviationPercent.toFixed(4)}%
                </span>.
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                Your margin ratio had dropped to{" "}
                <span className="font-mono font-bold text-trading-red">{audit.marginRatio.toFixed(2)}%</span>,
                which is below the maintenance margin requirement of{" "}
                <span className="font-mono font-bold">{audit.maintenanceMarginRate}%</span>.
                {" "}This triggered an automatic forced liquidation.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This operation was recorded and enforced by the smart contract at{" "}
                <span className="font-mono">{audit.contractAddress.slice(0, 10)}...{audit.contractAddress.slice(-6)}</span>.
                {" "}No manual intervention was involved. The execution is immutable and verifiable on-chain.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 flex-1"
              onClick={() => window.open(`https://basescan.org/tx/${audit.txHash}`, "_blank")}
            >
              <ExternalLink className="w-3.5 h-3.5" /> View on BaseScan
            </Button>
            <Button variant="outline" size="sm" className="text-xs flex-1" onClick={reset}>
              Audit Another Position
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
