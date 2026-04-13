import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletDeposit } from './WalletDeposit';
import { CrossChainDeposit } from './CrossChainDeposit';
import { BuyWithFiat } from './BuyWithFiat';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DepositDialog = ({ open, onOpenChange }: DepositDialogProps) => {
  const [activeTab, setActiveTab] = useState('wallet');

  const handleClose = () => {
    setActiveTab('wallet');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 max-h-[90vh] flex flex-col" hideCloseButton>
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Deposit</DialogTitle>
            <div className="flex items-center gap-2">
              <a
                href="mailto:customerservice@omenx.com?subject=Deposit Support"
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                <HelpCircle className="w-5 h-5" />
              </a>
              <button
                onClick={handleClose}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          <div className="px-4 pt-3 flex-shrink-0">
            <TabsList className="w-full grid grid-cols-3 h-9">
              <TabsTrigger value="wallet" className="text-xs">Wallet</TabsTrigger>
              <TabsTrigger value="crosschain" className="text-xs">Cross-Chain</TabsTrigger>
              <TabsTrigger value="fiat" className="text-xs">Buy Crypto</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="wallet" className="mt-0">
              <WalletDeposit onDone={handleClose} />
            </TabsContent>
            <TabsContent value="crosschain" className="mt-0">
              <CrossChainDeposit />
            </TabsContent>
            <TabsContent value="fiat" className="mt-0">
              <BuyWithFiat />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
