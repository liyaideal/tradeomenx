import { useNavigate } from "react-router-dom";
import { Shield, FileSearch, Scale, ChevronRight, ChevronLeft, ExternalLink, Lock, Eye, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { SeoFooter } from "@/components/seo/SeoFooter";
import { useAuth } from "@/hooks/useAuth";
import { LoginPrompt } from "@/components/LoginPrompt";

const SCENARIOS = [
  {
    id: "merkle-proof",
    icon: Shield,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    title: "My Funds Are Really There?",
    subtitle: "Asset Merkle Proof Verification",
    description: "Verify your account balance and positions are included in the platform's on-chain state root using cryptographic Merkle proofs.",
    steps: ["Fetch proof from platform", "Read on-chain StateRoot", "Local browser verification", "Result display"],
    badge: "Proof of Reserves",
  },
  {
    id: "trade-verification",
    icon: FileSearch,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    title: "Is My Trade Real?",
    subtitle: "Historical Trade Sourcing",
    description: "Compare your trade records against on-chain transaction logs to verify execution integrity and counterparty transparency.",
    steps: ["Select a trade", "Fetch on-chain log", "Side-by-side comparison", "Counterparty verification"],
    badge: "Trade Audit",
  },
  {
    id: "liquidation-audit",
    icon: Scale,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/10",
    title: "Why Was I Liquidated?",
    subtitle: "Liquidation Price Audit",
    description: "Audit forced liquidation events by comparing the platform's trigger price against third-party oracle feeds to ensure fairness.",
    steps: ["Select liquidation record", "Fetch oracle prices", "Price deviation analysis", "Fairness conclusion"],
    badge: "Price Fairness",
  },
];

const BASE_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const TransparencyPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <LoginPrompt
        title="Sign in to access Transparency Audit"
        description="Verify your assets, trades, and liquidations on-chain."
      />
    );
  }

  const HeroSection = () => (
    <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-emerald-500/5 via-background to-blue-500/5 p-6 md:p-10">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-2 max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            On-Chain Transparency
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Don't trust — verify. Audit your assets, trades, and liquidations directly against on-chain data using cryptographic proofs.
          </p>
        </div>

        <div className="flex items-center gap-6 mt-2">
          {[
            { icon: Lock, label: "Cryptographic" },
            { icon: Eye, label: "Transparent" },
            { icon: Zap, label: "Instant" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ScenarioCard = ({ scenario }: { scenario: typeof SCENARIOS[0] }) => {
    const Icon = scenario.icon;
    return (
      <button
        onClick={() => {/* TODO: navigate to scenario detail */}}
        className="trading-card p-5 md:p-6 text-left group hover:border-primary/30 transition-all duration-200 w-full"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${scenario.iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${scenario.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                {scenario.badge}
              </span>
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-1 group-hover:text-primary transition-colors">
              {scenario.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {scenario.description}
            </p>

            {/* Step preview */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {scenario.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground/70 bg-muted/30 px-2 py-0.5 rounded">
                    {i + 1}. {step}
                  </span>
                  {i < scenario.steps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-1 transition-colors" />
        </div>
      </button>
    );
  };

  const FooterInfo = () => (
    <div className="trading-card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Smart Contract</h3>
          <p className="text-xs text-muted-foreground mb-2">
            All user funds are held in the OmenX smart contract on Base network.
          </p>
          <code className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded break-all">
            {BASE_CONTRACT}
          </code>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => window.open(`https://basescan.org/address/${BASE_CONTRACT}`, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View on BaseScan
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => window.open("https://github.com/omenx/auditor", "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Source Auditor
          </Button>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="space-y-4 md:space-y-6">
      <HeroSection />
      {SCENARIOS.map((scenario) => (
        <ScenarioCard key={scenario.id} scenario={scenario} />
      ))}
      <FooterInfo />
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <MobileHeader title="Transparency Audit" showLogo={false} />
        <div className="p-4">{content}</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(160 50% 15% / 0.15) 0%, hsl(222 47% 6%) 70%)"
      }}
    >
      <EventsDesktopHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Settings
        </button>
        {content}
      </main>
      <SeoFooter />
    </div>
  );
};

export default TransparencyPage;
