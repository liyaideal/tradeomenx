import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useWallets } from '@/hooks/useWallets';
import { MonoText } from '@/components/typography';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

const NETWORKS = [
  "Ethereum",
  "BNB Smart Chain (BEP20)",
  "Tron (TRC20)",
  "Polygon",
  "Arbitrum One",
  "Solana",
  "Avalanche C-Chain",
  "Bitcoin",
];

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
  const { wallets, addWallet } = useWallets();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNetwork, setNewNetwork] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newLabel.trim() || !newAddress.trim() || !newNetwork) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsAdding(true);
    const result = await addWallet({
      label: newLabel.trim(),
      fullAddress: newAddress.trim(),
      network: newNetwork,
    });
    if (result.success) {
      toast.success("Address saved");
      setShowAddForm(false);
      setNewLabel("");
      setNewAddress("");
      setNewNetwork("");
      onSelectAddress(newAddress.trim());
    } else {
      toast.error(result.error || "Failed to save address");
    }
    setIsAdding(false);
  };

  const handleClose = () => {
    setShowAddForm(false);
    setNewLabel("");
    setNewAddress("");
    setNewNetwork("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>{showAddForm ? "Add New Address" : "Select Address"}</SheetTitle>
        </SheetHeader>

        {showAddForm ? (
          <div className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="e.g. My Binance, Cold Wallet"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                placeholder="Paste wallet address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Network</Label>
              <Select value={newNetwork} onValueChange={setNewNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.map((net) => (
                    <SelectItem key={net} value={net}>{net}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1 h-12">
                Back
              </Button>
              <Button onClick={handleAdd} disabled={isAdding} className="flex-1 h-12 btn-primary">
                {isAdding ? "Saving..." : "Save Address"}
              </Button>
            </div>
          </div>
        ) : (
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
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center p-2">
                    <img src={wallet.icon} alt={wallet.network} className="w-6 h-6" />
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

            {/* Add Address button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Address</span>
            </button>

            {wallets.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-muted-foreground text-sm">
                  Save addresses for quick withdrawals
                </p>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
