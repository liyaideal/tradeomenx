import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle2, Percent, ExternalLink, ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useFundingRateAudit, type FundingRateStep } from "@/hooks/useFundingRateAudit";

interface Props {
  onBack: () => void;
}

export const FundingRateAudit = ({ onBack }: Props) => {
  const { step, positions, selectedPosition, audit, isLoading, openSelector, selectPosition, reset } = useFundingRateAudit();

  /* ── Idle ── */
  if (step === "idle") {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="trading-card p-6 md:p-8 text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
            <Percent className="w-10 h-10 text-purple-400" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold">Am I Being Overcharged?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compare the funding rate applied to your position against the on-chain{" "}
              <code className="text-xs bg-muted/50 px-1 rounded">FundingRate</code> event log to verify no unfair fees were deducted.
            </p>
          </div>
          <Button onClick={openSelector} className="px-8 gap-2">
            <Percent className="w-4 h-4" /> Select a Position
          </Button>
        </div>
      </div>
    );
  }

  /* ── Select ── */
  if (step === "select") {
    return (
      <div className="space-y-6">
        <button onClick={reset} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="trading-card p-5 md:p-6 space-y-4">
          <h3 className="font-semibold">Select a Position</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading positions...
            </div>
          ) : positions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No positions found.</p>
          ) : (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {positions.map((pos) => (
                <button key={pos.id} onClick={() => selectPosition(pos)} className="w-full text-left p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate flex-1">{pos.event_name}</span>
                    <span className={`text-xs font-semibold ml-2 ${pos.side === "long" ? "text-emerald-400" : "text-red-400"}`}>{pos.side.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{pos.option_label}</span>
                    <span>{pos.leverage}x</span>
                    <span>Size: {pos.size}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Processing ── */
  if (step === "fetching" || step === "comparing") {
    return (
      <div className="space-y-6">
        <button onClick={reset} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="trading-card p-5 md:p-6 space-y-3 animate-fade-in">
          {[
            { key: "fetching", label: "Fetching on-chain FundingRate event log..." },
            { key: "comparing", label: "Comparing applied rate vs on-chain record..." },
          ].map((s) => {
            const isActive = s.key === step;
            const isDone = s.key === "fetching" && step === "comparing";
            return (
              <div key={s.key} className={`flex items-center gap-3 transition-opacity duration-300 ${!isActive && !isDone ? "opacity-30" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-purple-400/20 text-purple-400" : isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                </div>
                <span className={`text-sm ${isDone ? "text-purple-400" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Result ── */
  if (step === "result" && audit) {
    const DirectionIcon = audit.direction === "paid" ? TrendingDown : TrendingUp;
    return (
      <div className="space-y-6">
        <button onClick={() => { reset(); onBack(); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="space-y-4 animate-fade-in">
          {/* Match banner */}
          <div className="rounded-xl bg-purple-400/10 border border-purple-400/20 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h3 className="font-bold text-purple-400">Funding Rate Verified ✓</h3>
              <p className="text-xs text-muted-foreground">The applied rate matches the on-chain record exactly.</p>
            </div>
          </div>

          {/* Position info */}
          <div className="trading-card p-4 space-y-1">
            <p className="text-sm font-semibold">{audit.position.event_name}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{audit.position.option_label}</span>
              <span className={audit.position.side === "long" ? "text-emerald-400" : "text-red-400"}>{audit.position.side.toUpperCase()}</span>
              <span>{audit.position.leverage}x</span>
              <span>Size: {audit.position.size}</span>
            </div>
          </div>

          {/* Funding rate display */}
          <div className="trading-card p-4 text-center space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">On-Chain Funding Rate</p>
            <p className={`text-3xl font-bold font-mono ${audit.fundingRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {audit.fundingRateFormatted}
            </p>
            <p className="text-xs text-muted-foreground">
              {audit.fundingRate >= 0 ? "Longs pay Shorts" : "Shorts pay Longs"}
            </p>
          </div>

          {/* Applied to user */}
          <div className="trading-card p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Applied to Your Position</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DirectionIcon className={`w-5 h-5 ${audit.direction === "paid" ? "text-red-400" : "text-emerald-400"}`} />
                <span className="text-sm font-medium">You {audit.direction}</span>
              </div>
              <span className={`text-lg font-bold font-mono ${audit.direction === "paid" ? "text-red-400" : "text-emerald-400"}`}>
                {audit.direction === "paid" ? "-" : "+"}${audit.appliedAmount.toFixed(4)} USDC
              </span>
            </div>
          </div>

          {/* Contract fields */}
          <div className="trading-card p-4 space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">On-Chain Event Fields</p>
            {[
              { label: "eventId", value: audit.eventId },
              { label: "outcomeId", value: audit.outcomeId.toString() },
              { label: "fundingRate", value: audit.fundingRate.toFixed(6) },
              { label: "txHash", value: `${audit.txHash.slice(0, 6)}...${audit.txHash.slice(-6)}`, mono: true },
              { label: "blockNumber", value: `#${audit.blockNumber.toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/20 text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`${row.mono ? "font-mono" : ""} text-foreground/80`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5"
              onClick={() => window.open(`https://basescan.org/tx/${audit.txHash}`, "_blank")}
            >
              <ExternalLink className="w-3.5 h-3.5" /> View on BaseScan
            </Button>
            <Button size="sm" className="flex-1 text-xs gap-1.5" onClick={openSelector}>
              <ArrowRightLeft className="w-3.5 h-3.5" /> Verify Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
