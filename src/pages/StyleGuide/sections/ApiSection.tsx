import { Check, X, AlertTriangle, Copy, ShieldCheck, Mail, KeyRound, LineChart, Zap, Bot, Plus, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SubSection } from "../components";
import { ApiTerminal } from "@/components/developers/ApiTerminal";
import { EndpointMarquee } from "@/components/developers/EndpointMarquee";
import { cn } from "@/lib/utils";

interface Props {
  isMobile: boolean;
}

const scopes = [
  "read_public",
  "read_private",
  "trade_order",
  "trade_cancel",
  "trade_conditional",
  "ws_public",
  "ws_private",
];

const TierPlaygroundCard = ({
  title,
  desc,
  reqs,
  state,
}: {
  title: string;
  desc: string;
  reqs: { label: string; met: boolean; hint?: string }[];
  state: "available" | "not-met" | "manual";
}) => {
  const badge =
    state === "available" ? (
      <Badge variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
        Available
      </Badge>
    ) : state === "manual" ? (
      <Badge variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/20">
        Manual approval
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
        Requirements not met
      </Badge>
    );
  const cardCls =
    state === "available"
      ? "border-primary/40 bg-gradient-to-br from-primary/[0.06] via-card to-card shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_20px_40px_-20px_hsl(var(--primary)/0.35)]"
      : state === "manual"
      ? "border-amber-400/25 bg-gradient-to-br from-amber-400/[0.04] via-card to-card"
      : "border-border/40 bg-card/60";
  return (
    <div className={`relative p-4 flex flex-col gap-3 h-full rounded-xl border ${cardCls}`}>
      {state === "available" && (
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</div>
        </div>
        {badge}
      </div>
      <ul className="space-y-1.5 flex-1">
        {reqs.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            {r.met ? (
              <Check className="w-3.5 h-3.5 text-trading-green mt-0.5 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground/60 mt-0.5 shrink-0" />
            )}
            <span className={r.met ? "text-foreground" : "text-muted-foreground"}>
              {r.label}
              {r.hint && !r.met && (
                <span className="block text-[10px] text-muted-foreground/70 mt-0.5">{r.hint}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {state === "manual" && (
        <Button variant="outline" size="sm" className="w-full gap-1.5 mt-auto">
          <Mail className="w-3.5 h-3.5" /> Contact us
        </Button>
      )}
    </div>
  );
};

const KeyRow = ({
  label,
  prefix,
  tier,
  ipCount,
  status,
}: {
  label: string;
  prefix: string;
  tier: "Read-only" | "Trading" | "Pro / MM";
  ipCount: number;
  status: "active" | "revoked";
}) => {
  const tierCls =
    tier === "Read-only"
      ? "bg-muted text-muted-foreground border-border"
      : tier === "Trading"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-amber-400/10 text-amber-400 border-amber-400/20";
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-3 text-xs flex flex-wrap items-center gap-3">
      <div className="font-medium text-sm w-full md:w-auto">{label}</div>
      <code className="font-mono text-[11px] text-muted-foreground">{prefix}</code>
      <Badge variant="outline" className={tierCls}>{tier}</Badge>
      <div className="flex flex-wrap gap-1">
        {["read_public", "read_private"].map((s) => (
          <span key={s} className="px-1.5 py-0.5 rounded bg-background/60 border border-border/40 font-mono text-[10px]">
            {s}
          </span>
        ))}
      </div>
      <div className="text-muted-foreground">{ipCount > 0 ? `${ipCount} IP${ipCount > 1 ? "s" : ""}` : "—"}</div>
      <div className="ml-auto">
        {status === "active" ? (
          <Badge variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">Active</Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Revoked</Badge>
        )}
      </div>
    </div>
  );
};

export const ApiSection = ({ isMobile }: Props) => {
  return (
    <SectionWrapper
      id="api-management"
      title="API Management"
      description="Two-layer surface: /developers portal (marketing/entry) → /settings/api configuration (§4 skeleton)."
    ><div className="space-y-8">
      <SubSection title="Portal hero (/developers) — capabilities row">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: LineChart, title: "Market Data", body: "Real-time order book, trades, mark & funding.", tag: "REST · WS" },
            { icon: Zap, title: "Trading", body: "Place, cancel, and stage conditional orders.", tag: "Idempotent" },
            { icon: Bot, title: "Agent-Ready", body: "Typed schemas, preview→submit safety.", tag: "Agent-safe" },
          ].map((c) => (
            <div key={c.title} className="trading-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{c.tag}</span>
              </div>
              <div>
                <div className="text-sm font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Config-page empty state (compact card, not full-height void)">
        <div className="trading-card p-4 md:p-6">
          <div className="max-w-sm mx-auto rounded-xl border border-dashed border-border/60 bg-muted/10 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm font-semibold">No API keys yet</div>
            <div className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">
              Create your first key to start streaming data or placing orders programmatically.
            </div>
            <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Create key</Button>
          </div>
        </div>
      </SubSection>

      <SubSection title="Tier eligibility cards — every state">
        <div className={`grid gap-3 items-stretch ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
          <TierPlaygroundCard
            title="Read-only"
            desc="Public market data, private account & order history"
            state="available"
            reqs={[
              { label: "Email verified", met: true },
              { label: "2FA enabled", met: true },
            ]}
          />
          <TierPlaygroundCard
            title="Trading"
            desc="Place / cancel orders, private WebSocket streams"
            state="not-met"
            reqs={[
              { label: "Read-only requirements met", met: true },
              { label: "At least 1 successful deposit", met: true },
              { label: "Balance ≥ 100 USDC", met: true },
              { label: "At least 1 filled trade", met: false, hint: "Place any market order to unlock" },
            ]}
          />
          <TierPlaygroundCard
            title="Pro / Market Maker"
            desc="High rate limits, colocation, MM programs"
            state="manual"
            reqs={[
              { label: "30d volume ≥ 50,000 USDC or equity ≥ 10,000 USDC", met: false },
              { label: "Manual review required", met: false, hint: "Contact us to apply" },
            ]}
          />
        </div>
      </SubSection>

      <SubSection title="Keys table row — active & revoked">
        <div className="space-y-2">
          <KeyRow label="Trading bot – prod" prefix="omx_live_a1b2••••" tier="Trading" ipCount={2} status="active" />
          <KeyRow label="Read dashboard" prefix="omx_live_c3d4••••" tier="Read-only" ipCount={0} status="active" />
          <KeyRow label="Old MM script" prefix="omx_live_e5f6••••" tier="Pro / MM" ipCount={4} status="revoked" />
        </div>
      </SubSection>

      <SubSection title="Wizard scope list">
        <div className="rounded-lg border border-border/40 divide-y divide-border/40 max-w-lg">
          {scopes.map((s) => (
            <div key={s} className="flex items-center gap-3 p-2.5 text-xs">
              <div className="w-4 h-4 rounded border border-border" />
              <code className="font-mono">{s}</code>
              {(s.startsWith("trade_") || s === "ws_private") && (
                <Badge variant="outline" className="ml-auto text-[9px] py-0 h-4 bg-amber-400/10 text-amber-400 border-amber-400/20">
                  IP required
                </Badge>
              )}
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="2FA verification step (before secret is generated)">
        <div className="space-y-3 max-w-lg">
          <div className="rounded-lg border border-border/40 bg-muted/30 p-3 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              Enter the 6-digit code from your authenticator app to finalize key creation.
              <span className="block text-[10px] text-muted-foreground/70 mt-1">Demo: use 111111</span>
            </div>
          </div>
          <div className="rounded-md border border-input bg-background px-3 py-2 font-mono tracking-[0.4em] text-center text-lg">
            123456
          </div>
        </div>
      </SubSection>

      <SubSection title="One-time secret reveal (after 2FA)">
        <div className="space-y-3 max-w-lg">
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-100/90">
              This is the only time your full secret will be shown. Copy it and store it securely.
            </div>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/30 p-3 flex items-center gap-2">
            <code className="flex-1 font-mono text-xs break-all">
              omx_live_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
            </code>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> Send in the <code className="font-mono">X-OMENX-API-KEY</code> header.
          </div>
        </div>
      </SubSection>
      </div>
    </SectionWrapper>
  );
};
