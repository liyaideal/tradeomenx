/**
 * Wallet · Dual-Account 2b previews — style-guide iframe demos.
 *
 * Truth Rule (§16.1.1): renders the same production components used by
 * /wallet, /events header, and TransactionHistory. Composition-only pieces
 * (Band 1 Total Equity + dual-account cards, header HoverCard content)
 * mirror the exact JSX from Wallet.tsx / EventsDesktopHeader.tsx so the
 * spec cannot drift silently — any change there must be mirrored here.
 */
import { useState } from "react";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Eye, EyeOff, Info, Landmark, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { computeTotalEquity, formatEquityUsd } from "@/lib/equity";
import { TransferForm } from "@/components/wallet/TransferForm";
import { AccountPickerRows, type AccountKind } from "@/components/wallet/AccountPicker";
import {
  TransactionHistory,
  type Transaction,
} from "@/components/wallet/TransactionHistory";

/* ---------- Band 1 Total Equity + Band 2 dual-account cards ---------- */

const DEMO = {
  spot: 1284.53,
  balance: 8720.42, // futures available
  trial: 45,
};

export const WalletEquityBandsPreview = () => {
  const [hidden, setHidden] = useState(false);
  const total = computeTotalEquity({
    spotBalance: DEMO.spot,
    balance: DEMO.balance,
    trialBalance: DEMO.trial,
  });
  const mask = (n: number) => (hidden ? "••••••" : `$${formatEquityUsd(n)}`);

  return (
    <div className="space-y-4">
      {/* Band 1 · Total Equity 总览条 (hero gradient — §5 exception) */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              EST. TOTAL EQUITY
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold whitespace-nowrap">{mask(total)}</span>
              <button
                type="button"
                onClick={() => setHidden((h) => !h)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle balance visibility"
              >
                {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Spot + Futures + Trial Bonus · does not include unrealized PnL
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="btn-trading-green h-9">
              <ArrowDownLeft className="w-4 h-4 mr-1.5" /> Deposit
            </Button>
            <Button variant="outline" className="h-9">
              <ArrowUpRight className="w-4 h-4 mr-1.5" /> Withdraw
            </Button>
            <Button variant="outline" className="h-9">
              <ArrowLeftRight className="w-4 h-4 mr-1.5" /> Transfer
            </Button>
          </div>
        </div>
      </div>

      {/* Band 2 · Dual account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Spot */}
        <div className="stats-card p-4 relative">
          <button
            className="absolute top-2 right-2 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10"
            aria-label="Transfer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <WalletIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Spot Account</span>
          </div>
          <div className="mb-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Available
            </div>
            <div className="font-mono text-2xl font-semibold">${formatEquityUsd(DEMO.spot)}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <div className="text-[11px] text-muted-foreground">Funds US-stock spot trading</div>
          </div>
        </div>

        {/* Futures */}
        <div className="stats-card p-4 relative">
          <button
            className="absolute top-2 right-2 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10"
            aria-label="Transfer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Futures Account</span>
          </div>
          <div className="mb-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Available
            </div>
            <div className="font-mono text-2xl font-semibold">${formatEquityUsd(DEMO.balance)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-trading-green/10 border border-trading-green/20">
              <div className="text-[11px] text-muted-foreground mb-0.5">Trial Bonus</div>
              <div className="font-mono text-sm font-semibold text-trading-green">
                ${formatEquityUsd(DEMO.trial)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="text-[11px] text-muted-foreground mb-0.5">Total</div>
              <div className="font-mono text-sm font-semibold">
                ${formatEquityUsd(DEMO.balance + DEMO.trial)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- TransferForm state coverage (real component, props-driven) ---------- */

const TransferShell = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-md rounded-2xl border border-border/50 bg-card p-4">{children}</div>
);

export const TransferFormNormalPreview = () => (
  <TransferShell>
    <TransferForm
      demoOverride={{ balance: 8720.42, spotBalance: 1284.53, initialAmount: "250" }}
    />
  </TransferShell>
);

export const TransferFormInsufficientPreview = () => (
  <TransferShell>
    <TransferForm
      demoOverride={{ balance: 10, spotBalance: 1284.53, initialAmount: "500" }}
    />
  </TransferShell>
);

export const TransferFormZeroPreview = () => (
  <TransferShell>
    <TransferForm demoOverride={{ balance: 8720.42, spotBalance: 1284.53, initialAmount: "" }} />
  </TransferShell>
);

export const TransferFormTrialHintPreview = () => (
  // Direction = to_spot forces the "From = Futures" branch, which renders the ⓘ TrialHint.
  <TransferShell>
    <TransferForm
      initialDirection="to_spot"
      demoOverride={{ balance: 100, spotBalance: 1284.53, initialAmount: "50" }}
    />
  </TransferShell>
);

/* ---------- Deposit "Deposit to" pre-screen ---------- */

export const DepositToPickerPreview = () => {
  const [selected, setSelected] = useState<AccountKind | null>("spot");
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border/50 bg-card p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold">Deposit to</div>
        <div className="text-xs text-muted-foreground">
          Pick which account should receive the funds.
        </div>
      </div>
      <AccountPickerRows selected={selected} onSelect={setSelected} />
    </div>
  );
};

/* ---------- Header Equity HoverCard content ---------- */

export const EquityHoverCardPreview = () => {
  const total = computeTotalEquity({
    spotBalance: DEMO.spot,
    balance: DEMO.balance,
    trialBalance: DEMO.trial,
  });
  return (
    <div className="mx-auto w-[260px] rounded-lg border border-border bg-popover p-3 shadow-md">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        Total Equity
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Spot Account</span>
          <span className="font-mono">${formatEquityUsd(DEMO.spot)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Futures Account</span>
          <span className="font-mono">${formatEquityUsd(DEMO.balance)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Trial Bonus</span>
          <span className="font-mono text-trading-green">${formatEquityUsd(DEMO.trial)}</span>
        </div>
      </div>
      <div className="my-2 border-t border-border/50" />
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">Total Equity</span>
        <span className="font-mono font-bold">${formatEquityUsd(total)}</span>
      </div>
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors"
      >
        <ArrowLeftRight className="w-3 h-3" /> Transfer ›
      </button>
    </div>
  );
};

/* ---------- TransactionHistory account badges + transfer icon row ---------- */

const now = Date.now();
const mkTx = (t: Partial<Transaction> & { id: string; type: Transaction["type"]; amount: number }): Transaction => ({
  description: "",
  date: new Date(now - 3600_000).toISOString(),
  timestamp: now - 3600_000,
  status: "completed",
  ...t,
});

const DEMO_TXS: Transaction[] = [
  mkTx({
    id: "t1",
    type: "transfer_to_spot",
    amount: 250,
    description: "Transfer · Futures → Spot",
    account: "spot",
  }),
  mkTx({
    id: "t2",
    type: "transfer_to_futures",
    amount: 500,
    description: "Transfer · Spot → Futures",
    account: "futures",
  }),
  mkTx({
    id: "t3",
    type: "deposit",
    amount: 1000,
    description: "USDC deposit · Base",
    network: "Base",
    account: "spot",
    status: "completed",
  }),
  mkTx({
    id: "t4",
    type: "withdraw",
    amount: 200,
    description: "USDC withdraw · Base",
    network: "Base",
    account: "futures",
    status: "processing",
  }),
  mkTx({
    id: "t5",
    type: "trade_profit",
    amount: 42.18,
    description: "BTC ≥ $150k · resolved YES",
    account: "futures",
  }),
];

export const TransactionHistoryPreview = () => (
  <div className="rounded-2xl border border-border/40 bg-card">
    <TransactionHistory transactions={DEMO_TXS} />
  </div>
);

/* ---------- Legend chip: quick reference for account badges ---------- */

export const AccountBadgeLegendPreview = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3">
    <div className="flex items-center gap-2">
      <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] rounded-full">SPOT</Badge>
      <span className="text-xs text-muted-foreground">Spot Account row</span>
    </div>
    <div className="flex items-center gap-2">
      <Badge className="border-primary/30 bg-primary/10 text-primary text-[10px] rounded-full">FUTURES</Badge>
      <span className="text-xs text-muted-foreground">Futures Account row</span>
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
      Transfer icon (bidirectional)
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Info className="w-3.5 h-3.5" />
      Mobile: badges only appear on the second row (§8 Don't)
    </div>
  </div>
);
