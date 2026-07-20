import { SectionWrapper, SubSection } from "../components";
import { SingleDevicePreview } from "../components/DeviceFrame";

/**
 * Trading — /trade is TWO independent implementations:
 *
 *   A. Desktop: `src/pages/DesktopTrading.tsx`. Reuses `DesktopOrderBook`;
 *      the trade panel & positions/orders tables are INLINE in the page
 *      (there is no extracted `DesktopTradeForm` / `DesktopPositionsPanel`
 *      in production — those files exist but are orphan). Inline blocks
 *      are surfaced here via source-annotated mirrors.
 *
 *   B. Mobile: `src/components/MobileTradingLayout.tsx` shell composing
 *      mobile-specific real components (OrderBook, TradeForm, OptionChips,
 *      MobileRiskIndicator, PositionCard, OrderCard, AirdropPositionCard).
 *
 *   C. Device-agnostic reference: color semantics, order status badges,
 *      risk tier grid — pure token/spec surfaces used by both platforms.
 *
 * Every case renders through <SingleDevicePreview> — this section has no
 * shared responsive component, so DualDevicePreview is inappropriate here.
 */

export const TradingSection = () => {
  return (
    <SectionWrapper
      id="trading"
      title="Trading"
      description="Grouped by real implementation: A · Desktop /trade (DesktopTrading.tsx), B · Mobile /trade (MobileTradingLayout.tsx), C · Shared reference surfaces."
    >
      <div className="space-y-12">
        {/* ============ A. Desktop /trade ============ */}
        <div className="space-y-6">
          <div className="border-l-2 border-trading-purple pl-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-trading-purple">
              Group A
            </div>
            <div className="text-sm font-semibold">
              Desktop · Source: src/pages/DesktopTrading.tsx
            </div>
          </div>

          <SubSection
            title="A1. DesktopOrderBook (real, extracted)"
            description="Only production component reused by DesktopTrading. Enumerates Futures × 4 quoteModes (NORMAL / CONSERVATIVE / HEDGE_ONLY / CANCEL_ONLY) and Spot."
            platform="desktop"
          >
            <SingleDevicePreview
              previewKey="desktop-order-book"
              device="desktop"
              label="5 quote/variant states"
              minHeight={620}
            />
          </SubSection>

          <SubSection
            title="A2. Desktop trade panel — inline mirror"
            description="Mirror of the inline right-side Trade panel in DesktopTrading.tsx. Keep in sync when the inline block changes; the extracted DesktopTradeForm.tsx file is orphan and must NOT be treated as production."
            platform="desktop"
          >
            <SingleDevicePreview
              previewKey="desktop-trade-panel-mirror"
              device="desktop"
              label="Mirror · source: DesktopTrading.tsx (inline)"
              minHeight={560}
            />
          </SubSection>

          <SubSection
            title="A3. Desktop positions / orders panel — inline mirror"
            description="Mirror of the inline bottom Positions / Current Orders tabbed panel in DesktopTrading.tsx."
            platform="desktop"
          >
            <SingleDevicePreview
              previewKey="desktop-positions-panel-mirror"
              device="desktop"
              label="Mirror · source: DesktopTrading.tsx (inline)"
              minHeight={360}
            />
          </SubSection>

          <SubSection
            title="A4. Partial-fill HoverCard — desktop table"
            description="Hover the Partial Filled badge to reveal the fill-history popover, matching the inline HoverCard in the desktop orders table."
            platform="desktop"
          >
            <SingleDevicePreview
              previewKey="partial-fill-desktop"
              device="desktop"
              label="Hover the badge"
              minHeight={280}
            />
          </SubSection>

          <SubSection
            title="A5. AccountRiskIndicator · compact"
            description="Real component (variant=compact) as used in the desktop trade sidebar."
            platform="desktop"
          >
            <SingleDevicePreview
              previewKey="account-risk-compact"
              device="desktop"
              label="Live session · enumerate tiers in C3"
              minHeight={360}
            />
          </SubSection>

          <SubSection
            title="A6. AccountRiskIndicator · full"
            description="Real component (variant=full) as used in the desktop risk drawer."
            platform="desktop"
          >
            <SingleDevicePreview
              previewKey="account-risk-full"
              device="desktop"
              label="Live session · enumerate tiers in C3"
              minHeight={520}
            />
          </SubSection>
        </div>

        {/* ============ B. Mobile /trade ============ */}
        <div className="space-y-6">
          <div className="border-l-2 border-trading-green pl-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-trading-green">
              Group B
            </div>
            <div className="text-sm font-semibold">
              Mobile · Source: src/components/MobileTradingLayout.tsx
            </div>
          </div>

          <SubSection
            title="B1. OrderBook — mobile compact"
            description="Real mobile OrderBook (compact + in-panel full variants)."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="mobile-order-book"
              device="mobile"
              label="compact vs full"
              minHeight={520}
            />
          </SubSection>

          <SubSection
            title="B2. OptionChips (real)"
            description="Horizontal chip rail for outcome selection on mobile /trade."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="option-chips-mobile"
              device="mobile"
              label="5 outcomes · scrollable"
              minHeight={100}
            />
          </SubSection>

          <SubSection
            title="B3. TradeForm — mobile (multi + binaryMode)"
            description="Real TradeForm. Multi-outcome renders standard Buy/Sell rail; binaryMode swaps into a Yes/No option toggle. Long labels test truncation."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="trade-form-mobile"
              device="mobile"
              label="multi · binary Yes/No · binary long labels"
              minHeight={820}
            />
          </SubSection>

          <SubSection
            title="B4. MobileRiskIndicator (real)"
            description="Compact MM badge sitting in the /trade mobile header. Tap to open the full risk drawer."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="mobile-risk-indicator"
              device="mobile"
              label="Tap the badge to open the drawer"
              minHeight={200}
            />
          </SubSection>

          <SubSection
            title="B5. PositionCard (real)"
            description="Long/short profit/loss, near-liquidation, 100× leverage, binary alias, voucher airdrop badge."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="position-card"
              device="mobile"
              label="7 position states"
              minHeight={360}
            />
          </SubSection>

          <SubSection
            title="B6. OrderCard (real)"
            description="Buy/sell × Pending / Partial Filled / Filled / Cancelled, plus Market fills and binary alias variant."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="order-card"
              device="mobile"
              label="7 order states"
              minHeight={280}
            />
          </SubSection>

          <SubSection
            title="B7. Partial-fill HoverCard — mobile card"
            description="Same popover pattern on the mobile OrderCard badge trigger."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="partial-fill-mobile"
              device="mobile"
              label="Hover the badge to see the popover"
              minHeight={340}
            />
          </SubSection>

          <SubSection
            title="B8. AirdropPositionCard (real)"
            description="H2E airdrop position card as shown on mobile /trade order screen. Enumerates pending (needs activation) and active states."
            platform="mobile"
          >
            <SingleDevicePreview
              previewKey="airdrop-position-card"
              device="mobile"
              label="pending · active"
              minHeight={280}
            />
          </SubSection>
        </div>

        {/* ============ C. Shared reference ============ */}
        <div className="space-y-6">
          <div className="border-l-2 border-muted-foreground/60 pl-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Group C
            </div>
            <div className="text-sm font-semibold">
              Shared reference surfaces (device-agnostic)
            </div>
          </div>

          <SubSection
            title="C1. Trading color semantics"
            description="Green (profit / Yes / success), Red (loss / No / error), Yellow (warning / pending), Purple (brand / active)."
            platform="shared"
          >
            <SingleDevicePreview
              previewKey="trading-colors"
              device="desktop"
              label="Semantic palette · one source of truth"
              minHeight={220}
            />
          </SubSection>

          <SubSection
            title="C2. TradeSubmitButton"
            description="Unified CTA used across both desktop and mobile trade forms. Buy → trading-green, Sell → trading-red. Enumerates idle / disabled / loading / sm / lg."
            platform="shared"
          >
            <SingleDevicePreview
              previewKey="trade-submit-button"
              device="desktop"
              label="7 states via preset rail"
              minHeight={220}
            />
          </SubSection>

          <SubSection
            title="C3. Risk tier grid — all 4 tiers"
            description="SAFE / WARNING / RESTRICTION / LIQUIDATION using the exact getRiskColor / getRiskBgColor / getRiskMessage helpers from useRealtimeRiskMetrics. Complements the real indicators in A5/A6/B4, which only render the current session's live tier."
            platform="shared"
          >
            <SingleDevicePreview
              previewKey="risk-tier-grid"
              device="desktop"
              label="Single source of truth for tier semantics"
              minHeight={320}
            />
          </SubSection>

          <SubSection
            title="C4. Order status badges"
            description="Palette lifted verbatim from OrderCard statusColors map. Badges are inlined in OrderCard and the desktop positions table."
            platform="shared"
          >
            <SingleDevicePreview
              previewKey="order-status-badges"
              device="desktop"
              label="Pending / Partial Filled / Filled / Cancelled"
              minHeight={120}
            />
          </SubSection>
        </div>
      </div>
    </SectionWrapper>
  );
};
