import { useState } from 'react';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
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
import { AccountPicker, type AccountKind } from '@/components/wallet/AccountPicker';
import { useAccountPreference, ACCOUNT_LABEL } from '@/hooks/useAccountPreference';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DepositDialog = ({ open, onOpenChange }: DepositDialogProps) => {
  const [activeTab, setActiveTab] = useState('wallet');
  const { account, setAccount } = useAccountPreference('deposit');
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleClose = () => {
    setActiveTab('wallet');
    onOpenChange(false);
  };

  const handleSelect = (next: AccountKind) => {
    setAccount(next);
    setPickerOpen(false);
  };

  const needsSelection = !account;

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

        {needsSelection ? (
          /* Step 1: Deposit to (account selection) */
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Deposit to</h3>
              <p className="text-xs text-muted-foreground">
                Pick which account will receive your funds. You can change this later.
              </p>
            </div>
            <AccountPickerInline selected={null} onSelect={handleSelect} />
          </div>
        ) : (
          <>
            {/* Account crumb — click to reopen picker */}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex items-center justify-between px-6 py-2.5 text-xs border-b border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <span className="text-muted-foreground">
                To: <span className="font-medium text-foreground">{ACCOUNT_LABEL[account]}</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Tabs */}
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

            <AccountPicker
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              selected={account}
              onSelect={handleSelect}
              title="Deposit to"
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * Inline account rows for the first-run Deposit selection screen (before the AccountPicker
 * overlay becomes the crumb-edit affordance).
 */
const AccountPickerInline = ({
  selected,
  onSelect,
}: {
  selected: AccountKind | null;
  onSelect: (a: AccountKind) => void;
}) => (
  <AccountPicker
    open
    onOpenChange={() => {}}
    selected={selected}
    onSelect={onSelect}
    title=""
    // Render inline: reuse AccountPicker's rows body only. Since AccountPicker owns Dialog/Sheet
    // shell, we instead inline via a lightweight duplication below to avoid nested Dialogs.
  />
);
