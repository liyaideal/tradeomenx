import { useNavigate } from "react-router-dom";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { SeoFooter } from "@/components/seo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  LineChart,
  Zap,
  Bot,
  ShieldCheck,
  Radio,
  Code2,
  KeyRound,
  Terminal,
  FileCode,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

const capabilities = [
  {
    icon: LineChart,
    title: "Market Data",
    body: "Real-time order book, trades, mark & funding — REST snapshots and WebSocket streams with strict schemas.",
    tag: "REST · WS",
  },
  {
    icon: Zap,
    title: "Trading",
    body: "Place, cancel, and stage conditional orders. Positions, fills, and PnL over the same idempotent surface.",
    tag: "Idempotent",
  },
  {
    icon: Bot,
    title: "Agent-Ready",
    body: "Typed schemas, preview→submit safety, and deterministic errors. No natural-language execution path.",
    tag: "Agent-safe",
  },
];

const tiers = [
  {
    key: "read_only",
    name: "Read-only",
    tag: "Free · instant",
    body: "Public and private read endpoints. Ideal for dashboards, analytics, and monitoring.",
    accent: "text-muted-foreground",
  },
  {
    key: "trading",
    name: "Trading",
    tag: "Self-serve",
    body: "Full order lifecycle plus private streams. Unlocked after 2FA, first deposit and first fill.",
    accent: "text-primary",
  },
  {
    key: "pro_mm",
    name: "Pro / Market Maker",
    tag: "Manual review",
    body: "Elevated limits and dedicated stream capacity for market makers and quant desks.",
    accent: "text-amber-400",
  },
];

const quickstart = `# 1. Authenticate every request with your key + HMAC signature
curl https://api.omenx.io/v1/markets \\
  -H "X-OMENX-API-KEY: $OMENX_KEY" \\
  -H "X-OMENX-TS: $(date +%s)" \\
  -H "X-OMENX-SIGN: $(printf '%s' "$TS$PATH" | openssl dgst -sha256 -hmac "$SECRET")"

# 2. Preview an order (dry run — no state change)
curl -X POST https://api.omenx.io/v1/orders/preview \\
  -H "X-OMENX-API-KEY: $OMENX_KEY" \\
  -d '{"symbol":"AAPL-DAILY","side":"buy","type":"limit","price":0.42,"size":100}'

# 3. Submit — same body, POST /v1/orders. Idempotency-Key header optional.`;

const resources = [
  { icon: FileCode, title: "REST Reference", body: "Every endpoint, every field, every error code.", tag: "Coming soon" },
  { icon: Radio, title: "WebSocket Guide", body: "Public & private streams, heartbeats, reconnection.", tag: "Coming soon" },
  { icon: Cpu, title: "Agent Integration", body: "Preview→submit patterns for autonomous agents.", tag: "Coming soon" },
];

const DevelopersPage = () => {
  const navigate = useNavigate();
  const comingSoon = () => toast.info("Full documentation launching soon.");

  return (
    <SeoPageLayout title="OmenX Open API">
      <div className="not-prose space-y-14 md:space-y-20 -mt-2">
        {/* Hero */}
        <section className="relative">
          <div className="absolute -left-4 top-1 bottom-1 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent hidden md:block" />
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px]">
              v1
            </Badge>
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Open API</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
            Programmatic access to
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent">
              leveraged outcome markets.
            </span>
          </h1>
          <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            REST, WebSocket, agent-ready. One typed schema for market data, order lifecycle, and account state — built
            for bots, market makers, and autonomous agents.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/settings/api")} className="gap-2">
              <KeyRound className="w-4 h-4" /> Manage API Keys
            </Button>
            <Button size="lg" variant="outline" onClick={comingSoon} className="gap-2">
              <BookOpen className="w-4 h-4" /> Read the Docs
            </Button>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Capabilities</h2>
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hidden md:block">
              Built for automation
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="trading-card p-5 flex flex-col gap-3 group hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{c.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Access tiers */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Access tiers</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
              Three tiers, gated by account state. See the full checklist in{" "}
              <button onClick={() => navigate("/settings/api")} className="text-primary hover:underline">
                API Management
              </button>
              .
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tiers.map((t) => (
              <div key={t.key} className="rounded-xl border border-border/40 bg-card/50 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${t.accent}`}>{t.name}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{t.tag}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quickstart */}
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Quickstart</h2>
            <span className="text-[11px] font-mono text-muted-foreground hidden md:flex items-center gap-1.5">
              <Terminal className="w-3 h-3" /> shell
            </span>
          </div>
          <div className="rounded-xl border border-border/60 bg-[hsl(var(--background))]/60 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-muted/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-trading-red/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-trading-yellow/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-trading-green/60" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground ml-2">preview → submit</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground/70">
                X-OMENX-API-KEY · HMAC-SHA256
              </span>
            </div>
            <pre className="p-4 md:p-5 text-[11px] md:text-xs font-mono text-foreground/90 overflow-x-auto leading-relaxed">
              <code>{quickstart}</code>
            </pre>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> All state-changing endpoints support{" "}
            <code className="font-mono text-foreground/80">Idempotency-Key</code> and require IP whitelist on the key.
          </p>
        </section>

        {/* Resources */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Reference</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
              Full documentation surface rolling out with v1 launch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {resources.map((r) => (
              <button
                key={r.title}
                onClick={comingSoon}
                className="text-left rounded-xl border border-border/40 bg-card/50 p-4 hover:border-primary/40 hover:bg-card transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <r.icon className="w-5 h-5 text-primary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-sm font-semibold text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.body}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 mt-3">
                  {r.tag}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary">Ready to build</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">Generate your first key</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Read-only unlocks with email + 2FA. Trading unlocks after your first deposit and fill.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate("/settings/api")} className="gap-2 shrink-0">
              Manage API Keys <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </div>
    </SeoPageLayout>
  );
};

export default DevelopersPage;
