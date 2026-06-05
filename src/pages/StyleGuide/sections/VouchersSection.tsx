import { useState } from "react";
import { Ticket, ChevronRight, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoucherCard } from "@/components/vouchers/VoucherCard";
import { VoucherEarningsCard } from "@/components/vouchers/VoucherEarningsCard";
import { CloseVoucherContent } from "@/components/positions/CloseVoucherContent";
import type { PositionVoucher } from "@/hooks/usePositionVouchers";
import { SectionWrapper, SubSection } from "../components";


/* ---------------- mocks ---------------- */

const baseVoucher = (overrides: Partial<PositionVoucher> = {}): PositionVoucher => ({
  id: "v-mock",
  code: "ABCD1201",
  faceValue: 25,
  redeemableCapPct: 1,
  maxHoldingHours: 72,
  entryPriceMin: 0.2,
  entryPriceMax: 0.8,
  minHoursToSettlement: 6,
  status: "claimed",
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
  claimedAt: new Date().toISOString(),
  redeemedAt: null,
  redeemedAirdropPositionId: null,
  redeemedEventId: null,
  redeemedOptionId: null,
  redeemedSide: null,
  redeemedAirdropStatus: null,
  redeemedEventName: null,
  redeemedOutcomeLabel: null,
  redeemedSettledPnl: null,
  redeemedCloseReason: null,
  ...overrides,
});

/* ---------------- shared PresetRail ---------------- */

const PresetRail = ({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: any) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        onClick={() => onChange(o.id)}
        className={`h-7 px-2.5 rounded-full text-[11px] border transition ${
          value === o.id
            ? "bg-primary/15 border-primary/40 text-primary"
            : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Frame = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <div className="space-y-2">
    {label && <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>}
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">{children}</div>
  </div>
);

/* ---------------- 1. Banner ---------------- */

const BannerDemo = () => {
  const [state, setState] = useState<"hidden" | "some" | "urgent">("some");
  const count = state === "urgent" ? 1 : 3;
  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "hidden", label: "0 vouchers (hidden)" },
          { id: "some", label: "3 available" },
          { id: "urgent", label: "1 expiring soon" },
        ]}
      />
      <Frame>
        {state === "hidden" ? (
          <div className="text-xs text-muted-foreground italic">Banner is not rendered when user has no issued vouchers.</div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  You have {count} unredeemed voucher{count === 1 ? "" : "s"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {state === "urgent"
                    ? "Expires in <24h — redeem now or lose it."
                    : "Redeem to open a free position on any eligible event."}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        )}
      </Frame>
    </div>
  );
};

/* ---------------- 2. VoucherCard ---------------- */

type CardState =
  | "grantedFresh"
  | "grantedClaiming"
  | "claimedUnselected"
  | "claimedSelected"
  | "claimedUrgent";

const VoucherCardDemo = () => {
  const [state, setState] = useState<CardState>("grantedFresh");

  const voucher: PositionVoucher = (() => {
    switch (state) {
      case "grantedFresh":
      case "grantedClaiming":
        return baseVoucher({
          status: "granted",
          claimedAt: null,
          expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        });
      case "claimedUrgent":
        return baseVoucher({
          status: "claimed",
          expiresAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        });
      case "claimedSelected":
      case "claimedUnselected":
      default:
        return baseVoucher({
          status: "claimed",
          expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        });
    }
  })();

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "grantedFresh", label: "Granted · tap to claim" },
          { id: "grantedClaiming", label: "Granted · claiming…" },
          { id: "claimedUnselected", label: "Claimed · fresh (7d window)" },
          { id: "claimedSelected", label: "Claimed · selected" },
          { id: "claimedUrgent", label: "Claimed · expiring <24h" },
        ]}
      />
      <Frame>
        <div className="max-w-[280px]">
          <VoucherCard
            voucher={voucher}
            onRedeem={() => {}}
            onClaim={() => {}}
            compact
            selected={state === "claimedSelected"}
            claiming={state === "grantedClaiming"}
          />
        </div>
      </Frame>
    </div>
  );
};


/* ---------------- 3. Earnings card (tier ladder) ---------------- */

type TierState = "belowT1" | "t1" | "t2Partial" | "t3CapHit" | "t4Unlimited";

const TIER_PRESETS: Record<TierState, { volume: number; pending: number; lifetimeCredited: number }> = {
  belowT1:     { volume: 2_500,   pending: 18.40, lifetimeCredited: 0 },
  t1:          { volume: 7_500,   pending: 42.00, lifetimeCredited: 0 },
  t2Partial:   { volume: 22_000,  pending: 65.00, lifetimeCredited: 25 },
  t3CapHit:    { volume: 60_000,  pending: 800.00, lifetimeCredited: 100 },
  t4Unlimited: { volume: 180_000, pending: 1240.55, lifetimeCredited: 500 },
};

const EarningsDemo = () => {
  const [state, setState] = useState<TierState>("t2Partial");
  const data = TIER_PRESETS[state];
  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "belowT1", label: "Below T1 · locked" },
          { id: "t1", label: "T1 unlocked · $25 cap" },
          { id: "t2Partial", label: "T2 · partial headroom" },
          { id: "t3CapHit", label: "T3 · pending > cap" },
          { id: "t4Unlimited", label: "T4 · unlimited" },
        ]}
      />
      <Frame>
        <VoucherEarningsCard data={data} />
      </Frame>
    </div>
  );
};


/* ---------------- 4. Event picker rows ---------------- */

const PickerOptionRow = ({
  label,
  price,
  state,
  binary,
  isYes,
}: {
  label: string;
  price: number;
  state: "eligible" | "band" | "time" | "resolved";
  binary: boolean;
  isYes?: boolean;
}) => {
  const locked = state !== "eligible";
  const reason =
    state === "band"
      ? "Price out of 0.20–0.80 band"
      : state === "time"
        ? "Closes within 6h"
        : state === "resolved"
          ? "Event already resolved"
          : "";
  const colorClass = binary
    ? isYes
      ? "border-trading-green/40 bg-trading-green/15 text-trading-green"
      : "border-trading-red/40 bg-trading-red/15 text-trading-red"
    : "border-trading-green/40 bg-trading-green/15 text-trading-green";

  const btnClass = locked
    ? "border-border bg-muted/40 text-muted-foreground cursor-not-allowed"
    : colorClass;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1 text-xs text-foreground/90 truncate">{label}</div>
      <div className="font-mono text-xs text-muted-foreground tabular-nums w-12 text-right">
        ${price.toFixed(2)}
      </div>
      <div className="flex gap-1">
        {binary ? (
          <button className={`h-7 px-2 rounded text-[11px] font-medium border ${btnClass}`} disabled={locked}>
            {locked && <Lock className="w-3 h-3 inline mr-1" />}
            Buy {label}
          </button>
        ) : (
          <>
            <button className={`h-7 px-2 rounded text-[11px] font-medium border ${btnClass}`} disabled={locked}>
              {locked && <Lock className="w-3 h-3 inline mr-1" />}
              Yes
            </button>
            <button
              className={`h-7 px-2 rounded text-[11px] font-medium border ${
                locked ? "border-border bg-muted/40 text-muted-foreground cursor-not-allowed" : "border-trading-red/40 bg-trading-red/15 text-trading-red"
              }`}
              disabled={locked}
            >
              {locked && <Lock className="w-3 h-3 inline mr-1" />}
              No
            </button>
          </>
        )}
      </div>
      {locked && (
        <span className="text-[10px] text-muted-foreground italic w-44 text-right shrink-0">{reason}</span>
      )}
    </div>
  );
};

const PickerDemo = () => {
  const [eventType, setEventType] = useState<"binary" | "multi">("binary");
  return (
    <div className="space-y-3">
      <PresetRail
        value={eventType}
        onChange={setEventType}
        options={[
          { id: "binary", label: "Binary event (Yes/No aliases)" },
          { id: "multi", label: "Multi-market event" },
        ]}
      />
      <Frame>
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium text-foreground">
                {eventType === "binary" ? "UFC 316 Headliner: Pereira vs Ankalaev?" : "US unemployment rate May 2026?"}
              </div>
              <div className="text-[10px] text-muted-foreground capitalize">
                {eventType === "binary" ? "sports" : "macro"}
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {eventType === "binary" ? "Binary" : "5 options"}
            </Badge>
          </div>
          <div className="space-y-1.5">
            {eventType === "binary" ? (
              <>
                <PickerOptionRow label="Alex Pereira" price={0.42} state="eligible" binary isYes />
                <PickerOptionRow label="Magomed Ankalaev" price={0.58} state="eligible" binary isYes={false} />
              </>
            ) : (
              <>
                <PickerOptionRow label="Above 5.0%" price={0.35} state="eligible" binary={false} />
                <PickerOptionRow label="4.5%–5.0%" price={0.18} state="band" binary={false} />
                <PickerOptionRow label="4.0%–4.5%" price={0.55} state="time" binary={false} />
                <PickerOptionRow label="Below 4.0%" price={0.92} state="resolved" binary={false} />
              </>
            )}
          </div>
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 5. Redeem sticky bar ---------------- */

const RedeemStickyDemo = () => {
  const [state, setState] = useState<"empty" | "binary" | "multiYes" | "multiNo" | "submitting" | "blocked">("binary");

  if (state === "blocked") {
    return (
      <div className="space-y-3">
        <PresetRail
          value={state}
          onChange={setState}
          options={[
            { id: "empty", label: "Nothing picked" },
            { id: "binary", label: "Binary picked" },
            { id: "multiYes", label: "Multi · Yes" },
            { id: "multiNo", label: "Multi · No" },
            { id: "submitting", label: "Submitting" },
            { id: "blocked", label: "Active voucher exists" },
          ]}
        />
        <Frame>
          <div className="rounded-lg border border-trading-red/30 bg-trading-red/5 p-3 text-xs flex items-start gap-2">
            <Lock className="w-4 h-4 text-trading-red mt-0.5" />
            <div>
              <div className="font-medium text-trading-red">You already have an active voucher position</div>
              <div className="text-muted-foreground mt-0.5">Close it before redeeming another voucher.</div>
            </div>
          </div>
        </Frame>
      </div>
    );
  }

  const labels: Record<string, { display: string; color: string; hint: string }> = {
    binary: { display: "Magomed Ankalaev", color: "text-trading-red", hint: "Binary · alias" },
    multiYes: { display: "Above 5.0% · YES", color: "text-trading-green", hint: "Multi-market · Yes side" },
    multiNo: { display: "Above 5.0% · NO", color: "text-trading-red", hint: "Multi-market · No side" },
  };

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "empty", label: "Nothing picked" },
          { id: "binary", label: "Binary picked" },
          { id: "multiYes", label: "Multi · Yes" },
          { id: "multiNo", label: "Multi · No" },
          { id: "submitting", label: "Submitting" },
          { id: "blocked", label: "Active voucher exists" },
        ]}
      />
      <Frame>
        <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between gap-3">
          {state === "empty" ? (
            <span className="text-xs text-muted-foreground">Select an outcome on a market above to continue.</span>
          ) : (
            <div className="min-w-0">
              <div className={`text-sm font-medium ${labels[state]?.color}`}>{labels[state]?.display}</div>
              <div className="text-[11px] text-muted-foreground">{labels[state]?.hint}</div>
            </div>
          )}
          <Button size="sm" disabled={state === "empty" || state === "submitting"}>
            {state === "submitting" ? "Redeeming…" : "Redeem"}
          </Button>
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 6. Close voucher confirm ---------------- */

const CloseDemo = () => {
  const [state, setState] = useState<"profit" | "loss" | "submitting">("profit");
  const markPrice = state === "loss" ? 0.18 : 0.62;
  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "profit", label: "In profit" },
          { id: "loss", label: "In loss (credit floored)" },
          { id: "submitting", label: "Submitting" },
        ]}
      />
      <Frame>
        <div className="max-w-md">
          <CloseVoucherContent
            optionLabel="Magomed Ankalaev"
            side="long"
            entryPrice={0.42}
            markPrice={markPrice}
            faceValue={25}
            redeemableCap={25}
            isClosing={state === "submitting"}
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 7. Redeemed voucher row ---------------- */

const RedeemedRowDemo = () => {
  const [state, setState] = useState<"binaryOpen" | "multiOpen" | "settledProfit" | "settledLoss">("binaryOpen");
  const isClosed = state.startsWith("settled");
  const pnl = state === "settledProfit" ? 7.35 : state === "settledLoss" ? -12.5 : null;
  const pnlColor =
    pnl == null ? "text-muted-foreground" : pnl >= 0 ? "text-trading-green" : "text-trading-red";

  const isBinary = state === "binaryOpen";
  const code = state === "binaryOpen" ? "50AAC401" : state === "multiOpen" ? "DC3CAC02" : "EE8ECA03";
  const face = state === "binaryOpen" ? 10 : state === "multiOpen" ? 25 : 50;
  const eventName =
    state === "binaryOpen"
      ? "UFC 316 Headliner: Pereira vs Ankalaev?"
      : state === "multiOpen"
        ? "NBA Finals 2026 Game 7: Celtics vs Thunder?"
        : "US unemployment rate May 2026?";

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "binaryOpen", label: "Binary · open · alias chip" },
          { id: "multiOpen", label: "Multi · open · market + YES/NO" },
          { id: "settledProfit", label: "Settled +PnL" },
          { id: "settledLoss", label: "Settled −PnL" },
        ]}
      />
      <Frame>
        <div className={`rounded-lg border border-border bg-muted/20 p-3 max-w-xl ${isClosed ? "opacity-90" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{code}</span>
                <span className="font-mono text-sm">${face.toFixed(2)}</span>
              </div>
              {!isBinary && (
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded border border-border bg-background/40 px-1.5 py-0.5 text-[10px] tracking-wider uppercase text-muted-foreground">
                    Above 5.0%
                  </span>
                  <span className="inline-flex items-center rounded border border-trading-green/40 bg-trading-green/10 px-1.5 py-0.5 text-[10px] tracking-wider uppercase text-trading-green">
                    YES
                  </span>
                </div>
              )}
              <div className="text-xs text-foreground/80 mt-1 truncate">{eventName}</div>

              {isBinary && (
                <div className="mt-1.5 min-w-0">
                  <span className="inline-flex max-w-full items-center rounded border border-border bg-background/40 px-1.5 py-0.5 text-[10px] normal-case truncate text-trading-red">
                    Magomed Ankalaev
                  </span>
                </div>
              )}
              <div className="text-[11px] text-muted-foreground mt-1">Redeemed 03/06/2026</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[11px] ${isClosed ? "text-muted-foreground" : "text-primary"}`}>
                {isClosed ? "Position closed" : "Position open"}
              </span>
              {isClosed && pnl != null && (
                <span className={`font-mono text-sm ${pnlColor}`}>
                  {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- 8. Position chip (voucher source marker) ---------------- */

const PositionChipDemo = () => {
  const [state, setState] = useState<"comfortable" | "warning" | "overdue">("comfortable");
  const remainingH = state === "comfortable" ? 47 : state === "warning" ? 0.5 : -2;
  const label =
    remainingH < 0
      ? "Auto-settling…"
      : remainingH < 1
        ? `${Math.round(remainingH * 60)}m left`
        : `${Math.round(remainingH)}h left`;
  const tone =
    remainingH < 0
      ? "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
      : remainingH < 1
        ? "border-trading-red/40 bg-trading-red/10 text-trading-red"
        : "border-primary/30 bg-primary/10 text-primary";

  return (
    <div className="space-y-3">
      <PresetRail
        value={state}
        onChange={setState}
        options={[
          { id: "comfortable", label: "Comfortable (>1h)" },
          { id: "warning", label: "Urgent (<1h)" },
          { id: "overdue", label: "Past hold window" },
        ]}
      />
      <Frame>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
            <Ticket className="w-3 h-3 mr-1" />
            Voucher
          </Badge>
          <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-mono ${tone}`}>
            <Clock className="w-3 h-3" />
            {label}
          </span>
        </div>
      </Frame>
    </div>
  );
};

/* ---------------- Section root ---------------- */

interface VouchersSectionProps {
  isMobile: boolean;
}

export const VouchersSection = ({ isMobile: _isMobile }: VouchersSectionProps) => {
  return (
    <SectionWrapper
      id="vouchers"
      title="Vouchers"
      description="Position vouchers — granted→claimed (7d) → redeemed → settled, tiered earnings claim. Each module enumerates every state via the preset rail. Copy locked to docs/copy-dictionary.md."
    >
      <div className="space-y-10">
        <SubSection title="1. VoucherBanner" description="Mobile/home banner pointing users at unredeemed vouchers.">
          <BannerDemo />
        </SubSection>

        <SubSection title="2. VoucherCard" description="Compact card variants across the granted/claimed lifecycle. Granted = `Tap to claim`; claimed = redeem within 7 days.">
          <VoucherCardDemo />
        </SubSection>

        <SubSection
          title="3. VoucherEarningsCard"
          description="Pending earnings pool with 4-tier volume ladder (T1 $5k→$25 · T2 $15k→$100 · T3 $50k→$500 · T4 $150k→unlimited). Claimable = min(pending, tier.cap − lifetimeCredited)."
        >
          <EarningsDemo />
        </SubSection>


        <SubSection
          title="4. EventPickerList — option rows"
          description="Eligibility check per option: price band, time-to-settlement, resolution. Binary events render Buy{alias}; multi-market render Yes/No."
        >
          <PickerDemo />
        </SubSection>

        <SubSection title="5. Redeem confirm — sticky action bar" description="Bottom bar for the redemption flow.">
          <RedeemStickyDemo />
        </SubSection>

        <SubSection
          title="6. CloseVoucherContent"
          description="Confirm body shared by the close Dialog (desktop) and MobileDrawer. Credit floors at 0 and caps at Max profit."
        >
          <CloseDemo />
        </SubSection>

        <SubSection
          title="7. Redeemed voucher row (Vouchers page)"
          description="Binary events surface the alias chip on its own line; multi-market events show market label + YES/NO chip inline."
        >
          <RedeemedRowDemo />
        </SubSection>

        <SubSection title="8. Position chip — voucher source marker" description="Voucher badge + Hold window countdown rendered inside positions tables.">
          <PositionChipDemo />
        </SubSection>
      </div>
    </SectionWrapper>
  );
};
