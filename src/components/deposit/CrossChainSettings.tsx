import { useState } from 'react';
import { Settings2, X, Check, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrossChainSettingsProps {
  autoMode: boolean;
  onAutoModeChange: (v: boolean) => void;
  slippage: number;
  onSlippageChange: (v: number) => void;
}

const SLIPPAGE_PRESETS = [
  { value: -1, label: 'Suggested' },
  { value: 0.5, label: '0.5%' },
  { value: 1.0, label: '1%' },
];

const AUTO_FEATURES = [
  { text: 'Smart routing based on your swap preferences', pro: true },
  { text: 'Optimised slippage and protection', pro: true },
  { text: 'Swap any token across any chain', pro: true },
  { text: 'Swap tokens with a signature only', pro: true },
];

const MANUAL_FEATURES = [
  { text: 'Manual control over routing and execution', pro: true },
  { text: 'No automated refunds for some bridges', pro: false },
  { text: 'Limited token pair availability', pro: false },
  { text: 'Requires gas to execute transactions', pro: false },
];

/** Bungee-style Auto / Manual toggle card */
export const SwapModeCard = ({
  autoMode,
  onAutoModeChange,
}: {
  autoMode: boolean;
  onAutoModeChange: (v: boolean) => void;
}) => {
  const features = autoMode ? AUTO_FEATURES : MANUAL_FEATURES;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        Swap Mode
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onAutoModeChange(true)}
          className={cn(
            "rounded-lg px-4 py-3 text-left transition-all",
            autoMode
              ? "border-2 border-primary bg-card"
              : "border border-border/50 bg-muted/20 hover:bg-muted/40"
          )}
        >
          <span className={cn("text-sm font-semibold", autoMode ? "text-primary" : "text-foreground")}>
            Auto
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Optimized Execution</p>
        </button>

        <button
          onClick={() => onAutoModeChange(false)}
          className={cn(
            "rounded-lg px-4 py-3 text-left transition-all",
            !autoMode
              ? "border-2 border-primary bg-card"
              : "border border-border/50 bg-muted/20 hover:bg-muted/40"
          )}
        >
          <span className={cn("text-sm font-semibold", !autoMode ? "text-primary" : "text-foreground")}>
            Manual
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Custom Routing</p>
        </button>
      </div>

      <div className="space-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            {f.pro ? (
              <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" />
            )}
            <span className="text-sm text-foreground/90">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AutoModeButton = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
      active
        ? "bg-primary/10 text-primary"
        : "bg-muted/50 text-muted-foreground hover:bg-muted"
    )}
  >
    {active ? 'Auto' : 'Manual'}
  </button>
);

export const SettingsPanel = ({
  open,
  onClose,
  slippage,
  onSlippageChange,
  autoMode,
  onAutoModeChange,
}: CrossChainSettingsProps & { open: boolean; onClose: () => void }) => {
  const [customSlippage, setCustomSlippage] = useState('');
  const isSuggested = slippage === -1;

  if (!open) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Bridge Settings</h4>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Swap Mode Card */}
      <SwapModeCard autoMode={autoMode} onAutoModeChange={onAutoModeChange} />

      {/* Slippage */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Slippage</p>
          <span className="text-xs text-muted-foreground">
            {isSuggested ? 'Suggested' : `${slippage}%`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {SLIPPAGE_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { onSlippageChange(p.value); setCustomSlippage(''); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                (p.value === slippage || (p.value === -1 && isSuggested)) && !customSlippage
                  ? "border border-primary text-primary bg-card"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              {p.label}
            </button>
          ))}
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Custom %"
              value={customSlippage}
              onChange={(e) => {
                setCustomSlippage(e.target.value);
                const val = parseFloat(e.target.value);
                if (val > 0 && val <= 50) onSlippageChange(val);
              }}
              className="w-full h-8 px-2 pr-6 rounded-lg bg-muted/40 border border-border/30 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
          </div>
        </div>
        {isSuggested && (
          <p className="text-xs text-muted-foreground">
            We'll find the best slippage for a successful swap.
          </p>
        )}
        {!isSuggested && slippage > 3 && (
          <p className="text-xs text-yellow-500 flex items-center gap-1">
            ⚠️ High slippage may result in unfavorable rates
          </p>
        )}
      </div>
    </div>
  );
};

export const SettingsButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors">
    <Settings2 className="w-4 h-4" />
  </button>
);
