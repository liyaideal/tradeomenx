import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "./useUserProfile";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export type VoucherStatus = "issued" | "redeemed" | "settled" | "expired" | "revoked";

export interface PositionVoucher {
  id: string;
  code: string;
  faceValue: number;
  redeemableCapPct: number;
  maxHoldingHours: number;
  entryPriceMin: number;
  entryPriceMax: number;
  minHoursToSettlement: number;
  status: VoucherStatus;
  issuedAt: string;
  expiresAt: string;
  redeemedAt: string | null;
  redeemedAirdropPositionId: string | null;
  redeemedEventId: string | null;
  redeemedOptionId: string | null;
  redeemedSide: string | null;
  /** Resolved status of the linked airdrop_positions row, when redeemed. */
  redeemedAirdropStatus: string | null;
}

const QUERY_KEY = ["position-vouchers"];

const mapRow = (row: any): PositionVoucher => ({
  id: row.id,
  code: row.code,
  faceValue: Number(row.face_value),
  redeemableCapPct: Number(row.redeemable_cap_pct),
  maxHoldingHours: Number(row.max_holding_hours),
  entryPriceMin: Number(row.entry_price_min),
  entryPriceMax: Number(row.entry_price_max),
  minHoursToSettlement: Number(row.min_hours_to_settlement),
  status: row.status,
  issuedAt: row.issued_at,
  expiresAt: row.expires_at,
  redeemedAt: row.redeemed_at,
  redeemedAirdropPositionId: row.redeemed_airdrop_position_id,
  redeemedEventId: row.redeemed_event_id,
  redeemedOptionId: row.redeemed_option_id,
  redeemedSide: row.redeemed_side,
  redeemedAirdropStatus: null,
});

export const usePositionVouchers = () => {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();
  const [isRedeeming, setIsRedeeming] = useState(false);

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: [...QUERY_KEY, user?.id ?? "guest"],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("position_vouchers" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      if (error) {
        console.error("Failed to fetch vouchers", error);
        return [];
      }
      const mapped = (data as any[]).map(mapRow);

      // Enrich with linked airdrop_positions.status so we can show "closed"
      // even if the voucher row itself wasn't flipped to 'settled'.
      const airdropIds = mapped
        .map((v) => v.redeemedAirdropPositionId)
        .filter((id): id is string => !!id);
      if (airdropIds.length > 0) {
        const { data: airdropRows } = await supabase
          .from("airdrop_positions")
          .select("id, status")
          .in("id", airdropIds);
        const statusById = new Map<string, string>(
          (airdropRows ?? []).map((r: any) => [r.id, r.status]),
        );
        return mapped.map((v) =>
          v.redeemedAirdropPositionId
            ? { ...v, redeemedAirdropStatus: statusById.get(v.redeemedAirdropPositionId) ?? null }
            : v,
        );
      }
      return mapped;
    },
  });


  const issuedVouchers = vouchers.filter(
    (v) => v.status === "issued" && new Date(v.expiresAt).getTime() > Date.now(),
  );

  const redeem = async (
    voucherId: string,
    eventId: string,
    optionId: string,
    side: "long" | "short",
  ): Promise<{ success: boolean; airdropPositionId?: string; eventId?: string; error?: string }> => {
    setIsRedeeming(true);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-position-voucher", {
        body: { voucherId, eventId, optionId, side },
      });
      if (error) {
        const msg = (data as any)?.error ?? error.message ?? "Failed to redeem voucher";
        toast({ title: "Redemption failed", description: msg, variant: "destructive" });
        return { success: false, error: msg };
      }
      if (!data?.success) {
        const msg = (data as any)?.error ?? "Failed to redeem voucher";
        toast({ title: "Redemption failed", description: msg, variant: "destructive" });
        return { success: false, error: msg };
      }
      toast({ title: "Voucher redeemed", description: "Your position is now active." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["airdrop-positions"] });
      return { success: true, airdropPositionId: data.airdropPositionId, eventId: data.eventId };
    } finally {
      setIsRedeeming(false);
    }
  };

  return { vouchers, issuedVouchers, isLoading, redeem, isRedeeming };
};
