/**
 * Mobile Home previews — 真组件优先，hook-forced 态用 1:1 mirror。
 *
 * Real components:
 *  - MobileHeader (Preset A)            src/components/MobileHeader.tsx
 *  - HomeEquityHero                     src/components/home/HomeEquityHero.tsx
 *  - HomeGreeting (live)                src/components/home/HomeGreeting.tsx
 *  - PersonalSlot (live)                src/components/home/PersonalSlot.tsx
 *  - HomeCampaignRail                   src/components/home/HomeCampaignRail.tsx
 *  - MainnetLaunchCallout               src/components/home/MainnetLaunchCallout.tsx
 *  - HomeTopEvents (live)               src/components/home/HomeTopEvents.tsx
 *  - BottomNav                          src/components/BottomNav.tsx
 *
 * Mirrors (hook-locked branches that can't be forced from outside):
 *  - HomeGreeting Guest / Authed·hasData / Authed·noData
 *  - PersonalSlot Onboarding / PositionAlert branches
 *  Sources mirrored: HomeGreeting.tsx (renders based on useAuth + useEquity7D)
 *                    OnboardingCard.tsx + PositionAlertCard.tsx (feed cards)
 */
import { Bell, Globe, Plus, ArrowRight, ChevronRight } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { HomeEquityHero } from "@/components/home/HomeEquityHero";
import { HomeGreeting } from "@/components/home/HomeGreeting";
import { PersonalSlot } from "@/components/home/PersonalSlot";
import { HomeCampaignRail } from "@/components/home/HomeCampaignRail";
import { MainnetLaunchCallout } from "@/components/home/MainnetLaunchCallout";
import { HomeTopEvents } from "@/components/home/HomeTopEvents";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";

/* -------------------- Header preset A (matches MobileHome) -------------------- */

const HeaderRightActions = () => (
  <div className="flex items-center gap-1">
    <button className="p-2 rounded-full hover:bg-[#5865F2]/15" aria-label="Discord">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-muted-foreground">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.8733.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
      </svg>
    </button>
    <button className="p-2 rounded-full hover:bg-muted/50" aria-label="Language">
      <Globe className="h-5 w-5 text-muted-foreground" />
    </button>
    <button className="p-2 rounded-full hover:bg-muted/50 relative" aria-label="Notifications">
      <Bell className="h-5 w-5 text-muted-foreground" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-trading-red rounded-full" />
    </button>
  </div>
);

export const HomeHeaderPresetAPreview = () => (
  <MobileHeader showLogo showBack={false} rightContent={<HeaderRightActions />} />
);

/* -------------------- Real single-module previews -------------------- */

export const HomeEquityHeroLivePreview = () => (
  <div className="p-2">
    <HomeEquityHero onLogin={() => {}} />
  </div>
);

export const HomeGreetingLivePreview = () => (
  <div className="p-2">
    <HomeGreeting onSignIn={() => {}} />
  </div>
);

export const PersonalSlotLivePreview = () => (
  <div className="p-2">
    <PersonalSlot />
  </div>
);

export const HomeCampaignRailPreview = () => (
  <div className="px-2 pt-2">
    <HomeCampaignRail />
  </div>
);

export const MainnetLaunchCalloutPreview = () => (
  <div className="p-2">
    <MainnetLaunchCallout />
  </div>
);

export const HomeTopEventsLivePreview = () => (
  <div className="px-2 pt-2">
    <HomeTopEvents />
  </div>
);

export const HomeTopEventsInterludePreview = () => (
  <div className="px-2 pt-2">
    <HomeTopEvents title="Pick your first prediction" interlude={<MainnetLaunchCallout />} />
  </div>
);

/* -------------------- BottomNav (uses fixed position) -------------------- */

export const BottomNavPreview = () => (
  <div className="relative h-[220px] rounded-lg overflow-hidden border border-border/40 bg-background">
    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
      Page body area
    </div>
    <div className="absolute inset-x-0 bottom-0">
      <BottomNav />
    </div>
  </div>
);

/* -------------------- Composed full-page skeleton (real components) -------------------- */

export const HomeFullPageComposedPreview = () => (
  <div className="min-h-[720px] bg-background">
    <HomeHeaderPresetAPreview />
    <main className="px-4 pt-3 pb-24 space-y-5">
      <HomeEquityHero onLogin={() => {}} />
      <div className="empty:hidden"><PersonalSlot /></div>
      <HomeCampaignRail />
      <HomeTopEvents />
    </main>
    <BottomNav />
  </div>
);

/* =====================================================================
 * MIRRORS — hook-locked branches
 * Kept 1:1 with production. Update when the source files change.
 * ===================================================================== */

const sparkPath =
  "M0 28 C12 22, 18 30, 28 24 C38 18, 46 26, 58 14 C70 4, 80 18, 92 8 L100 6";
const sparkArea = `${sparkPath} L100 40 L0 40 Z`;

/** Mirror of HomeGreeting — guest branch. Source: HomeGreeting.tsx */
export const HomeGreetingGuestMirror = () => (
  <div className="p-2">
    <button className="group relative block w-full overflow-hidden rounded-2xl border border-border/40 bg-card p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trading-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-trading-green" />
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-trading-green">
              Live on OmenX
            </span>
          </div>
          <h1 className="mt-2 text-[15px] font-semibold leading-snug text-foreground">
            Hey Caller. Ready to make your next call?
          </h1>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[28px] font-bold leading-none tracking-tight text-foreground tabular-nums">$4.2M</span>
            <span className="font-sans text-[12px] font-medium text-muted-foreground">traded · 24h</span>
          </div>
          <div className="mt-2 font-sans text-[12px] text-muted-foreground">
            <span className="font-mono font-semibold text-foreground tabular-nums">128</span> active markets
          </div>
        </div>
        <div className="relative h-12 w-24 shrink-0 opacity-70">
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="sgGuestSparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={sparkArea} fill="url(#sgGuestSparkFill)" />
            <path d={sparkPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="mt-5 border-t border-border/40 pt-4">
        <div className="flex items-center justify-between gap-2 text-[13px] font-semibold text-foreground">
          <span>Sign in to start trading</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>
    </button>
  </div>
);

const HomeGreetingAuthedMirror = ({ hasData }: { hasData: boolean }) => (
  <div className="p-2">
    <div className="relative block w-full overflow-hidden rounded-2xl border border-border/40 bg-card p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 text-[17px] font-bold leading-tight text-foreground">alex</h1>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-2.5 py-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">Deposit</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="h-2.5 w-2.5" strokeWidth={3.5} />
          </span>
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total equity</p>
          <div className="mt-1.5 font-mono text-[34px] font-bold leading-none tracking-tight text-foreground">$13,530.00</div>
          {hasData ? (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-trading-green tabular-nums">+1.9%</span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">7D</span>
            </div>
          ) : (
            <p className="mt-2.5 whitespace-nowrap">
              <span className="font-sans text-[12px] font-medium text-muted-foreground">No 7D activity · </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Tap Deposit to start</span>
            </p>
          )}
        </div>
        {hasData && (
          <div className="relative h-12 w-24 shrink-0 opacity-70">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="sgAuthSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--trading-green))" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(var(--trading-green))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkArea} fill="url(#sgAuthSparkFill)" />
              <path d={sparkPath} fill="none" stroke="hsl(var(--trading-green))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const HomeGreetingAuthedHasDataMirror = () => <HomeGreetingAuthedMirror hasData />;
export const HomeGreetingAuthedNoDataMirror = () => <HomeGreetingAuthedMirror hasData={false} />;

/** Mirror of OnboardingCard body. Source: OnboardingCard.tsx */
export const PersonalSlotOnboardingMirror = ({ step = 2 }: { step?: 2 | 3 }) => {
  const completed = step - 1;
  const label = step === 2 ? "Deposit USDC on Base" : "Place your first trade";
  return (
    <div className="p-2">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
              Onboarding · {completed}/3
            </p>
            <p className="mt-1 text-[14px] font-semibold text-foreground">{label}</p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-primary" />
        </div>
        <div className="mt-3 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i < completed ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Mirror of PositionAlertCard body. Source: PositionAlertCard.tsx */
export const PersonalSlotPositionAlertMirror = () => (
  <div className="p-2">
    <div className="rounded-2xl border border-trading-green/30 bg-trading-green/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-trading-green">Your position</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground truncate">BTC &gt; $100k by Mar 31</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">Yes</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-base font-semibold leading-tight text-trading-green">+$24.30</p>
          <p className="font-mono text-[11px] leading-tight text-trading-green">+12.4%</p>
        </div>
      </div>
    </div>
  </div>
);
