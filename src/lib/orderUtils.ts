import { Order } from "@/stores/useOrdersStore";
import { Position } from "@/stores/usePositionsStore";

// Check if option is "No" for binary events
const isNoOption = (optionLabel: string): boolean => {
  return optionLabel.toLowerCase() === "no";
};

// Convert an Order to a Position when the order is filled
export function orderToPosition(order: Order): Position {
  // Parse the price value (remove $ and commas)
  const priceValue = order.price.replace(/[$,]/g, '');
  const amountValue = order.amount.replace(/,/g, '');
  
  // Calculate margin (simplified: total / leverage)
  const totalValue = order.total.replace(/[$,]/g, '');
  const leverage = 10; // Default leverage
  const margin = (parseFloat(totalValue) / leverage).toFixed(2);
  
  // Mark price is slightly different from entry price to simulate market movement
  const entryPrice = parseFloat(priceValue);
  const markPriceAdjustment = order.type === 'buy' 
    ? 1 + (Math.random() * 0.02 - 0.005) // +/- small percentage for buy
    : 1 + (Math.random() * 0.02 - 0.015); // +/- small percentage for sell
  const markPrice = (entryPrice * markPriceAdjustment).toFixed(4);
  
  // Calculate initial PnL based on price difference
  const priceDiff = parseFloat(markPrice) - entryPrice;
  const size = parseFloat(amountValue);
  const pnl = order.type === 'buy' ? priceDiff * size : -priceDiff * size;
  const pnlPercent = ((pnl / parseFloat(totalValue)) * 100);
  
  // Apply binary event conversion: No Long → Yes Short, No Short → Yes Long
  const isNo = isNoOption(order.option);
  const positionOption = isNo ? "Yes" : order.option;
  const positionType: "long" | "short" = isNo 
    ? (order.type === 'buy' ? 'short' : 'long')  // Flip for No options
    : (order.type === 'buy' ? 'long' : 'short');
  
  return {
    type: positionType,
    event: order.event,
    option: positionOption,
    entryPrice: order.price,
    markPrice: `$${markPrice}`,
    size: order.amount,
    margin: `$${margin}`,
    pnl: `${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toFixed(2)}`,
    pnlPercent: `${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(1)}%`,
    leverage: `${leverage}x`,
    tp: '',
    sl: '',
    tpMode: '%',
    slMode: '%',
  };
}
