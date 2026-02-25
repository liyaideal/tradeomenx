import { useState } from 'react';
import { Check, Plus, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWallets } from '@/hooks/useWallets';
import { MonoText } from '@/components/typography';
import { cn } from '@/lib/utils';
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

interface WithdrawAddressSelectDialogProps {
  open: boolean;
  onClose: () => void;
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
}

export const WithdrawAddressSelectDialog = ({
  open,
  onClose,
  selectedAddress,
  onSelectAddress,
}: WithdrawAddressSelectDialogProps) => {
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
      // Auto-select the newly added address
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

  if (showAddForm) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>Save a wallet address for withdrawals</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
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
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleAdd} disabled={isAdding} className="flex-1 btn-primary">
              {isAdding ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Select Withdrawal Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {wallets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <Wallet className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                No addresses saved yet
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          ) : (
            <>
              {wallets.map((wallet) => {
                const isSelected = wallet.fullAddress === selectedAddress;
                return (
                  <button
                    key={wallet.id}
                    onClick={() => onSelectAddress(wallet.fullAddress)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center p-2">
                        <img src={wallet.icon} alt={wallet.network} className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{wallet.label}</span>
                          {wallet.isPrimary && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <MonoText className="text-xs text-muted-foreground">
                          {wallet.address}
                        </MonoText>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Add Address button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
