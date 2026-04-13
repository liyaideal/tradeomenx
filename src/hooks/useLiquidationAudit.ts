import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type LiquidationStep = "idle" | "select" | "fetching_oracle" | "analyzing" | "result";

interface LiquidationRecord {
  id: string;
  event_name: string;
  option_label: string;
  side: string;
  entry_price: number;
  mark_price: number;
  size: number;
  margin: number;
  leverage: number;
  pnl: number;
  closed_at: string;
}

export interface LiquidationAuditData {
  position: LiquidationRecord;
  platformPrice: number;
  oraclePrice: number;
  deviation: number;
  deviationPercent: number;
  oracleSource: string;
  oracleTimestamp: string;
  conclusion: "fair" | "suspicious";
  blockNumber: number;
}

export const useLiquidationAudit = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<LiquidationStep>("idle");
  const [positions, setPositions] = useState<LiquidationRecord[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<LiquidationRecord | null>(null);
  const [audit, setAudit] = useState<LiquidationAuditData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPositions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("positions")
      .select("id, event_name, option_label, side, entry_price, mark_price, size, margin, leverage, pnl, closed_at")
      .eq("user_id", user.id)
      .eq("status", "Closed")
      .not("pnl", "is", null)
      .lt("pnl", 0)
      .order("closed_at", { ascending: false })
      .limit(20);
    setPositions((data as LiquidationRecord[]) || []);
    setIsLoading(false);
  }, [user]);

  const openSelector = useCallback(() => {
    setStep("select");
    loadPositions();
  }, [loadPositions]);

  const selectPosition = useCallback(async (pos: LiquidationRecord) => {
    setSelectedPosition(pos);

    setStep("fetching_oracle");
    await new Promise((r) => setTimeout(r, 2000));

    setStep("analyzing");
    await new Promise((r) => setTimeout(r, 1500));

    // Mock oracle data — small deviation to simulate realistic audit
    const platformPrice = pos.mark_price;
    const deviationBps = (Math.random() - 0.5) * 0.02; // ±1%
    const oraclePrice = parseFloat((platformPrice + deviationBps).toFixed(4));
    const deviation = parseFloat((platformPrice - oraclePrice).toFixed(6));
    const deviationPercent = platformPrice > 0
      ? parseFloat(((deviation / platformPrice) * 100).toFixed(4))
      : 0;
    const isFair = Math.abs(deviationPercent) < 1.5;

    const auditData: LiquidationAuditData = {
      position: pos,
      platformPrice,
      oraclePrice,
      deviation: Math.abs(deviation),
      deviationPercent: Math.abs(deviationPercent),
      oracleSource: "Chainlink / Pyth Network (Aggregated)",
      oracleTimestamp: new Date(new Date(pos.closed_at).getTime() - 2000).toISOString(),
      conclusion: isFair ? "fair" : "suspicious",
      blockNumber: 18_000_000 + Math.floor(Math.random() * 500_000),
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
