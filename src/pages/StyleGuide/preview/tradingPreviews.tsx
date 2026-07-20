/**
 * Trading preview cases mounted inside <DeviceFrame> iframes so `md:` breakpoints
 * resolve against the true 375px mobile viewport.
 *
 * Real production components used directly (with mock props):
 *  - TradeSubmitButton        → src/components/trading/TradeSubmitButton.tsx
 *  - DesktopOrderBook         → src/components/DesktopOrderBook.tsx
 *  - OrderBook (mobile)       → src/components/OrderBook.tsx
 *  - DesktopTradeForm         → src/components/DesktopTradeForm.tsx
 *  - TradeForm                → src/components/TradeForm.tsx (includes binaryMode)
 *  - PositionCard             → src/components/PositionCard.tsx
 *  - OrderCard                → src/components/OrderCard.tsx
 *  - AccountRiskIndicator     → src/components/AccountRiskIndicator.tsx (compact + full)
 *  - MobileRiskIndicator      → src/components/MobileRiskIndicator.tsx
 *
 * The following stay as style-guide-internal mirrors because production has no
 * independent, prop-driven component to import:
 *  - Trading color semantics   (raw tokens; no wrapper component in production)
 *  - Order status badge lineup (inline in OrderCard / positions tables)
 *  - Partial-fill HoverCard    (composed inline in DesktopPositionsPanel and
 *                               OrderCard drawers; no exported <PartialFillPopover>)
 *  - Risk-tier badge grid      (helper to enumerate all 4 risk tiers; real
 *                               AccountRiskIndicator/MobileRiskIndicator are
 *                               hook-driven and only ever render the live state)
 *  - TradingHeaderPlayground   (see TradingHeaderPlayground.tsx — the /trade
 *                               header is inlined in DesktopTrading.tsx with no
 *                               independent component; kept as a spec playground)
 * Each mirror must be kept 1:1 in sync with its production source when styles change.
 */

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Ban,
  Clock,
  Check,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TradeSubmitButton } from "@/components/trading/TradeSubmitButton";
import { DesktopOrderBook } from "@/components/DesktopOrderBook";
import { OrderBook } from "@/components/OrderBook";
import { OptionChips } from "@/components/OptionChips";
import { AirdropPositionCard } from "@/components/AirdropPositionCard";
import type { AirdropPosition } from "@/hooks/useAirdropPositions";

import { TradeForm } from "@/components/TradeForm";
import { PositionCard } from "@/components/PositionCard";
import { OrderCard } from "@/components/OrderCard";
import { AccountRiskIndicator } from "@/components/AccountRiskIndicator";
import { MobileRiskIndicator } from "@/components/MobileRiskIndicator";
import {
  getRiskColor,
  getRiskBgColor,
  getRiskMessage,
  type RiskLevel,
} from "@/hooks/useRealtimeRiskMetrics";

/* ---------------- shared bits ---------------- */

const PresetRail = ({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: any) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        onClick={() => onChange(o.id)}
        className={`h-7 px-2.5 rounded-full text-[11px] border transition ${
          value === o.id
            ? "bg-primary/15 border-primary/40 text-primary"
            : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Frame = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => (
  <div className="space-y-2">
    {label && (
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    )}
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      {children}
    </div>
  </div>
);

/* ---------------- 1. Trading colors (mirror) ---------------- */
/* Raw semantic reference — no independent production component. */

export const TradingColorsPreview = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {[
      {
        cls: "trading-green",
        Icon: TrendingUp,
        title: "Green",
        note: "Profit, Yes side, Success",
      },
      {
        cls: "trading-red",
        Icon: TrendingDown,
        title: "Red",
        note: "Loss, No side, Error",
      },
      {
        cls: "trading-yellow",
        Icon: AlertTriangle,
        title: "Yellow",
        note: "Warning, Pending",
      },
      {
        cls: "trading-purple",
        Icon: ShieldCheck,
        title: "Purple",
        note: "Brand, Active",
      },
    ].map(({ cls, Icon, title, note }) => (
      <div
        key={cls}
        className={`p-4 bg-${cls}/10 border border-${cls}/30 rounded-lg text-center`}
      >
        <Icon className={`h-6 w-6 text-${cls} mx-auto mb-2`} />
        <p className={`text-sm font-medium text-${cls}`}>{title}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
    ))}
  </div>
);

/* ---------------- 2. TradeSubmitButton (real) ---------------- */

type SubmitState =
  | "buyIdle"
  | "sellIdle"
  | "buyDisabled"
  | "sellDisabled"
  | "buyLoading"
  | "buySm"
  | "buyLg";

export const TradeSubmitPreview = () => {
  const [state, setState] = useState<SubmitState>("buyIdle");
  const configs: Record<
    SubmitState,
    {
      side: "buy" | "sell";
      label: string;
      potentialWin: number;
      disabled?: boolean;
      loading?: boolean;
      loadingText?: string;
      size?: "sm" | "md" | "lg";
    }
  > = {
    buyIdle: { side: "buy", label: "Buy Yes", potentialWin: 154 },
    sellIdle: { side: "sell", label: "Buy No", potentialWin: 236 },
    buyDisabled: {
      side: "buy",
      label: "Insufficient balance",
      potentialWin: 0,
      disabled: true,
    },
    sellDisabled: {
      side: "sell",
      label: "Close-only mode",
      potentialWin: 0,
      disabled: true,
    },
    buyLoading: {
      side: "buy",
      label: "Buy Yes",
      potentialWin: 154,
      loading: true,
      loadingText: "Submitting order…",
    },
    buySm: { side: "buy", label: "Buy Yes", potentialWin: 154, size: "sm" },
    buyLg: { side: "buy", label: "Buy Yes", potentialWin: 154, size: "lg" },
  };
  const cfg = configs[state];
  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "buyIdle", label: "Buy · idle" },
          { id: "sellIdle", label: "Sell · idle" },
          { id: "buyDisabled", label: "Buy · disabled" },
          { id: "sellDisabled", label: "Sell · disabled" },
          { id: "buyLoading", label: "Buy · loading" },
          { id: "buySm", label: "Buy · sm" },
          { id: "buyLg", label: "Buy · lg" },
        ]}
      />
      <Frame>
        <div className="max-w-sm mx-auto">
          <TradeSubmitButton {...cfg} onClick={() => {}} />
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 3. DesktopOrderBook (real) ---------------- */

const makeOrderBook = () => {
  const asks = Array.from({ length: 8 }).map((_, i) => ({
    price: (0.6531 + (7 - i) * 0.0004).toFixed(4),
    amount: (1200 + i * 340).toLocaleString(),
    total: (12400 - i * 700).toLocaleString(),
  }));
  const bids = Array.from({ length: 8 }).map((_, i) => ({
    price: (0.6527 - i * 0.0004).toFixed(4),
    amount: (900 + i * 280).toLocaleString(),
    total: (10800 - i * 640).toLocaleString(),
  }));
  return { asks, bids };
};

type BookState =
  | "futuresNormal"
  | "futuresConservative"
  | "futuresHedgeOnly"
  | "futuresCancelOnly"
  | "spotNormal";

export const DesktopOrderBookPreview = () => {
  const [state, setState] = useState<BookState>("futuresNormal");
  const { asks, bids } = makeOrderBook();
  const variant: "futures" | "spot" = state === "spotNormal" ? "spot" : "futures";
  const quoteMode =
    state === "futuresConservative"
      ? "CONSERVATIVE"
      : state === "futuresHedgeOnly"
        ? "HEDGE_ONLY"
        : state === "futuresCancelOnly"
          ? "CANCEL_ONLY"
          : "NORMAL";
  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "futuresNormal", label: "Futures · NORMAL" },
          { id: "futuresConservative", label: "Futures · CONSERVATIVE" },
          { id: "futuresHedgeOnly", label: "Futures · HEDGE_ONLY" },
          { id: "futuresCancelOnly", label: "Futures · CANCEL_ONLY" },
          { id: "spotNormal", label: "Spot · outcome-share copy" },
        ]}
      />
      <Frame>
        <div className="max-w-md">
          <DesktopOrderBook
            asks={asks}
            bids={bids}
            currentPrice="0.6529"
            priceChange="+0.0012"
            isPositive={true}
            variant={variant}
            quoteMode={quoteMode}
          />
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 4. OrderBook (mobile compact — real) ---------------- */

export const MobileOrderBookPreview = () => {
  const [compact, setCompact] = useState<"compact" | "full">("compact");
  const { asks, bids } = makeOrderBook();
  return (
    <div className="space-y-3">
      <PresetRail
        value={compact}
        onChange={setCompact}
        options={[
          { id: "compact", label: "Compact (mobile)" },
          { id: "full", label: "Full (in-panel)" },
        ]}
      />
      <Frame>
        <OrderBook
          asks={asks.slice(0, 6)}
          bids={bids.slice(0, 6)}
          currentPrice="0.6529"
          compact={compact === "compact"}
        />
      </Frame>
    </div>
  );
};

/* ---------------- 5. Desktop trade panel (inline mirror) ---------------- */
/* Source: src/pages/DesktopTrading.tsx (inline right-side Trade panel).
   /trade desktop composes this markup inline — there is NO extracted
   <DesktopTradeForm> in production (that file exists but is orphan). Keep
   this mirror in sync when the inline block changes. */

export const DesktopTradePanelMirror = () => (
  <div className="space-y-2">
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
      Mirror · Source: DesktopTrading.tsx (inline)
    </div>
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="max-w-sm space-y-3">
        <div className="flex gap-1.5">
          {["Market", "Limit"].map((t, i) => (
            <button
              key={t}
              className={`flex-1 h-8 text-xs rounded-md border ${i === 0 ? "bg-primary/15 border-primary/40 text-primary" : "bg-muted/30 border-border text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button className="flex-1 h-9 text-xs rounded-md bg-trading-green/20 text-trading-green border border-trading-green/40">
            Buy Yes · $0.6234
          </button>
          <button className="flex-1 h-9 text-xs rounded-md bg-trading-red/15 text-trading-red border border-trading-red/30">
            Buy No · $0.3766
          </button>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Amount (USDC)</span>
            <span className="font-mono">Balance: 1,240.50</span>
          </div>
          <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center font-mono text-sm">
            100.00
          </div>
          <div className="flex gap-1 text-[10px]">
            {["25%", "50%", "75%", "Max"].map((p) => (
              <button key={p} className="flex-1 h-6 rounded border border-border text-muted-foreground">{p}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-[11px] text-muted-foreground">Leverage</div>
          <div className="flex gap-1 text-[10px]">
            {["1x", "5x", "10x", "25x", "50x", "100x"].map((l, i) => (
              <button key={l} className={`flex-1 h-6 rounded border ${i === 2 ? "bg-trading-purple/20 border-trading-purple/40 text-trading-purple" : "border-border text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-border/60 bg-muted/20 p-2 space-y-1 text-[11px] font-mono">
          {[
            ["Type", "Market"],
            ["Margin", "$10.00"],
            ["Quantity", "160.4"],
            ["Est. Liq.", "$0.5610"],
            ["Fee", "$0.06"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted-foreground">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <button className="w-full h-10 rounded-md bg-trading-green text-trading-green-foreground text-sm font-semibold">
          Buy Yes · To win $160.40
        </button>
      </div>
    </div>
  </div>
);

/* ---------------- 5b. Desktop positions panel (inline mirror) ---------------- */
/* Source: src/pages/DesktopTrading.tsx (inline bottom Positions / Current Orders tabs). */

export const DesktopPositionsPanelMirror = () => (
  <div className="space-y-2">
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
      Mirror · Source: DesktopTrading.tsx (inline)
    </div>
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-4 border-b border-border/40 pb-2 mb-3 text-xs">
        <button className="text-foreground font-medium border-b-2 border-primary pb-2 -mb-2">
          Positions <span className="text-muted-foreground">(3)</span>
        </button>
        <button className="text-muted-foreground">Current Orders <span>(1)</span></button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/30 text-muted-foreground">
              {["Contracts", "Side", "Size", "Entry", "Mark", "PnL", "Leverage", ""].map((h) => (
                <th key={h} className="px-2 py-1.5 text-left font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { c: "BTC $100k EOY", s: "Yes", side: "long", size: "100", entry: "0.5200", mark: "0.6531", pnl: "+$13.31", lev: "10x", pos: true },
              { c: "Fed cuts Q1 2026", s: "No", side: "short", size: "250", entry: "0.4800", mark: "0.4210", pnl: "+$14.75", lev: "10x", pos: true },
              { c: "SPX >6,000 EOY", s: "Yes", side: "long", size: "500", entry: "0.7100", mark: "0.6512", pnl: "-$3.35", lev: "100x", pos: false },
            ].map((r) => (
              <tr key={r.c} className="border-b border-border/20 hover:bg-muted/30">
                <td className="px-2 py-2 font-medium">{r.c}</td>
                <td className="px-2 py-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${r.side === "long" ? "bg-trading-green/20 text-trading-green" : "bg-trading-red/20 text-trading-red"}`}>{r.s}</span>
                </td>
                <td className="px-2 py-2 font-mono">{r.size}</td>
                <td className="px-2 py-2 font-mono">${r.entry}</td>
                <td className="px-2 py-2 font-mono">${r.mark}</td>
                <td className={`px-2 py-2 font-mono ${r.pos ? "text-trading-green" : "text-trading-red"}`}>{r.pnl}</td>
                <td className="px-2 py-2 font-mono text-muted-foreground">{r.lev}</td>
                <td className="px-2 py-2 text-right">
                  <button className="h-6 px-2 rounded border border-border text-[10px] text-muted-foreground">Close</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ---------------- 5c. OptionChips (real, mobile-only) ---------------- */
export const OptionChipsPreview = () => {
  const [selected, setSelected] = useState("o2");
  return (
    <Frame>
      <OptionChips
        selectedId={selected}
        onSelect={setSelected}
        options={[
          { id: "o1", label: "0-99", price: "0.12" },
          { id: "o2", label: "100-199", price: "0.34" },
          { id: "o3", label: "200-219", price: "0.28" },
          { id: "o4", label: "220-249", price: "0.16" },
          { id: "o5", label: "250+", price: "0.10" },
        ]}
      />
    </Frame>
  );
};

/* ---------------- 5d. AirdropPositionCard (real, mobile trading) ---------------- */
export const AirdropPositionCardPreview = () => {
  const [state, setState] = useState<"pending" | "active">("pending");
  const airdrop: AirdropPosition = {
    id: "demo-airdrop",
    source: "matched",
    externalEventName: "Will Bitcoin reach $120k by March 2026?",
    externalSide: "Yes",
    externalPrice: 0.62,
    counterEventName: "BTC End of Q1 2026 Price",
    counterEventId: "btc-120k-q1-2026",
    counterOptionLabel: "Below $120,000",
    counterSide: "Yes",
    counterPrice: 0.38,
    airdropValue: 10,
    status: state,
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    activatedAt: state === "active" ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  };
  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "pending", label: "Pending · needs activation" },
          { id: "active", label: "Active" },
        ]}
      />
      <Frame>
        <AirdropPositionCard
          airdrop={airdrop}
          onActivate={async () => {}}
          isActivating={false}
        />
      </Frame>
    </div>
  );
};


/* ---------------- 6. TradeForm (mobile — real, incl. binaryMode) ---------------- */

type MobileFormState = "multiOutcome" | "binaryDefault" | "binaryLongLabels";

export const MobileTradeFormPreview = () => {
  const [state, setState] = useState<MobileFormState>("multiOutcome");
  const [binarySide, setBinarySide] = useState<"yes" | "no">("yes");

  if (state === "multiOutcome") {
    return (
      <div className="space-y-3">
        <PresetRail
          value={state}
          onChange={setState}
          options={[
            { id: "multiOutcome", label: "Multi-outcome" },
            { id: "binaryDefault", label: "Binary · Yes/No" },
            { id: "binaryLongLabels", label: "Binary · long team names" },
          ]}
        />
        <Frame>
          <TradeForm
            selectedPrice="0.6234"
            eventName="Elon Musk # tweets December 12 - December 19, 2025?"
            optionLabel="200-219"
            eventOptions={[
              { label: "0-99" },
              { label: "100-199" },
              { label: "200-219" },
              { label: "220+" },
            ]}
          />
        </Frame>
      </div>
    );
  }

  const preset =
    state === "binaryDefault"
      ? { yes: "Yes", no: "No", yesPrice: 0.62, noPrice: 0.38, alias: null }
      : {
          yes: "Boston Celtics",
          no: "Oklahoma City Thunder",
          yesPrice: 0.52,
          noPrice: 0.48,
          alias: { yes: "Boston Celtics", no: "Oklahoma City Thunder" },
        };

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "multiOutcome", label: "Multi-outcome" },
          { id: "binaryDefault", label: "Binary · Yes/No" },
          { id: "binaryLongLabels", label: "Binary · long team names" },
        ]}
      />
      <Frame>
        <TradeForm
          selectedPrice={
            binarySide === "yes"
              ? preset.yesPrice.toFixed(4)
              : preset.noPrice.toFixed(4)
          }
          eventName="NBA Finals 2026 Game 7?"
          optionLabel={binarySide === "yes" ? preset.yes : preset.no}
          eventOptions={[{ label: preset.yes }, { label: preset.no }]}
          binaryMode={{
            yesLabel: preset.yes,
            noLabel: preset.no,
            yesPrice: preset.yesPrice,
            noPrice: preset.noPrice,
            isYesSelected: binarySide === "yes",
            onSelectYes: () => setBinarySide("yes"),
            onSelectNo: () => setBinarySide("no"),
          }}
          sideLabels={preset.alias}
        />
      </Frame>
    </div>
  );
};

/* ---------------- 7. PositionCard (real) ---------------- */

type PositionState =
  | "longProfit"
  | "longLoss"
  | "shortProfit"
  | "nearLiq"
  | "highLeverage"
  | "binaryYesAlias"
  | "airdropVoucher";

export const PositionCardPreview = () => {
  const [state, setState] = useState<PositionState>("longProfit");

  const cfg: Record<
    PositionState,
    React.ComponentProps<typeof PositionCard>
  > = {
    longProfit: {
      type: "long",
      event: "BTC to reach $100k by Dec 31, 2026?",
      option: "Yes",
      entryPrice: "$0.5200",
      markPrice: "$0.6531",
      size: "100",
      margin: "$5.20",
      pnl: "+$13.31",
      pnlPercent: "+256.0%",
      leverage: "10x",
    },
    longLoss: {
      type: "long",
      event: "BTC to reach $100k by Dec 31, 2026?",
      option: "Yes",
      entryPrice: "$0.6800",
      markPrice: "$0.6531",
      size: "100",
      margin: "$6.80",
      pnl: "-$2.69",
      pnlPercent: "-39.6%",
      leverage: "10x",
    },
    shortProfit: {
      type: "short",
      event: "Fed to cut rates in Q1 2026?",
      option: "No",
      entryPrice: "$0.4800",
      markPrice: "$0.4210",
      size: "250",
      margin: "$12.00",
      pnl: "+$14.75",
      pnlPercent: "+122.9%",
      leverage: "10x",
    },
    nearLiq: {
      type: "long",
      event: "SPX to close above 6,000 by year end?",
      option: "Yes",
      entryPrice: "$0.7100",
      markPrice: "$0.6512",
      size: "500",
      margin: "$3.55",
      pnl: "-$3.35",
      pnlPercent: "-94.4%",
      leverage: "100x",
    },
    highLeverage: {
      type: "long",
      event: "ETH to reach $6k by Q2 2026?",
      option: "Yes",
      entryPrice: "$0.4400",
      markPrice: "$0.4632",
      size: "1,000",
      margin: "$4.40",
      pnl: "+$2.32",
      pnlPercent: "+52.7%",
      leverage: "100x",
    },
    binaryYesAlias: {
      type: "long",
      event: "NBA Finals 2026 Game 7: Celtics vs Thunder?",
      option: "Yes",
      displayOption: "Boston Celtics",
      entryPrice: "$0.4800",
      markPrice: "$0.5210",
      size: "200",
      margin: "$9.60",
      pnl: "+$8.20",
      pnlPercent: "+85.4%",
      leverage: "10x",
    },
    airdropVoucher: {
      type: "long",
      event: "Bitcoin to reach $150k by end of 2026?",
      option: "Yes",
      entryPrice: "$0.2200",
      markPrice: "$0.2618",
      size: "100",
      margin: "$2.20",
      pnl: "+$4.18",
      pnlPercent: "+190.0%",
      leverage: "10x",
      isAirdrop: true,
    },
  };

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "longProfit", label: "Long · profit" },
          { id: "longLoss", label: "Long · loss" },
          { id: "shortProfit", label: "Short · profit" },
          { id: "nearLiq", label: "Near liquidation" },
          { id: "highLeverage", label: "High leverage (100x)" },
          { id: "binaryYesAlias", label: "Binary · alias display" },
          { id: "airdropVoucher", label: "Airdrop · voucher badge" },
        ]}
      />
      <Frame>
        <PositionCard {...cfg[state]} />
      </Frame>
    </div>
  );
};

/* ---------------- 8. OrderCard (real) ---------------- */

type OrderState =
  | "buyPending"
  | "sellPending"
  | "buyPartial"
  | "buyFilled"
  | "sellCancelled"
  | "buyMarket"
  | "binaryPartial";

export const OrderCardPreview = () => {
  const [state, setState] = useState<OrderState>("buyPending");

  const cfg: Record<OrderState, React.ComponentProps<typeof OrderCard>> = {
    buyPending: {
      type: "buy",
      orderType: "Limit",
      event: "BTC to reach $100k?",
      option: "Yes",
      probability: "65%",
      price: "$0.6531",
      amount: "100",
      total: "$65.31",
      time: "14:32:05",
      status: "Pending",
    },
    sellPending: {
      type: "sell",
      orderType: "Limit",
      event: "Fed to cut rates in Q1 2026?",
      option: "No",
      probability: "42%",
      price: "$0.4210",
      amount: "250",
      total: "$105.25",
      time: "14:28:12",
      status: "Pending",
    },
    buyPartial: {
      type: "buy",
      orderType: "Limit",
      event: "BTC to reach $100k?",
      option: "Yes",
      probability: "65%",
      price: "$0.6531",
      amount: "100",
      total: "$65.31",
      time: "14:32:05",
      status: "Partial Filled",
    },
    buyFilled: {
      type: "buy",
      orderType: "Limit",
      event: "BTC to reach $100k?",
      option: "Yes",
      probability: "65%",
      price: "$0.6531",
      amount: "100",
      total: "$65.31",
      time: "14:32:05",
      status: "Filled",
    },
    sellCancelled: {
      type: "sell",
      orderType: "Limit",
      event: "Fed to cut rates in Q1 2026?",
      option: "No",
      probability: "42%",
      price: "$0.4210",
      amount: "250",
      total: "$105.25",
      time: "14:28:12",
      status: "Cancelled",
    },
    buyMarket: {
      type: "buy",
      orderType: "Market",
      event: "ETH to reach $6k by Q2 2026?",
      option: "Yes",
      probability: "58%",
      price: "$0.5810",
      amount: "150",
      total: "$87.15",
      time: "14:22:44",
      status: "Filled",
    },
    binaryPartial: {
      type: "buy",
      orderType: "Limit",
      event: "NBA Finals 2026 Game 7: Celtics vs Thunder?",
      option: "Yes",
      displayOption: "Boston Celtics",
      probability: "52%",
      price: "$0.5210",
      amount: "200",
      total: "$104.20",
      time: "14:12:18",
      status: "Partial Filled",
    },
  };

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "buyPending", label: "Buy · Pending" },
          { id: "sellPending", label: "Sell · Pending" },
          { id: "buyPartial", label: "Buy · Partial Filled" },
          { id: "buyFilled", label: "Buy · Filled" },
          { id: "sellCancelled", label: "Sell · Cancelled" },
          { id: "buyMarket", label: "Buy · Market · Filled" },
          { id: "binaryPartial", label: "Binary · Partial (alias)" },
        ]}
      />
      <Frame>
        <div className="max-w-md">
          <OrderCard {...cfg[state]} />
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 9. Order status badges (mirror) ---------------- */
/* Palette lifted verbatim from OrderCard.tsx statusColors map — keep in sync. */

export const OrderStatusBadgesPreview = () => (
  <div className="flex flex-wrap gap-3">
    <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
      Pending
    </Badge>
    <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
      Partial Filled
    </Badge>
    <Badge className="bg-trading-green/20 text-trading-green hover:bg-trading-green/30">
      Filled
    </Badge>
    <Badge className="bg-trading-red/20 text-trading-red hover:bg-trading-red/30">
      Cancelled
    </Badge>
  </div>
);

/* ---------------- 10. Partial-fill HoverCard (mirror) ---------------- */
/* Composed inline in DesktopPositionsPanel + OrderCard drawers; no exported
   <PartialFillPopover>. Kept as mirror for design reference. */

const mockFillHistory = [
  { time: "14:32:05", amount: 30, price: "0.652", total: "$19.56" },
  { time: "14:28:12", amount: 20, price: "0.648", total: "$12.96" },
  { time: "14:25:33", amount: 10, price: "0.645", total: "$6.45" },
];

const FillPopoverContent = ({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) => {
  const pct = Math.round((filled / total) * 100);
  return (
    <>
      <div className="px-3 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium">Fill Progress</span>
          <span className="text-xs font-mono text-cyan-400">
            {filled}/{total} ({pct}%)
          </span>
        </div>
        <Progress value={pct} className="h-1.5 [&>div]:bg-cyan-400" />
      </div>
      <div className="px-3 py-2">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
          Fill History
        </div>
        <div className="space-y-1">
          {mockFillHistory.map((fill, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-trading-green" />
                <span className="font-mono text-muted-foreground">
                  {fill.time}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono">
                  {fill.amount} @ {fill.price}
                </span>
                <span className="font-mono text-trading-green">
                  {fill.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Avg Fill Price</span>
          <span className="font-mono font-medium">$0.649</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Total Filled</span>
          <span className="font-mono font-medium text-trading-green">
            ${(filled * 0.649).toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export const PartialFillDesktopPreview = () => {
  const filled = 60;
  const total = 100;
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        Hover the &quot;Partial Filled&quot; badge to reveal the fill-history
        popover — mirror of the inline HoverCard in DesktopPositionsPanel.
      </p>
      <Frame>
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {[
                  "Contracts",
                  "Side",
                  "Order Type",
                  "Price",
                  "Qty",
                  "Value",
                  "Status",
                  "Time",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-xs text-muted-foreground font-normal text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 hover:bg-muted/30">
                <td className="px-3 py-2 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">Spain</span>
                    <span className="text-xs text-muted-foreground">
                      FIFA World Cup 2026 Winner?
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-sm">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-trading-green/20 text-trading-green">
                    Yes
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-muted-foreground">
                  Limit
                </td>
                <td className="px-3 py-2 text-sm font-mono">$0.1800</td>
                <td className="px-3 py-2 text-sm font-mono">{total}</td>
                <td className="px-3 py-2 text-sm font-mono">
                  ${(total * 0.18).toFixed(2)}
                </td>
                <td className="px-3 py-2 text-sm">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <button className="cursor-pointer">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                          Partial Filled
                        </span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="bottom"
                      align="start"
                      className="w-80 p-0 bg-popover border-border"
                    >
                      <FillPopoverContent filled={filled} total={total} />
                    </HoverCardContent>
                  </HoverCard>
                </td>
                <td className="px-3 py-2 text-sm text-muted-foreground">
                  Just now
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Frame>
    </div>
  );
};

export const PartialFillMobilePreview = () => {
  const filled = 60;
  const total = 100;
  const pct = Math.round((filled / total) * 100);
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        Hover the badge to reveal the popover — mirror of the inline HoverCard
        in the mobile order card.
      </p>
      <Frame>
        <div className="bg-card rounded-xl p-4 border border-border max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-trading-green/20 text-trading-green">
                Yes
              </span>
              <span className="text-sm text-muted-foreground">Limit</span>
            </div>
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button className="cursor-pointer">
                  <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Partial Filled
                    </span>
                  </Badge>
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                side="bottom"
                align="end"
                className="w-72 p-0 bg-popover border-border"
              >
                <FillPopoverContent filled={filled} total={total} />
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="mb-3">
            <h3 className="font-medium text-foreground text-sm">
              BTC to reach $100k
            </h3>
            <p className="text-xs text-muted-foreground">Yes · 65%</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Price
              </span>
              <span className="font-mono text-xs">$0.65</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Amount
              </span>
              <span className="font-mono text-xs">{total}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Filled
              </span>
              <span className="font-mono text-xs text-cyan-400">
                {filled}/{total} · {pct}%
              </span>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 11. Risk-tier badge grid (mirror helper) ---------------- */
/* Real AccountRiskIndicator / MobileRiskIndicator read useRealtimeRiskMetrics
   and only ever render one tier per session. This helper enumerates the 4
   canonical tiers using the exact colour + message helpers exported from the
   same hook module, so the tier semantics stay in one source of truth. */

const RiskTierBadge = ({ level }: { level: RiskLevel }) => {
  const message = getRiskMessage(level);
  const icon =
    level === "SAFE" ? (
      <ShieldCheck className="w-3.5 h-3.5" />
    ) : level === "WARNING" ? (
      <AlertTriangle className="w-3.5 h-3.5" />
    ) : level === "RESTRICTION" ? (
      <Ban className="w-3.5 h-3.5" />
    ) : (
      <Zap className="w-3.5 h-3.5" />
    );
  const ratio =
    level === "SAFE"
      ? 45
      : level === "WARNING"
        ? 87
        : level === "RESTRICTION"
          ? 97
          : 105;
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded ${getRiskBgColor(level)}/20 ${getRiskColor(level)}`}
        >
          {icon}
          {level}
        </span>
        <span className={`text-xs font-mono ${getRiskColor(level)}`}>
          {ratio.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getRiskBgColor(level)}`}
          style={{ width: `${Math.min(ratio, 100)}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">
        {message.text}
      </p>
    </div>
  );
};

export const RiskTierGridPreview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {(["SAFE", "WARNING", "RESTRICTION", "LIQUIDATION"] as RiskLevel[]).map(
      (level) => (
        <RiskTierBadge key={level} level={level} />
      ),
    )}
  </div>
);

/* ---------------- 12. AccountRiskIndicator (real, both variants) ---------------- */

export const AccountRiskCompactPreview = () => (
  <div className="space-y-3">
    <p className="text-[11px] text-muted-foreground italic">
      Real AccountRiskIndicator (variant=&quot;compact&quot;). Tier reflects
      the current session — enumerate all 4 tiers in the Risk-Tier Grid case
      above.
    </p>
    <Frame>
      <div className="max-w-xs">
        <AccountRiskIndicator variant="compact" />
      </div>
    </Frame>
  </div>
);

export const AccountRiskFullPreview = () => (
  <div className="space-y-3">
    <p className="text-[11px] text-muted-foreground italic">
      Real AccountRiskIndicator (variant=&quot;full&quot;). Tier reflects the
      current session — enumerate all 4 tiers in the Risk-Tier Grid case above.
    </p>
    <Frame>
      <div className="max-w-md">
        <AccountRiskIndicator variant="full" />
      </div>
    </Frame>
  </div>
);

/* ---------------- 13. MobileRiskIndicator (real) ---------------- */

export const MobileRiskIndicatorPreview = () => (
  <div className="space-y-3">
    <p className="text-[11px] text-muted-foreground italic">
      Real MobileRiskIndicator — compact MM badge that opens the full risk
      drawer. Tap the badge to open the drawer. Tier reflects the current
      session.
    </p>
    <Frame>
      <div className="flex items-center gap-3">
        <MobileRiskIndicator />
        <span className="text-xs text-muted-foreground">
          Sits in the /trade mobile header
        </span>
      </div>
    </Frame>
  </div>
);
