import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletWithdraw } from './WalletWithdraw';
import { CrossChainWithdraw } from './CrossChainWithdraw';
import { SellToFiat } from './SellToFiat';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawDialog = ({ open, onOpenChange }: WithdrawDialogProps) => {
  const [activeTab, setActiveTab] = useState('wallet');

  const handleClose = () => {
    setActiveTab('wallet');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 max-h-[90vh] flex flex-col" hideCloseButton>
        <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Withdraw</DialogTitle>
            <div className="flex items-center gap-2">
              <a
                href="mailto:customerservice@omenx.com?subject=Withdraw Support"
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          <div className="px-4 pt-3 flex-shrink-0">
            <TabsList className="w-full grid grid-cols-3 h-9">
              <TabsTrigger value="wallet" className="text-xs">Address</TabsTrigger>
              <TabsTrigger value="crosschain" className="text-xs">Wallet</TabsTrigger>
              <TabsTrigger value="fiat" className="text-xs">Fiat</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="wallet" className="mt-0">
              <WalletWithdraw onDone={handleClose} />
            </TabsContent>
            <TabsContent value="crosschain" className="mt-0">
              <CrossChainWithdraw />
            </TabsContent>
            <TabsContent value="fiat" className="mt-0">
              <SellToFiat />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
