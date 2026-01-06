import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Maximum allowed leverage
const MAX_LEVERAGE = 100;
const MIN_LEVERAGE = 1;
const FEE_RATE = 0.0005; // 0.05% fee rate (must match TradeForm)

// Zod schema for trade data validation
const TradeDataSchema = z.object({
  eventName: z.string().min(1, "Event name is required").max(200, "Event name too long"),
  optionLabel: z.string().min(1, "Option label is required").max(200, "Option label too long"),
  side: z.enum(["buy", "sell"], { errorMap: () => ({ message: "Invalid side" }) }),
  orderType: z.enum(["Market", "Limit"], { errorMap: () => ({ message: "Invalid order type" }) }),
  price: z.number().positive("Price must be positive").max(1000000, "Price exceeds maximum"),
  amount: z.number().positive("Amount must be positive").max(10000000, "Amount exceeds maximum"),
  quantity: z.number().positive("Quantity must be positive").max(100000000, "Quantity exceeds maximum"),
  leverage: z.number().int("Leverage must be an integer").min(MIN_LEVERAGE).max(MAX_LEVERAGE, `Leverage cannot exceed ${MAX_LEVERAGE}x`),
  margin: z.number().positive("Margin must be positive"),
  fee: z.number().nonnegative("Fee cannot be negative").max(10000, "Fee exceeds maximum"),
  tpValue: z.number().positive("Take profit must be positive").optional(),
  tpMode: z.enum(["%", "$"]).optional(),
  slValue: z.number().positive("Stop loss must be positive").optional(),
  slMode: z.enum(["%", "$"]).optional(),
});

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

// Validate margin calculation
const validateMarginCalculation = (price: number, quantity: number, leverage: number, providedMargin: number): boolean => {
  const expectedMargin = (price * quantity) / leverage;
  // Allow 1% tolerance for rounding differences
  const tolerance = expectedMargin * 0.01;
  return Math.abs(providedMargin - expectedMargin) <= Math.max(tolerance, 0.01);
};

// Validate fee calculation (fee is based on notional value = amount * leverage)
const validateFeeCalculation = (amount: number, leverage: number, providedFee: number): boolean => {
  const notionalValue = amount * leverage;
  const expectedFee = notionalValue * FEE_RATE;
  // Allow 5% tolerance for rounding differences
  const tolerance = expectedFee * 0.05;
  return Math.abs(providedFee - expectedFee) <= Math.max(tolerance, 0.01);
};

// Create a new trade and position with validation
export const executeTrade = async (userId: string, tradeData: TradeData) => {
  try {
    // Step 1: Validate input schema
    const validationResult = TradeDataSchema.safeParse(tradeData);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(e => e.message).join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    
    const validated = validationResult.data;
    
    // Step 2: Validate business logic - margin calculation
    if (!validateMarginCalculation(validated.price, validated.quantity, validated.leverage, validated.margin)) {
      throw new Error("Invalid margin calculation. Please try again.");
    }
    
    // Step 3: Validate business logic - fee calculation (based on notional value)
    if (!validateFeeCalculation(validated.amount, validated.leverage, validated.fee)) {
      throw new Error("Invalid fee calculation. Please try again.");
    }
    
    // Step 4: Additional sanity checks
    if (validated.leverage > MAX_LEVERAGE) {
      throw new Error(`Leverage cannot exceed ${MAX_LEVERAGE}x`);
    }
    
    // Validate TP/SL values if provided
    if (validated.tpValue !== undefined && validated.tpMode === undefined) {
      throw new Error("Take profit mode is required when take profit value is set");
    }
    if (validated.slValue !== undefined && validated.slMode === undefined) {
      throw new Error("Stop loss mode is required when stop loss value is set");
    }

    // Insert trade record with validated data
    const { data: trade, error: tradeError } = await supabase
      .from("trades")
      .insert({
        user_id: userId,
        event_name: validated.eventName,
        option_label: validated.optionLabel,
        side: validated.side,
        order_type: validated.orderType,
        price: validated.price,
        amount: validated.amount,
        quantity: validated.quantity,
        leverage: validated.leverage,
        margin: validated.margin,
        fee: validated.fee,
        status: "Filled",
        tp_value: validated.tpValue,
        tp_mode: validated.tpMode,
        sl_value: validated.slValue,
        sl_mode: validated.slMode,
      })
      .select()
      .single();

    if (tradeError) {
      console.error("Trade error:", tradeError);
      throw tradeError;
    }

    // Create corresponding position with validated data
    const positionSide = validated.side === "buy" ? "long" : "short";
    
    const { data: position, error: positionError } = await supabase
      .from("positions")
      .insert({
        user_id: userId,
        trade_id: trade.id,
        event_name: validated.eventName,
        option_label: validated.optionLabel,
        side: positionSide,
        entry_price: validated.price,
        mark_price: validated.price,
        size: validated.quantity,
        margin: validated.margin,
        leverage: validated.leverage,
        pnl: 0,
        pnl_percent: 0,
        tp_value: validated.tpValue,
        tp_mode: validated.tpMode,
        sl_value: validated.slValue,
        sl_mode: validated.slMode,
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
