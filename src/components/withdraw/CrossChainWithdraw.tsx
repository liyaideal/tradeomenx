import { useState } from 'react';
import { ArrowDown, Loader2, Check, X, Clock, ExternalLink, RotateCcw, AlertCircle } from 'lucide-react';
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

const DEST_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', icon: '/chain-logos/ethereum.svg', chainId: 1 },
  { id: 'arbitrum', name: 'Arbitrum', icon: '/chain-logos/arbitrum.svg', chainId: 42161 },
  { id: 'bnb', name: 'BNB Chain', icon: '/chain-logos/bnb.svg', chainId: 56 },
  { id: 'polygon', name: 'Polygon', icon: '/chain-logos/polygon.svg', chainId: 137 },
];

const DEST_TOKENS: Record<string, { symbol: string; name: string }[]> = {
  ethereum: [{ symbol: 'USDC', name: 'USD Coin' }, { symbol: 'USDT', name: 'Tether' }, { symbol: 'ETH', name: 'Ethereum' }],
  arbitrum: [{ symbol: 'USDC', name: 'USD Coin' }, { symbol: 'USDT', name: 'Tether' }, { symbol: 'ETH', name: 'Ethereum' }],
  bnb: [{ symbol: 'USDC', name: 'USD Coin' }, { symbol: 'USDT', name: 'Tether' }, { symbol: 'BNB', name: 'BNB' }],
  polygon: [{ symbol: 'USDC', name: 'USD Coin' }, { symbol: 'USDT', name: 'Tether' }, { symbol: 'MATIC', name: 'Polygon' }],
};

type Step = 'select' | 'quote' | 'sign' | 'processing' | 'result';

export const CrossChainWithdraw = () => {
  const isMobile = useIsMobile();
  const { balance } = useUserProfile();
  const [step, setStep] = useState<Step>('select');
  const [toChain, setToChain] = useState('ethereum');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [quoteCountdown, setQuoteCountdown] = useState(30);
  const [processingStage, setProcessingStage] = useState(0);
  const [txResult, setTxResult] = useState<'success' | 'failed'>('success');

  const availableTokens = DEST_TOKENS[toChain] || [];
  const parsedAmount = parseFloat(amount) || 0;
  const isStable = ['USDC', 'USDT'].includes(toToken);
  const mockRate = isStable ? 1 : toToken === 'ETH' ? 1 / 3500 : toToken === 'BNB' ? 1 / 600 : toToken === 'MATIC' ? 1 / 0.8 : 1;
  const estimatedReceive = parsedAmount * mockRate;
  const gasFee = 0.5;

  const handleGetQuote = () => {
    setStep('quote');
    setQuoteCountdown(30);
    const interval = setInterval(() => {
      setQuoteCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSign = () => {
    setStep('sign');
    setTimeout(() => {
      setStep('processing');
      setProcessingStage(0);
      setTimeout(() => setProcessingStage(1), 2000);
      setTimeout(() => setProcessingStage(2), 5000);
      setTimeout(() => { setTxResult('success'); setStep('result'); }, 7000);
    }, 2000);
  };

  const handleRetry = () => {
    setStep('select');
    setAmount('');
    setProcessingStage(0);
  };

  const canProceed = parsedAmount > 0 && parsedAmount <= balance && toChain && toToken && toAddress.length > 10;

  if (step === 'select') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        {/* From: OmenX (Base USDC) */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">From (OmenX Wallet)</label>
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0052FF] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <span className="font-medium">Base • USDC</span>
              </div>
              <span className="text-xs text-muted-foreground">Bal: {balance.toFixed(2)}</span>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="h-12 text-lg font-mono bg-background"
            />
            {parsedAmount > balance && (
              <p className="text-xs text-trading-red flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Insufficient balance
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* To */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">To</label>
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
            <div className="flex gap-3">
              <Select value={toChain} onValueChange={(v) => { setToChain(v); setToToken(DEST_TOKENS[v]?.[0]?.symbol || 'USDC'); }}>
                <SelectTrigger className="flex-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEST_CHAINS.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <img src={chain.icon} alt={chain.name} className="w-4 h-4" />
                        {chain.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-28 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTokens.map(token => (
                    <SelectItem key={token.symbol} value={token.symbol}>{token.symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {parsedAmount > 0 && (
              <div className="text-2xl font-mono font-semibold">
                ~{estimatedReceive.toFixed(isStable ? 2 : 6)} <span className="text-sm text-muted-foreground">{toToken}</span>
              </div>
            )}
          </div>
        </div>

        {/* To Address */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Receiving Address</label>
          <Input
            placeholder="0x..."
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            className="h-10 font-mono text-sm"
          />
        </div>

        <Button onClick={handleGetQuote} disabled={!canProceed} className={cn("w-full bg-primary hover:bg-primary-hover", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}>
          Get Quote
        </Button>
        <p className="text-xs text-center text-muted-foreground">Powered by <span className="font-semibold">Bungee</span></p>
      </div>
    );
  }

  if (step === 'quote') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">Confirm Bridge Withdrawal</h3>
        </div>
        <div className="p-4 rounded-xl border border-border/50 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">You send</span><span className="font-mono font-semibold">{parsedAmount} USDC</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">You receive</span><span className="font-mono font-semibold text-trading-green">~{estimatedReceive.toFixed(isStable ? 2 : 6)} {toToken}</span></div>
          <hr className="border-border/30" />
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bridge fee</span><span className="font-mono text-trading-green">Free</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gas (est.)</span><span className="font-mono">~${gasFee.toFixed(2)}</span></div>
        </div>
        {quoteCountdown > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />Quote expires in {quoteCountdown}s
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('select')} className="flex-1">Back</Button>
          <Button onClick={handleSign} disabled={quoteCountdown === 0} className="flex-1 bg-primary hover:bg-primary-hover">Confirm & Sign</Button>
        </div>
      </div>
    );
  }

  if (step === 'sign') {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 space-y-6", isMobile ? "px-4" : "px-5")}>
        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center"><span className="text-3xl">🦊</span></div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Waiting for Signature</h3>
          <p className="text-sm text-muted-foreground">Confirm the transaction in your wallet</p>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (step === 'processing') {
    const stages = [
      { label: 'OmenX withdrawal approved', done: processingStage >= 1 },
      { label: 'Cross-chain bridging', done: processingStage >= 2 },
      { label: 'Destination chain confirmation', done: processingStage >= 3 },
    ];
    const progress = processingStage === 0 ? 15 : processingStage === 1 ? 50 : processingStage === 2 ? 85 : 100;

    return (
      <div className={cn("flex flex-col items-center py-10 space-y-8", isMobile ? "px-4" : "px-5")}>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Withdrawal in Progress</h3>
          <p className="text-sm text-muted-foreground">{parsedAmount} USDC → ~{estimatedReceive.toFixed(isStable ? 2 : 6)} {toToken}</p>
        </div>
        <div className="w-full max-w-sm space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-right text-muted-foreground">{progress}%</p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {s.done ? (
                <div className="w-6 h-6 rounded-full bg-trading-green/20 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-trading-green" /></div>
              ) : i === processingStage ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted/50 border border-border/30" />
              )}
              <span className={cn("text-sm", s.done ? "text-foreground" : i === processingStage ? "text-primary font-medium" : "text-muted-foreground")}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center py-10 space-y-6", isMobile ? "px-4" : "px-5")}>
      {txResult === 'success' ? (
        <>
          <div className="w-20 h-20 rounded-full bg-trading-green/20 flex items-center justify-center"><Check className="w-10 h-10 text-trading-green" /></div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">Withdrawal Successful</h3>
            <p className="text-3xl font-mono font-bold text-trading-green">{estimatedReceive.toFixed(isStable ? 2 : 6)} <span className="text-lg">{toToken}</span></p>
            <p className="text-sm text-muted-foreground">Sent to {toAddress.slice(0, 6)}...{toAddress.slice(-4)}</p>
          </div>
          <div className="w-full max-w-sm p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tx Hash</span>
              <div className="flex items-center gap-1"><code className="text-muted-foreground">0x9c4d...f3a1</code><ExternalLink className="w-3 h-3 text-muted-foreground" /></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-trading-red/20 flex items-center justify-center"><X className="w-10 h-10 text-trading-red" /></div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">Withdrawal Failed</h3>
            <p className="text-sm text-muted-foreground">Please try again</p>
          </div>
        </>
      )}
      <Button onClick={handleRetry} variant={txResult === 'success' ? 'secondary' : 'default'} className={cn("w-full max-w-sm", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}>
        {txResult === 'success' ? 'Done' : <><RotateCcw className="w-4 h-4 mr-2" />Try Again</>}
      </Button>
    </div>
  );
};
