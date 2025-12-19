import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

export const TradeForm = () => {
  const navigate = useNavigate();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [marginType, setMarginType] = useState("Cross");
  const [leverage, setLeverage] = useState("10x");
  const [orderType, setOrderType] = useState("Market");
  const [amount, setAmount] = useState("0.00");
  const [sliderValue, setSliderValue] = useState([0]);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpsl, setTpsl] = useState(false);

  const available = 2453.42;

  const handlePreview = () => {
    navigate("/order-preview", {
      state: {
        side,
        marginType,
        leverage,
        orderType,
        amount,
        price: "0.7234",
      },
    });
  };

  return (
    <div className="px-4 pb-4 space-y-3">
      {/* Buy/Sell Toggle */}
      <div className="flex bg-muted rounded-lg p-1">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
            side === "buy"
              ? "bg-trading-green text-trading-green-foreground"
              : "text-muted-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
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
          {leverage}
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
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Order type</span>
        <button className="w-full flex items-center justify-between px-3 py-2.5 bg-muted rounded-lg text-sm">
          <span>{orderType}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Amount</span>
          <button className="text-muted-foreground text-xs">⇄</button>
        </div>
        <div className="flex items-center bg-muted rounded-lg px-3 py-2.5">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none font-mono text-sm"
            placeholder="0.00"
          />
          <span className="text-muted-foreground text-xs font-medium">USDC</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
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
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Notional val.</span>
          <span className="text-muted-foreground">--</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Margin req.</span>
          <span className="text-muted-foreground">--</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee (est.)</span>
          <span className="text-muted-foreground">--</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border/30">
          <span className="font-medium text-foreground">Total</span>
          <span className="text-muted-foreground">--</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handlePreview}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
          side === "buy"
            ? "bg-trading-green text-trading-green-foreground"
            : "bg-trading-red text-foreground"
        }`}
      >
        Preview {side} order
      </button>
    </div>
  );
};