import { useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Countdown } from "@/components/mainnet-launch/Countdown";
import { RewardSnapshot } from "@/components/mainnet-launch/RewardSnapshot";
import { RewardLadder } from "@/components/mainnet-launch/RewardLadder";
import { ProgressDashboard } from "@/components/mainnet-launch/ProgressDashboard";
import { MobileFloatingCTA } from "@/components/mainnet-launch/MobileFloatingCTA";
import { TrustBar } from "@/components/mainnet-launch/TrustBar";
import { SectionShell, SectionTitle } from "@/components/mainnet-launch/SectionShell";
import { MAINNET_REBATE_TIERS, getCurrentTier, getNextTier, getTierProgress } from "@/lib/mainnetLaunch";

const REUSED_IN: Record<string, string[]> = {
  countdown: ["Mainnet Launch"],
  snapshot: ["Mainnet Launch"],
  ladder: ["Mainnet Launch"],
  dashboard: ["Mainnet Launch"],
  floating: ["Mainnet Launch"],
  trust: ["Mainnet Launch"],
  shell: ["Mainnet Launch"],
};

const PlaygroundCard = ({
  id,
  title,
  description,
  whenToUse,
  whenNotTo,
  propsHint,
  children,
}: {
  id: string;
  title: string;
  description: string;
  whenToUse: string;
  whenNotTo: string;
  propsHint?: string;
  children: ReactNode;
}) => (
  <section className="overflow-hidden rounded-md border border-border/60 bg-card/40">
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 bg-background/30 px-5 py-4">
      <div className="min-w-0">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-foreground">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(REUSED_IN[id] ?? []).map((tag) => (
          <Badge key={tag} variant="outline" className="border-campaign-accent/30 bg-campaign-accent/10 font-mono text-[10px] uppercase tracking-[0.16em] text-campaign-accent">
            Reused in: {tag}
          </Badge>
        ))}
      </div>
    </header>

    <div className="bg-background/15 p-5 md:p-6">{children}</div>

    <footer className="grid gap-4 border-t border-border/40 bg-background/30 p-5 md:grid-cols-2 md:p-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-trading-green">When to use</p>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{whenToUse}</p>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-trading-red">When not to</p>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{whenNotTo}</p>
      </div>
      {propsHint && (
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Shape</p>
          <pre className="mt-1.5 overflow-x-auto rounded-sm border border-border/40 bg-background/40 p-3 font-mono text-[11px] leading-5 text-foreground/80">{propsHint}</pre>
        </div>
      )}
    </footer>
  </section>
);

// — Countdown demo: pick from preset endsAt
const COUNTDOWN_PRESETS = [
  { id: "future", label: "> 1 day", offsetMs: 1000 * 60 * 60 * 36 },
  { id: "soon", label: "< 1 hour", offsetMs: 1000 * 60 * 12 },
  { id: "ended", label: "Ended", offsetMs: -1 },
];

const CountdownDemo = () => {
  const [presetId, setPresetId] = useState("future");
  const preset = COUNTDOWN_PRESETS.find((p) => p.id === presetId)!;
  const endsAt = new Date(Date.now() + preset.offsetMs);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {COUNTDOWN_PRESETS.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={p.id === presetId ? "default" : "outline"}
            onClick={() => setPresetId(p.id)}
            className="font-mono text-[11px] uppercase tracking-[0.14em]"
          >
            {p.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-border/40 bg-background/30 p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Compact</p>
          <Countdown compact endsAt={endsAt} className="text-mainnet-gold text-base" />
        </div>
        <div className="rounded-sm border border-border/40 bg-background/30 p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Long</p>
          <Countdown endsAt={endsAt} className="text-mainnet-gold text-base" />
        </div>
      </div>
    </div>
  );
};

// — RewardLadder demo: pick a volume preset
const VOLUME_PRESETS = [
  { id: "none", label: "$0 (not started)", volume: 0 },
  { id: "mid", label: "$120K (mid-tier)", volume: 120_000 },
  { id: "top", label: "$1M (top tier)", volume: 1_000_000 },
];

const RewardLadderDemo = () => {
  const [pid, setPid] = useState("mid");
  const preset = VOLUME_PRESETS.find((p) => p.id === pid)!;
  const currentTier = getCurrentTier(preset.volume);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {VOLUME_PRESETS.map((p) => (
          <Button key={p.id} size="sm" variant={p.id === pid ? "default" : "outline"} onClick={() => setPid(p.id)} className="font-mono text-[11px] uppercase tracking-[0.14em]">
            {p.label}
          </Button>
        ))}
      </div>
      <RewardLadder
        onCta={() => {}}
        progressOverride={{ user: { id: "demo" }, volume: preset.volume, currentTier }}
      />
    </div>
  );
};

// — ProgressDashboard demo: pick a volume preset
const ProgressDashboardDemo = () => {
  const [pid, setPid] = useState("mid");
  const preset = VOLUME_PRESETS.find((p) => p.id === pid)!;
  const currentTier = getCurrentTier(preset.volume);
  const nextTier = getNextTier(preset.volume);
  const progressToNext = getTierProgress(preset.volume);
  const volumeToNextTier = nextTier ? Math.max(0, nextTier.volume - preset.volume) : 0;

  // Force qualified for demo (>= 5K)
  const qualified = preset.volume >= 5_000 ? true : false;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {VOLUME_PRESETS.map((p) => (
          <Button key={p.id} size="sm" variant={p.id === pid ? "default" : "outline"} onClick={() => setPid(p.id)} className="font-mono text-[11px] uppercase tracking-[0.14em]">
            {p.label}
          </Button>
        ))}
      </div>
      {!qualified ? (
        <div className="rounded-sm border border-dashed border-border/60 bg-background/20 p-6 text-center text-sm text-muted-foreground">
          Component renders <span className="font-mono text-foreground">null</span> when user has not crossed the qualifying threshold ($5K).
        </div>
      ) : (
        <ProgressDashboard
          onCta={() => {}}
          progressOverride={{
            user: { id: "demo" } as unknown as ReturnType<typeof useState>,
            event1Qualified: true,
            volume: preset.volume,
            currentTier,
            nextTier,
            progressToNext,
            volumeToFirstTrade: 0,
            volumeToNextTier,
            tradeCount: 24,
            isLoading: false,
            refetch: (() => {}) as never,
          } as never}
        />
      )}
    </div>
  );
};

// — MobileFloatingCTA demo: simulated trigger inside a 390px frame
const FloatingCTADemo = () => {
  const [hidden, setHidden] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setHidden((v) => !v)} className="font-mono text-[11px] uppercase tracking-[0.14em]">
          {hidden ? "Scroll back to top" : "Simulate scroll past hero"}
        </Button>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Trigger: hero leaves viewport
        </span>
      </div>
      <div className="relative mx-auto w-full max-w-[390px] overflow-hidden rounded-md border border-border/50 bg-background">
        <div className="h-12 border-b border-border/40 bg-background/80 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          390 × 540 mobile preview
        </div>
        <div className="h-[420px] overflow-hidden">
          {!hidden && (
            <div ref={triggerRef} className="grid h-full place-items-center bg-mainnet-surface/40 p-6 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mainnet-gold">Hero (visible)</p>
                <p className="mt-2 font-semibold text-foreground">Mock hero content</p>
                <p className="mt-1 text-xs text-muted-foreground">Floating CTA stays hidden while this is on screen.</p>
              </div>
            </div>
          )}
          {hidden && (
            <div className="grid h-full place-items-center p-6 text-center text-xs text-muted-foreground">
              Scrolled past hero — floating CTA pinned below.
            </div>
          )}
          {hidden && (
            <div className="absolute inset-x-0 bottom-0 z-40 border-t border-mainnet-gold/20 bg-background/95 p-3 backdrop-blur">
              <Button onClick={() => {}} className="h-12 w-full justify-between rounded-sm bg-mainnet-gold font-mono text-background hover:bg-mainnet-gold/90">
                <span>Claim My Bonus</span>
                <span className="font-mono text-xs">Demo</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShellDemo = () => (
  <div className="-m-5 md:-m-6">
    <SectionShell className="bg-mainnet-surface/30">
      <SectionTitle eyebrow="Section eyebrow" title="A campaign section uses this shell." desc="Shell handles padding, max-width, vertical rhythm. Title block enforces eyebrow → title → description." />
      <div className="rounded-sm border border-dashed border-border/60 bg-background/30 p-6 text-center text-sm text-muted-foreground">
        Your section content goes here.
      </div>
    </SectionShell>
  </div>
);

const TrustBarDemo = () => (
  <div className="-m-5 md:-m-6">
    <TrustBar />
  </div>
);

const SnapshotDemo = () => (
  <div className="-m-5 md:-m-6">
    <RewardSnapshot />
  </div>
);

export const CampaignPlayground = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-2">
        <h2 className="text-xl font-semibold text-foreground">Interactive Playground</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live demos of campaign-level reusable components. Each card shows real component behavior with switchable mock data — wire your campaign's data shape into the same props.
        </p>
      </div>

      <Tabs defaultValue="data">
        <TabsList className="mb-4 bg-muted/40">
          <TabsTrigger value="data" className="font-mono text-[11px] uppercase tracking-[0.14em]">Data-driven</TabsTrigger>
          <TabsTrigger value="layout" className="font-mono text-[11px] uppercase tracking-[0.14em]">Layout primitives</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="mt-0 space-y-6">
          <PlaygroundCard
            id="countdown"
            title="Countdown"
            description="Live countdown to a target date. Auto-handles days / hours / minutes / seconds and ended state."
            whenToUse="Campaign deadline, claim window, settlement window. Anywhere a user needs to see urgency."
            whenNotTo="Static dates that don't tick. Use a plain formatted date string instead."
            propsHint={`<Countdown
  endsAt={new Date("2026-05-28T02:00:00Z")}
  compact // optional
/>`}
          >
            <CountdownDemo />
          </PlaygroundCard>

          <PlaygroundCard
            id="ladder"
            title="Reward Ladder"
            description="Tier table with progress fill. Highlights current tier, marks reached tiers, calls out top tier."
            whenToUse="Volume rebate, points tier, rank-based reward, anything where user climbs through tiers."
            whenNotTo="Single flat reward (no tiers). Use RewardSnapshot instead."
            propsHint={`<RewardLadder
  onCta={(section) => navigate("/trade")}
  progressOverride={{ // optional, falls back to useMainnetLaunchProgress
    user: currentUser,
    volume: 120_000,
    currentTier: { volume: 100_000, rebate: 20 },
  }}
/>`}
          >
            <RewardLadderDemo />
          </PlaygroundCard>

          <PlaygroundCard
            id="dashboard"
            title="Progress Dashboard"
            description="Hero progress block with total volume, qualification badge, fill bar, and 4-cell metric grid."
            whenToUse="Authenticated, qualified users. Shows them where they stand and what's next."
            whenNotTo="Guests or unqualified users — component returns null by design. Show a different empty/CTA state instead."
            propsHint={`<ProgressDashboard
  onCta={(section) => navigate("/trade")}
  progressOverride={{ /* full progress shape, or omit to use live hook */ }}
/>`}
          >
            <ProgressDashboardDemo />
          </PlaygroundCard>

          <PlaygroundCard
            id="floating"
            title="Mobile Floating CTA"
            description="Pinned bottom CTA that appears once a target element scrolls out of view."
            whenToUse="Mobile-only conversion campaigns. Re-surfaces the primary CTA after the hero scrolls away."
            whenNotTo="Desktop pages, or pages with multiple competing CTAs. Only one floating CTA per page."
            propsHint={`const heroRef = useRef<HTMLDivElement>(null);
<MobileFloatingCTA triggerRef={heroRef} onCta={handleCta} />`}
          >
            <FloatingCTADemo />
          </PlaygroundCard>
        </TabsContent>

        <TabsContent value="layout" className="mt-0 space-y-6">
          <PlaygroundCard
            id="shell"
            title="Section Shell + Title"
            description="Standard campaign section: padding, max-width, eyebrow → title → description vertical block."
            whenToUse="Every campaign section. Enforces consistent padding and the vertical title rule from CAMPAIGN_DESIGN §4."
            whenNotTo="Hero blocks (use a campaign-specific hero composition) and full-bleed visual sections."
            propsHint={`<SectionShell id="rules">
  <SectionTitle eyebrow="Eyebrow" title="Section title" desc="Description" />
  {/* your content */}
</SectionShell>`}
          >
            <ShellDemo />
          </PlaygroundCard>

          <PlaygroundCard
            id="trust"
            title="Trust / Proof Bar"
            description="4-up icon grid for proof points. Uses bordered cells, mono labels, single accent color icons."
            whenToUse="Right after the hero — quick credibility before deeper sections."
            whenNotTo="As decoration. Each item must be a verifiable factual claim."
            propsHint={`// Items are currently inline — copy the component pattern\n// for a different campaign's proof points.`}
          >
            <TrustBarDemo />
          </PlaygroundCard>

          <PlaygroundCard
            id="snapshot"
            title="Reward Snapshot"
            description="Two side-by-side reward cards with eyebrow, action, arrow, reward amount and detail."
            whenToUse="Two clear reward paths (e.g. guaranteed bonus + variable rebate). Sets expectations near the top."
            whenNotTo="Single-reward campaigns or 4+ reward types. Use RewardLadder or a custom layout."
            propsHint={`// Currently uses a hardcoded cards array.\n// Lift to props when reused in a second campaign.`}
          >
            <SnapshotDemo />
          </PlaygroundCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
