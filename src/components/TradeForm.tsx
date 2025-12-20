import { useState, useMemo } from "react";
import { ChevronDown, Plus, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

interface TradeFormProps {
  selectedPrice?: string;
}

export const TradeForm = ({ selectedPrice = "0.1234" }: TradeFormProps) => {
  const navigate = useNavigate();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [marginType, setMarginType] = useState("Cross");
  const [leverage, setLeverage] = useState(10);
  const [orderType, setOrderType] = useState("Market");
  const [amount, setAmount] = useState("0.00");
  const [sliderValue, setSliderValue] = useState([0]);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpsl, setTpsl] = useState(false);
  const [inputMode, setInputMode] = useState<"amount" | "qty">("amount");

  const available = 2453.42;
  const feeRate = 0.0005; // 0.05% trading fee

  // Calculate order values based on amount and leverage
  const orderCalculations = useMemo(() => {
    const amountValue = parseFloat(amount) || 0;
    const price = parseFloat(selectedPrice);
    
    // Notional value = amount * leverage
    const notionalValue = amountValue * leverage;
    
    // Margin required = amount (same as input)
    const marginRequired = amountValue;
    
    // Estimated fee = notional value * fee rate
    const estimatedFee = notionalValue * feeRate;
    
    // Total = margin required + fee
    const total = marginRequired + estimatedFee;
    
    // Quantity = notional value / price
    const quantity = price > 0 ? notionalValue / price : 0;
    
    // Potential win = (1 - price) * quantity (if price goes to 1)
    const potentialWin = (1 - price) * quantity;
    
    // Estimated liquidation price
    const liqPrice = price > 0 ? (price * (1 - 1 / leverage * 0.9)).toFixed(4) : "0.0000";
    
    return {
      notionalValue: notionalValue.toFixed(2),
      marginRequired: marginRequired.toFixed(2),
      estimatedFee: estimatedFee.toFixed(2),
      total: total.toFixed(2),
      quantity: quantity.toFixed(0),
      potentialWin: potentialWin.toFixed(0),
      liqPrice,
    };
  }, [amount, leverage, selectedPrice]);

  const handlePreview = () => {
    navigate("/order-preview", {
      state: {
        side,
        marginType,
        leverage: `${leverage}x`,
        orderType,
        amount,
        price: selectedPrice,
        orderCalculations,
      },
    });
  };

  return (
    <div className="px-3 pb-2 space-y-2">
      {/* Buy/Sell Toggle */}
      <div className="flex bg-muted rounded-lg p-0.5">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-all duration-200 ${
            side === "buy"
              ? "bg-trading-green text-trading-green-foreground"
              : "text-muted-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-all duration-200 ${
            side === "sell"
              ? "bg-trading-red text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Margin & Leverage */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Margin / LVG</span>
        <button className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
          {marginType}
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
          {leverage}x
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Available Balance */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Available (USDC)</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{available.toLocaleString()}</span>
          <button className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Order Type */}
      <div className="space-y-0.5">
        <span className="text-[10px] text-muted-foreground">Order type</span>
        <button className="w-full flex items-center justify-between px-2.5 py-2 bg-muted rounded-lg text-xs">
          <span>{orderType}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Amount/Qty Input */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">
            {inputMode === "amount" ? "Amount" : "Qty"}
          </span>
          <button 
            onClick={() => setInputMode(inputMode === "amount" ? "qty" : "amount")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center bg-muted rounded-lg px-2.5 py-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none font-mono text-xs"
            placeholder="0.00"
          />
          {inputMode === "amount" && (
            <span className="text-muted-foreground text-[10px] font-medium">USDC</span>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <Slider
          value={sliderValue}
          onValueChange={(val) => {
            setSliderValue(val);
            setAmount((available * val[0] / 100).toFixed(2));
          }}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          {["0%", "25%", "50%", "75%", "100%"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${reduceOnly ? 'bg-trading-purple border-trading-purple' : 'border-muted-foreground'}`}>
            {reduceOnly && <span className="text-[10px] text-foreground">✓</span>}
          </div>
          <input
            type="checkbox"
            checked={reduceOnly}
            onChange={(e) => setReduceOnly(e.target.checked)}
            className="hidden"
          />
          <span className="text-xs text-muted-foreground">Reduce only</span>
          <span className="w-3.5 h-3.5 rounded-full bg-muted text-[9px] flex items-center justify-center text-muted-foreground">?</span>
        </label>
      </div>
      
      <label className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${tpsl ? 'bg-trading-purple border-trading-purple' : 'border-muted-foreground'}`}>
          {tpsl && <span className="text-[10px] text-foreground">✓</span>}
        </div>
        <input
          type="checkbox"
          checked={tpsl}
          onChange={(e) => setTpsl(e.target.checked)}
          className="hidden"
        />
        <span className="text-xs text-muted-foreground">TP/SL</span>
      </label>

      {/* Order Summary */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Notional val.</span>
          <span className={parseFloat(amount) > 0 ? "text-foreground font-mono" : "text-muted-foreground"}>
            {parseFloat(amount) > 0 ? `${orderCalculations.notionalValue} USDC` : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Margin req.</span>
          <span className={parseFloat(amount) > 0 ? "text-foreground font-mono" : "text-muted-foreground"}>
            {parseFloat(amount) > 0 ? `${orderCalculations.marginRequired} USDC` : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee (est.)</span>
          <span className={parseFloat(amount) > 0 ? "text-foreground font-mono" : "text-muted-foreground"}>
            {parseFloat(amount) > 0 ? `${orderCalculations.estimatedFee} USDC` : "--"}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border/30">
          <span className="font-medium text-foreground">Total</span>
          <span className={parseFloat(amount) > 0 ? "text-foreground font-mono font-medium" : "text-muted-foreground"}>
            {parseFloat(amount) > 0 ? `${orderCalculations.total} USDC` : "--"}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handlePreview}
        className={`w-full py-2 rounded-lg font-semibold text-xs transition-all duration-200 active:scale-[0.98] ${
          side === "buy"
            ? "bg-trading-green text-trading-green-foreground"
            : "bg-trading-red text-foreground"
        }`}
      >
        {side === "buy" ? "Buy Long" : "Sell Short"} - to win $ {parseFloat(amount) > 0 ? parseInt(orderCalculations.potentialWin).toLocaleString() : "0"}
      </button>
    </div>
  );
};