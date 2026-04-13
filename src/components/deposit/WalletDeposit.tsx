import { useState } from 'react';
import { Copy, Check, MoreHorizontal, AlertTriangle, Loader2, RefreshCw, Eye, Share2, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LabelText, MonoText } from '@/components/typography';
import { toast } from 'sonner';
import { useDeposit } from '@/hooks/useDeposit';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Base USDC config - hardcoded since we only support this
const BASE_USDC_CONFIG = {
  symbol: 'USDC' as const,
  name: 'USD Coin',
  network: 'Base',
  chainId: 8453,
  contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  decimals: 6,
  minAmount: 10,
  confirmationBlocks: 12,
  estimatedTime: '< 2 minutes',
  fee: 0,
};

interface WalletDepositProps {
  onDone?: () => void;
}

export const WalletDeposit = ({ onDone }: WalletDepositProps) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const {
    pendingClaims,
    isClaiming,
    claimDeposit,
    formatTimeAgo,
    getCurrentAddress,
    generateNewAddress,
    isGeneratingAddress,
  } = useDeposit('USDC');

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
    } catch {
      toast.error('Failed to claim deposit');
    } finally {
      setClaimingId(null);
    }
  };

  const handleGenerateNewAddress = async () => {
    try {
      await generateNewAddress('USDC');
      toast.success('New deposit address generated');
    } catch {
      toast.error('Failed to generate new address');
    }
  };

  const tokenPendingClaims = pendingClaims.filter(c => c.token === 'USDC');

  return (
    <div className={cn("space-y-5", isMobile ? "px-4 py-5" : "p-5")}>
      {/* Base-USDC Only Warning */}
      <div className="p-3 bg-trading-yellow/10 border border-trading-yellow/30 rounded-xl">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-trading-yellow shrink-0 mt-0.5" />
          <div className="text-xs text-trading-yellow leading-relaxed">
            <span className="font-semibold">Only send USDC on Base network.</span>
            <br />
            Contract: <code className="text-[10px] bg-trading-yellow/10 px-1 py-0.5 rounded">{BASE_USDC_CONFIG.contractAddress}</code>
            <br />
            Sending other tokens or using a different network may result in <span className="font-semibold">permanent loss of funds</span>.
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className={cn("bg-white rounded-2xl", isMobile ? "p-6" : "p-4")}>
          <QRCodeSVG 
            value={custodyAddress} 
            size={isMobile ? 200 : 160}
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="text-center space-y-2">
        <LabelText size="sm" muted className="block">
          USDC deposit address (Base)
        </LabelText>
        <div className="px-2">
          <MonoText className={cn("leading-relaxed break-all", isMobile ? "text-base" : "text-sm")}>
            {custodyAddress}
          </MonoText>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopyAddress}
          className={cn("flex-1 bg-primary hover:bg-primary-hover", isMobile ? "h-12 rounded-xl" : "h-10 rounded-lg")}
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
              className={cn("border-border/50", isMobile ? "h-12 w-12 rounded-xl" : "h-10 w-10 rounded-lg")}
            >
              <MoreHorizontal className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info Table */}
      <div className="space-y-3 pt-2">
        <InfoRow label="Network" value="Base" />
        <InfoRow label="Token" value="USDC" />
        <InfoRow label="Fee" value="0 USDC" />
        <InfoRow label="Minimum deposit" value={`${BASE_USDC_CONFIG.minAmount} USDC`} underline />
        <InfoRow label="Confirmations" value={BASE_USDC_CONFIG.confirmationBlocks.toString()} />
        <InfoRow label="Processing time" value={BASE_USDC_CONFIG.estimatedTime} underline />
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
          <p className="text-xs text-muted-foreground">
            These deposits are below the minimum threshold and require manual claiming.
          </p>
          <div className="space-y-2">
            {tokenPendingClaims.map((deposit) => (
              <div 
                key={deposit.id}
                className="flex items-center justify-between p-3 bg-trading-yellow/5 border border-trading-yellow/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-trading-yellow/20 flex items-center justify-center text-lg">
                    💲
                  </div>
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

      {/* Done Button (desktop only) */}
      {onDone && (
        <Button
          onClick={onDone}
          variant="secondary"
          className="w-full h-10 rounded-lg"
        >
          Done
        </Button>
      )}
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  underline?: boolean;
}

const InfoRow = ({ label, value, underline }: InfoRowProps) => (
  <div className="flex items-center justify-between text-sm">
    <span className={cn(
      "text-muted-foreground",
      underline && "underline underline-offset-2 decoration-dashed"
    )}>
      {label}
    </span>
    <span className="font-medium">{value}</span>
  </div>
);
