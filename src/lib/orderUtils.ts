import { Order } from "@/stores/useOrdersStore";
import { Position } from "@/stores/usePositionsStore";

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
  
  return {
    type: order.type === 'buy' ? 'long' : 'short',
    event: order.event,
    option: order.option,
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
