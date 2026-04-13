import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type FundingRateStep = "idle" | "select" | "fetching" | "comparing" | "result";

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

export interface FundingRateAuditData {
  position: PositionRecord;
  // On-chain FundingRate event fields
  eventId: string;
  outcomeId: number;
  fundingRate: number; // signed: positive = longs pay shorts
  fundingRateFormatted: string;
  // What was applied to user
  appliedRate: number;
  appliedAmount: number; // absolute USDC amount
  direction: "paid" | "received";
  // Verification
  ratesMatch: boolean;
  txHash: string;
  blockNumber: number;
  timestamp: string;
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

  const openSelector = useCallback(() => {
    setStep("select");
    loadPositions();
  }, [loadPositions]);

  const selectPosition = useCallback(async (pos: PositionRecord) => {
    setSelectedPosition(pos);

    setStep("fetching");
    await new Promise((r) => setTimeout(r, 1600));
    setStep("comparing");
    await new Promise((r) => setTimeout(r, 1400));

    // Simulate realistic funding rate: between -0.03% and +0.03%
    const fundingRate = parseFloat(((Math.random() - 0.5) * 0.06).toFixed(6));
    const isLong = pos.side === "long";
    // Longs pay when rate is positive, receive when negative
    const direction: "paid" | "received" = (isLong && fundingRate > 0) || (!isLong && fundingRate < 0) ? "paid" : "received";
    const notionalValue = pos.size * pos.entry_price;
    const appliedAmount = parseFloat(Math.abs(notionalValue * fundingRate).toFixed(4));

    const eventId = `EVT-${Math.floor(Math.random() * 90000) + 10000}`;
    const outcomeId = Math.floor(Math.random() * 4);

    const auditData: FundingRateAuditData = {
      position: pos,
      eventId,
      outcomeId,
      fundingRate,
      fundingRateFormatted: `${fundingRate >= 0 ? "+" : ""}${(fundingRate * 100).toFixed(4)}%`,
      appliedRate: fundingRate,
      appliedAmount,
      direction,
      ratesMatch: true,
      txHash: mockHex(64),
      blockNumber: 18_000_000 + Math.floor(Math.random() * 500_000),
      timestamp: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    setAudit(auditData);
    setStep("result");
  }, []);

  const reset = useCallback(() => {
    setStep("idle");
    setSelectedPosition(null);
    setAudit(null);
  }, []);

  return { step, positions, selectedPosition, audit, isLoading, openSelector, selectPosition, reset };
};
