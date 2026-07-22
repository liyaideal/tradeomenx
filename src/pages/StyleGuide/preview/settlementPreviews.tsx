// Settlement row previews for Style Guide (Round 4B).
// MIRROR: uses production components exported from PortfolioSettlements.tsx —
// if you change the row layout there, the previews below update automatically.
// Also demos the SPOT badge treatments across resolved / list surfaces.

import { SettlementRowDesktop, SettlementRowMobile } from "@/pages/PortfolioSettlements";
import type { SettlementListItem } from "@/hooks/useSettlements";
import { ProductLineBadge } from "@/lib/productLineBadge";
import { ResolvedMarketCard } from "@/components/resolved/ResolvedMarketCard";
import { MarketCardB } from "@/components/events/MarketCardB";
import type { ResolvedEvent } from "@/hooks/useResolvedEvents";
import type { EventRow } from "@/hooks/useMarketListData";

const now = new Date().toISOString().split("T")[0];

const mkRow = (over: Partial<SettlementListItem>): SettlementListItem => ({
  id: "demo",
  event: "Will NVDA close up on 2026-07-22?",
  option: "Up",
  side: "long",
  entryPrice: "$0.5400",
  exitPrice: "$1.0000",
  size: "120",
  pnl: "+$55.20",
  pnlValue: 55.2,
  pnlPercent: "(+42.1%)",
  leverage: "5x",
  settledAt: now,
  result: "win",
  kind: "settled",
  productLine: "futures",
  ...over,
});

/** Futures · settled · win — leverage chip + Win badge. */
export const SettlementFuturesWinDesktopPreview = () => (
  <table className="w-full text-sm">
    <tbody>
      <SettlementRowDesktop settlement={mkRow({})} optionDisplay="Up" onOpen={() => {}} />
    </tbody>
  </table>
);

/** Spot · settled — SPOT badge + $1/$0 exit + Win/Loss chip. */
export const SettlementSpotSettledDesktopPreview = () => (
  <table className="w-full text-sm">
    <tbody>
      <SettlementRowDesktop
        settlement={mkRow({
          productLine: "spot",
          leverage: "SPOT",
          event: "NVDA · Up on 07-22",
        })}
        optionDisplay="Up"
        onOpen={() => {}}
      />
    </tbody>
  </table>
);

/** Spot · intraday close — no Win/Loss chip, PnL number is the only signal. */
export const SettlementSpotClosedDesktopPreview = () => (
  <table className="w-full text-sm">
    <tbody>
      <SettlementRowDesktop
        settlement={mkRow({
          productLine: "spot",
          leverage: "SPOT",
          kind: "closed",
          exitPrice: "$0.6720",
          pnl: "-$14.40",
          pnlValue: -14.4,
          pnlPercent: "(-22.2%)",
          result: "lose",
        })}
        optionDisplay="Up"
        onOpen={() => {}}
      />
    </tbody>
  </table>
);

export const SettlementFuturesWinMobilePreview = () => (
  <div className="space-y-2">
    <SettlementRowMobile settlement={mkRow({})} optionDisplay="Up" onOpen={() => {}} />
  </div>
);

export const SettlementSpotSettledMobilePreview = () => (
  <div className="space-y-2">
    <SettlementRowMobile
      settlement={mkRow({ productLine: "spot", leverage: "SPOT", event: "NVDA · Up on 07-22" })}
      optionDisplay="Up"
      onOpen={() => {}}
    />
  </div>
);

export const SettlementSpotClosedMobilePreview = () => (
  <div className="space-y-2">
    <SettlementRowMobile
      settlement={mkRow({
        productLine: "spot",
        leverage: "SPOT",
        kind: "closed",
        exitPrice: "$0.6720",
        pnl: "-$14.40",
        pnlValue: -14.4,
        pnlPercent: "(-22.2%)",
        result: "lose",
      })}
      optionDisplay="Up"
      onOpen={() => {}}
    />
  </div>
);

/** Product-line badge legend — three surfaces where SPOT appears. */
export const ProductLineBadgeLegendPreview = () => (
  <div className="space-y-2 text-xs text-muted-foreground">
    <div className="flex items-center gap-2">
      <ProductLineBadge line="spot" />
      <span>Row inline (Settlements · Transactions · Transparency · Resolved · Events list)</span>
    </div>
    <div className="flex items-center gap-2">
      <ProductLineBadge line="futures" />
      <span>Reserved for surfaces where both lines must coexist (Transactions row).</span>
    </div>
    <p className="text-[10px]">
      /spot terminal header keeps its neutral outline badge (§14 LOCKED) — do not swap.
    </p>
  </div>
);
