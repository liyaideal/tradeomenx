// ============================================================
// LiteSection — Style Guide playground for Lite surface Round A.
// Enumerates every state per spec §6: surface switcher (Lite/Pro), sector
// rail (with active/inactive), Lite event cards (stocks / standard), quick
// buy panel (tradeable / closing soon / frozen / settled / amount error /
// insufficient / slippage). Desktop + mobile rendered side-by-side.
// ============================================================
import { Repeat, LineChart, Coins, Landmark, Film, ExternalLink, Clock, TrendingUp } from "lucide-react";
import { SectionWrapper, SubSection } from "../components";
import { cn } from "@/lib/utils";

// -------- Static demo data (no DB coupling) --------
const DEMO_STOCK_EVENT = {
  id: "demo-stock",
  name: "Will TSLA close above $250 today?",
  category: "finance",
  side_labels: { yes: "Up", no: "Not Up" },
  product_lines: ["spot"],
  freeze_time: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
  end_date: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
  options: [
    { id: "y", label: "Yes", price: 0.57 },
    { id: "n", label: "No", price: 0.43 },
  ],
  lifecycle_status: "TRADING",
};

const DEMO_CRYPTO_EVENT = {
  id: "demo-crypto",
  name: "BTC above $150k by end of 2026?",
  category: "crypto",
  side_labels: null,
  product_lines: ["futures"],
  end_date: new Date(Date.now() + 90 * 86400 * 1000).toISOString(),
  options: [
    { id: "y", label: "Yes", price: 0.31 },
    { id: "n", label: "No", price: 0.69 },
  ],
  lifecycle_status: "TRADING",
};

// -------- Presentational reproductions (no live data) --------
const SurfaceSwitcherDemo = ({ current }: { current: "lite" | "pro" }) => (
  <button className="flex w-full items-center gap-2 rounded-md border border-border/40 bg-muted/20 px-3 py-2 text-sm">
    <Repeat className="h-4 w-4 text-primary" />
    <span>{current === "lite" ? "Switch to Pro" : "Switch to Lite"}</span>
    <span className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      currently {current}
    </span>
  </button>
);

const SectorCard = ({
  Icon, label, hook, count, tone = "default",
}: { Icon: any; label: string; hook: string; count?: number | string; tone?: "default" | "active" | "external" }) => (
  <div className={cn(
    "flex w-[220px] flex-shrink-0 flex-col justify-between rounded-xl border p-3",
    tone === "active" && "border-primary/60 bg-primary/10",
    tone === "external" && "border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-amber-600/5",
    tone === "default" && "border-border/40 bg-card",
  )}>
    <div className="mb-2 flex items-center justify-between">
      <span className={cn(
        "flex items-center gap-1.5 text-sm font-semibold",
        tone === "active" ? "text-primary" : tone === "external" ? "text-amber-400" : "text-foreground",
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {tone === "external" ? (
        <ExternalLink className="h-3.5 w-3.5 text-amber-500/70" />
      ) : (
        <span className="rounded-md bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{count}</span>
      )}
    </div>
    <p className="text-xs leading-snug text-muted-foreground">{hook}</p>
  </div>
);

const SectorRailDemo = () => (
  <div className="-mx-4 overflow-x-auto scrollbar-none">
    <div className="flex min-w-max gap-3 px-4">
      <SectorCard Icon={TrendingUp} label="Sports" hook="World-class matches, simple YES / NO" tone="external" />
      <SectorCard Icon={LineChart} label="Stocks" hook="New events every trading day · settles at market close" count={12} tone="active" />
      <SectorCard Icon={Coins} label="Crypto" hook="24/7 price events across BTC, ETH, SOL, and more" count={8} />
      <SectorCard Icon={Landmark} label="Macro" hook="Central-bank calls, elections, macro data prints" count={4} />
      <SectorCard Icon={Film} label="Entertainment" hook="Box office, awards, culture-moment markets" count={2} />
    </div>
  </div>
);

const EventCardDemo = ({ isStocks }: { isStocks: boolean }) => (
  <div className="rounded-xl border border-border/40 bg-card p-4">
    <div className="mb-3 flex items-start justify-between gap-3">
      <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-foreground">
        {isStocks ? DEMO_STOCK_EVENT.name : DEMO_CRYPTO_EVENT.name}
      </h3>
      {isStocks && (
        <span className="flex flex-shrink-0 items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
          <Clock className="h-3 w-3" />
          Settles today · 4:00 PM ET
        </span>
      )}
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg border border-trading-green/30 bg-trading-green/5 px-3 py-2">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {isStocks ? "Up" : "Yes"}
        </span>
        <div className="font-mono text-base font-bold text-trading-green">57%</div>
      </div>
      <div className="rounded-lg border border-trading-red/30 bg-trading-red/5 px-3 py-2">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {isStocks ? "Not Up" : "No"}
        </span>
        <div className="font-mono text-base font-bold text-trading-red">43%</div>
      </div>
    </div>
  </div>
);

type PanelState = "tradeable" | "closing" | "frozen" | "settled" | "amount-zero" | "insufficient" | "slippage";

const STATE_META: Record<PanelState, { label: string; badge: { text: string; className: string }; disabled: boolean; errorLine?: string; submitLabel: string }> = {
  tradeable:   { label: "Tradeable",        badge: { text: "TRADING",   className: "border-trading-green/40 bg-trading-green/10 text-trading-green" }, disabled: false, submitLabel: "Buy Up ~$0.57" },
  closing:     { label: "Closing soon",     badge: { text: "TRADING",   className: "border-amber-500/40 bg-amber-500/10 text-amber-500" }, disabled: false, submitLabel: "Buy Up ~$0.57" },
  frozen:      { label: "Frozen (disabled)",badge: { text: "FROZEN",    className: "border-muted-foreground/40 bg-muted/40 text-muted-foreground" }, disabled: true, submitLabel: "Trading frozen" },
  settled:     { label: "Settled",          badge: { text: "SETTLED",   className: "border-border/40 bg-muted/30 text-muted-foreground" }, disabled: true, submitLabel: "Event settled" },
  "amount-zero":{ label: "Amount = 0 error",badge: { text: "TRADING",   className: "border-trading-green/40 bg-trading-green/10 text-trading-green" }, disabled: true, errorLine: "Enter an amount above $0", submitLabel: "Buy Up" },
  insufficient:{ label: "Insufficient balance",badge: { text: "TRADING",className: "border-trading-green/40 bg-trading-green/10 text-trading-green" }, disabled: true, errorLine: "Insufficient balance", submitLabel: "Buy Up ~$0.57" },
  slippage:    { label: "Slippage failure", badge: { text: "TRADING",   className: "border-trading-green/40 bg-trading-green/10 text-trading-green" }, disabled: false, errorLine: "Price moved, try again", submitLabel: "Buy Up ~$0.57" },
};

const BuyPanelDemo = ({ state, isMobile }: { state: PanelState; isMobile: boolean }) => {
  const meta = STATE_META[state];
  return (
    <div className={cn("space-y-4 rounded-xl border border-border/50 bg-card p-4", isMobile ? "w-full" : "w-[360px]")}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex-1 text-sm font-semibold leading-snug">{DEMO_STOCK_EVENT.name}</h2>
        <span className={cn("flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium", meta.badge.className)}>
          {meta.badge.text}
        </span>
      </div>
      <div className="flex items-baseline justify-between rounded-lg bg-muted/30 px-3 py-2">
        <span className="text-xs text-muted-foreground">Up probability</span>
        <span className="font-mono text-2xl font-bold">Up 57%</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-trading-green bg-trading-green/15 px-3 py-2">
          <div className="text-[11px] uppercase text-muted-foreground">Up</div>
          <div className="font-mono text-base font-bold text-trading-green">$0.57</div>
        </div>
        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
          <div className="text-[11px] uppercase text-muted-foreground">Not Up</div>
          <div className="font-mono text-base font-bold text-trading-red">$0.43</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Amount (USDC)</span>
          <span className="font-mono">Available: $1,250.00</span>
        </div>
        <div className={cn(
          "h-11 rounded-md border bg-background px-3 flex items-center font-mono text-base",
          meta.errorLine && "border-trading-red/60",
        )}>
          {state === "amount-zero" ? "" : state === "insufficient" ? "9,999.00" : "50.00"}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[10, 25, 50, 100].map((n) => (
            <div key={n} className="rounded-md border border-border/50 bg-muted/20 py-1.5 text-center font-mono text-xs">${n}</div>
          ))}
        </div>
        {meta.errorLine && <p className="text-xs text-trading-red">{meta.errorLine}</p>}
      </div>
      <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/20 p-3 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Max loss <span className="text-muted-foreground/70">(what you pay)</span></span><span className="font-mono">$50.00</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">You get if right</span><span className="font-mono">$87.72</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Potential profit</span><span className="font-mono text-trading-green">+$37.72</span></div>
      </div>
      <div className={cn(
        "flex h-12 items-center justify-center rounded-md text-base font-semibold",
        meta.disabled ? "bg-muted text-muted-foreground" : "bg-trading-green text-white",
      )}>
        {meta.submitLabel}
      </div>
    </div>
  );
};

const DualFrame = ({ children }: { children: (isMobile: boolean) => React.ReactNode }) => (
  <div className="grid gap-4 lg:grid-cols-2">
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">Mobile</div>
      <div className="mx-auto w-[360px] rounded-2xl border border-border/40 bg-background p-4">
        {children(true)}
      </div>
    </div>
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">Desktop</div>
      <div className="rounded-2xl border border-border/40 bg-background p-4">
        {children(false)}
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _isMobileUnused = (b: boolean) => b;

export const LiteSection = ({ isMobile: _isMobile }: { isMobile: boolean }) => {
  const panelStates: PanelState[] = ["tradeable", "closing", "frozen", "settled", "amount-zero", "insufficient", "slippage"];

  return (
    <SectionWrapper
      id="lite"
      title="Lite Surface (Round A)"
      platform="shared"
      description="Lite mode 首轮骨架：Surface 切换、板块 rail、Lite 事件卡（含 Stocks 当日开奖徽标）、Stocks 快速买入面板全部状态。Boost 面板与 Sports 表单对齐属下一轮。"
    >
      <div className="space-y-8">
        <SubSection title="Surface switcher — profile 菜单项" platform="shared">
          <div className="grid gap-3 sm:grid-cols-2">
            <SurfaceSwitcherDemo current="lite" />
            <SurfaceSwitcherDemo current="pro" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            桌面：<code className="font-mono">EventsDesktopHeader</code> 头像菜单。移动：<code className="font-mono">BottomNav</code> Profile drawer。写入 <code className="font-mono">profiles.preferred_surface</code>；guest 落 localStorage。
          </p>
        </SubSection>

        <SubSection title="Sector rail — 板块导航（Sports 常驻外链）" platform="shared">
          <DualFrame>
            {() => <SectorRailDemo />}
          </DualFrame>
        </SubSection>

        <SubSection title="Lite event card — stocks + standard" platform="shared">
          <DualFrame>
            {(mobile) => (
              <div className={mobile ? "space-y-3" : "grid grid-cols-2 gap-3"}>
                <EventCardDemo isStocks />
                <EventCardDemo isStocks={false} />
              </div>
            )}
          </DualFrame>
        </SubSection>

        <SubSection title="Quick buy panel — 全部 7 态" platform="shared">
          <div className="space-y-6">
            {panelStates.map((s) => (
              <div key={s}>
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  {STATE_META[s].label}
                </div>
                <DualFrame>
                  {(mobile) => <BuyPanelDemo state={s} isMobile={mobile} />}
                </DualFrame>
              </div>
            ))}
          </div>
        </SubSection>
      </div>
    </SectionWrapper>
  );
};
