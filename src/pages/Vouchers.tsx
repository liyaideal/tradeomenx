import { useState } from "react";
import { Ticket, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
import { usePositionVouchers, type PositionVoucher } from "@/hooks/usePositionVouchers";
import { VoucherCard } from "@/components/vouchers/VoucherCard";
import { RedeemVoucherSheet } from "@/components/vouchers/RedeemVoucherSheet";

const Vouchers = () => {
  const isMobile = useIsMobile();
  const { vouchers, issuedVouchers, isLoading } = usePositionVouchers();
  const [activeVoucher, setActiveVoucher] = useState<PositionVoucher | null>(null);

  const redeemed = vouchers.filter((v) => v.status === "redeemed");
  const expired = vouchers.filter(
    (v) => v.status === "expired" || (v.status === "issued" && new Date(v.expiresAt).getTime() <= Date.now()),
  );

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
        <main className={`${isMobile ? "px-4 py-6" : "px-8 py-10 max-w-5xl mx-auto"} space-y-8`}>
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

          {!isLoading && issuedVouchers.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-medium text-foreground">
                  Available ({issuedVouchers.length})
                </h2>
              </div>
              <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
                {issuedVouchers.map((v) => (
                  <VoucherCard key={v.id} voucher={v} onRedeem={setActiveVoucher} />
                ))}
              </div>
            </section>
          )}

          {!isLoading && redeemed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Redeemed ({redeemed.length})
              </h2>
              <div className="space-y-2">
                {redeemed.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-lg border border-border bg-muted/20 p-3 flex items-center justify-between gap-3"
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
                    <span className="text-[11px] text-primary">Position opened</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isLoading && expired.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Expired ({expired.length})</h2>
              <div className="space-y-2">
                {expired.map((v) => (
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
          )}
        </main>
      </AuthGateOverlay>

      <RedeemVoucherSheet
        voucher={activeVoucher}
        open={!!activeVoucher}
        onOpenChange={(open) => !open && setActiveVoucher(null)}
      />

      {isMobile && <BottomNav />}
    </div>
  );
};

export default Vouchers;
