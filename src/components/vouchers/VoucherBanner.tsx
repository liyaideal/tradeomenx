import { Link } from "react-router-dom";
import { Ticket, ChevronRight } from "lucide-react";
import { usePositionVouchers } from "@/hooks/usePositionVouchers";

export const VoucherBanner = () => {
  const { issuedVouchers, isLoading } = usePositionVouchers();
  if (isLoading || issuedVouchers.length === 0) return null;

  return (
    <Link
      to="/vouchers"
      className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-4 py-3 hover:border-primary/50 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Ticket className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">
            You have {issuedVouchers.length} unredeemed voucher{issuedVouchers.length === 1 ? "" : "s"}
          </div>
          <div className="text-xs text-muted-foreground">
            Redeem to open a free position on any eligible event.
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </Link>
  );
};
