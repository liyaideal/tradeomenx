import { useEffect, useState } from "react";
import { Ticket, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
import { usePositionVouchers } from "@/hooks/usePositionVouchers";
import { VoucherCard } from "@/components/vouchers/VoucherCard";
import { RedeemVoucherContent } from "@/components/vouchers/RedeemVoucherContent";
import { VoucherEarningsCard } from "@/components/vouchers/VoucherEarningsCard";

const Vouchers = () => {
  const isMobile = useIsMobile();
  const { vouchers, issuedVouchers, isLoading } = usePositionVouchers();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default-select the first available voucher; keep selection valid as the list changes
  useEffect(() => {
    if (issuedVouchers.length === 0) {
      if (selectedId !== null) setSelectedId(null);
      return;
    }
    if (!selectedId || !issuedVouchers.some((v) => v.id === selectedId)) {
      setSelectedId(issuedVouchers[0].id);
    }
  }, [issuedVouchers, selectedId]);

  const selected = issuedVouchers.find((v) => v.id === selectedId) ?? null;

  const redeemed = vouchers.filter((v) => v.status === "redeemed" || v.status === "settled");
  const expired = vouchers.filter(
    (v) => v.status === "expired" || (v.status === "issued" && new Date(v.expiresAt).getTime() <= Date.now()),
  );

  const redeemPanel = selected ? (() => {
    const cap = selected.faceValue * selected.redeemableCapPct;
    return (
      <div className="rounded-xl border border-border bg-card/40">
        {/* Header band */}
        <div className="relative border-b border-border bg-gradient-to-br from-primary/10 via-card/40 to-card/40 p-4 md:p-5 rounded-t-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {/* Left: label + face value + code chip */}
            <div className="flex flex-col gap-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Redeeming voucher
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl md:text-4xl font-semibold text-foreground leading-none">
                  ${selected.faceValue.toFixed(2)}
                </span>
                <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] tracking-widest text-muted-foreground">
                  {selected.code}
                </span>
              </div>
            </div>

            {/* Right: meta stats */}
            <div className="flex items-stretch gap-2">
              <div className="rounded-lg border border-border bg-background/40 px-3 py-2 min-w-[92px]">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Max profit</div>
                <div className="font-mono text-sm text-trading-green mt-0.5">${cap.toFixed(2)}</div>
              </div>
              <div className="rounded-lg border border-border bg-background/40 px-3 py-2 min-w-[92px]">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hold window</div>
                <div className="font-mono text-sm text-foreground mt-0.5">{selected.maxHoldingHours}h</div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-muted-foreground">
            Pick a market below to open your free position.
          </div>
        </div>

        <div className="p-4 md:p-5">
          <RedeemVoucherContent voucher={selected} variant="inline" />
        </div>
      </div>
    );
  })() : null;

  return (
    <div
      className={`min-h-screen ${isMobile ? "pb-24" : ""}`}
      style={{
        background: isMobile
          ? "hsl(222 47% 6%)"
          : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(260 50% 15% / 0.3) 0%, hsl(222 47% 6%) 70%)",
      }}
    >
      {isMobile ? <MobileHeader showLogo /> : <EventsDesktopHeader />}

      <AuthGateOverlay
        title="Sign in to view your vouchers"
        description="Position vouchers let you open a free position on any tradeable event."
      >
        <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-6xl mx-auto"} space-y-6`}>
          <div className="relative">
            {!isMobile && (
              <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
            )}
            <div>
              <h1 className={`font-bold text-foreground ${isMobile ? "text-2xl" : "text-3xl"}`}>
                Position Vouchers
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">
                Redeem a voucher to instantly open a free position on any eligible event. Profits are capped per voucher; losses don't touch your balance.
              </p>
            </div>
          </div>

          <VoucherEarningsCard />

          {isLoading && (
            <div className="rounded-xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
              Loading vouchers...
            </div>
          )}

          {!isLoading && vouchers.length === 0 && (
            <div className="rounded-xl border border-border bg-card/40 p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Ticket className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-base font-medium text-foreground mb-1">No vouchers yet</div>
              <div className="text-sm text-muted-foreground max-w-sm mx-auto">
                When you receive a position voucher, it'll show up here ready to redeem.
              </div>
            </div>
          )}

          {!isLoading && vouchers.length > 0 && (
            isMobile ? (
              // ===== Mobile: single column =====
              <div className="space-y-6">
                {issuedVouchers.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-medium text-foreground">
                        Available ({issuedVouchers.length})
                      </h2>
                    </div>
                    <div className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
                      {issuedVouchers.map((v) => (
                        <div key={v.id} className="snap-start shrink-0 w-[78%] max-w-[280px]">
                          <VoucherCard
                            voucher={v}
                            compact
                            selected={v.id === selectedId}
                            onRedeem={(vc) => setSelectedId(vc.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {redeemPanel}

                {redeemed.length > 0 && <RedeemedSection items={redeemed} />}
                {expired.length > 0 && <ExpiredSection items={expired} />}
              </div>
            ) : (
              // ===== Desktop: two-column =====
              <div className="grid grid-cols-12 gap-6 items-start">
                <aside className="col-span-4 space-y-6">
                  {issuedVouchers.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-medium text-foreground">
                          Available ({issuedVouchers.length})
                        </h2>
                      </div>
                      <div className="space-y-2">
                        {issuedVouchers.map((v) => (
                          <VoucherCard
                            key={v.id}
                            voucher={v}
                            compact
                            selected={v.id === selectedId}
                            onRedeem={(vc) => setSelectedId(vc.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {redeemed.length > 0 && <RedeemedSection items={redeemed} />}
                  {expired.length > 0 && <ExpiredSection items={expired} />}
                </aside>

                <section className="col-span-8">
                  {redeemPanel ?? (
                    <div className="rounded-xl border border-border bg-card/40 p-10 text-center">
                      <div className="text-sm text-muted-foreground">
                        No active vouchers to redeem.
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )
          )}
        </main>
      </AuthGateOverlay>

      {isMobile && <BottomNav />}
    </div>
  );
};

const RedeemedSection = ({ items }: { items: ReturnType<typeof usePositionVouchers>["vouchers"] }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-medium text-muted-foreground">Redeemed ({items.length})</h2>
    <div className="space-y-2">
      {items.map((v) => {
        const isSettled = v.status === "settled";
        return (
          <div
            key={v.id}
            className={`rounded-lg border border-border bg-muted/20 p-3 flex items-center justify-between gap-3 ${isSettled ? "opacity-70" : ""}`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{v.code}</span>
                <span className="font-mono text-sm">${v.faceValue.toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Redeemed {v.redeemedAt ? new Date(v.redeemedAt).toLocaleDateString() : ""}
              </div>
            </div>
            <span className={`text-[11px] ${isSettled ? "text-muted-foreground" : "text-primary"}`}>
              {isSettled ? "Position closed" : "Position open"}
            </span>
          </div>
        );
      })}
    </div>
  </section>
);

const ExpiredSection = ({ items }: { items: ReturnType<typeof usePositionVouchers>["vouchers"] }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-medium text-muted-foreground">Expired ({items.length})</h2>
    <div className="space-y-2">
      {items.map((v) => (
        <div
          key={v.id}
          className="rounded-lg border border-border bg-muted/10 p-3 flex items-center justify-between gap-3 opacity-70"
        >
          <div>
            <span className="font-mono text-xs text-muted-foreground">{v.code}</span>
            <span className="font-mono text-sm ml-2">${v.faceValue.toFixed(2)}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Expired</span>
        </div>
      ))}
    </div>
  </section>
);

export default Vouchers;
