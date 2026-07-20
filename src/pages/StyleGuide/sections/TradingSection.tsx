import { SectionWrapper, SubSection, DualDevicePreview } from "../components";

/**
 * Trading section — same "real components + all states + true dual-viewport"
 * standard as ApiSection / VouchersSection. Every case mounts through
 * <DualDevicePreview> so `md:` breakpoints resolve against the 375px iframe.
 *
 * Real production components used directly:
 *  - TradeSubmitButton, DesktopOrderBook, OrderBook, DesktopTradeForm,
 *    TradeForm (multi + binary), PositionCard, OrderCard,
 *    AccountRiskIndicator (compact + full), MobileRiskIndicator.
 *
 * Style-guide-internal mirrors (annotated in tradingPreviews.tsx):
 *  - Trading color semantics, order status badge lineup, partial-fill
 *    HoverCard (composed inline in DesktopPositionsPanel / OrderCard drawers,
 *    no exported wrapper), and the 4-tier risk badge grid (real risk
 *    indicators are hook-driven and only render one tier per session).
 */

interface Props {
  isMobile: boolean;
}

export const TradingSection = ({ isMobile: _isMobile }: Props) => {
  return (
    <SectionWrapper
      id="trading"
      title="Trading"
      description="Order book, trade forms, positions, orders, and account risk. Every module toggles Desktop / Mobile·375 through an iframe so `md:` breakpoints render honestly."
    >
      <div className="space-y-10">
        <SubSection
          title="1. Trading color semantics"
          description="Green (profit / Yes / success), Red (loss / No / error), Yellow (warning / pending), Purple (brand / active). Mirror — no independent production component."
          platform="shared"
        >
          <DualDevicePreview
            previewKey="trading-colors"
            label="Semantic palette; stacks 2×2 on mobile."
            minHeight={220}
          />
        </SubSection>

        <SubSection
          title="2. TradeSubmitButton"
          description="Unified trade CTA. Buy→trading-green, Sell→trading-red. Two-line layout (label + 'To win $X'). Enumerates idle / disabled / loading / sm / lg."
          platform="shared"
        >
          <DualDevicePreview
            previewKey="trade-submit-button"
            label="7 states via preset rail"
            minHeight={220}
          />
        </SubSection>

        <SubSection
          title="3. DesktopOrderBook"
          description="Real DesktopOrderBook with mock asks/bids. Enumerates Futures × 4 quoteModes (NORMAL / CONSERVATIVE / HEDGE_ONLY / CANCEL_ONLY) and Spot (outcome-share copy)."
          platform="desktop"
        >
          <DualDevicePreview
            previewKey="desktop-order-book"
            label="5 quote/variant states"
            minHeight={620}
          />
        </SubSection>

        <SubSection
          title="4. OrderBook — mobile compact"
          description="Real OrderBook component (mobile compact + in-panel full variants)."
          platform="mobile"
        >
          <DualDevicePreview
            previewKey="mobile-order-book"
            label="compact vs full"
            minHeight={520}
          />
        </SubSection>

        <SubSection
          title="5. DesktopTradeForm"
          description="Real DesktopTradeForm driven by mock selectedPrice. Auth/balance/leverage from live hooks — state-forced disabled / loading / close-only variants belong to the TradeSubmitButton case."
          platform="desktop"
        >
          <DualDevicePreview
            previewKey="trade-form-desktop"
            label="3 price presets"
            minHeight={780}
          />
        </SubSection>

        <SubSection
          title="6. TradeForm — mobile (incl. binaryMode)"
          description="Real TradeForm. Multi-outcome renders standard Buy/Sell CTA rail. binaryMode swaps Buy/Sell into a Yes/No option toggle; long labels test truncation."
          platform="mobile"
        >
          <DualDevicePreview
            previewKey="trade-form-mobile"
            label="multi · binary Yes/No · binary long labels"
            minHeight={820}
          />
        </SubSection>

        <SubSection
          title="7. PositionCard"
          description="Real PositionCard across long/short profit/loss, near-liquidation, high-leverage (100×), binary alias display, and voucher airdrop badge."
          platform="mobile"
        >
          <DualDevicePreview
            previewKey="position-card"
            label="7 position states"
            minHeight={360}
          />
        </SubSection>

        <SubSection
          title="8. OrderCard"
          description="Real OrderCard across buy/sell × Pending / Partial Filled / Filled / Cancelled and Market fills. Binary alias variant included."
          platform="mobile"
        >
          <DualDevicePreview
            previewKey="order-card"
            label="7 order states"
            minHeight={280}
          />
        </SubSection>

        <SubSection
          title="9. Order status badges"
          description="Palette lifted verbatim from OrderCard statusColors map. Mirror — badges are inlined in OrderCard and positions tables."
          platform="shared"
        >
          <DualDevicePreview
            previewKey="order-status-badges"
            label="Pending / Partial Filled / Filled / Cancelled"
            minHeight={120}
          />
        </SubSection>

        <SubSection
          title="10. Partial-fill HoverCard — desktop table"
          description="Hover the Partial Filled badge in the order row to reveal the fill-history popover. Mirror of the inline HoverCard in DesktopPositionsPanel."
          platform="desktop"
        >
          <DualDevicePreview
            previewKey="partial-fill-desktop"
            label="Hover the badge to see the popover"
            minHeight={280}
          />
        </SubSection>

        <SubSection
          title="11. Partial-fill HoverCard — mobile card"
          description="Same popover pattern on the mobile OrderCard badge. Mirror of the inline HoverCard in the order card drawer trigger."
          platform="mobile"
        >
          <DualDevicePreview
            previewKey="partial-fill-mobile"
            label="Hover the badge to see the popover"
            minHeight={340}
          />
        </SubSection>

        <SubSection
          title="12. Risk-tier grid — all 4 tiers"
          description="Enumerates SAFE / WARNING / RESTRICTION / LIQUIDATION using the exact getRiskColor / getRiskBgColor / getRiskMessage helpers exported from useRealtimeRiskMetrics. Complements the real risk indicators below, which only render the current session's live tier."
          platform="shared"
        >
          <DualDevicePreview
            previewKey="risk-tier-grid"
            label="Single source of truth for tier semantics"
            minHeight={320}
          />
        </SubSection>

        <SubSection
          title="13. AccountRiskIndicator — compact"
          description="Real AccountRiskIndicator (variant=compact) used in the desktop trade sidebar. Reflects the current session's tier."
          platform="desktop"
        >
          <DualDevicePreview
            previewKey="account-risk-compact"
            label="Live session data · enumerate tiers in case 12"
            minHeight={360}
          />
        </SubSection>

        <SubSection
          title="14. AccountRiskIndicator — full"
          description="Real AccountRiskIndicator (variant=full) used in the risk drawer. Reflects the current session's tier."
          platform="desktop"
        >
          <DualDevicePreview
            previewKey="account-risk-full"
            label="Live session data · enumerate tiers in case 12"
            minHeight={520}
          />
        </SubSection>

        <SubSection
          title="15. MobileRiskIndicator"
          description="Real MobileRiskIndicator — compact MM badge sitting in the /trade mobile header. Tap the badge to open the full risk drawer."
          platform="mobile"
        >
          <DualDevicePreview
            previewKey="mobile-risk-indicator"
            label="Tap the badge to open the drawer"
            minHeight={200}
          />
        </SubSection>
      </div>
    </SectionWrapper>
  );
};
