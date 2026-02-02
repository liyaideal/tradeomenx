import { useState, useEffect } from 'react';
import { X, ChevronLeft, HelpCircle, Loader2, AlertTriangle, ChevronDown, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetSelect } from '@/components/shared/AssetSelect';
import { SupportedToken, getTokenConfig, TokenConfig } from '@/types/deposit';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useWallets } from '@/hooks/useWallets';
import { LabelText, MonoText } from '@/components/typography';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { WithdrawAddressSelectDialog } from './WithdrawAddressSelectDialog';
import { WithdrawStatusTracker } from './WithdrawStatusTracker';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawDialog = ({ open, onOpenChange }: WithdrawDialogProps) => {
  const [selectedToken, setSelectedToken] = useState<SupportedToken | null>(null);

  const handleSelectToken = (token: SupportedToken) => {
    setSelectedToken(token);
  };

  const handleBack = () => {
    setSelectedToken(null);
  };

  const handleClose = () => {
    setSelectedToken(null);
    onOpenChange(false);
  };

  const tokenConfig = selectedToken ? getTokenConfig(selectedToken) : null;
  const title = tokenConfig ? `Withdraw ${tokenConfig.symbol}` : 'Withdraw';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 max-h-[90vh] flex flex-col" hideCloseButton>
        {/* Custom Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedToken && (
                <button
                  onClick={handleBack}
                  className="p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedToken && tokenConfig ? (
            <WithdrawFormDesktop token={tokenConfig} onDone={handleClose} onBack={handleBack} />
          ) : (
            <div className="p-6">
              <AssetSelect onSelectToken={handleSelectToken} balanceLabel="Available" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Desktop-optimized WithdrawForm
interface WithdrawFormDesktopProps {
  token: TokenConfig;
  onDone: () => void;
  onBack: () => void;
}

const WithdrawFormDesktop = ({ token, onDone, onBack }: WithdrawFormDesktopProps) => {
  const { wallets } = useWallets();
  const {
    availableBalance,
    limits,
    isSubmitting,
    currentWithdrawal,
    submitWithdrawal,
    validateWithdrawal,
    calculateNetAmount,
    getWithdrawFee,
    getWithdrawMinimum,
  } = useWithdraw();

  const [amount, setAmount] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = getWithdrawFee(token.symbol);
  const minAmount = getWithdrawMinimum(token.symbol);
  const netAmount = calculateNetAmount(token.symbol, amount);

  // Auto-select primary wallet
  useEffect(() => {
    const primaryWallet = wallets.find(w => w.isPrimary);
    if (primaryWallet && !selectedAddress) {
      setSelectedAddress(primaryWallet.fullAddress);
    }
  }, [wallets, selectedAddress]);

  const selectedWallet = wallets.find(w => w.fullAddress === selectedAddress);

  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
    setError(null);
  };

  const handleSetMax = () => {
    const maxAmount = Math.max(0, availableBalance - fee);
    setAmount(maxAmount.toString());
    setError(null);
  };

  const handleSubmit = async () => {
    const validationError = validateWithdrawal({
      token: token.symbol,
      amount,
      toAddress: selectedAddress,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await submitWithdrawal({
        token: token.symbol,
        amount,
        toAddress: selectedAddress,
      });
      toast.success('Withdrawal request submitted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit withdrawal');
    }
  };

  // If we have a current withdrawal, show status tracker
  if (currentWithdrawal) {
    return (
      <div className="p-6">
        <WithdrawStatusTracker 
          withdrawal={currentWithdrawal} 
          token={token}
          onDone={onDone}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Token Info */}
      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
          {token.icon}
        </div>
        <div>
          <div className="font-semibold text-sm">{token.symbol}</div>
          <div className="text-xs text-muted-foreground">{token.network}</div>
        </div>
      </div>

      {/* Withdrawal Address */}
      <div className="space-y-2">
        <LabelText size="sm" muted>Withdrawal Address</LabelText>
        <button
          onClick={() => setShowAddressSelect(true)}
          className="w-full flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {selectedWallet ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedWallet.icon}</span>
              <div className="text-left">
                <div className="font-medium text-sm">{selectedWallet.walletType}</div>
                <MonoText className="text-xs text-muted-foreground">
                  {selectedWallet.address}
                </MonoText>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Select withdrawal address</span>
            </div>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <LabelText size="sm" muted>Amount</LabelText>
          <button
            onClick={handleSetMax}
            className="text-xs text-primary font-medium hover:underline"
          >
            MAX
          </button>
        </div>
        <div className="relative">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={cn(
              "h-12 text-lg font-mono pr-16 bg-muted/30 border-border/50 rounded-lg",
              error && "border-trading-red focus-visible:ring-trading-red"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            {token.symbol}
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-trading-red text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Available: <span className="font-mono">{availableBalance.toFixed(2)}</span> {token.symbol}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Network Fee</span>
          <MonoText className="font-medium">{fee} {token.symbol}</MonoText>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Minimum</span>
          <MonoText className="font-medium">{minAmount} {token.symbol}</MonoText>
        </div>
        <div className="h-px bg-border/50" />
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">You'll Receive</span>
          <MonoText className="text-base font-bold">
            {netAmount.toFixed(token.decimals > 8 ? 4 : 2)} {token.symbol}
          </MonoText>
        </div>
      </div>

      {/* Limits */}
      <div className="p-3 bg-muted/20 rounded-lg space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Daily Limit</span>
          <MonoText>{limits.dailyLimit.toLocaleString()} {token.symbol}</MonoText>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Remaining</span>
          <MonoText className="text-trading-green">{limits.dailyRemaining.toLocaleString()} {token.symbol}</MonoText>
        </div>
      </div>

      {/* Warning */}
      <div className="p-3 bg-trading-yellow/10 border border-trading-yellow/30 rounded-lg">
        <p className="text-xs text-trading-yellow leading-relaxed">
          <span className="font-semibold">Important:</span> Ensure the address supports{' '}
          <span className="font-semibold">{token.network}</span>.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !amount || !selectedAddress}
        className="w-full h-11 rounded-lg bg-primary hover:bg-primary-hover font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Withdraw'
        )}
      </Button>

      {/* Address Selection Dialog */}
      <WithdrawAddressSelectDialog
        open={showAddressSelect}
        onClose={() => setShowAddressSelect(false)}
        selectedAddress={selectedAddress}
        onSelectAddress={(address) => {
          setSelectedAddress(address);
          setShowAddressSelect(false);
        }}
      />
    </div>
  );
};
