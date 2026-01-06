import { supabase } from "@/integrations/supabase/client";

export interface TradeData {
  eventName: string;
  optionLabel: string;
  side: "buy" | "sell";
  orderType: "Market" | "Limit";
  price: number;
  amount: number;
  quantity: number;
  leverage: number;
  margin: number;
  fee: number;
  tpValue?: number;
  tpMode?: "%" | "$";
  slValue?: number;
  slMode?: "%" | "$";
}

export interface PositionData {
  tradeId: string;
  eventName: string;
  optionLabel: string;
  side: "long" | "short";
  entryPrice: number;
  markPrice: number;
  size: number;
  margin: number;
  leverage: number;
  tpValue?: number;
  tpMode?: "%" | "$";
  slValue?: number;
  slMode?: "%" | "$";
}

// Create a new trade and position
export const executeTrade = async (userId: string, tradeData: TradeData) => {
  try {
    // Insert trade record
    const { data: trade, error: tradeError } = await supabase
      .from("trades")
      .insert({
        user_id: userId,
        event_name: tradeData.eventName,
        option_label: tradeData.optionLabel,
        side: tradeData.side,
        order_type: tradeData.orderType,
        price: tradeData.price,
        amount: tradeData.amount,
        quantity: tradeData.quantity,
        leverage: tradeData.leverage,
        margin: tradeData.margin,
        fee: tradeData.fee,
        status: "Filled", // Market orders fill immediately
        tp_value: tradeData.tpValue,
        tp_mode: tradeData.tpMode,
        sl_value: tradeData.slValue,
        sl_mode: tradeData.slMode,
      })
      .select()
      .single();

    if (tradeError) {
      console.error("Trade error:", tradeError);
      throw tradeError;
    }

    // Create corresponding position
    const positionSide = tradeData.side === "buy" ? "long" : "short";
    
    const { data: position, error: positionError } = await supabase
      .from("positions")
      .insert({
        user_id: userId,
        trade_id: trade.id,
        event_name: tradeData.eventName,
        option_label: tradeData.optionLabel,
        side: positionSide,
        entry_price: tradeData.price,
        mark_price: tradeData.price, // Initially same as entry
        size: tradeData.quantity,
        margin: tradeData.margin,
        leverage: tradeData.leverage,
        pnl: 0,
        pnl_percent: 0,
        tp_value: tradeData.tpValue,
        tp_mode: tradeData.tpMode,
        sl_value: tradeData.slValue,
        sl_mode: tradeData.slMode,
        status: "Open",
      })
      .select()
      .single();

    if (positionError) {
      console.error("Position error:", positionError);
      throw positionError;
    }

    return { trade, position };
  } catch (error) {
    console.error("Execute trade error:", error);
    throw error;
  }
};

// Get user's trades
export const getUserTrades = async (userId: string) => {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Get user's open positions
export const getUserPositions = async (userId: string) => {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "Open")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Close a position
export const closePosition = async (
  userId: string, 
  positionId: string, 
  closePrice: number,
  pnl: number
) => {
  try {
    // Update position status
    const { error: positionError } = await supabase
      .from("positions")
      .update({
        status: "Closed",
        mark_price: closePrice,
        pnl: pnl,
        closed_at: new Date().toISOString(),
      })
      .eq("id", positionId)
      .eq("user_id", userId);

    if (positionError) throw positionError;

    // Get the position to find the trade
    const { data: position } = await supabase
      .from("positions")
      .select("trade_id, margin")
      .eq("id", positionId)
      .single();

    // Update corresponding trade
    if (position?.trade_id) {
      await supabase
        .from("trades")
        .update({
          status: "Closed",
          pnl: pnl,
          closed_at: new Date().toISOString(),
        })
        .eq("id", position.trade_id);
    }

    // Return margin + PnL to be added back to balance
    return (position?.margin || 0) + pnl;
  } catch (error) {
    console.error("Close position error:", error);
    throw error;
  }
};

// Update balance in profile
export const updateUserBalance = async (userId: string, newBalance: number) => {
  const { error } = await supabase
    .from("profiles")
    .update({ trial_balance: newBalance })
    .eq("user_id", userId);

  if (error) throw error;
  return true;
};
