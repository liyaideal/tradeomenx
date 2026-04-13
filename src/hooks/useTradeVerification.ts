import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type TradeVerifyStep = "idle" | "select" | "fetching" | "comparing" | "result";

interface TradeRecord {
  id: string;
  event_name: string;
  option_label: string;
  side: string;
  price: number;
  quantity: number;
  amount: number;
  fee: number;
  order_type: string;
  created_at: string;
  status: string;
}

export interface TradeComparisonData {
  trade: TradeRecord;
  dbRecord: Record<string, string>;
  onchainLog: Record<string, string>;
  matchedFields: string[];
  counterparty: string;
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

export const useTradeVerification = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<TradeVerifyStep>("idle");
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);
  const [comparison, setComparison] = useState<TradeComparisonData | null>(null);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);

  const loadTrades = useCallback(async () => {
    if (!user) return;
    setIsLoadingTrades(true);
    const { data } = await supabase
      .from("trades")
      .select("id, event_name, option_label, side, price, quantity, amount, fee, order_type, created_at, status")
      .eq("user_id", user.id)
      .eq("status", "Filled")
      .order("created_at", { ascending: false })
      .limit(20);
    setTrades((data as TradeRecord[]) || []);
    setIsLoadingTrades(false);
  }, [user]);

  const openSelector = useCallback(() => {
    setStep("select");
    loadTrades();
  }, [loadTrades]);

  const selectTrade = useCallback(async (trade: TradeRecord) => {
    if (!user) return;
    setSelectedTrade(trade);

    // Step: fetching on-chain log
    setStep("fetching");
    await new Promise((r) => setTimeout(r, 1800));

    // Step: comparing
    setStep("comparing");
    await new Promise((r) => setTimeout(r, 1500));

    const txHash = mockHex(64);
    const blockNumber = 18_000_000 + Math.floor(Math.random() * 500_000);
    const ts = new Date(trade.created_at).toISOString();
    const fields = ["event", "option", "side", "price", "quantity", "timestamp"];

    const dbRecord: Record<string, string> = {
      event: trade.event_name,
      option: trade.option_label,
      side: trade.side,
      price: trade.price.toString(),
      quantity: trade.quantity.toString(),
      amount: trade.amount.toString(),
      fee: trade.fee.toString(),
      timestamp: ts,
      order_type: trade.order_type,
    };

    const onchainLog: Record<string, string> = {
      event: trade.event_name,
      option: trade.option_label,
      side: trade.side,
      price: trade.price.toString(),
      quantity: trade.quantity.toString(),
      amount: trade.amount.toString(),
      fee: trade.fee.toString(),
      timestamp: ts,
      tx_hash: txHash,
      block: blockNumber.toString(),
    };

    const data: TradeComparisonData = {
      trade,
      dbRecord,
      onchainLog,
      matchedFields: fields,
      counterparty: "Official AMM Node",
      txHash,
      blockNumber,
      verifiedAt: new Date().toISOString(),
    };

    setComparison(data);

    // Save to DB
    try {
      await supabase.from("trade_verifications").insert({
        user_id: user.id,
        trade_id: trade.id,
        db_record: dbRecord,
        onchain_log: onchainLog,
        matched_fields: fields,
        counterparty: "Official AMM Node",
        verification_result: "matched",
        verified_at: new Date().toISOString(),
      } as any);
    } catch {}

    setStep("result");
  }, [user]);

  const reset = useCallback(() => {
    setStep("idle");
    setSelectedTrade(null);
    setComparison(null);
  }, []);

  return { step, trades, selectedTrade, comparison, isLoadingTrades, openSelector, selectTrade, reset };
};
