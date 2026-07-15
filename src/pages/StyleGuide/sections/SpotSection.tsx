import { Badge } from "@/components/ui/badge";
import {
  LIFECYCLE_BADGE,
  LP_QUOTE_MODE_BADGE,
  SESSION_PROFILES,
  type SessionProfile,
} from "@/lib/usStockSessions";
import { SpotStatsHeader } from "@/components/SpotStatsHeader";
import { SectionWrapper } from "../components/SectionWrapper";
import { ArrowLeft, Star } from "lucide-react";


interface Props { isMobile: boolean }

/**
 * Style-guide gallery for /spot. Mirrors the terminal skeleton so any
 * regression (site nav creeping back, wrong CTA color, perp fields leaking
 * in) is visible here first.
 */
export const SpotSection = ({ isMobile }: Props) => {
  return (
    <div className="space-y-8">
      {/* Terminal chrome — the whole point: NO site nav on trading pages */}
      <SectionWrapper
        id="spot-terminal-chrome"
        title="Spot terminal chrome"
        description="Back + event name + red-pulse countdown + right stats (24h Vol · Prior Close · Last · Yes Price) + watchlist star. NO site navigation header. NO Index/Funding/OI/Perpetual."
      >
        <div className="rounded-lg border border-border/50 overflow-hidden bg-background">
          <header className="flex items-center gap-4 px-4 py-2 border-b border-border/30">
            <button className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 border border-border/60 font-mono text-[11px] font-semibold">TSL</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">Will TSLA close higher today? (Jul 15)</span>
                  <Badge variant="outline" className="text-[10px]">SPOT</Badge>
                  <Badge variant="outline" className={`text-[10px] border ${LIFECYCLE_BADGE.TRADING.className}`}>Trading</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <span className="w-1.5 h-1.5 bg-trading-red rounded-full animate-pulse" />
                  <span>Closes in</span>
                  <span className="text-trading-red font-mono font-medium">02:14:33</span>
                  <span>·</span>
                  <span className="font-mono">Jul 15, 16:00 ET</span>
                  <span>·</span>
                  <span className="font-mono">Jul 16, 04:00 北京</span>
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-6 text-xs">
              <Stat label="24h Volume" value="$1.82M" />
              <Stat label="Prior Close" value="$268.30" />
              <Stat label="Last (indicative)" value="$270.14" valueClass="text-trading-green" hint="+0.69%" />
              <Stat label="Yes Price" value="$0.44" />
            </div>
            <Star className="w-5 h-5 text-trading-yellow fill-trading-yellow ml-2" />
          </header>
        </div>
      </SectionWrapper>

      {/* Spot stats header (mobile / embedded variant) */}
      <SectionWrapper
        id="spot-stats-header"
        title="SpotStatsHeader — 3 lifecycle states"
        description="Standalone header used when embedding spot metadata outside the terminal (fallback / mobile)."
      >
        <div className="space-y-3">
          <SpotStatsHeader eventId="us-tsla-updown-20260715" eventName="Will TSLA close higher today?" basePrice={268.30} yesPrice={0.44} lifecycle="TRADING" />
          <SpotStatsHeader eventId="us-nvda-updown-20260715" eventName="Will NVDA close higher today?" basePrice={182.45} yesPrice={0.57} lifecycle="CLOSE_MODE" />
          <SpotStatsHeader eventId="us-aapl-updown-20260715" eventName="Will AAPL close higher today?" basePrice={231.10} yesPrice={0.54} lifecycle="FROZEN" />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="spot-lifecycle"
        title="Lifecycle badges (11 states)"
        description="Full events.lifecycle_status enum per PRD: CREATED → EXTENDED_TRADING → OPEN_COOLDOWN → TRADING → CLOSE_MODE → FROZEN → SETTLING → SETTLED plus SUSPENDED / REVIEW / CANCELED. PRE_FREEZE is NOT a lifecycle state — it's a display-layer session hint only."
      >
        <div className="flex flex-wrap gap-2">
          {Object.entries(LIFECYCLE_BADGE).map(([k, v]) => (
            <Badge key={k} variant="outline" className={`text-[10px] border ${v.className}`}>{v.label}</Badge>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="spot-quote-mode"
        title="LP quote-mode badge"
        description="Rendered in the order-book header. Enum mirrors lp_quote_mode. Default on demo is NORMAL."
      >
        <div className="flex flex-wrap gap-2">
          {Object.entries(LP_QUOTE_MODE_BADGE).map(([k, v]) => (
            <span
              key={k}
              className={`px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide rounded border ${v.className}`}
              title={v.tooltip}
            >
              {v.label}
            </span>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA colour semantics — regression pin */}
      <SectionWrapper
        id="spot-cta"
        title="Trade CTA — semantic colour only"
        description="Buy Up → trading-green. Buy Not Up → trading-red. NEVER primary/purple. Text follows selected outcome + Buy/Sell."
      >
        <div className="grid gap-3 md:grid-cols-4">
          <button className="h-11 rounded-lg font-semibold text-sm bg-trading-green hover:bg-trading-green/90 text-trading-green-foreground">
            Buy Up · To win $126 →
          </button>
          <button className="h-11 rounded-lg font-semibold text-sm bg-trading-red hover:bg-trading-red/90 text-foreground">
            Buy Not Up · To win $180 →
          </button>
          <button className="h-11 rounded-lg font-semibold text-sm bg-trading-green hover:bg-trading-green/90 text-trading-green-foreground">
            Sell Up
          </button>
          <button className="h-11 rounded-lg font-semibold text-sm bg-trading-red hover:bg-trading-red/90 text-foreground">
            Sell Not Up
          </button>
        </div>
      </SectionWrapper>

      {/* Session-aware order-book profiles */}
      <SectionWrapper
        id="spot-session-profiles"
        title="Session-aware LP profiles"
        description="getCurrentSession() picks the profile from wall-clock ET. Depth/spread/size + quote-mode badge follow the session (LP PRD §4.2/§6.1). DEMO-STATE."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {Object.values(SESSION_PROFILES).map((p) => (
            <SessionProfileCard key={p.session} profile={p} />
          ))}
        </div>
      </SectionWrapper>

      {/* Pending limit orders (Cancel / Reserved) */}
      <SectionWrapper
        id="spot-pending-orders"
        title="Current Orders — Pending / Cancel"
        description="Buy limit < best ask → Pending (cash reserved). Sell limit > best bid → Pending. Cancel refunds reserved cash for buys. Touch-fill is front-end simulated; DEMO-STATE."
      >
        <div className="rounded-lg border border-border/50 overflow-hidden text-xs">
          <div className="grid grid-cols-[1.5fr_0.6fr_0.6fr_0.7fr_0.8fr_0.7fr_0.7fr_0.5fr] gap-2 px-4 py-2 text-muted-foreground border-b border-border/30 bg-muted/30">
            <span>Market</span>
            <span>Side</span>
            <span>Type</span>
            <span className="text-right">Limit</span>
            <span className="text-right">Qty (sh)</span>
            <span className="text-right">Reserved</span>
            <span className="text-right">Status</span>
            <span />
          </div>
          {SAMPLE_ORDERS.map((o, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.5fr_0.6fr_0.6fr_0.7fr_0.8fr_0.7fr_0.7fr_0.5fr] gap-2 px-4 py-2 items-center border-b border-border/20"
            >
              <span className="truncate">{o.market}</span>
              <span className={`uppercase ${o.side === "buy" ? "text-trading-green" : "text-trading-red"}`}>{o.side}</span>
              <span>{o.type}</span>
              <span className="text-right font-mono">{o.limit}</span>
              <span className="text-right font-mono">{o.qty}</span>
              <span className="text-right font-mono text-muted-foreground">{o.reserved}</span>
              <span className={`text-right ${o.status === "Pending" ? "text-trading-yellow" : "text-muted-foreground"}`}>
                {o.status}
              </span>
              <button
                disabled={o.status !== "Pending"}
                className="text-[10px] text-trading-red hover:underline text-right disabled:opacity-40 disabled:no-underline"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Removed fields — anti-pattern reference */}
      <SectionWrapper
        id="spot-removed-fields"
        title="Removed on spot (anti-pattern reference)"
        description="Fields that MUST NOT appear anywhere on /spot. Kept here so regressions are obvious."
      >
        <div className="rounded-lg border border-trading-red/30 bg-trading-red/5 p-4 text-xs font-mono space-y-1 text-muted-foreground">
          <div>❌ Margin Mode / Cross</div>
          <div>❌ Leverage slider + multiplier chips</div>
          <div>❌ TP / SL block</div>
          <div>❌ Funding Rate / Next Funding / Open Interest / Index Price</div>
          <div>❌ Liq. price / Margin req.</div>
          <div>❌ BTCUSDT / USDT Perpetual defaults from `DesktopHeader`</div>
          <div>❌ Site-wide nav header (`EventsDesktopHeader`, `MobileHeader` w/ Logo)</div>
        </div>
      </SectionWrapper>
    </div>
  );
};

const SAMPLE_ORDERS = [
  { market: "TSLA · Up (Jul 15)", side: "buy", type: "Limit", limit: "$0.42", qty: "500", reserved: "$210.00", status: "Pending" },
  { market: "NVDA · Not Up (Jul 15)", side: "sell", type: "Limit", limit: "$0.61", qty: "300", reserved: "—", status: "Pending" },
  { market: "AAPL · Up (Jul 15)", side: "buy", type: "Limit", limit: "$0.55", qty: "200", reserved: "$110.00", status: "Filled" },
];

const SessionProfileCard = ({ profile }: { profile: SessionProfile }) => {
  const badge = LP_QUOTE_MODE_BADGE[profile.quoteMode];
  return (
    <div className="rounded-lg border border-border/50 p-3 bg-background space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{profile.label}</span>
        <span
          className={`px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide rounded border ${badge.className}`}
          title={badge.tooltip}
        >
          {badge.label}
        </span>
      </div>
      <div className="text-[11px] text-muted-foreground">{profile.tooltip}</div>
      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
        <div>
          <div className="text-muted-foreground text-[10px]">Levels</div>
          <div>
            {profile.levelsMin}
            {profile.levelsMin === profile.levelsMax ? "" : `–${profile.levelsMax}`}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-[10px]">Spread ×</div>
          <div>{profile.spreadMult}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-[10px]">Size ×</div>
          <div>{profile.sizeMult}</div>
        </div>
      </div>
    </div>
  );
};


const Stat = ({ label, value, valueClass, hint }: { label: string; value: string; valueClass?: string; hint?: string }) => (
  <div className="text-xs">
    <div className="text-muted-foreground">{label}</div>
    <div className={`font-mono font-medium ${valueClass ?? ""}`}>
      {value}
      {hint && <span className={`ml-1 text-[10px] ${valueClass ?? ""}`}>{hint}</span>}
    </div>
  </div>
);
