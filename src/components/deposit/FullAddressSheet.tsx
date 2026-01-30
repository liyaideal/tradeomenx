import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { toast } from 'sonner';

interface FullAddressSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  tokenSymbol: string;
}

// Color palette for address characters (matching reference design)
const CHAR_COLORS = [
  'text-purple-400',
  'text-blue-400', 
  'text-cyan-400',
  'text-green-400',
  'text-yellow-400',
  'text-orange-400',
  'text-pink-400',
  'text-violet-400',
];

const formatAddressWithColors = (address: string) => {
  // Remove 0x prefix for formatting
  const hasPrefix = address.startsWith('0x');
  const cleanAddress = hasPrefix ? address.slice(2) : address;
  
  // Split into chunks of 4 characters
  const chunks: string[] = [];
  for (let i = 0; i < cleanAddress.length; i += 4) {
    chunks.push(cleanAddress.slice(i, i + 4));
  }
  
  return { hasPrefix, chunks };
};

export const FullAddressSheet = ({
  open,
  onOpenChange,
  address,
  tokenSymbol,
}: FullAddressSheetProps) => {
  const { hasPrefix, chunks } = formatAddressWithColors(address);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
    onOpenChange(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tokenSymbol} Deposit Address`,
          text: address,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle>{tokenSymbol} deposit address</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Formatted Address Display */}
          <div className="p-6 bg-card/50 border border-border/50 rounded-2xl">
            <div className="font-mono text-xl leading-relaxed text-center flex flex-wrap justify-center gap-x-3 gap-y-2">
              {hasPrefix && (
                <span className={CHAR_COLORS[0]}>0x</span>
              )}
              {chunks.map((chunk, index) => (
                <span 
                  key={index} 
                  className={CHAR_COLORS[(index + (hasPrefix ? 1 : 0)) % CHAR_COLORS.length]}
                >
                  {chunk}
                </span>
              ))}
            </div>
          </div>

          {/* Warning */}
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            <span className="font-semibold text-foreground">Only deposit {tokenSymbol} from the correct network.</span>{' '}
            Deposits of other assets or from other networks will be lost.{' '}
            <button className="text-primary underline underline-offset-2">Learn more</button>
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              variant="secondary"
              className="flex-1 h-12 rounded-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleCopy}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
