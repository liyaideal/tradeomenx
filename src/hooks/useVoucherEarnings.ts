import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const VOUCHER_CLAIM_VOLUME_REQUIRED = 50_000;

interface VoucherEarningsState {
  pending: number;
  lifetimeCredited: number;
  volume: number;
  loading: boolean;
  claiming: boolean;
}

export function useVoucherEarnings() {
  const { user } = useAuth();
  const [state, setState] = useState<VoucherEarningsState>({
    pending: 0,
    lifetimeCredited: 0,
    volume: 0,
    loading: true,
    claiming: false,
  });

  const refresh = useCallback(async () => {
    if (!user) {
      setState((s) => ({ ...s, pending: 0, lifetimeCredited: 0, volume: 0, loading: false }));
      return;
    }
    setState((s) => ({ ...s, loading: true }));

    const [{ data: pool }, { data: trades }] = await Promise.all([
      supabase
        .from("voucher_earnings")
        .select("pending_amount, lifetime_credited")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("trades")
        .select("amount")
        .eq("user_id", user.id)
        .eq("status", "Filled"),
    ]);

    const volume = (trades ?? []).reduce(
      (sum, row) => sum + Number((row as { amount: number | string }).amount ?? 0),
      0,
    );

    setState({
      pending: Number(pool?.pending_amount ?? 0),
      lifetimeCredited: Number(pool?.lifetime_credited ?? 0),
      volume,
      loading: false,
      claiming: false,
    });
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime: react to voucher position settlements and new trades
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`voucher-earnings-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "voucher_earnings", filter: `user_id=eq.${user.id}` },
        () => refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trades", filter: `user_id=eq.${user.id}` },
        () => refresh(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  const required = VOUCHER_CLAIM_VOLUME_REQUIRED;
  const progressPct = useMemo(
    () => Math.max(0, Math.min(100, (state.volume / required) * 100)),
    [state.volume, required],
  );
  const volumeMet = state.volume >= required;
  const canClaim = volumeMet && state.pending > 0 && !state.claiming;

  const claim = useCallback(async () => {
    if (!user || !canClaim) return;
    setState((s) => ({ ...s, claiming: true }));
    try {
      const { data, error } = await supabase.functions.invoke("claim-voucher-earnings", {
        body: {},
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      const claimed = Number((data as { claimed?: number })?.claimed ?? 0);
      toast.success(`Claimed $${claimed.toFixed(2)} to available balance`);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to claim voucher earnings");
      setState((s) => ({ ...s, claiming: false }));
    }
  }, [user, canClaim, refresh]);

  return {
    pending: state.pending,
    lifetimeCredited: state.lifetimeCredited,
    volume: state.volume,
    required,
    progressPct,
    volumeMet,
    canClaim,
    loading: state.loading,
    claiming: state.claiming,
    claim,
    refresh,
  };
}
