import { useState } from "react";
import {
  Check,
  Copy,
  KeyRound,
  Plus,
  ShieldCheck,
  Zap,
  Bot,
  LineChart,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SubSection, PlatformBadge } from "../components";
import { ApiTerminal } from "@/components/developers/ApiTerminal";
import { EndpointMarquee } from "@/components/developers/EndpointMarquee";
import { cn } from "@/lib/utils";
import { EmptyState, LoadingState, ErrorState } from "@/components/states";
import {
  TierTrack,
  TierQuickAnswer,
  KeysTable,
  StepIndicator,
  Step1,
  Step2,
  Step3,
  Step4Secret,
  CreateKeyFlow,
  RevokeDialog,
  TIER_META,
} from "@/components/api";
import type { ApiKey, ApiScope, ApiTier, TierEligibility } from "@/hooks/useApiKeys";
import { ALL_SCOPES } from "@/hooks/useApiKeys";
import { useApiKeys } from "@/hooks/useApiKeys";

/* -------------------- Mock factories (drive real components) -------------------- */
const makeTiers = (level: "ok-readonly" | "ok-trading" | "locked"): TierEligibility[] => {
  const readOnly: TierEligibility = {
    tier: "read_only",
    label: "Read-only",
    description: "Market data, account & order history (read only)",
    requirements: [
      { label: "Email verified", met: true },
      { label: "2FA enabled", met: level !== "locked", hint: "Enable in Settings → Account Security" },
    ],
    eligible: level !== "locked",
  };
  const trading: TierEligibility = {
    tier: "trading",
    label: "Trading",
    description: "Place & cancel orders, private WebSocket streams",
    requirements: [
      { label: "Read-only requirements met", met: level !== "locked" },
      { label: "At least 1 successful deposit", met: level === "ok-trading" },
      { label: "Balance ≥ 100 USDC", met: level === "ok-trading" },
      { label: "At least 1 filled trade", met: level === "ok-trading", hint: "Place any market order to unlock" },
    ],
    eligible: level === "ok-trading",
  };
  const pro: TierEligibility = {
    tier: "pro_mm",
    label: "Pro / Market Maker",
    description: "High rate limits, colocation, MM programs — manual review",
    requirements: [
      { label: "30d volume ≥ 50,000 USDC or equity ≥ 10,000 USDC", met: false },
      { label: "Manual review required", met: false, hint: "Contact us to apply" },
    ],
    eligible: false,
    manualReview: true,
  };
  return [readOnly, trading, pro];
};

const mockKeys: ApiKey[] = [
  {
    id: "k1",
    user_id: "u",
    label: "Trading bot – prod",
    key_prefix: "omx_live_a1b2c3d4…f8a9",
    tier: "trading",
    scopes: ["read_public", "read_private", "trade_order", "trade_cancel", "ws_private"],
    ip_whitelist: ["203.0.113.10", "198.51.100.0/24"],
    status: "active",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    last_used_at: new Date(Date.now() - 3600000).toISOString(),
    revoked_at: null,
  },
  {
    id: "k2",
    user_id: "u",
    label: "Read dashboard",
    key_prefix: "omx_live_e5f6g7h8…c2d1",
    tier: "read_only",
    scopes: ["read_public", "read_private"],
    ip_whitelist: [],
    status: "active",
    created_at: new Date(Date.now() - 32 * 86400000).toISOString(),
    last_used_at: null,
    revoked_at: null,
  },
  {
    id: "k3",
    user_id: "u",
    label: "Old MM script",
    key_prefix: "omx_live_i9j0k1l2…b4a5",
    tier: "pro_mm",
    scopes: ["read_public", "trade_order", "trade_cancel", "trade_conditional", "ws_private"],
    ip_whitelist: ["192.0.2.4", "192.0.2.5", "192.0.2.6", "192.0.2.7"],
    status: "revoked",
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    last_used_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    revoked_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

/* -------------------- Preview scaffolding -------------------- */
const PreviewFrame = ({
  platform,
  label,
  width,
  children,
}: {
  platform: "desktop" | "mobile" | "shared";
  label?: string;
  /** Fixed width to simulate viewport (mobile → 375). Omit for full-width. */
  width?: number;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <PlatformBadge platform={platform} />
      {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
    </div>
    <div className="rounded-lg border border-border/40 bg-background/40 p-3 overflow-auto">
      <div style={width ? { width, minWidth: width } : undefined} className="mx-auto">
        {children}
      </div>
    </div>
  </div>
);

const DualPreview = ({
  desktop,
  mobile,
  label,
}: {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  label?: string;
}) => (
  <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4">
    <PreviewFrame platform="desktop" label={label}>{desktop}</PreviewFrame>
    <PreviewFrame platform="mobile" label={label} width={360}>{mobile}</PreviewFrame>
  </div>
);

/* -------------------- Sub-blocks -------------------- */
const KeysStatesPreview = () => {
  const fakeRefetch = (() => Promise.resolve({} as any)) as unknown as ReturnType<typeof useApiKeys>["refetch"];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PreviewFrame platform="shared" label="empty (real EmptyState card)">
        <EmptyState
          variant="card"
          icon={KeyRound}
          title="No API keys yet"
          description="Create your first key to start streaming data or placing orders programmatically."
          action={
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" /> Create key
            </Button>
          }
        />
      </PreviewFrame>
      <PreviewFrame platform="shared" label="loading (real LoadingState)">
        <LoadingState label="Loading keys…" />
      </PreviewFrame>
      <PreviewFrame platform="shared" label="error (real ErrorState + retry)">
        <ErrorState
          title="Couldn't load API keys"
          description="Something went wrong fetching your keys."
          onRetry={() => fakeRefetch()}
        />
      </PreviewFrame>
      <PreviewFrame platform="shared" label="loaded (real KeysTable · 3 rows · 1 revoked)">
        <KeysTable keys={mockKeys} onRevoke={() => {}} />
      </PreviewFrame>
    </div>
  );
};

const StepIndicatorStates = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {([1, 2, 3, 4] as const).map((s) => (
      <PreviewFrame key={s} platform="shared" label={`current = ${s}`}>
        <StepIndicator current={s} />
      </PreviewFrame>
    ))}
  </div>
);

const WizardStepsInline = () => {
  const tiers = makeTiers("ok-readonly");
  const [label, setLabel] = useState("Trading bot – prod");
  const [tier, setTier] = useState<ApiTier>("read_only");
  const [scopes, setScopes] = useState<ApiScope[]>(["read_public", "trade_order"]);
  const [ipRaw, setIpRaw] = useState("203.0.113.10, not-an-ip");
  const [otp, setOtp] = useState("111");

  const ipList = ipRaw.split(/[,\n\s]+/).map((s) => s.trim()).filter(Boolean);
  const ipInvalid = ipList.filter((ip) => !/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(ip));

  return (
    <div className="space-y-6">
      <PreviewFrame platform="shared" label="Step 1 · label + tier (Trading disabled — requirements not met)">
        <Step1
          label={label}
          setLabel={setLabel}
          tier={tier}
          setTier={setTier}
          tierEntries={tiers.filter((t) => t.tier !== "pro_mm")}
        />
      </PreviewFrame>
      <PreviewFrame platform="shared" label="Step 2 · scopes checked + IP invalid validation error">
        <Step2
          scopes={scopes}
          setScopes={(fn) => setScopes(fn)}
          availableScopes={ALL_SCOPES}
          requiresIp={true}
          ipRaw={ipRaw}
          setIpRaw={setIpRaw}
          ipInvalid={ipInvalid}
        />
      </PreviewFrame>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PreviewFrame platform="shared" label="Step 3 · empty / typing">
          <Step3 otp={otp} setOtp={setOtp} otpError={null} />
        </PreviewFrame>
        <PreviewFrame platform="shared" label="Step 3 · error (Invalid code)">
          <Step3 otp="000000" setOtp={() => {}} otpError="Invalid code. Try again." />
        </PreviewFrame>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PreviewFrame platform="shared" label="Step 4 · secret (pre-copy)">
          <Step4Secret
            secret="omx_live_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
            copied={false}
            onCopy={() => {}}
          />
        </PreviewFrame>
        <PreviewFrame platform="shared" label="Step 4 · secret (copied)">
          <Step4Secret
            secret="omx_live_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
            copied={true}
            onCopy={() => {}}
          />
        </PreviewFrame>
      </div>
    </div>
  );
};

const WizardShellDemo = () => {
  const [dOpen, setDOpen] = useState(false);
  const [mOpen, setMOpen] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const tiers = makeTiers("ok-trading");
  const createKeyStub = {
    mutateAsync: async () => ({ secret: "omx_live_" + "0".repeat(48) }),
    isPending: false,
  } as unknown as ReturnType<typeof useApiKeys>["createKey"];

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <PlatformBadge platform="desktop" />
        <Button size="sm" variant="outline" onClick={() => setDOpen(true)}>
          Open Dialog chrome
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <PlatformBadge platform="mobile" />
        <Button size="sm" variant="outline" onClick={() => setMOpen(true)}>
          Open Drawer chrome
        </Button>
      </div>
      <CreateKeyFlow
        open={dOpen}
        onOpenChange={(o) => {
          setDOpen(o);
          if (!o) setSecret(null);
        }}
        onCreated={setSecret}
        newSecret={secret}
        tiers={tiers}
        createKey={createKeyStub}
        isMobile={false}
      />
      <CreateKeyFlow
        open={mOpen}
        onOpenChange={(o) => {
          setMOpen(o);
          if (!o) setSecret(null);
        }}
        onCreated={setSecret}
        newSecret={secret}
        tiers={tiers}
        createKey={createKeyStub}
        isMobile={true}
      />
    </div>
  );
};

const RevokeDialogDemo = () => {
  const [open, setOpen] = useState(false);
  const target = open ? mockKeys[0] : null;
  return (
    <div className="flex items-center gap-2">
      <PlatformBadge platform="shared" />
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open Revoke dialog
      </Button>
      <RevokeDialog
        target={target}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        pending={false}
      />
    </div>
  );
};

/* -------------------- Portal (/developers) — trimmed marketing shell -------------------- */
const PortalGroup = ({ isMobile }: { isMobile: boolean }) => (
  <div className="space-y-6">
    <SubSection title="Hero terminal (multi-tab, macOS chrome)" platform="shared">
      <ApiTerminal
        caption="terminal · preview → submit"
        tabs={[
          {
            label: "cURL",
            lang: "bash",
            code: `curl -X POST https://api.omenx.io/v1/orders/preview \\\n  -H "X-OMENX-API-KEY: $KEY" \\\n  -d '{"symbol":"AAPL-DAILY","side":"buy","price":0.42,"size":100}'`,
          },
          {
            label: "Python",
            lang: "python",
            code: `from omenx import Client\nclient = Client(key=KEY)\npreview = client.orders.preview(symbol="AAPL-DAILY", side="buy", price=0.42, size=100)`,
          },
        ]}
      />
    </SubSection>

    <SubSection title="Endpoint marquee (auto-scroll)" platform="shared">
      <div className="rounded-xl border border-border/40 bg-muted/10">
        <EndpointMarquee />
      </div>
    </SubSection>

    <SubSection title="Capabilities row" platform="shared">
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

    <SubSection title="Access-tier stepped ladder (marketing)" platform="desktop">
      <div className={isMobile ? "hidden" : "flex items-stretch gap-0"}>
        {[
          { name: "Read-only", tag: "Free", accent: "muted" as const, offset: 16 },
          { name: "Trading", tag: "Self-serve", accent: "primary" as const, offset: 8 },
          { name: "Pro / MM", tag: "Manual approval", accent: "amber" as const, offset: 0 },
        ].map((t, i, arr) => (
          <div key={t.name} className="flex-1 flex items-stretch">
            <div
              style={{ marginTop: t.offset }}
              className={cn(
                "flex-1 rounded-xl p-4 flex flex-col gap-2",
                t.accent === "muted" && "border border-border/40 bg-card/60",
                t.accent === "primary" && "border border-primary/40 bg-gradient-to-br from-primary/[0.06] via-card to-card",
                t.accent === "amber" && "border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.04] via-card to-card",
              )}
            >
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Tier {i + 1}</div>
              <div className={cn("text-base font-bold", t.accent === "primary" && "text-primary", t.accent === "amber" && "text-amber-400")}>
                {t.name}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">{t.tag}</div>
            </div>
            {i < arr.length - 1 && (
              <div className="flex items-center px-1 shrink-0">
                <div className="w-4 border-t border-dashed border-border" />
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </SubSection>
  </div>
);

/* -------------------- Management (/settings/api) — real components, every state -------------------- */
const ManagementGroup = () => {
  const tiersOk = makeTiers("ok-trading");
  const tiersPartial = makeTiers("ok-readonly");
  const tiersLocked = makeTiers("locked");

  return (
    <div className="space-y-8">
      <SubSection
        title="TierTrack · Available / Manual / Not-met + you-pill"
        description="Real TierTrack component with mocked TierEligibility[] — desktop shared-border 3-column layout with progress rail + node dots; mobile stacks vertically."
        platform="shared"
      >
        <div className="space-y-4">
          <PreviewFrame platform="desktop" label="highestEligible = trading (you-pill on Trading segment)">
            <TierTrack tiers={tiersOk} highestEligible="trading" />
          </PreviewFrame>
          <PreviewFrame platform="desktop" label="highestEligible = read_only (Trading = not met)">
            <TierTrack tiers={tiersPartial} highestEligible="read_only" />
          </PreviewFrame>
          <PreviewFrame platform="desktop" label="all locked (no you-pill)">
            <TierTrack tiers={tiersLocked} />
          </PreviewFrame>
          <PreviewFrame platform="mobile" label="stacked (viewport-dependent — narrow browser to preview)" width={360}>
            <TierTrack tiers={tiersOk} highestEligible="trading" />
          </PreviewFrame>
        </div>
      </SubSection>

      <SubSection
        title="TierQuickAnswer · you-can-create chip row"
        description="ok / manual / locked chip states rendered from the same real TierEligibility mock as the track."
        platform="shared"
      >
        <div className="space-y-3">
          <PreviewFrame platform="shared" label="ok · Trading eligible">
            <TierQuickAnswer tiers={tiersOk} />
          </PreviewFrame>
          <PreviewFrame platform="shared" label="partial · only Read-only eligible">
            <TierQuickAnswer tiers={tiersPartial} />
          </PreviewFrame>
          <PreviewFrame platform="shared" label="locked · nothing available">
            <TierQuickAnswer tiers={tiersLocked} />
          </PreviewFrame>
        </div>
      </SubSection>

      <SubSection
        title="Keys section · four states"
        description="Real EmptyState / LoadingState / ErrorState / KeysTable — same components mounted by ApiManagement.tsx."
        platform="shared"
      >
        <KeysStatesPreview />
      </SubSection>

      <SubSection
        title="KeysTable · desktop 9-col vs mobile stacked"
        description="Same rows, viewport-driven layout switch. 3 rows include: active Trading key with IPs, active Read-only with no IP, revoked Pro/MM."
        platform="shared"
      >
        <DualPreview
          desktop={<KeysTable keys={mockKeys} onRevoke={() => {}} />}
          mobile={<KeysTable keys={mockKeys} onRevoke={() => {}} />}
        />
      </SubSection>

      <SubSection title="StepIndicator · 4 node states (done · current · todo)" platform="shared">
        <StepIndicatorStates />
      </SubSection>

      <SubSection
        title="CreateKeyFlow · each step, controlled inline"
        description="Real Step1/Step2/Step3/Step4Secret rendered directly with mock state — bypasses the Dialog/Drawer shell so every branch is inspectable."
        platform="shared"
      >
        <WizardStepsInline />
      </SubSection>

      <SubSection
        title="CreateKeyFlow shell · Dialog vs Drawer chrome"
        description="Real CreateKeyFlow — same component ApiManagement mounts. Click to open each shell and walk the wizard end-to-end (mock createKey stub)."
        platform="shared"
      >
        <WizardShellDemo />
      </SubSection>

      <SubSection
        title="RevokeDialog · confirmation state"
        description="Real RevokeDialog with a mock target key — destructive trading-red primary button."
        platform="shared"
      >
        <RevokeDialogDemo />
      </SubSection>
    </div>
  );
};

/* -------------------- Section -------------------- */
interface Props {
  isMobile: boolean;
}

export const ApiSection = ({ isMobile }: Props) => {
  return (
    <SectionWrapper
      id="api-management"
      title="API"
      description="Two production surfaces: /developers marketing portal (A) and /settings/api key management (B). Group B imports real production components from src/components/api/ so this page never drifts from what ships."
    >
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <h2 className="text-base font-semibold">A · Open API Portal <span className="text-muted-foreground font-normal">(/developers)</span></h2>
            <Badge variant="outline" className="text-[10px]">marketing shell</Badge>
          </div>
          <PortalGroup isMobile={isMobile} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <h2 className="text-base font-semibold">B · API Management <span className="text-muted-foreground font-normal">(/settings/api)</span></h2>
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">real production components</Badge>
          </div>
          <ManagementGroup />
        </div>
      </div>
    </SectionWrapper>
  );
};
