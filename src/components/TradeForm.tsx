import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
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
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Buy/Sell Toggle */}
      <div className="flex bg-muted rounded-xl p-1">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            side === "buy"
              ? "bg-trading-green text-trading-green-foreground"
              : "text-muted-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            side === "sell"
              ? "bg-trading-red text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Margin & Leverage */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Margin / LVG</span>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-sm">
          {marginType}
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-sm">
          {leverage}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Available Balance */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Available (USDC)</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{available.toLocaleString()}</span>
          <button className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Order Type */}
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Order type</span>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-xl">
          <span>{orderType}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Amount</span>
          <button className="text-muted-foreground">⇄</button>
        </div>
        <div className="flex items-center bg-muted rounded-xl px-4 py-3">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none font-mono text-lg"
            placeholder="0.00"
          />
          <span className="text-muted-foreground font-medium">USDC</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-3">
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
        <div className="flex justify-between text-xs text-muted-foreground">
          {["0%", "25%", "50%", "75%", "100%"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={reduceOnly}
            onChange={(e) => setReduceOnly(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-muted accent-trading-purple"
          />
          <span className="text-sm text-muted-foreground">Reduce only</span>
          <span className="w-4 h-4 rounded-full bg-muted text-xs flex items-center justify-center text-muted-foreground">?</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={tpsl}
            onChange={(e) => setTpsl(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-muted accent-trading-purple"
          />
          <span className="text-sm text-muted-foreground">TP/SL</span>
        </label>
      </div>

      {/* Order Summary */}
      <div className="space-y-2 text-sm">
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
          <span className="font-medium">Total</span>
          <span className="text-muted-foreground">--</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handlePreview}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.98] ${
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
