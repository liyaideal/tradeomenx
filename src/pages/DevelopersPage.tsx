import { SeoPageLayout } from "@/components/seo";
import { Code, Database, Webhook, Key, BookOpen, Terminal } from "lucide-react";

const endpoints = [
  { method: "GET", path: "/api/v1/events", desc: "List all active event markets with options and current prices" },
  { method: "GET", path: "/api/v1/events/{id}", desc: "Get detailed event info including order book and price history" },
  { method: "GET", path: "/api/v1/events/{id}/options", desc: "Get all options and current prices for a specific event" },
  { method: "GET", path: "/api/v1/prices/history", desc: "Historical price data with configurable intervals" },
  { method: "GET", path: "/api/v1/resolved", desc: "List resolved events with settlement details and evidence" },
  { method: "GET", path: "/api/v1/stats", desc: "Platform-wide statistics: volume, active markets, traders" },
];

const DevelopersPage = () => {
  return (
    <SeoPageLayout
      title="Developers"
      description="Integrate OmenX event market data into your applications. REST API, webhooks, and real-time data feeds."
    >
      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Database, title: "REST API", desc: "RESTful endpoints for markets, prices, and historical data" },
          { icon: Webhook, title: "Webhooks", desc: "Real-time event notifications for price changes and settlements" },
          { icon: Terminal, title: "WebSocket", desc: "Live streaming data for order book updates and price feeds" },
        ].map((f) => (
          <div key={f.title} className="p-4 rounded-xl bg-card border border-border/30">
            <f.icon className="w-5 h-5 text-primary mb-2" />
            <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <h2>API Endpoints</h2>
      <div className="not-prose space-y-2 mb-8">
        {endpoints.map((ep) => (
          <div key={ep.path} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/30">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              ep.method === "GET" ? "bg-trading-green/10 text-trading-green" : "bg-primary/10 text-primary"
            }`}>
              {ep.method}
            </span>
            <div>
              <code className="text-sm text-foreground font-mono">{ep.path}</code>
              <p className="text-xs text-muted-foreground mt-0.5">{ep.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Authentication</h2>
      <p>
        All API requests require an API key passed via the <code>X-API-Key</code> header.
        API keys can be generated from your OmenX account settings. Rate limits apply based on your plan tier.
      </p>

      <h2>Rate Limits</h2>
      <div className="not-prose overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 text-foreground font-medium">Tier</th>
              <th className="text-left py-2 text-foreground font-medium">Requests/min</th>
              <th className="text-left py-2 text-foreground font-medium">WebSocket Streams</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/20">
              <td className="py-2">Free</td><td>60</td><td>3</td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="py-2">Pro</td><td>600</td><td>20</td>
            </tr>
            <tr>
              <td className="py-2">Enterprise</td><td>Custom</td><td>Unlimited</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Use Cases</h2>
      <ul>
        <li><strong>Research</strong> — Access historical prediction market data for academic studies on collective intelligence.</li>
        <li><strong>Dashboards</strong> — Build custom monitoring tools for event markets and portfolio tracking.</li>
        <li><strong>AI Integration</strong> — Feed real-time probability data into LLM applications and AI agents.</li>
        <li><strong>Trading Bots</strong> — Automate trading strategies with programmatic order management.</li>
      </ul>

      <h2>Get Started</h2>
      <p>
        Ready to build? Create an OmenX account, generate your API key in Settings, and start making requests.
        Full API documentation with code samples is available at <code>api.omenx.io/docs</code>.
      </p>
    </SeoPageLayout>
  );
};

export default DevelopersPage;
