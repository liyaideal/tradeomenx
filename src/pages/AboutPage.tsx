import { SeoPageLayout } from "@/components/seo";
import { Shield, Target, Zap, Users, Globe, TrendingUp } from "lucide-react";

const values = [
  { icon: Shield, title: "Transparency", desc: "Every market, price, and settlement is fully auditable. We publish resolution sources and methodology for every event." },
  { icon: Target, title: "Accuracy", desc: "Our markets consistently demonstrate strong predictive accuracy, outperforming traditional polling and expert forecasts." },
  { icon: Zap, title: "Speed", desc: "Instant order execution, real-time price feeds, and rapid settlement — because information moves fast." },
  { icon: Users, title: "Accessibility", desc: "Low barriers to entry with trial funds, intuitive design, and multi-language support to serve traders worldwide." },
  { icon: Globe, title: "Global Coverage", desc: "We cover events across crypto, politics, sports, economics, and entertainment — if the world cares about it, you can trade it." },
  { icon: TrendingUp, title: "Innovation", desc: "Continuous development of new market types, trading tools, and analytics to push event trading forward." },
];

const AboutPage = () => {
  return (
    <SeoPageLayout
      title="About OmenX"
      description="OmenX is a next-generation event trading platform — turning real-world outcomes into tradable markets."
    >
      <h2>Our Mission</h2>
      <p>
        OmenX was founded on a simple principle: <strong>markets are the most efficient mechanism for aggregating information</strong>.
        By creating liquid, transparent markets around real-world events, we enable anyone to express their views on future outcomes
        while contributing to more accurate collective forecasting.
      </p>
      <p>
        Whether it's predicting crypto price movements, election results, or sporting outcomes, OmenX provides the infrastructure
        for event-based trading with institutional-grade execution and consumer-friendly design.
      </p>

      <h2>What Makes Us Different</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
        {values.map((v) => (
          <div key={v.title} className="p-4 rounded-xl bg-card border border-border/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <v.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{v.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <h2>How It Works</h2>
      <ol>
        <li><strong>Event Creation</strong> — Real-world events are listed as tradable markets with clearly defined resolution criteria.</li>
        <li><strong>Price Discovery</strong> — Traders buy and sell options, with prices reflecting collective probability estimates.</li>
        <li><strong>Resolution</strong> — When the event concludes, outcomes are verified using trusted data sources.</li>
        <li><strong>Settlement</strong> — Winning options pay $1.00, losing options pay $0.00, and funds are instantly credited.</li>
      </ol>

      <h2>Our Team</h2>
      <p>
        OmenX is built by a team of fintech engineers, quantitative analysts, and product designers with experience across
        traditional finance, DeFi, and prediction markets. We are backed by leading investors in the blockchain and trading space.
      </p>

      <h2>Contact</h2>
      <p>
        For business inquiries, partnerships, or press: <strong>contact@omenx.io</strong>
      </p>
      <p>
        For technical support: visit our <a href="/faq">FAQ</a> or reach out via the in-app Help & Support.
      </p>

      {/* JSON-LD Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "OmenX",
            description: "Next-generation event trading platform",
            url: "https://omenx.lovable.app",
            sameAs: [],
            contactPoint: {
              "@type": "ContactPoint",
              email: "contact@omenx.io",
              contactType: "customer service",
            },
          }),
        }}
      />
    </SeoPageLayout>
  );
};

export default AboutPage;
