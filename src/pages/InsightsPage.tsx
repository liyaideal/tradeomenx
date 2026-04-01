import { SeoPageLayout } from "@/components/seo";
import { TrendingUp, BarChart3, Activity, Users, DollarSign, Clock } from "lucide-react";

const stats = [
  { icon: BarChart3, label: "Active Markets", value: "150+", desc: "Live event markets across 6 categories" },
  { icon: TrendingUp, label: "Total Volume", value: "$12.5M+", desc: "Cumulative trading volume since launch" },
  { icon: Users, label: "Registered Traders", value: "25,000+", desc: "Global community of event traders" },
  { icon: Activity, label: "Avg. Daily Trades", value: "8,500+", desc: "Average daily transactions across all markets" },
  { icon: DollarSign, label: "Avg. Settlement Time", value: "<5 min", desc: "From event resolution to fund credit" },
  { icon: Clock, label: "Markets Resolved", value: "1,200+", desc: "Events successfully settled with verified outcomes" },
];

const InsightsPage = () => {
  return (
    <SeoPageLayout
      title="Platform Insights"
      description="Live data and statistics from the OmenX event trading platform — volume, liquidity, accuracy, and market performance."
    >
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose mb-10">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-card border border-border/30 text-center">
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-foreground font-mono">{s.value}</div>
            <div className="text-xs font-medium text-foreground mt-1">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>

      <h2>Market Categories</h2>
      <p>
        OmenX covers events across <strong>Crypto</strong>, <strong>Politics</strong>, <strong>Sports</strong>,
        <strong> Economics</strong>, <strong>Entertainment</strong>, and <strong>Technology</strong>.
        Each category features curated events with clearly defined resolution criteria and transparent data sources.
      </p>

      <h2>Prediction Accuracy</h2>
      <p>
        OmenX markets have demonstrated strong calibration across categories. Events priced at 70%
        probability historically resolve in favor ~68-72% of the time, confirming that our market prices
        are reliable probability signals.
      </p>

      <h2>Liquidity & Execution</h2>
      <p>
        Our order book model ensures tight spreads and deep liquidity on popular markets. Market makers
        and active traders contribute continuous price discovery, with average spreads of 1-3 cents on
        high-volume events.
      </p>

      <h2>Data API</h2>
      <p>
        Researchers, analysts, and developers can access OmenX market data through our
        <a href="/developers"> Developer API</a>. Historical prices, volumes, and resolution data
        are available for academic research and integration into third-party platforms.
      </p>

      {/* JSON-LD Dataset */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "OmenX Platform Insights",
            description: "Aggregate statistics and performance data from OmenX event trading markets",
            provider: { "@type": "Organization", name: "OmenX" },
          }),
        }}
      />
    </SeoPageLayout>
  );
};

export default InsightsPage;
