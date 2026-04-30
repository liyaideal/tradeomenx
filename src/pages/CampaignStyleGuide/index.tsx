import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CampaignBannerFrame,
  CampaignCTA,
  CampaignLedgerPanel,
  CampaignMetricStrip,
  CampaignPageShell,
  CampaignSection,
  CampaignSectionHeader,
} from "@/components/campaign-system";

const metrics = [
  { label: "Activation", value: "$5K", detail: "open + close volume" },
  { label: "Reward", value: "$2-$50", detail: "guaranteed USDC" },
  { label: "Max Rebate", value: "$200", detail: "highest tier only" },
];

const rules = [
  ["Section Header", "Always vertical: eyebrow, title, description. Never split title and description into two desktop columns."],
  ["Safe Width", "Use max-w-7xl with px-5 on mobile and px-8 on desktop. Check 1024px before shipping."],
  ["Visual Metaphor", "One coherent concept per campaign: ledger, scoreboard, network, vault, or console."],
  ["No AI Tropes", "No rockets, emoji labels, glowing orbs, random glass cards, or generic crypto gradients."],
];

const ladder = [
  ["$10K", "$5"],
  ["$50K", "$10"],
  ["$100K", "$20"],
  ["$300K", "$60"],
  ["$500K", "$100"],
  ["$750K", "$150"],
  ["$1M", "$200"],
];

const CampaignStyleGuide = () => {
  const navigate = useNavigate();

  return (
    <CampaignPageShell>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-muted/40">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground md:text-2xl">Campaign Style Guide</h1>
              <p className="text-sm text-muted-foreground">Dedicated landing page system, separate from product UI.</p>
            </div>
          </div>
          <a href="/CAMPAIGN_DESIGN.md" className="hidden font-mono text-xs uppercase tracking-[0.16em] text-campaign-accent md:block">
            CAMPAIGN_DESIGN.md
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div className="min-w-0">
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-campaign-accent">Campaign System</p>
              <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-foreground md:text-7xl">
                Landing pages are not product screens.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
                Campaign surfaces use a separate conversion system: one narrative, one visual metaphor, one primary action, and strict responsive QA.
              </p>
              <div className="mt-8">
                <CampaignCTA>Use Campaign System</CampaignCTA>
              </div>
            </div>

            <CampaignBannerFrame className="min-h-[300px] p-6 md:p-8">
              <div className="flex min-h-[300px] flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-campaign-accent">Banner Pattern</p>
                    <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-5xl">
                      One headline. One CTA. Same visual language.
                    </h3>
                  </div>
                  <span className="border border-trading-green/30 bg-trading-green/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-trading-green">
                    Live
                  </span>
                </div>
                <CampaignMetricStrip metrics={metrics} />
              </div>
            </CampaignBannerFrame>
          </div>
        </section>

        <CampaignSection>
          <CampaignSectionHeader
            eyebrow="Headers"
            title="Section titles stack vertically."
            description="This is the approved campaign section header pattern. The description supports the title underneath it; it does not sit beside it as a competing column."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {rules.map(([label, body]) => (
              <CampaignLedgerPanel key={label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-campaign-accent">{label}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{body}</p>
              </CampaignLedgerPanel>
            ))}
          </div>
        </CampaignSection>

        <CampaignSection tone="surface">
          <CampaignSectionHeader
            eyebrow="Rewards"
            title="Rewards read as ledgers, not coupon cards."
            description="Amounts, thresholds, payout state, and tier rules should be scannable and financially credible."
          />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <CampaignLedgerPanel className="border-campaign-accent/25">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-campaign-accent">Activation</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">First Qualifying Trade</h3>
                </div>
                <CheckCircle2 className="h-5 w-5 text-trading-green" />
              </div>
              <CampaignMetricStrip metrics={metrics.slice(0, 2)} className="mt-8 sm:grid-cols-2" />
              <p className="mt-5 text-sm leading-6 text-muted-foreground">Keep formulas and edge cases out of the hero. Explain volume and payout timing in rules or FAQ.</p>
            </CampaignLedgerPanel>

            <CampaignLedgerPanel>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-campaign-accent-secondary">Ladder</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">Volume Rebate Ledger</h3>
                </div>
                <p className="font-mono text-xs text-muted-foreground">highest tier only</p>
              </div>
              <div className="grid min-w-0 gap-2 md:grid-cols-7">
                {ladder.map(([volume, reward]) => (
                  <div key={volume} className="min-h-[112px] border border-border/50 bg-background/30 p-3">
                    <p className="font-mono text-[10px] text-muted-foreground">{volume}</p>
                    <p className="mt-7 font-mono text-lg font-semibold text-campaign-accent">{reward}</p>
                    <div className="mt-3 h-px bg-border" />
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">rebate</p>
                  </div>
                ))}
              </div>
            </CampaignLedgerPanel>
          </div>
        </CampaignSection>

        <CampaignSection>
          <CampaignSectionHeader
            eyebrow="QA"
            title="No campaign page ships without viewport checks."
            description="Check 1024, 1280, 1366, 390, and 320 widths. Homepage carousel slides must pass the same safe-width rule."
          />
          <div className="border-y border-border/50">
            {["1024px has no horizontal scrollbar", "Hero shows a hint of the next section", "CTA text never clips", "Homepage carousel aligns with event list safe area", "No title/description split columns"].map((item, index) => (
              <div key={item} className="grid gap-3 border-b border-border/40 py-4 last:border-b-0 md:grid-cols-[80px_1fr]">
                <span className="font-mono text-xs text-campaign-accent">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm text-muted-foreground md:text-base">{item}</p>
              </div>
            ))}
          </div>
        </CampaignSection>
      </main>
    </CampaignPageShell>
  );
};

export default CampaignStyleGuide;
