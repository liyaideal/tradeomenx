import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { AuthContent } from "./AuthContent";
import { useAuth, type AuthStep } from "@/hooks/useAuth";

interface AuthSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthSheet = ({ open, onOpenChange }: AuthSheetProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<AuthStep>("login");
  const [isLoading, setIsLoading] = useState(false);

  // Move to wallet creation step when user logs in
  useEffect(() => {
    if (user && open) {
      setStep("createWallet");
    }
  }, [user, open]);

  const handleSuccess = () => {
    onOpenChange(false);
    setStep("login"); // Reset for next time
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep("login"); // Reset step when closing
    }
    onOpenChange(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl px-5 pt-4 pb-8 bg-background border-t border-border/50 max-h-[85vh]"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
        
        <SheetHeader className="mb-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <SheetTitle className="sr-only">Sign In</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto">
          <AuthContent
            step={step}
            setStep={setStep}
            onSuccess={handleSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            variant="mobile"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
