import { useState } from "react";
import { Gift, ArrowRight, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePoints } from "@/hooks/usePoints";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface RedeemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RedeemDialog = ({ open, onOpenChange }: RedeemDialogProps) => {
  const isMobile = useIsMobile();
  const { pointsBalance, config, redeemPoints, isRedeeming } = usePoints();
  const [amount, setAmount] = useState("");

  const pointsPerCent = config?.exchange_rate?.points_per_cent || 10;
  const minThreshold = config?.min_redeem_threshold?.points || 100;
  const pointsToRedeem = parseInt(amount) || 0;
  const trialBalanceReceived = (pointsToRedeem / pointsPerCent) / 100;
  const isValid = pointsToRedeem >= minThreshold && pointsToRedeem <= pointsBalance;

  const handleRedeem = () => {
    if (isValid) {
      redeemPoints(pointsToRedeem);
      onOpenChange(false);
      setAmount("");
    }
  };

  const quickAmounts = [100, 500, 1000].filter(a => a <= pointsBalance);

  const content = (
    <div className="space-y-6 p-4">
      {/* Exchange Rate Info */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Info className="w-4 h-4" />
          <span>Exchange Rate</span>
        </div>
        <p className="font-medium">
          100 Points = $10 Trial Balance
        </p>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label>Points to Redeem</Label>
        <Input
          type="number"
          placeholder={`Min. ${minThreshold} points`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-lg font-mono"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Available: {pointsBalance.toLocaleString()} pts</span>
          <button
            className="text-primary hover:underline"
            onClick={() => setAmount(pointsBalance.toString())}
          >
            Max
          </button>
        </div>
      </div>

      {/* Quick Amounts */}
      {quickAmounts.length > 0 && (
        <div className="flex gap-2">
          {quickAmounts.map(a => (
            <Button
              key={a}
              variant="outline"
              size="sm"
              onClick={() => setAmount(a.toString())}
              className={amount === a.toString() ? 'border-primary' : ''}
            >
              {a}
            </Button>
          ))}
        </div>
      )}

      {/* Preview */}
      {pointsToRedeem > 0 && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">You'll receive</p>
              <p className="text-2xl font-bold text-primary font-mono">
                ${trialBalanceReceived.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Trial Balance</p>
            </div>
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleRedeem}
        disabled={!isValid || isRedeeming}
        className="w-full btn-primary"
        size="lg"
      >
        <Gift className="w-4 h-4 mr-2" />
        {isRedeeming ? "Processing..." : "Redeem Points"}
      </Button>

      {/* Notes */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Trial balance can be used for all trading products</p>
        <p>• Trial balance is consumed before real balance</p>
        <p>• Trial balance cannot be withdrawn</p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Redeem Points</DrawerTitle>
            <DrawerDescription>
              Convert your points to trial balance
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Redeem Points</DialogTitle>
          <DialogDescription>
            Convert your points to trial balance
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
