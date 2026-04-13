import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type LiquidationStep = "idle" | "select" | "fetching_chain" | "fetching_oracle" | "analyzing" | "result";

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
  // Module A: on-chain snapshot
  onchainMarkPrice: number;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  liquidatedAt: string;
  // Module B: oracle fair price
  oraclePrice: number;
  oracleSource: string;
  oracleTimestamp: string;
  oracleFeedAddress: string;
  // Analysis
  deviation: number;
  deviationPercent: number;
  marginRatio: number;
  maintenanceMarginRate: number;
  conclusion: "fair" | "suspicious";
}

const mockHex = (len: number) => {
  const chars = "0123456789abcdef";
  let r = "0x";
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * 16)];
  return r;
};

const CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

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

    // Step 1: fetch on-chain log
    setStep("fetching_chain");
    await new Promise((r) => setTimeout(r, 1600));

    // Step 2: fetch oracle
    setStep("fetching_oracle");
    await new Promise((r) => setTimeout(r, 1800));

    // Step 3: analyze
    setStep("analyzing");
    await new Promise((r) => setTimeout(r, 1200));

    // Mock data
    const onchainMarkPrice = pos.mark_price;
    const deviationBps = (Math.random() - 0.3) * 0.008; // slight bias toward small deviation
    const oraclePrice = parseFloat((onchainMarkPrice + deviationBps).toFixed(4));
    const deviation = Math.abs(onchainMarkPrice - oraclePrice);
    const deviationPercent = onchainMarkPrice > 0
      ? parseFloat(((deviation / onchainMarkPrice) * 100).toFixed(4))
      : 0;

    // Simulate margin ratio that breached maintenance margin
    const maintenanceMarginRate = 5; // 5%
    const marginRatio = parseFloat((2 + Math.random() * 3).toFixed(2)); // 2-5%, breached

    const txHash = mockHex(64);
    const blockNumber = 18_000_000 + Math.floor(Math.random() * 500_000);
    const liquidatedAt = pos.closed_at;
    const oracleTimestamp = new Date(new Date(pos.closed_at).getTime() - 1500).toISOString();

    const isFair = deviationPercent < 1.5;

    const auditData: LiquidationAuditData = {
      position: pos,
      onchainMarkPrice,
      txHash,
      blockNumber,
      contractAddress: CONTRACT_ADDRESS,
      liquidatedAt,
      oraclePrice,
      oracleSource: "Chainlink / Pyth Network (Aggregated)",
      oracleTimestamp,
      oracleFeedAddress: mockHex(40),
      deviation: parseFloat(deviation.toFixed(6)),
      deviationPercent,
      marginRatio,
      maintenanceMarginRate,
      conclusion: isFair ? "fair" : "suspicious",
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
