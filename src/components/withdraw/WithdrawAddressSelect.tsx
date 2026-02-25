import { Check, Plus } from 'lucide-react';
import { useWallets } from '@/hooks/useWallets';
import { MonoText } from '@/components/typography';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface WithdrawAddressSelectProps {
  open: boolean;
  onClose: () => void;
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
}

export const WithdrawAddressSelect = ({
  open,
  onClose,
  selectedAddress,
  onSelectAddress,
}: WithdrawAddressSelectProps) => {
  const { wallets } = useWallets();

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Select Address</SheetTitle>
        </SheetHeader>

        <div className="space-y-2 pb-6">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onSelectAddress(wallet.fullAddress)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                selectedAddress === wallet.fullAddress
                  ? "bg-primary/10 border border-primary"
                  : "bg-muted/30 border border-transparent hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                  {wallet.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{wallet.label}</div>
                  <MonoText className="text-sm text-muted-foreground">
                    {wallet.address}
                  </MonoText>
                </div>
              </div>
              {selectedAddress === wallet.fullAddress && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}

          {wallets.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No wallets connected</p>
              <button
                onClick={() => {
                  onClose();
                  // Navigate to wallet page to connect
                }}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Connect a wallet
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
