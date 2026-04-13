import { useState } from 'react';
import { ArrowDown, ChevronDown, Loader2, Check, X, AlertCircle, Clock, ExternalLink, RotateCcw } from 'lucide-react';
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
import { useDeposit } from '@/hooks/useDeposit';

// Supported source chains
const SOURCE_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', icon: '/chain-logos/ethereum.svg', chainId: 1 },
  { id: 'arbitrum', name: 'Arbitrum', icon: '/chain-logos/arbitrum.svg', chainId: 42161 },
  { id: 'bnb', name: 'BNB Chain', icon: '/chain-logos/bnb.svg', chainId: 56 },
  { id: 'polygon', name: 'Polygon', icon: '/chain-logos/polygon.svg', chainId: 137 },
];

// Supported source tokens per chain
const SOURCE_TOKENS: Record<string, { symbol: string; name: string; icon: string }[]> = {
  ethereum: [
    { symbol: 'USDC', name: 'USD Coin', icon: '💲' },
    { symbol: 'USDT', name: 'Tether', icon: '💵' },
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
    { symbol: 'DAI', name: 'Dai', icon: '◈' },
  ],
  arbitrum: [
    { symbol: 'USDC', name: 'USD Coin', icon: '💲' },
    { symbol: 'USDT', name: 'Tether', icon: '💵' },
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
    { symbol: 'ARB', name: 'Arbitrum', icon: '🔵' },
  ],
  bnb: [
    { symbol: 'USDC', name: 'USD Coin', icon: '💲' },
    { symbol: 'USDT', name: 'Tether', icon: '💵' },
    { symbol: 'BNB', name: 'BNB', icon: '🔶' },
    { symbol: 'BUSD', name: 'Binance USD', icon: '💛' },
  ],
  polygon: [
    { symbol: 'USDC', name: 'USD Coin', icon: '💲' },
    { symbol: 'USDT', name: 'Tether', icon: '💵' },
    { symbol: 'MATIC', name: 'Polygon', icon: '🟣' },
  ],
};

type Step = 'select' | 'quote' | 'sign' | 'processing' | 'result';

export const CrossChainDeposit = () => {
  const isMobile = useIsMobile();
  const { getCurrentAddress } = useDeposit('USDC');
  const [step, setStep] = useState<Step>('select');

  // Step 1 state
  const [fromChain, setFromChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('USDC');
  const [amount, setAmount] = useState('');

  // Step 2 state
  const [quoteCountdown, setQuoteCountdown] = useState(30);
  
  // Step 4 state
  const [processingStage, setProcessingStage] = useState(0);
  
  // Step 5 state
  const [txResult, setTxResult] = useState<'success' | 'failed'>('success');

  const receivingAddress = getCurrentAddress();
  const availableTokens = SOURCE_TOKENS[fromChain] || [];
  const selectedChain = SOURCE_CHAINS.find(c => c.id === fromChain);
  const selectedToken = availableTokens.find(t => t.symbol === fromToken);

  // Mock quote data
  const parsedAmount = parseFloat(amount) || 0;
  const isStable = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(fromToken);
  const mockRate = isStable ? 1 : fromToken === 'ETH' ? 3500 : fromToken === 'BNB' ? 600 : fromToken === 'ARB' ? 1.2 : fromToken === 'MATIC' ? 0.8 : 1;
  const estimatedReceive = parsedAmount * mockRate;
  const minReceive = estimatedReceive * 0.995;
  const bridgeFee = 0;
  const gasFee = isStable ? 0.5 : 2;

  const handleGetQuote = () => {
    setStep('quote');
    setQuoteCountdown(30);
    const interval = setInterval(() => {
      setQuoteCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSign = () => {
    setStep('sign');
    // Auto-advance after 2s (mock signature)
    setTimeout(() => {
      setStep('processing');
      setProcessingStage(0);
      // 3-stage progress: source confirm → bridge → dest confirm
      setTimeout(() => setProcessingStage(1), 2000);
      setTimeout(() => setProcessingStage(2), 5000);
      setTimeout(() => {
        setTxResult('success');
        setStep('result');
      }, 7000);
    }, 2000);
  };

  const handleRetry = () => {
    setStep('select');
    setAmount('');
    setProcessingStage(0);
  };

  const canProceed = parsedAmount > 0 && fromChain && fromToken;

  // Step 1: Asset Selection
  if (step === 'select') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        {/* From Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">From</label>
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
            <div className="flex gap-3">
              <Select value={fromChain} onValueChange={(v) => { setFromChain(v); setFromToken(SOURCE_TOKENS[v]?.[0]?.symbol || 'USDC'); }}>
                <SelectTrigger className="flex-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_CHAINS.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <img src={chain.icon} alt={chain.name} className="w-4 h-4" />
                        {chain.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-32 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTokens.map(token => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <span>{token.icon}</span>
                        {token.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="h-12 text-lg font-mono bg-background"
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* To Section (locked) */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">To</label>
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0052FF] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <span className="font-medium">Base</span>
              </div>
              <span className="text-sm font-medium text-primary">USDC</span>
            </div>
            {parsedAmount > 0 && (
              <div className="text-2xl font-mono font-semibold">
                ~{estimatedReceive.toFixed(2)} <span className="text-sm text-muted-foreground">USDC</span>
              </div>
            )}
          </div>
        </div>

        {/* Receiving Address */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Receiving Address (Your OmenX Wallet)</label>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <code className="text-xs text-muted-foreground break-all">{receivingAddress}</code>
          </div>
        </div>

        <Button
          onClick={handleGetQuote}
          disabled={!canProceed}
          className={cn("w-full bg-primary hover:bg-primary-hover", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}
        >
          Get Quote
        </Button>

        {/* Powered by notice */}
        <p className="text-xs text-center text-muted-foreground">
          Powered by <span className="font-semibold">Bungee</span> cross-chain bridge
        </p>
      </div>
    );
  }

  // Step 2: Quote Confirmation
  if (step === 'quote') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">Confirm Bridge</h3>
          <p className="text-sm text-muted-foreground">Review the details below</p>
        </div>

        <div className="p-4 rounded-xl border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">You send</span>
            <span className="font-mono font-semibold">{parsedAmount} {fromToken}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">You receive</span>
            <span className="font-mono font-semibold text-trading-green">~{estimatedReceive.toFixed(2)} USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Min. receive</span>
            <span className="font-mono text-sm">{minReceive.toFixed(2)} USDC</span>
          </div>
          <hr className="border-border/30" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bridge fee</span>
            <span className="font-mono text-sm text-trading-green">Free</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gas fee (est.)</span>
            <span className="font-mono text-sm">~${gasFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rate</span>
            <span className="font-mono text-sm">1 {fromToken} = {mockRate} USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Slippage</span>
            <span className="font-mono text-sm">0.5%</span>
          </div>
        </div>

        {quoteCountdown > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            Quote expires in {quoteCountdown}s
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSign} 
            disabled={quoteCountdown === 0}
            className="flex-1 bg-primary hover:bg-primary-hover"
          >
            Confirm & Sign
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Mock wallet signature
  if (step === 'sign') {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 space-y-6", isMobile ? "px-4" : "px-5")}>
        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center">
          <span className="text-3xl">🦊</span>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Waiting for Signature</h3>
          <p className="text-sm text-muted-foreground">Confirm the transaction in your wallet</p>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Step 4: Processing
  if (step === 'processing') {
    const stages = [
      { label: 'Source chain confirmation', done: processingStage >= 1 },
      { label: 'Cross-chain bridging', done: processingStage >= 2 },
      { label: 'Base chain confirmation', done: processingStage >= 3 },
    ];
    const progress = processingStage === 0 ? 15 : processingStage === 1 ? 50 : processingStage === 2 ? 85 : 100;

    return (
      <div className={cn("flex flex-col items-center py-10 space-y-8", isMobile ? "px-4" : "px-5")}>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Bridging in Progress</h3>
          <p className="text-sm text-muted-foreground">
            {parsedAmount} {fromToken} → ~{estimatedReceive.toFixed(2)} USDC
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
              ) : i === processingStage ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted/50 border border-border/30" />
              )}
              <span className={cn("text-sm", s.done ? "text-foreground" : i === processingStage ? "text-primary font-medium" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 5: Result
  return (
    <div className={cn("flex flex-col items-center py-10 space-y-6", isMobile ? "px-4" : "px-5")}>
      {txResult === 'success' ? (
        <>
          <div className="w-20 h-20 rounded-full bg-trading-green/20 flex items-center justify-center">
            <Check className="w-10 h-10 text-trading-green" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">Bridge Successful</h3>
            <p className="text-3xl font-mono font-bold text-trading-green">
              +{estimatedReceive.toFixed(2)} <span className="text-lg">USDC</span>
            </p>
            <p className="text-sm text-muted-foreground">Credited to your OmenX account</p>
          </div>
          <div className="w-full max-w-sm p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tx Hash</span>
              <div className="flex items-center gap-1">
                <code className="text-muted-foreground">0x8f3a...e7b2</code>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-trading-red/20 flex items-center justify-center">
            <X className="w-10 h-10 text-trading-red" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">Bridge Failed</h3>
            <p className="text-sm text-muted-foreground">Transaction could not be completed</p>
          </div>
          <div className="w-full max-w-sm p-3 rounded-lg bg-trading-red/5 border border-trading-red/20">
            <div className="flex items-center gap-2 text-sm text-trading-red">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Insufficient gas on source chain</span>
            </div>
          </div>
        </>
      )}

      <Button
        onClick={handleRetry}
        className={cn("w-full max-w-sm", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}
        variant={txResult === 'success' ? 'secondary' : 'default'}
      >
        {txResult === 'success' ? (
          'Done'
        ) : (
          <>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </>
        )}
      </Button>
    </div>
  );
};
