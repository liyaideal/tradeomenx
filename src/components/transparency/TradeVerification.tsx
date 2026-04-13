import { useState } from "react";
import { FileSearch, Loader2, CheckCircle2, ArrowLeft, ExternalLink, Copy, Check, ArrowRightLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTradeVerification } from "@/hooks/useTradeVerification";
import { toast } from "sonner";

const COMPARE_FIELDS = [
  { key: "event", label: "Event" },
  { key: "option", label: "Option" },
  { key: "side", label: "Side" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "timestamp", label: "Timestamp" },
];

interface Props {
  onBack: () => void;
}

export const TradeVerification = ({ onBack }: Props) => {
  const { step, trades, selectedTrade, comparison, isLoadingTrades, openSelector, selectTrade, reset } = useTradeVerification();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Idle
  if (step === "idle") {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="trading-card p-6 md:p-8 text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
            <FileSearch className="w-10 h-10 text-blue-400" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold">Is My Trade Real?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Select a recent filled trade and compare its database record against the on-chain transaction log to verify execution integrity.
            </p>
          </div>
          <Button onClick={openSelector} className="px-8 gap-2">
            <FileSearch className="w-4 h-4" /> Select a Trade
          </Button>
        </div>
      </div>
    );
  }

  // Trade selector
  if (step === "select") {
    return (
      <div className="space-y-6">
        <button onClick={() => reset()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="trading-card p-5 md:p-6 space-y-4">
          <h3 className="font-semibold">Select a Filled Trade</h3>
          {isLoadingTrades ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading trades...
            </div>
          ) : trades.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No filled trades found.</p>
          ) : (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {trades.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTrade(t)}
                  className="w-full text-left p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate flex-1">{t.event_name}</span>
                    <span className={`text-xs font-semibold ml-2 ${t.side === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{t.option_label}</span>
                    <span>@ {t.price}</span>
                    <span>×{t.quantity}</span>
                    <span className="ml-auto">{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fetching / Comparing / Result
  return (
    <div className="space-y-6">
      <button onClick={() => { reset(); onBack(); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="trading-card p-5 md:p-6 space-y-5">
        {/* Progress */}
        {(step === "fetching" || step === "comparing") && (
          <div className="space-y-3 animate-fade-in">
            {[
              { key: "fetching", label: "Fetching on-chain transaction log..." },
              { key: "comparing", label: "Comparing records field by field..." },
            ].map((s, i) => {
              const isActive = s.key === step;
              const isDone = (s.key === "fetching" && step === "comparing");
              return (
                <div key={s.key} className={`flex items-center gap-3 transition-opacity duration-300 ${!isActive && !isDone ? "opacity-30" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-blue-400/20 text-blue-400" : isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <span className={`text-sm ${isDone ? "text-blue-400" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Result */}
        {step === "result" && comparison && (
          <div className="animate-fade-in space-y-5">
            {/* Match banner */}
            <div className="rounded-xl bg-blue-400/10 border border-blue-400/20 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <h3 className="font-bold text-blue-400">All Fields Match ✓</h3>
                <p className="text-xs text-muted-foreground">
                  {comparison.matchedFields.length} of {comparison.matchedFields.length} fields verified against on-chain data.
                </p>
              </div>
            </div>

            {/* Trade info */}
            <div className="bg-muted/20 rounded-xl p-4 space-y-1">
              <p className="text-sm font-semibold">{comparison.trade.event_name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{comparison.trade.option_label}</span>
                <span className={comparison.trade.side === "buy" ? "text-emerald-400" : "text-red-400"}>{comparison.trade.side.toUpperCase()}</span>
                <span>@ {comparison.trade.price}</span>
                <span>×{comparison.trade.quantity}</span>
              </div>
            </div>

            {/* Side-by-side comparison */}
            <div>
              <div className="grid grid-cols-[1fr,1fr,1fr] gap-0 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-2">
                <span>Field</span>
                <span>DB Record</span>
                <span>On-Chain Log</span>
              </div>
              <div className="space-y-1">
                {COMPARE_FIELDS.map((f) => {
                  const dbVal = comparison.dbRecord[f.key] || "—";
                  const chainVal = comparison.onchainLog[f.key] || "—";
                  const isMatch = comparison.matchedFields.includes(f.key);
                  return (
                    <div key={f.key} className={`grid grid-cols-[1fr,1fr,1fr] gap-0 rounded-lg px-2 py-1.5 text-xs ${isMatch ? "bg-emerald-400/5" : "bg-muted/20"}`}>
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className={`font-mono truncate ${isMatch ? "text-emerald-400" : ""}`}>{dbVal}</span>
                      <span className={`font-mono truncate ${isMatch ? "text-emerald-400" : ""}`}>{chainVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Counterparty */}
            <div className="bg-muted/20 rounded-xl p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Counterparty</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{comparison.counterparty}</p>
                  <p className="text-[10px] text-muted-foreground">Automated market maker — always available liquidity</p>
                </div>
              </div>
            </div>

            {/* TX details */}
            <div className="bg-muted/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tx Hash</span>
                <div className="flex items-center gap-1">
                  <code className="text-[10px] font-mono text-foreground">{comparison.txHash.slice(0, 10)}...{comparison.txHash.slice(-8)}</code>
                  <button onClick={() => copyText(comparison.txHash, "tx")} className="text-muted-foreground hover:text-foreground">
                    {copiedField === "tx" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Block</span>
                <code className="text-[10px] font-mono text-foreground">#{comparison.blockNumber.toLocaleString()}</code>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs gap-1.5"
                onClick={() => window.open(`https://basescan.org/tx/${comparison.txHash}`, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on BaseScan
              </Button>
              <Button size="sm" className="flex-1 text-xs gap-1.5" onClick={openSelector}>
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Verify Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
