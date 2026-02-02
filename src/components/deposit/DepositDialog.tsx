import { useState } from 'react';
import { X, ChevronLeft, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AssetSelect } from '@/components/shared/AssetSelect';
import { DepositDetails } from './DepositDetails';
import { SupportedToken, getTokenConfig } from '@/types/deposit';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DepositDialog = ({ open, onOpenChange }: DepositDialogProps) => {
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
  const title = tokenConfig ? `Deposit ${tokenConfig.symbol}` : 'Deposit';

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
            <DepositDetailsDesktop token={tokenConfig} onDone={handleClose} />
          ) : (
            <AssetSelectDesktop onSelectToken={handleSelectToken} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Desktop-optimized AssetSelect wrapper
interface AssetSelectDesktopProps {
  onSelectToken: (token: SupportedToken) => void;
}

const AssetSelectDesktop = ({ onSelectToken }: AssetSelectDesktopProps) => {
  return (
    <div className="p-6">
      <AssetSelect onSelectToken={onSelectToken} />
    </div>
  );
};

// Desktop-optimized DepositDetails wrapper
import { Copy, Check, MoreHorizontal, AlertTriangle, Loader2, RefreshCw, Eye } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TokenConfig, getCustodyAddress } from '@/types/deposit';
import { LabelText, MonoText } from '@/components/typography';
import { toast } from 'sonner';
import { useDeposit } from '@/hooks/useDeposit';
import { cn } from '@/lib/utils';
import { FullAddressDialog } from './FullAddressDialog';

interface DepositDetailsDesktopProps {
  token: TokenConfig;
  onDone: () => void;
}

const DepositDetailsDesktop = ({ token, onDone }: DepositDetailsDesktopProps) => {
  const [copied, setCopied] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const {
    pendingClaims,
    isClaiming,
    claimDeposit,
    formatTimeAgo,
    getCurrentAddress,
    generateNewAddress,
    isGeneratingAddress,
  } = useDeposit(token.symbol);

  const custodyAddress = getCurrentAddress();

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(custodyAddress);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimDeposit = async (depositId: string) => {
    setClaimingId(depositId);
    try {
      const mockSignature = '0x...mock_signature';
      await claimDeposit({ depositId, signature: mockSignature });
      toast.success('Deposit claimed successfully');
    } catch (error) {
      toast.error('Failed to claim deposit');
    } finally {
      setClaimingId(null);
    }
  };

  const handleGenerateNewAddress = async () => {
    try {
      await generateNewAddress(token.symbol);
      toast.success('New deposit address generated');
    } catch (error) {
      toast.error('Failed to generate new address');
    }
  };

  const tokenPendingClaims = pendingClaims.filter(c => c.token === token.symbol);

  return (
    <div className="p-6 space-y-6">
      {/* QR Code - Smaller for desktop */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-xl">
          <QRCodeSVG 
            value={custodyAddress} 
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="text-center space-y-2">
        <LabelText size="sm" muted className="block">
          {token.symbol} deposit address
        </LabelText>
        <div className="px-2">
          <MonoText className="text-sm leading-relaxed break-all">
            {custodyAddress}
          </MonoText>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopyAddress}
          className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-hover"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy address
            </>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg border-border/50"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={handleGenerateNewAddress}
              disabled={isGeneratingAddress}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isGeneratingAddress && "animate-spin")} />
              Generate new address
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowFullAddress(true)}>
              <Eye className="w-4 h-4 mr-2" />
              View full address
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Full Address Dialog */}
      <FullAddressDialog
        open={showFullAddress}
        onOpenChange={setShowFullAddress}
        address={custodyAddress}
        tokenSymbol={token.symbol}
      />

      {/* Info Table */}
      <div className="space-y-3 pt-2">
        <InfoRow label="Network" value={token.network} valueIcon={token.icon} />
        <InfoRow label="Fee" value={`${token.fee} ${token.symbol}`} />
        <InfoRow label="Minimum deposit" value={`${token.minAmount} ${token.symbol}`} underline />
        <InfoRow label="Confirmations" value={token.confirmationBlocks.toString()} />
        <InfoRow label="Processing time" value={token.estimatedTime} underline />
      </div>

      {/* Warning Notice */}
      <div className="p-3 bg-trading-yellow/10 border border-trading-yellow/30 rounded-lg">
        <p className="text-xs text-trading-yellow leading-relaxed">
          <span className="font-semibold">Important:</span> Only send {token.symbol} on the{' '}
          <span className="font-semibold">{token.network}</span> network.
        </p>
      </div>

      {/* Pending Claims */}
      {tokenPendingClaims.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-trading-yellow" />
            <LabelText size="sm" weight="semibold">
              Pending Deposits ({tokenPendingClaims.length})
            </LabelText>
          </div>
          <div className="space-y-2">
            {tokenPendingClaims.map((deposit) => (
              <div 
                key={deposit.id}
                className="flex items-center justify-between p-3 bg-trading-yellow/5 border border-trading-yellow/20 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{token.icon}</span>
                  <div>
                    <span className="font-mono font-semibold text-sm">
                      {deposit.amount.toFixed(2)} {deposit.token}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(deposit.createdAt)}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleClaimDeposit(deposit.id)}
                  disabled={isClaiming}
                  className="bg-trading-yellow hover:bg-trading-yellow/90 text-background h-8"
                >
                  {claimingId === deposit.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    'Claim'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done Button */}
      <Button
        onClick={onDone}
        variant="secondary"
        className="w-full h-10 rounded-lg"
      >
        Done
      </Button>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  valueIcon?: string;
  underline?: boolean;
}

const InfoRow = ({ label, value, valueIcon, underline }: InfoRowProps) => (
  <div className="flex items-center justify-between text-sm">
    <span className={cn(
      "text-muted-foreground",
      underline && "underline underline-offset-2 decoration-dashed"
    )}>
      {label}
    </span>
    <div className="flex items-center gap-1.5">
      {valueIcon && <span className="text-sm">{valueIcon}</span>}
      <span className="font-medium">{value}</span>
    </div>
  </div>
);
