/**
 * Mobile Patterns previews — 真组件在 375 iframe 内渲染。
 *
 * Real components:
 *  - MobileHeader                        src/components/MobileHeader.tsx
 *  - HomeEquityHero (for Preset D)       src/components/home/HomeEquityHero.tsx
 *  - MobileDrawer + MobileDrawerActions  src/components/ui/mobile-drawer.tsx
 *  - BottomNav                           src/components/BottomNav.tsx
 *
 * No mirrors needed — every preset/state is prop-forceable on the real components.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/MobileHeader";
import { HomeEquityHero } from "@/components/home/HomeEquityHero";
import { MobileDrawer } from "@/components/ui/mobile-drawer";
import { BottomNav } from "@/components/BottomNav";
import { Bell, Globe } from "lucide-react";

/* -------------------- MobileHeader presets A / B / C -------------------- */

const RightActions = () => (
  <div className="flex items-center gap-1">
    <button className="p-2 rounded-full hover:bg-muted/50" aria-label="Language">
      <Globe className="h-5 w-5 text-muted-foreground" />
    </button>
    <button className="p-2 rounded-full hover:bg-muted/50 relative" aria-label="Notifications">
      <Bell className="h-5 w-5 text-muted-foreground" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-trading-red rounded-full" />
    </button>
  </div>
);

export const PresetAPreview = () => (
  <MobileHeader showLogo showBack={false} rightContent={<RightActions />} />
);

export const PresetBPreview = () => (
  <MobileHeader title="Settings" showLogo={false} showBack={true} />
);

export const PresetCPreview = () => (
  <MobileHeader title="OmenX Insights" showLogo={false} showBack={true} />
);

/** Preset D — Preset A header + <HomeEquityHero> as first body card (not sticky). */
export const PresetDPreview = () => (
  <div className="min-h-[280px] bg-background">
    <MobileHeader showLogo showBack={false} rightContent={<RightActions />} />
    <main className="px-4 pt-3">
      <HomeEquityHero onLogin={() => {}} />
    </main>
  </div>
);

/* -------------------- rightContent variants -------------------- */

export const HeaderActionsPreview = () => (
  <MobileHeader
    title="BTC to $100k?"
    showLogo={false}
    showBack={true}
    showActions
  />
);

export const HeaderCustomRightPreview = () => (
  <MobileHeader
    title="Edit key"
    showLogo={false}
    showBack={true}
    rightContent={
      <Button variant="ghost" size="sm" className="text-xs">
        Save
      </Button>
    }
  />
);

export const HeaderStatsRowPreview = () => (
  <MobileHeader
    title="Will BTC reach $100k by March 2026?"
    showLogo={false}
    showBack={true}
    showActions
    endTime={new Date(Date.now() + 86400_000 * 2 + 3600_000 * 5)}
    currentPrice="$94,532.18"
    priceChange24h="+2.34%"
    priceLabel="BTC/USD"
    tweetCount={1234}
  />
);

/* -------------------- MobileDrawer variants (real component) -------------------- */

const DrawerDemoShell = ({
  buttonLabel,
  title,
  description,
  children,
}: {
  buttonLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-3">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Re-open drawer
      </Button>
      <MobileDrawer
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
      >
        {children}
      </MobileDrawer>
      <p className="mt-3 text-[11px] text-muted-foreground">{buttonLabel}</p>
    </div>
  );
};

export const DrawerReadOnlyPreview = () => (
  <DrawerDemoShell
    buttonLabel="Read-only pattern · no footer (e.g. Position Details)"
    title="Position details"
    description="Full-size read view"
  >
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Entry price</span><span className="font-mono">$0.5234</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Mark price</span><span className="font-mono">$0.5410</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="font-mono">120</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Leverage</span><span className="font-mono">5x</span></div>
      </div>
    </div>
  </DrawerDemoShell>
);

export const DrawerEditPreview = () => (
  <DrawerDemoShell
    buttonLabel="Edit pattern · Cancel + Primary (e.g. Edit TP/SL)"
    title="Edit TP / SL"
  >
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-trading-green">Take profit</label>
        <input
          defaultValue="0.60"
          className="w-full h-11 bg-muted border-0 rounded-lg px-3 text-sm font-mono"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-trading-red">Stop loss</label>
        <input
          defaultValue="0.48"
          className="w-full h-11 bg-muted border-0 rounded-lg px-3 text-sm font-mono"
        />
      </div>
      <div className="mt-4 pt-3 border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1 h-11" type="button">Cancel</Button>
        <Button className="flex-1 h-11" type="button">Confirm</Button>
      </div>
    </div>
  </DrawerDemoShell>
);

export const DrawerDestructivePreview = () => (
  <DrawerDemoShell
    buttonLabel="Destructive pattern · Cancel + Red primary (e.g. Close Position)"
    title="Close position"
  >
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Realized PnL</span><span className="font-mono text-trading-green">+$12.40</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Released margin</span><span className="font-mono">$24.00</span></div>
      </div>
      <div className="mt-4 pt-3 border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1 h-11" type="button">Cancel</Button>
        <Button
          className="flex-1 h-11 bg-trading-red text-white hover:bg-trading-red/90"
          type="button"
        >
          Close all
        </Button>
      </div>
    </div>
  </DrawerDemoShell>
);

/* -------------------- BottomNav safe area (real component) -------------------- */

export const BottomNavSafeAreaPreview = () => (
  <div className="relative h-[260px] rounded-lg overflow-hidden border border-border/40 bg-background">
    <div className="p-4 space-y-2">
      <div className="h-8 rounded bg-muted/40" />
      <div className="h-8 rounded bg-muted/40" />
      <div className="h-8 rounded bg-muted/40" />
    </div>
    <div className="absolute inset-x-0 bottom-0">
      <BottomNav />
    </div>
  </div>
);

/* -------------------- Mobile card consistency (DESIGN.md §15) -------------------- */

export const MobileCardConsistencyPreview = () => (
  <div className="p-3 space-y-3">
    <div className="stats-card">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total equity</div>
      <div className="mt-1 font-mono text-2xl font-bold">$13,530.00</div>
      <div className="mt-1 text-xs text-trading-green font-mono">+$34.56 · 7D +1.9%</div>
    </div>
    <div className="trading-card p-4">
      <div className="text-sm font-semibold">Trading card variant</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Content surface used across trade/portfolio detail modules. Uses shared radius, border, and hover states from index.css.
      </p>
    </div>
    <div className="rounded-xl border border-border/40 bg-card p-3">
      <div className="text-sm font-semibold">Generic list item</div>
      <p className="mt-0.5 text-[11px] text-muted-foreground font-mono">rounded-xl · border-border/40 · bg-card</p>
    </div>
  </div>
);
