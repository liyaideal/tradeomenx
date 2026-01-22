import { useState } from "react";
import { ChevronDown, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { TRADING_TERMS } from "@/lib/tradingTerms";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface DesktopTradeFormProps {
  selectedPrice?: string;
  symbol?: string;
}

export const DesktopTradeForm = ({ selectedPrice = "0.1234", symbol = "BTC" }: DesktopTradeFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [marginType, setMarginType] = useState("Cross");
  const [leverage, setLeverage] = useState("10.00x");
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Conditional">("Limit");
  const [price, setPrice] = useState(selectedPrice);
  const [quantity, setQuantity] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"signin" | "signup">("signup");

  const handlePreview = (side: "buy" | "sell") => {
    // Check if user is logged in first
    if (!user) {
      setAuthDefaultTab("signup");
      setAuthDialogOpen(true);
      return;
    }
    
    navigate("/order-preview", {
      state: {
        side,
        marginType,
        leverage,
        orderType,
        amount: quantity,
        price,
      },
    });
  };

  const handleAuth = (type: "signin" | "signup") => {
    setAuthDefaultTab(type);
    setAuthDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <span className="text-sm font-medium text-foreground">Trade</span>
        <div className="flex items-center gap-2">
          <button className="p-1 text-muted-foreground hover:text-foreground">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="11" y="3" width="6" height="6" rx="1" />
              <rect x="3" y="11" width="6" height="6" rx="1" />
              <rect x="11" y="11" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button className="p-1 text-muted-foreground hover:text-foreground">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="4" r="2" />
              <circle cx="10" cy="10" r="2" />
              <circle cx="10" cy="16" r="2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Margin & Leverage */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded text-xs font-medium">
            {marginType}
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded text-xs font-medium">
            {leverage}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Order Type Tabs */}
        <div className="flex border-b border-border/30">
          {(["Limit", "Market", "Conditional"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-3 py-2 text-sm font-medium transition-all ${
                orderType === type
                  ? "text-foreground border-b-2 border-trading-yellow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Price</span>
          </div>
          <div className="flex items-center bg-muted rounded-lg">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 bg-transparent outline-none font-mono text-sm px-3 py-2.5"
              placeholder="0.00"
            />
            <button className="px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground border-l border-border/30">
              Last
            </button>
            <button className="px-2 py-2.5 text-muted-foreground hover:text-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Quantity</span>
          <div className="flex items-center bg-muted rounded-lg">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 bg-transparent outline-none font-mono text-sm px-3 py-2.5"
              placeholder="0.00"
            />
            <button className="flex items-center gap-1 px-3 py-2.5 text-xs font-medium">
              {symbol}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span>100%</span>
          </div>
        </div>

        {/* Value & Cost */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Value</span>
            <span className="text-muted-foreground font-mono">-- / --USDT</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cost</span>
            <span className="text-muted-foreground font-mono">-- / --USDT</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {user ? (
            <>
              <button
                onClick={() => handlePreview("buy")}
                className="w-full py-2.5 rounded-lg font-semibold text-sm bg-trading-green text-trading-green-foreground transition-all duration-200 hover:opacity-90"
              >
                Buy Long
              </button>
              <button
                onClick={() => handlePreview("sell")}
                className="w-full py-2.5 rounded-lg font-semibold text-sm bg-trading-red text-foreground transition-all duration-200 hover:opacity-90"
              >
                Sell Short
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleAuth("signup")}
                className="w-full py-2.5 rounded-lg font-semibold text-sm bg-trading-yellow text-background transition-all duration-200 hover:opacity-90"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleAuth("signin")}
                className="w-full py-2.5 rounded-lg font-semibold text-sm bg-muted text-foreground border border-border/50 transition-all duration-200 hover:bg-muted/80"
              >
                Log In
              </button>
              <button className="w-full text-center text-sm text-trading-yellow hover:underline">
                Demo Trading
              </button>
            </>
          )}
        </div>

        {/* Calculator */}
        <div className="flex items-center gap-2 pt-2">
          <Calculator className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Calculator</span>
        </div>
      </div>

      {/* Contract Details */}
      <div className="px-4 py-3 border-t border-border/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Contract Details BTCUSDT</span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expiration Date</span>
            <span>Perpetual</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Index Price</span>
            <span className="font-mono">88,155.51</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{TRADING_TERMS.MARK_PRICE}</span>
            <span className="font-mono">88,132.18</span>
          </div>
        </div>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          Show
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Auth Dialog */}
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDefaultTab}
      />
    </div>
  );
};
