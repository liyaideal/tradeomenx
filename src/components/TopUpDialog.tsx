import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, CreditCard, Building, Copy, Check } from "lucide-react";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onTopUp?: (amount: number, method: string) => void;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const DEPOSIT_ADDRESS = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12";

export function TopUpDialog({ open, onOpenChange, currentBalance, onTopUp }: TopUpDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("crypto");
  const [copied, setCopied] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopUp = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && onTopUp) {
      onTopUp(numAmount, selectedMethod);
      setAmount("");
      onOpenChange(false);
    }
  };

  const methods = [
    { id: "crypto", label: "Crypto", icon: Wallet, description: "Deposit USDC directly" },
    { id: "card", label: "Card", icon: CreditCard, description: "Visa, Mastercard" },
    { id: "bank", label: "Bank", icon: Building, description: "Wire transfer" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Top Up Balance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-2">
          {/* Current Balance */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Current Balance</div>
            <div className="text-2xl font-mono font-semibold">{currentBalance.toLocaleString()} <span className="text-sm text-muted-foreground">USDC</span></div>
          </div>

          {/* Deposit Method */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Deposit Method</label>
            <div className="grid grid-cols-3 gap-2">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <method.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Crypto Deposit Address */}
          {selectedMethod === "crypto" && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">USDC Deposit Address (Ethereum)</label>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                <code className="flex-1 text-xs font-mono truncate">{DEPOSIT_ADDRESS}</code>
                <button
                  onClick={handleCopyAddress}
                  className="p-1.5 rounded hover:bg-muted-foreground/20 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-trading-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Send USDC to this address. Funds will appear after network confirmation.
              </p>
            </div>
          )}

          {/* Amount Input (for Card/Bank) */}
          {selectedMethod !== "crypto" && (
            <>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Amount (USDC)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="font-mono text-lg h-12"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {QUICK_AMOUNTS.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                      amount === value.toString()
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>

              {/* Fee Info */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-mono">${amount || "0.00"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fee (2.5%)</span>
                  <span className="font-mono">${amount ? (parseFloat(amount) * 0.025).toFixed(2) : "0.00"}</span>
                </div>
                <div className="border-t border-border/50 pt-1 mt-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>You receive</span>
                    <span className="font-mono">${amount ? (parseFloat(amount) * 0.975).toFixed(2) : "0.00"} USDC</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleTopUp}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full h-11 bg-trading-green hover:bg-trading-green/90 text-background font-medium"
              >
                {selectedMethod === "card" ? "Pay with Card" : "Continue to Bank Transfer"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
