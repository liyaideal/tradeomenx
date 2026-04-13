import { useState, useEffect, useCallback } from 'react';
import { ArrowDown, Loader2, Check, X, AlertCircle, ExternalLink, RotateCcw, Settings2, Sparkles } from 'lucide-react';
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
import { AutoModeButton, SettingsButton, SettingsPanel } from './CrossChainSettings';

const SOURCE_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', icon: '/chain-logos/ethereum.svg', chainId: 1 },
  { id: 'arbitrum', name: 'Arbitrum', icon: '/chain-logos/arbitrum.svg', chainId: 42161 },
  { id: 'bnb', name: 'BNB Chain', icon: '/chain-logos/bnb.svg', chainId: 56 },
  { id: 'polygon', name: 'Polygon', icon: '/chain-logos/polygon.svg', chainId: 137 },
];

const SOURCE_TOKENS: Record<string, { symbol: string; name: string }[]> = {
  ethereum: [
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'DAI', name: 'Dai' },
  ],
  arbitrum: [
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'ARB', name: 'Arbitrum' },
  ],
  bnb: [
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'BNB', name: 'BNB' },
    { symbol: 'BUSD', name: 'Binance USD' },
  ],
  polygon: [
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'MATIC', name: 'Polygon' },
  ],
};

type Step = 'swap' | 'review' | 'sign' | 'processing' | 'result';

export const CrossChainDeposit = () => {
  const isMobile = useIsMobile();
  const { getCurrentAddress } = useDeposit('USDC');
  const [step, setStep] = useState<Step>('swap');
  const [fromChain, setFromChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [processingStage, setProcessingStage] = useState(0);
  const [txResult, setTxResult] = useState<'success' | 'failed'>('success');
  const [autoMode, setAutoMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [gasPreference, setGasPreference] = useState<'low' | 'medium' | 'fast'>('medium');

  const receivingAddress = getCurrentAddress();
  const availableTokens = SOURCE_TOKENS[fromChain] || [];
  const selectedChain = SOURCE_CHAINS.find(c => c.id === fromChain);

  const parsedAmount = parseFloat(amount) || 0;
  const isStable = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(fromToken);
  const mockRate = isStable ? 1 : fromToken === 'ETH' ? 3500 : fromToken === 'BNB' ? 600 : fromToken === 'ARB' ? 1.2 : fromToken === 'MATIC' ? 0.8 : 1;
  const estimatedReceive = parsedAmount * mockRate;
  const gasFee = isStable ? 0.5 : 2;

  const handleReview = () => setStep('review');

  const handleConfirm = () => {
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
    setStep('swap');
    setAmount('');
    setProcessingStage(0);
  };

  const canProceed = parsedAmount > 0;

  // ── Main Swap Card ──
  if (step === 'swap') {
    return (
      <div className={cn("space-y-4", isMobile ? "px-4 py-5" : "p-5")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Swap</h3>
          <div className="flex items-center gap-2">
            <AutoModeButton active={autoMode} onClick={() => setAutoMode(!autoMode)} />
            <SettingsButton onClick={() => setShowSettings(!showSettings)} />
          </div>
        </div>

        {/* Settings Panel */}
        <SettingsPanel
          open={showSettings}
          onClose={() => setShowSettings(false)}
          autoMode={autoMode}
          onAutoModeChange={setAutoMode}
          slippage={slippage}
          onSlippageChange={setSlippage}
          gasPreference={gasPreference}
          onGasPreferenceChange={setGasPreference}
        />

        {/* From */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">From</span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 h-12 text-2xl font-mono bg-transparent border-none shadow-none focus-visible:ring-0 p-0"
            />
            <Select value={`${fromChain}-${fromToken}`} onValueChange={(v) => {
              const [chain, token] = v.split('-');
              setFromChain(chain);
              setFromToken(token);
            }}>
              <SelectTrigger className="w-auto min-w-[140px] h-10 rounded-full bg-card border-border/50 gap-2">
                <div className="flex items-center gap-2">
                  {selectedChain && <img src={selectedChain.icon} alt="" className="w-5 h-5" />}
                  <span className="font-medium">{fromToken}</span>
                  <span className="text-xs text-muted-foreground">{selectedChain?.name}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {SOURCE_CHAINS.map(chain =>
                  (SOURCE_TOKENS[chain.id] || []).map(token => (
                    <SelectItem key={`${chain.id}-${token.symbol}`} value={`${chain.id}-${token.symbol}`}>
                      <div className="flex items-center gap-2">
                        <img src={chain.icon} alt="" className="w-4 h-4" />
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-xs text-muted-foreground">{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center shadow-sm">
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* To (locked: Base USDC) */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-xs text-muted-foreground">OmenX Wallet</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-2xl font-mono font-semibold">
              {parsedAmount > 0 ? estimatedReceive.toFixed(2) : '0.00'}
            </span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border/50">
              <div className="w-5 h-5 rounded-full bg-[#0052FF] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">B</span>
              </div>
              <span className="font-medium text-sm">USDC</span>
              <span className="text-xs text-muted-foreground">Base</span>
            </div>
          </div>
        </div>

        {/* Inline Quote Details (shown when amount > 0) */}
        {parsedAmount > 0 && (
          <div className="space-y-2 px-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rate</span>
              <span className="font-mono">1 {fromToken} = {mockRate} USDC</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bridge Fee</span>
              <span className="font-mono text-trading-green">Free</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Est. Gas</span>
              <span className="font-mono">~${gasFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Est. Time</span>
              <span className="font-mono">~2 min</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleReview}
          disabled={!canProceed}
          className={cn("w-full bg-primary hover:bg-primary-hover font-semibold", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}
        >
          {canProceed ? 'Review Bridge' : 'Enter Amount'}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">
          Powered by <span className="font-semibold">Bungee</span>
        </p>
      </div>
    );
  }

  // ── Review / Confirm ──
  if (step === 'review') {
    return (
      <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">Confirm Bridge</h3>
        </div>

        {/* Summary cards */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedChain && <img src={selectedChain.icon} alt="" className="w-5 h-5" />}
              <span className="text-sm">{fromToken} on {selectedChain?.name}</span>
            </div>
            <span className="font-mono font-semibold">{parsedAmount}</span>
          </div>
          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-muted-foreground" /></div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0052FF] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">B</span>
              </div>
              <span className="text-sm">USDC on Base</span>
            </div>
            <span className="font-mono font-semibold text-trading-green">~{estimatedReceive.toFixed(2)}</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-3 rounded-lg border border-border/30 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rate</span><span className="font-mono">1 {fromToken} = {mockRate} USDC</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bridge Fee</span><span className="font-mono text-trading-green">Free</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gas (est.)</span><span className="font-mono">~${gasFee.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Slippage</span><span className="font-mono">0.5%</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Min. Receive</span><span className="font-mono">{(estimatedReceive * 0.995).toFixed(2)} USDC</span></div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs text-muted-foreground">Receiving Address</p>
          <code className="text-xs text-foreground break-all">{receivingAddress}</code>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('swap')} className="flex-1">Back</Button>
          <Button onClick={handleConfirm} className="flex-1 bg-primary hover:bg-primary-hover">Confirm & Bridge</Button>
        </div>
      </div>
    );
  }

  // ── Sign ──
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

  // ── Processing ──
  if (step === 'processing') {
    const stages = [
      { label: `${selectedChain?.name || 'Source'} confirmation`, done: processingStage >= 1 },
      { label: 'Cross-chain bridging', done: processingStage >= 2 },
      { label: 'Base chain confirmation', done: processingStage >= 3 },
    ];
    const progress = processingStage === 0 ? 15 : processingStage === 1 ? 50 : processingStage === 2 ? 85 : 100;

    return (
      <div className={cn("flex flex-col items-center py-10 space-y-8", isMobile ? "px-4" : "px-5")}>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Bridging in Progress</h3>
          <p className="text-sm text-muted-foreground">{parsedAmount} {fromToken} → ~{estimatedReceive.toFixed(2)} USDC</p>
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

  // ── Result ──
  return (
    <div className={cn("flex flex-col items-center py-10 space-y-6", isMobile ? "px-4" : "px-5")}>
      {txResult === 'success' ? (
        <>
          <div className="w-20 h-20 rounded-full bg-trading-green/20 flex items-center justify-center"><Check className="w-10 h-10 text-trading-green" /></div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">Bridge Successful</h3>
            <p className="text-3xl font-mono font-bold text-trading-green">+{estimatedReceive.toFixed(2)} <span className="text-lg">USDC</span></p>
            <p className="text-sm text-muted-foreground">Credited to your OmenX account</p>
          </div>
          <div className="w-full max-w-sm p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tx Hash</span>
              <div className="flex items-center gap-1"><code className="text-muted-foreground">0x8f3a...e7b2</code><ExternalLink className="w-3 h-3 text-muted-foreground" /></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-trading-red/20 flex items-center justify-center"><X className="w-10 h-10 text-trading-red" /></div>
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
      <Button onClick={handleRetry} variant={txResult === 'success' ? 'secondary' : 'default'} className={cn("w-full max-w-sm", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}>
        {txResult === 'success' ? 'Done' : <><RotateCcw className="w-4 h-4 mr-2" />Try Again</>}
      </Button>
    </div>
  );
};
