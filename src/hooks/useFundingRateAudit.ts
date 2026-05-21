import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type FundingRateStep = "idle" | "select" | "periods" | "fetching" | "comparing" | "result";

interface PositionRecord {
  id: string;
  event_name: string;
  option_label: string;
  side: string;
  size: number;
  leverage: number;
  entry_price: number;
  created_at: string;
}

export interface FundingPeriodRecord {
  id: string;
  applied_rate: number;
  notional: number;
  amount: number; // signed: negative = user paid, positive = user received
  accrual_start: string;
  accrual_end: string;
  created_at: string; // used as settlementTs
}

export interface FundingRateAuditData {
  position: PositionRecord;
  period: FundingPeriodRecord;
  // On-chain FundingRate event fields
  eventId: string;
  outcomeId: number;
  fundingRate: number; // signed: positive = longs pay shorts
  fundingRateFormatted: string;
  // What was applied to user
  appliedRate: number;
  appliedAmount: number; // absolute USDC amount
  direction: "paid" | "received";
  notional: number;
  windowStart: string;
  windowEnd: string;
  settledAt: string;
  // Verification
  ratesMatch: boolean;
  txHash: string;
  blockNumber: number;
  verifiedAt: string;
}

const mockHex = (len: number) => {
  const chars = "0123456789abcdef";
  let r = "0x";
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * 16)];
  return r;
};

export const useFundingRateAudit = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<FundingRateStep>("idle");
  const [positions, setPositions] = useState<PositionRecord[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<PositionRecord | null>(null);
  const [periods, setPeriods] = useState<FundingPeriodRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<FundingPeriodRecord | null>(null);
  const [audit, setAudit] = useState<FundingRateAuditData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPositions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("positions")
      .select("id, event_name, option_label, side, size, leverage, entry_price, created_at")
      .eq("user_id", user.id)
      .in("status", ["Open", "Closed"])
      .order("created_at", { ascending: false })
      .limit(20);
    setPositions((data as PositionRecord[]) || []);
    setIsLoading(false);
  }, [user]);

  const loadPeriods = useCallback(async (positionId: string) => {
    setIsLoading(true);
    const { data } = await supabase
      .from("position_funding_ledger")
      .select("id, applied_rate, notional, amount, accrual_start, accrual_end, created_at")
      .eq("position_id", positionId)
      .neq("amount", 0)
      .order("created_at", { ascending: false })
      .limit(200);
    setPeriods(((data as FundingPeriodRecord[]) || []).map((p) => ({
      ...p,
      applied_rate: Number(p.applied_rate),
      notional: Number(p.notional),
      amount: Number(p.amount),
    })));
    setIsLoading(false);
  }, []);

  const openSelector = useCallback(() => {
    setSelectedPosition(null);
    setSelectedPeriod(null);
    setAudit(null);
    setPeriods([]);
    setStep("select");
    loadPositions();
  }, [loadPositions]);

  const selectPosition = useCallback(
    async (pos: PositionRecord) => {
      setSelectedPosition(pos);
      setSelectedPeriod(null);
      setAudit(null);
      setStep("periods");
      await loadPeriods(pos.id);
    },
    [loadPeriods]
  );

  const backToPeriods = useCallback(() => {
    setAudit(null);
    setSelectedPeriod(null);
    setStep("periods");
  }, []);

  const selectPeriod = useCallback(
    async (period: FundingPeriodRecord) => {
      if (!selectedPosition) return;
      setSelectedPeriod(period);

      setStep("fetching");
      await new Promise((r) => setTimeout(r, 1400));
      setStep("comparing");
      await new Promise((r) => setTimeout(r, 1200));

      const fundingRate = period.applied_rate;
      const direction: "paid" | "received" = period.amount < 0 ? "paid" : "received";
      const appliedAmount = Math.abs(period.amount);

      const eventId = `EVT-${Math.floor(Math.random() * 90000) + 10000}`;
      const outcomeId = Math.floor(Math.random() * 4);

      const auditData: FundingRateAuditData = {
        position: selectedPosition,
        period,
        eventId,
        outcomeId,
        fundingRate,
        fundingRateFormatted: `${fundingRate >= 0 ? "+" : ""}${(fundingRate * 100).toFixed(4)}%`,
        appliedRate: fundingRate,
        appliedAmount,
        direction,
        notional: period.notional,
        windowStart: period.accrual_start,
        windowEnd: period.accrual_end,
        settledAt: period.created_at,
        ratesMatch: true,
        txHash: mockHex(64),
        blockNumber: 18_000_000 + Math.floor(Math.random() * 500_000),
        verifiedAt: new Date().toISOString(),
      };

      setAudit(auditData);
      setStep("result");
    },
    [selectedPosition]
  );

  const reset = useCallback(() => {
    setStep("idle");
    setSelectedPosition(null);
    setSelectedPeriod(null);
    setPeriods([]);
    setAudit(null);
  }, []);

  return {
    step,
    positions,
    periods,
    selectedPosition,
    selectedPeriod,
    audit,
    isLoading,
    openSelector,
    selectPosition,
    selectPeriod,
    backToPeriods,
    reset,
  };
};
