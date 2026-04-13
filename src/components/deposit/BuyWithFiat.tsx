import { useState } from 'react';
import { ChevronDown, CreditCard, Building2, Smartphone, Loader2, Check, X, Clock, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const FIAT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.53 },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, fee: '2.5%' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, fee: '1.0%' },
  { id: 'apple', label: 'Apple Pay', icon: Smartphone, fee: '2.5%' },
];

type Step = 'form' | 'checkout' | 'tracking' | 'result';

export const BuyWithFiat = () => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>('form');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [trackingStage, setTrackingStage] = useState(0);

  const selectedCurrency = FIAT_CURRENCIES.find(c => c.code === currency)!;
  const selectedPayment = PAYMENT_METHODS.find(p => p.id === paymentMethod)!;
  const parsedAmount = parseFloat(amount) || 0;
  const feePercent = paymentMethod === 'bank' ? 0.01 : 0.025;
  const fee = parsedAmount * feePercent;
  const usdcReceive = (parsedAmount - fee) / selectedCurrency.rate;

  const handleProceed = () => {
    setStep('checkout');
  };

  const handleCompletePayment = () => {
    setStep('tracking');
    setTrackingStage(0);
    // Mock 4-stage progress
    setTimeout(() => setTrackingStage(1), 1500);
    setTimeout(() => setTrackingStage(2), 3500);
    setTimeout(() => setTrackingStage(3), 5500);
    setTimeout(() => setStep('result'), 7000);
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setTrackingStage(0);
  };

  // Step 1: Form
  if (step === 'form') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        {/* Currency & Amount */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">You pay</label>
          <div className="flex gap-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-28 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIAT_CURRENCIES.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="mr-1">{c.flag}</span> {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="100.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 h-12 text-2xl font-mono"
            />
          </div>
        </div>

        {/* You receive */}
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">You receive</span>
            <span className="text-xs text-muted-foreground">on Base</span>
          </div>
          <div className="text-2xl font-mono font-semibold">
            {usdcReceive > 0 ? `~${usdcReceive.toFixed(2)}` : '0.00'} <span className="text-sm text-muted-foreground">USDC</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Payment method</label>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  )}
                >
                  <Icon className={cn("w-5 h-5", paymentMethod === method.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="flex-1 text-sm font-medium">{method.label}</span>
                  <span className="text-xs text-muted-foreground">{method.fee} fee</span>
                  {paymentMethod === method.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee breakdown */}
        {parsedAmount > 0 && (
          <div className="p-3 rounded-lg bg-muted/30 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing fee</span>
              <span className="font-mono">{selectedCurrency.flag} {fee.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exchange rate</span>
              <span className="font-mono">1 USDC = {selectedCurrency.rate.toFixed(2)} {currency}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleProceed}
          disabled={parsedAmount < 10}
          className={cn("w-full bg-primary hover:bg-primary-hover", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}
        >
          Continue to Payment
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Powered by <span className="font-semibold">Banxa</span> • Min. $10
        </p>
      </div>
    );
  }

  // Step 2: Mock Banxa Checkout
  if (step === 'checkout') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        {/* Banxa header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-xl bg-[#00D395]/10 mx-auto flex items-center justify-center">
            <span className="text-2xl font-bold text-[#00D395]">B</span>
          </div>
          <h3 className="text-lg font-semibold">Banxa Checkout</h3>
        </div>

        {/* Order summary */}
        <div className="p-4 rounded-xl border border-border/50 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-mono font-medium">{selectedCurrency.flag} {parsedAmount.toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-mono">{fee.toFixed(2)} {currency}</span>
          </div>
          <hr className="border-border/30" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span className="font-mono font-semibold text-trading-green">~{usdcReceive.toFixed(2)} USDC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span>{selectedPayment.label}</span>
          </div>
        </div>

        {/* KYC badge */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-trading-green/10 border border-trading-green/20">
          <Shield className="w-4 h-4 text-trading-green" />
          <span className="text-sm text-trading-green font-medium">KYC Verified</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
            Back
          </Button>
          <Button onClick={handleCompletePayment} className="flex-1 bg-[#00D395] hover:bg-[#00D395]/90 text-white">
            Complete Payment
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Order tracking
  if (step === 'tracking') {
    const stages = [
      { label: 'Payment received', done: trackingStage >= 1 },
      { label: 'Processing order', done: trackingStage >= 2 },
      { label: 'Sending USDC', done: trackingStage >= 3 },
      { label: 'Credited to account', done: trackingStage >= 4 },
    ];
    const progress = trackingStage === 0 ? 10 : trackingStage === 1 ? 35 : trackingStage === 2 ? 65 : trackingStage === 3 ? 90 : 100;

    return (
      <div className={cn("flex flex-col items-center py-10 space-y-8", isMobile ? "px-4" : "px-5")}>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Processing Payment</h3>
          <p className="text-sm text-muted-foreground">
            {selectedCurrency.flag} {parsedAmount.toFixed(2)} {currency} → ~{usdcReceive.toFixed(2)} USDC
          </p>
        </div>

        <div className="w-full max-w-sm space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-right text-muted-foreground">{progress}%</p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {s.done ? (
                <div className="w-6 h-6 rounded-full bg-trading-green/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-trading-green" />
                </div>
              ) : i === trackingStage ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted/50 border border-border/30" />
              )}
              <span className={cn("text-sm", s.done ? "text-foreground" : i === trackingStage ? "text-primary font-medium" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Result
  return (
    <div className={cn("flex flex-col items-center py-10 space-y-6", isMobile ? "px-4" : "px-5")}>
      <div className="w-20 h-20 rounded-full bg-trading-green/20 flex items-center justify-center">
        <Check className="w-10 h-10 text-trading-green" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">Purchase Complete</h3>
        <p className="text-3xl font-mono font-bold text-trading-green">
          +{usdcReceive.toFixed(2)} <span className="text-lg">USDC</span>
        </p>
        <p className="text-sm text-muted-foreground">Credited to your OmenX account</p>
      </div>
      <Button
        onClick={handleReset}
        variant="secondary"
        className={cn("w-full max-w-sm", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}
      >
        Done
      </Button>
    </div>
  );
};
