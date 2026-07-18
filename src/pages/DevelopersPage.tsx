import { useNavigate } from "react-router-dom";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { SeoFooter } from "@/components/seo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiTerminal, type TerminalTab } from "@/components/developers/ApiTerminal";
import { EndpointMarquee } from "@/components/developers/EndpointMarquee";
import { MiniOrderBook } from "@/components/developers/MiniOrderBook";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  LineChart,
  Zap,
  Bot,
  ShieldCheck,
  Radio,
  KeyRound,
  FileCode,
  Cpu,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// DEMO-STATE: 展示性指标，上线前以真实 SLA 口径替换
const HERO_STATS = [
  { value: "47 ms", label: "p50 latency" },
  { value: "99.95%", label: "Uptime" },
  { value: "31", label: "REST endpoints" },
  { value: "9", label: "WS topics" },
];

const heroTabs: TerminalTab[] = [
  {
    label: "cURL",
    lang: "bash",
    code: `# POST /v1/orders/preview — dry run, no state change
curl -X POST https://api.omenx.io/v1/orders/preview \\
  -H "X-OMENX-API-KEY: $OMENX_KEY" \\
  -H "X-OMENX-TS: 1721059431" \\
  -H "X-OMENX-SIGN: $SIG" \\
  -d '{
    "market_id": "US_STOCK_UPDOWN:TSLA:2026-07-17",
    "outcome_side": "UP",
    "order_type": "LIMIT",
    "limit_price": "0.5142",
    "size": 240,
    "client_order_id": "a1b2c3d4"
  }'

# 200 OK
{
  "pricing_snapshot_id": "ps_01J2ZKQ4T9",
  "estimated_fill_price": "0.5142",
  "estimated_margin_u": "4.2183",
  "fee_preview_u": "0.1872",
  "expires_in_ms": 3000
}`,
  },
  {
    label: "Python",
    lang: "python",
    code: `from omenx import Client

client = Client(key=OMENX_KEY, secret=OMENX_SECRET)

preview = client.orders.preview(
    market_id="US_STOCK_UPDOWN:TSLA:2026-07-17",
    outcome_side="UP",
    order_type="LIMIT",
    limit_price="0.5142",
    size=240,
    client_order_id="a1b2c3d4",
)

# preview.pricing_snapshot_id -> "ps_01J2ZKQ4T9"
# preview.estimated_margin_u  -> "4.2183"
# preview.fee_preview_u       -> "0.1872"`,
  },
  {
    label: "TypeScript",
    lang: "ts",
    code: `import { OmenX } from "@omenx/sdk";

const client = new OmenX({ key: process.env.OMENX_KEY });

const preview = await client.orders.preview({
  market_id: "US_STOCK_UPDOWN:TSLA:2026-07-17",
  outcome_side: "UP",
  order_type: "LIMIT",
  limit_price: "0.5142",
  size: 240,
  client_order_id: "a1b2c3d4",
});

// preview.pricing_snapshot_id === "ps_01J2ZKQ4T9"
// preview.estimated_margin_u  === "4.2183"`,
  },
];

const signTabs: TerminalTab[] = [
  {
    label: "sign.sh",
    lang: "bash",
    code: `# HMAC-SHA256 over: {timestamp}{method}{path}{body}
TS=$(date +%s)
BODY='{"market_id":"US_STOCK_UPDOWN:TSLA:2026-07-17","outcome_side":"UP"}'
SIG=$(printf '%s' "$TS POST /v1/orders/preview $BODY" \\
  | openssl dgst -sha256 -hmac "$OMENX_SECRET" -hex \\
  | awk '{print $2}')

curl -X POST https://api.omenx.io/v1/orders/preview \\
  -H "X-OMENX-API-KEY: $OMENX_KEY" \\
  -H "X-OMENX-TS: $TS" \\
  -H "X-OMENX-SIGN: $SIG" \\
  -d "$BODY"`,
  },
];

const capabilities = {
  agent: {
    icon: Bot,
    title: "Agent-Ready",
    body:
      "Typed schemas, deterministic errors, and a strict preview → confirm → submit flow. Built so autonomous agents cannot fat-finger production capital.",
  },
  data: {
    icon: LineChart,
    title: "Market Data",
    body: "Real-time order book, trades, mark & funding. REST snapshots plus WebSocket streams.",
  },
  trade: {
    icon: Zap,
    title: "Trading",
    body: "Full order lifecycle: place, cancel, stage conditional orders. Idempotent by design.",
  },
};

const tiers = [
  {
    name: "Read-only",
    tag: "Free · instant",
    body: "Public + private read endpoints. Ideal for dashboards, analytics, monitoring.",
    chips: ["read_public", "read_private", "ws_public"],
    accent: "muted",
  },
  {
    name: "Trading",
    tag: "Self-serve",
    body: "Full order lifecycle plus private streams. Unlocks after 2FA + first deposit + first fill.",
    chips: ["trade_order", "trade_cancel", "trade_conditional", "ws_private"],
    accent: "primary",
  },
  {
    name: "Pro / Market Maker",
    tag: "Manual review",
    body: "Elevated limits and dedicated stream capacity for MM desks and quant funds.",
    chips: ["elevated_rate_limits", "dedicated_ws", "mm_program"],
    accent: "amber",
  },
] as const;

const resources = [
  { icon: FileCode, title: "REST Reference", body: "Every endpoint, every field, every error code." },
  { icon: Radio, title: "WebSocket Guide", body: "Public & private streams, heartbeats, reconnection." },
  { icon: Cpu, title: "Agent Integration", body: "Preview → submit patterns for autonomous agents." },
];

const dotBg =
  "bg-[radial-gradient(circle_at_1px_1px,hsl(var(--muted-foreground)/0.15)_1px,transparent_0)] [background-size:22px_22px]";

const SectionNumber = ({ n }: { n: string }) => (
  <div className="flex items-center gap-2 mb-3 text-[10px] font-mono tracking-[0.2em] text-muted-foreground/60">
    <span>{n}</span>
    <span className="w-2 h-px bg-muted-foreground/40" />
  </div>
);

const DevelopersPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const comingSoon = () => toast.info("Full documentation launching soon.");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isMobile ? (
        <MobileHeader title="Open API" showLogo={false} showBack={true} />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className="flex-1 w-full">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className={cn("absolute inset-0 opacity-40", dotBg)} />
          {/* Single, asymmetric ambient glow (top-right, dim) */}
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none" />

          <div className="relative w-full max-w-7xl mx-auto px-5 md:px-8 pt-10 md:pt-20 pb-14 md:pb-24">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
              {/* Left copy */}
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-5">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px]"
                  >
                    v1
                  </Badge>
                  <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-primary">
                    OMENX OPEN API · V1
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight text-foreground">
                  Programmatic access to
                  <br />
                  outcome markets.
                </h1>
                <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                  REST, WebSocket, agent-ready. One typed schema for market data, order lifecycle, and
                  account state — built for bots, market makers, and autonomous agents.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button size="lg" onClick={() => navigate("/settings/api")} className="gap-2">
                    <KeyRound className="w-4 h-4" /> Manage API Keys
                  </Button>
                  <Button size="lg" variant="outline" onClick={comingSoon} className="gap-2">
                    <BookOpen className="w-4 h-4" /> Read the Docs
                  </Button>
                </div>

                {/* Stat bar — dirty numbers with tick decoration + brand vertical rule */}
                <div className="mt-10 relative pl-4 pt-6 border-t border-border/40">
                  <div className="absolute left-0 top-6 bottom-0 w-px bg-trading-purple/40" />
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
                    {HERO_STATS.map((s, i) => (
                      <div key={s.label} className="flex items-start gap-6">
                        {i > 0 && <span className="hidden md:block h-8 w-px bg-border/60 mt-1" />}
                        <div className="flex flex-col">
                          <div className="font-mono text-lg font-bold text-foreground leading-none">
                            {s.value}
                          </div>
                          {/* tick decoration */}
                          <div className="mt-1.5 flex gap-[2px] h-[2px]">
                            <span className="w-3 bg-primary/60" />
                            <span className="w-1.5 bg-primary/30" />
                            <span className="w-1 bg-primary/20" />
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
                            {s.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — terminal hero + mini order book (layered) */}
              <div className="relative animate-fade-in" style={{ animationDelay: "75ms" }}>
                <div className="relative">
                  <ApiTerminal
                    tabs={heroTabs}
                    caption="POST /v1/orders/preview · 200 OK"
                    className="relative z-10"
                    showCursor={false}
                  />
                  {/* Floating badges — real WS seq / endpoint chips */}
                  <div className="hidden md:flex absolute -top-3 -right-3 z-20 rotate-2 items-center gap-1.5 rounded-md border border-border bg-card/90 backdrop-blur px-2 py-1 shadow-lg">
                    <span className="text-primary font-mono text-[10px] font-semibold">ws</span>
                    <span className="font-mono text-[10px] text-foreground/80">market.book · seq 48,516</span>
                  </div>
                  <div className="hidden md:flex absolute -top-3 left-8 z-20 -rotate-1 items-center gap-1.5 rounded-md border border-border bg-card/90 backdrop-blur px-2 py-1 shadow-lg">
                    <span className="text-trading-green font-mono text-[10px] font-semibold">GET</span>
                    <span className="font-mono text-[10px] text-foreground/80">/v1/markets/{"{id}"}</span>
                  </div>

                  {/* Mini order book — desktop overlay, mobile stacked below */}
                  <MiniOrderBook className="hidden lg:block absolute -bottom-6 -right-6 z-30 rotate-1" />
                  <div className="lg:hidden mt-6 flex justify-center">
                    <MiniOrderBook />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoint marquee */}
          <div className="relative border-t border-border/40 bg-muted/10">
            <EndpointMarquee />
          </div>
        </section>

        <div className="w-full max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16 md:pb-24">
          {/* CAPABILITIES — Bento */}
          <section className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <SectionNumber n="01" />
            <div className="mb-6 flex items-baseline justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Built for automation</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Three surfaces, one typed schema, zero surprise state changes.
                </p>
              </div>
              <span className="hidden md:block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Capabilities
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr">
              {/* Agent-Ready — large */}
              <div className="web3-card lg:col-span-2 lg:row-span-2 p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <capabilities.agent.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-trading-purple/10 text-trading-purple border-trading-purple/30 font-mono text-[10px]"
                  >
                    Agent-safe
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {capabilities.agent.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
                    {capabilities.agent.body}
                  </p>
                </div>

                {/* Stepper with real field names */}
                <div className="mt-2 rounded-lg border border-border/50 bg-background/40 p-4">
                  <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs font-mono">
                    {[
                      { step: "preview", field: "pricing_snapshot_id" },
                      { step: "confirm", field: "client_order_id" },
                      { step: "submit", field: "idempotent" },
                    ].map((s, i) => (
                      <div key={s.step} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-trading-green/15 border border-trading-green/40 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-trading-green" />
                          </div>
                          <span className="text-foreground">{s.step}</span>
                          {i < 2 && (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground pl-8">{s.field}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3">
                    Strict typed schema · No natural-language execution path
                  </p>
                </div>
              </div>

              {/* Market Data — mini trades tape evidence */}
              <div className="trading-card p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    {capabilities.data.title}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">REST · WS</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {capabilities.data.body}
                </p>
                {/* mini tape */}
                <div className="mt-1 rounded-md border border-border/50 bg-background/40 font-mono text-[10px] divide-y divide-border/40">
                  {[
                    { t: "14:32:08", p: "0.5142", side: "buy" },
                    { t: "14:32:05", p: "0.5108", side: "sell" },
                    { t: "14:32:01", p: "0.5140", side: "buy" },
                    { t: "14:31:58", p: "0.5133", side: "sell" },
                  ].map((r, i) => (
                    <div key={i} className="grid grid-cols-3 px-2.5 py-1">
                      <span className="text-muted-foreground">{r.t}</span>
                      <span
                        className={cn(
                          "text-center",
                          r.side === "buy" ? "text-trading-green" : "text-trading-red",
                        )}
                      >
                        {r.p}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {r.side === "buy" ? "↑" : "↓"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/80">
                  GET /v1/markets/{"{id}"}/trades
                </div>
              </div>

              {/* Trading — fill JSON snippet evidence */}
              <div className="trading-card p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    {capabilities.trade.title}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">Idempotent</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {capabilities.trade.body}
                </p>
                <pre className="mt-1 rounded-md border border-border/50 bg-background/40 p-2.5 font-mono text-[10px] leading-relaxed overflow-hidden">
{`{
  "status": "FILLED",
  "fill_price": "0.5142",
  "fee_u": "0.1872"
}`}
                </pre>
                <div className="text-[10px] font-mono text-muted-foreground/80">
                  POST /v1/orders
                </div>
              </div>
            </div>
          </section>


          {/* TIERS — Stepped */}
          <section className="mt-16 animate-fade-in" style={{ animationDelay: "75ms" }}>
            <SectionNumber n="02" />
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Access tiers</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Three progressive tiers. Everyone starts read-only.{" "}
                <button
                  onClick={() => navigate("/settings/api")}
                  className="text-primary hover:underline"
                >
                  Check your eligibility →
                </button>
              </p>
            </div>

            {/* Desktop stepped */}
            <div className="hidden lg:flex items-stretch gap-0">
              {tiers.map((t, i) => (
                <div key={t.name} className="flex-1 flex items-stretch">
                  <div
                    className={cn(
                      "flex-1 rounded-xl p-5 flex flex-col gap-3 transition-all",
                      t.accent === "muted" && "border border-border/40 bg-card/60",
                      t.accent === "primary" &&
                        "border border-primary/40 bg-gradient-to-br from-primary/[0.06] via-card to-card shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]",
                      t.accent === "amber" &&
                        "web3-card border-amber-400/25 bg-gradient-to-br from-amber-400/[0.04] via-card to-card"
                    )}
                    style={{
                      marginTop: i === 0 ? "16px" : i === 1 ? "8px" : "0px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-muted-foreground">
                        Tier {i + 1}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-mono text-[10px]",
                          t.accent === "amber" &&
                            "bg-amber-400/10 text-amber-400 border-amber-400/25",
                          t.accent === "primary" && "bg-primary/10 text-primary border-primary/20",
                          t.accent === "muted" && "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {t.tag}
                      </Badge>
                    </div>
                    <div>
                      <div
                        className={cn(
                          "text-lg font-bold",
                          t.accent === "primary"
                            ? "text-primary"
                            : t.accent === "amber"
                            ? "text-amber-400"
                            : "text-foreground"
                        )}
                      >
                        {t.name}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t.body}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-1 pt-2">
                      {t.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded border border-border/50 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < tiers.length - 1 && (
                    <div className="flex items-center px-2 shrink-0">
                      <div className="w-6 border-t border-dashed border-border" />
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <div className="w-6 border-t border-dashed border-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile timeline */}
            <div className="lg:hidden relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-4">
                {tiers.map((t, i) => (
                  <div key={t.name} className="relative">
                    <div
                      className={cn(
                        "absolute -left-[18px] top-4 w-3 h-3 rounded-full border-2 bg-background",
                        t.accent === "primary" && "border-primary",
                        t.accent === "amber" && "border-amber-400",
                        t.accent === "muted" && "border-border"
                      )}
                    />
                    <div
                      className={cn(
                        "rounded-xl p-4",
                        t.accent === "muted" && "border border-border/40 bg-card/60",
                        t.accent === "primary" &&
                          "border border-primary/40 bg-gradient-to-br from-primary/[0.06] via-card to-card",
                        t.accent === "amber" &&
                          "border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.04] via-card to-card"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={cn(
                            "text-base font-bold",
                            t.accent === "primary"
                              ? "text-primary"
                              : t.accent === "amber"
                              ? "text-amber-400"
                              : "text-foreground"
                          )}
                        >
                          {t.name}
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">{t.tag}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{t.body}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {t.chips.map((c) => (
                          <span
                            key={c}
                            className="rounded border border-border/50 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* QUICKSTART */}
          <section className="animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quickstart</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                From zero to first signed request in three steps.
              </p>
            </div>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-10 items-start">
              <ol className="space-y-5">
                {[
                  {
                    t: "Create your key",
                    b: "In Settings → API Management, verify 2FA and generate a Read-only or Trading key. The secret is shown once.",
                  },
                  {
                    t: "Sign the request",
                    b: "HMAC-SHA256 over timestamp + method + path + body. Attach three headers on every call.",
                  },
                  {
                    t: "Preview, then submit",
                    b: "POST to /orders/preview for a dry run. Same body, same signature — POST to /orders to commit.",
                  },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary/15 text-primary font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{s.t}</div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.b}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <ApiTerminal tabs={signTabs} caption="hmac-sha256 · timestamp + method + path + body" />
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> All state-changing endpoints support{" "}
              <code className="font-mono text-foreground/80">Idempotency-Key</code> and require an IP
              whitelist on the key.
            </p>
          </section>

          {/* RESOURCES */}
          <section className="animate-fade-in" style={{ animationDelay: "225ms" }}>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Reference</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Full documentation surface rolling out with v1 launch.
              </p>
            </div>
            <div className="rounded-xl border border-border/40 divide-y divide-border/40 overflow-hidden">
              {resources.map((r) => (
                <button
                  key={r.title}
                  onClick={comingSoon}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{r.body}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="hidden md:inline-flex bg-muted text-muted-foreground border-border font-mono text-[10px]"
                  >
                    Coming soon
                  </Badge>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </section>

          {/* CTA BAND */}
          <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-card to-card p-6 md:p-10"
              )}
            >
              <div className={cn("absolute inset-0 opacity-30", dotBg)} />
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary mb-2">
                    Ready to build
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    Generate your first key
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                    Read-only unlocks with email + 2FA. Trading unlocks after your first deposit and
                    first fill.
                  </p>
                </div>
                <Button size="lg" onClick={() => navigate("/settings/api")} className="gap-2 shrink-0">
                  Manage API Keys <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SeoFooter />
    </div>
  );
};

export default DevelopersPage;
