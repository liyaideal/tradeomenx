import { useState } from 'react';
import { CreditCard, Building2, Loader2, Check, Clock, Shield, Lock } from 'lucide-react';
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
import { useUserProfile } from '@/hooks/useUserProfile';

const FIAT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.53 },
];

const PAYOUT_METHODS = [
  { id: 'bank', label: 'Bank Transfer', icon: Building2, fee: '1.0%', est: '1-3 business days' },
  { id: 'card', label: 'Card Refund', icon: CreditCard, fee: '2.0%', est: '3-5 business days' },
];

type Step = 'form' | 'kyc' | 'confirm' | 'tracking' | 'result';

export const SellToFiat = () => {
  const isMobile = useIsMobile();
  const { balance } = useUserProfile();
  const [step, setStep] = useState<Step>('form');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [trackingStage, setTrackingStage] = useState(0);

  const selectedCurrency = FIAT_CURRENCIES.find(c => c.code === currency)!;
  const selectedPayout = PAYOUT_METHODS.find(p => p.id === payoutMethod)!;
  const parsedAmount = parseFloat(amount) || 0;
  const feePercent = payoutMethod === 'bank' ? 0.01 : 0.02;
  const fee = parsedAmount * feePercent;
  const fiatReceive = (parsedAmount - fee) * selectedCurrency.rate;

  const handleProceed = () => setStep('kyc');

  const handleConfirmKyc = () => setStep('confirm');

  const handleConfirmTransfer = () => {
    setStep('tracking');
    setTrackingStage(0);
    setTimeout(() => setTrackingStage(1), 1500);
    setTimeout(() => setTrackingStage(2), 3500);
    setTimeout(() => setTrackingStage(3), 5000);
    setTimeout(() => setTrackingStage(4), 6500);
    setTimeout(() => setStep('result'), 8000);
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setTrackingStage(0);
  };

  if (step === 'form') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        {/* Amount */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Sell USDC</label>
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="h-12 text-2xl font-mono bg-background"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Available: {balance.toFixed(2)} USDC</span>
              <button onClick={() => setAmount(balance.toString())} className="text-primary font-medium">MAX</button>
            </div>
            {parsedAmount > balance && (
              <p className="text-xs text-trading-red">Insufficient balance</p>
            )}
          </div>
        </div>

        {/* Receive */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">You receive</label>
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex gap-2 items-center mb-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-28 h-9">
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
            </div>
            <div className="text-2xl font-mono font-semibold">
              {fiatReceive > 0 ? `~${fiatReceive.toFixed(2)}` : '0.00'} <span className="text-sm text-muted-foreground">{currency}</span>
            </div>
          </div>
        </div>

        {/* Payout method */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Payout method</label>
          <div className="space-y-2">
            {PAYOUT_METHODS.map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPayoutMethod(method.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                    payoutMethod === method.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-border"
                  )}
                >
                  <Icon className={cn("w-5 h-5", payoutMethod === method.id ? "text-primary" : "text-muted-foreground")} />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{method.label}</span>
                    <span className="text-xs text-muted-foreground block">{method.est}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{method.fee}</span>
                  {payoutMethod === method.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee */}
        {parsedAmount > 0 && (
          <div className="p-3 rounded-lg bg-muted/30 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-mono">{fee.toFixed(2)} USDC</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="font-mono">1 USDC = {selectedCurrency.rate.toFixed(2)} {currency}</span></div>
          </div>
        )}

        <Button onClick={handleProceed} disabled={parsedAmount < 10 || parsedAmount > balance} className={cn("w-full bg-primary hover:bg-primary-hover", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}>
          Continue
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">Powered by <span className="font-semibold">Banxa</span> • Min. 10 USDC</p>
      </div>
    );
  }

  if (step === 'kyc') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-xl bg-[#00D395]/10 mx-auto flex items-center justify-center">
            <span className="text-2xl font-bold text-[#00D395]">B</span>
          </div>
          <h3 className="text-lg font-semibold">Banxa Verification</h3>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-trading-green/10 border border-trading-green/20">
          <Shield className="w-4 h-4 text-trading-green" />
          <span className="text-sm text-trading-green font-medium">KYC Verified</span>
        </div>
        <div className="p-4 rounded-xl border border-border/50 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Sell</span><span className="font-mono font-semibold">{parsedAmount} USDC</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Receive</span><span className="font-mono font-semibold text-trading-green">~{fiatReceive.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Payout</span><span>{selectedPayout.label}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Est. arrival</span><span>{selectedPayout.est}</span></div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('form')} className="flex-1">Back</Button>
          <Button onClick={handleConfirmKyc} className="flex-1 bg-[#00D395] hover:bg-[#00D395]/90 text-white">Confirm</Button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        <div className="text-center space-y-2">
          <Lock className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">Confirm USDC Transfer</h3>
          <p className="text-sm text-muted-foreground">Your USDC will be frozen and sent to Banxa</p>
        </div>
        <div className="p-4 rounded-xl border border-border/50 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">From</span><span>OmenX Wallet</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">To</span><span>Banxa Collection</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-mono font-semibold">{parsedAmount} USDC</span></div>
        </div>
        <div className="p-3 bg-trading-yellow/10 border border-trading-yellow/30 rounded-xl">
          <p className="text-xs text-trading-yellow"><span className="font-semibold">Note:</span> {parsedAmount} USDC will be frozen in your account until the transaction is completed.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('kyc')} className="flex-1">Back</Button>
          <Button onClick={handleConfirmTransfer} className="flex-1 bg-primary hover:bg-primary-hover">Transfer & Freeze</Button>
        </div>
      </div>
    );
  }

  if (step === 'tracking') {
    const stages = [
      { label: 'USDC frozen', done: trackingStage >= 1 },
      { label: 'USDC sent to Banxa', done: trackingStage >= 2 },
      { label: 'Banxa processing', done: trackingStage >= 3 },
      { label: 'Fiat payout initiated', done: trackingStage >= 4 },
      { label: 'Funds received', done: trackingStage >= 5 },
    ];
    const progress = Math.min(100, trackingStage * 20);

    return (
      <div className={cn("flex flex-col items-center py-10 space-y-8", isMobile ? "px-4" : "px-5")}>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Processing Sale</h3>
          <p className="text-sm text-muted-foreground">{parsedAmount} USDC → ~{fiatReceive.toFixed(2)} {currency}</p>
        </div>
        <div className="w-full max-w-sm space-y-1">
          <Progress value={progress} className="h-2" /><p className="text-xs text-right text-muted-foreground">{progress}%</p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {s.done ? (
                <div className="w-6 h-6 rounded-full bg-trading-green/20 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-trading-green" /></div>
              ) : i === trackingStage ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted/50 border border-border/30" />
              )}
              <span className={cn("text-sm", s.done ? "text-foreground" : i === trackingStage ? "text-primary font-medium" : "text-muted-foreground")}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center py-10 space-y-6", isMobile ? "px-4" : "px-5")}>
      <div className="w-20 h-20 rounded-full bg-trading-green/20 flex items-center justify-center"><Check className="w-10 h-10 text-trading-green" /></div>
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">Sale Submitted</h3>
        <p className="text-3xl font-mono font-bold">{selectedCurrency.flag} {fiatReceive.toFixed(2)} <span className="text-sm">{currency}</span></p>
        <p className="text-sm text-muted-foreground">Expected in {selectedPayout.est}</p>
      </div>
      <Button onClick={handleReset} variant="secondary" className={cn("w-full max-w-sm", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}>Done</Button>
    </div>
  );
};
