import { SeoPageLayout } from "@/components/seo";

const MethodologyPage = () => {
  return (
    <SeoPageLayout
      title="Methodology"
      description="How OmenX creates, prices, and settles event markets — a transparent look at our platform mechanics."
    >
      <h2>Market Creation</h2>
      <p>
        Events are curated by the OmenX team based on public interest, verifiability, and trading demand.
        Each event undergoes a rigorous review process to ensure:
      </p>
      <ul>
        <li><strong>Clear resolution criteria</strong> — unambiguous conditions for determining the outcome.</li>
        <li><strong>Verifiable data sources</strong> — trusted, publicly accessible sources for settlement.</li>
        <li><strong>Defined timeframe</strong> — a specific end date or trigger condition.</li>
        <li><strong>Meaningful outcomes</strong> — events that reflect genuine informational value.</li>
      </ul>

      <h2>Pricing Mechanism</h2>
      <p>
        OmenX uses a <strong>continuous double auction (order book)</strong> model for price discovery.
        Unlike automated market makers (AMMs), our order book model allows:
      </p>
      <ul>
        <li>True price discovery through natural supply and demand</li>
        <li>Tighter spreads and better execution for traders</li>
        <li>Limit orders for precise entry and exit points</li>
        <li>Transparent visibility into market depth and liquidity</li>
      </ul>
      <p>
        Option prices range from $0.00 to $1.00, directly representing the market-implied probability
        of each outcome. For binary events (Yes/No), option prices are complementary.
      </p>

      <h2>Leverage & Margin</h2>
      <p>
        Traders can open leveraged positions up to 20x. The margin system ensures:
      </p>
      <ul>
        <li><strong>Isolated margin</strong> — each position has its own margin, limiting loss to the allocated amount.</li>
        <li><strong>Automatic liquidation</strong> — positions are closed before they can exceed the margin.</li>
        <li><strong>No negative balances</strong> — you cannot lose more than your margin on any single position.</li>
      </ul>

      <h2>Resolution & Settlement</h2>
      <p>
        When an event concludes, the OmenX resolution system:
      </p>
      <ol>
        <li><strong>Monitors</strong> — Tracks the event through designated data sources in real time.</li>
        <li><strong>Verifies</strong> — Cross-references outcomes across multiple sources to prevent errors.</li>
        <li><strong>Resolves</strong> — Marks the winning outcome and triggers settlement.</li>
        <li><strong>Settles</strong> — Instantly credits winners ($1.00 per winning contract) and debits losing positions ($0.00).</li>
      </ol>
      <p>
        All settlement evidence, including source URLs and timestamps, is published on the event's resolution page
        for full transparency.
      </p>

      <h2>Risk Management</h2>
      <p>
        OmenX employs multiple risk management mechanisms:
      </p>
      <ul>
        <li><strong>Account Risk Indicator</strong> — Real-time risk scoring based on portfolio leverage and exposure.</li>
        <li><strong>Position Limits</strong> — Maximum position sizes per event to prevent market manipulation.</li>
        <li><strong>Stop Loss / Take Profit</strong> — Automatic exit orders to manage individual position risk.</li>
        <li><strong>Budget Limits</strong> — Optional spending controls for responsible trading.</li>
      </ul>

      <h2>Data Integrity</h2>
      <p>
        All trades, prices, and settlements are recorded with full audit trails. Historical price data
        is available through our <a href="/developers">Developer API</a> for independent verification
        and research.
      </p>
    </SeoPageLayout>
  );
};

export default MethodologyPage;
