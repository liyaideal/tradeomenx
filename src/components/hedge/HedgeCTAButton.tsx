import { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { PolymarketConnectDialog } from "./PolymarketConnectDialog";

interface HedgeCTAButtonProps {
  label?: string;
  size?: "default" | "lg";
  className?: string;
  showArrow?: boolean;
  fullWidth?: boolean;
}

/**
 * Unified CTA button for the H2E landing page.
 * Three-state behavior:
 *  - Not signed in -> open AuthDialog/AuthSheet, then auto-prompt connect
 *  - Signed in, no Polymarket linked -> open PolymarketConnectDialog
 *  - Polymarket linked -> navigate to /portfolio/airdrops
 */
export const HedgeCTAButton = forwardRef<HTMLButtonElement, HedgeCTAButtonProps>(
  (
    { label = "Connect Polymarket Wallet", size = "lg", className, showArrow = true, fullWidth = false },
    ref
  ) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { user } = useUserProfile();
    const { activeAccounts } = useConnectedAccounts();

    const polymarketAccount = activeAccounts.find((a) => a.platform === "polymarket");

    const [authOpen, setAuthOpen] = useState(false);
    const [connectOpen, setConnectOpen] = useState(false);
    const [autoOpenAfterAuth, setAutoOpenAfterAuth] = useState(false);

    // After user finishes auth flow, auto-open the Polymarket connect dialog
    useEffect(() => {
      if (autoOpenAfterAuth && user && !authOpen) {
        if (polymarketAccount) {
          navigate("/portfolio/airdrops");
        } else {
          setConnectOpen(true);
        }
        setAutoOpenAfterAuth(false);
      }
    }, [autoOpenAfterAuth, user, authOpen, polymarketAccount, navigate]);

    const handleClick = () => {
      if (!user) {
        setAutoOpenAfterAuth(true);
        setAuthOpen(true);
        return;
      }
      if (polymarketAccount) {
        navigate("/portfolio/airdrops");
        return;
      }
      setConnectOpen(true);
    };

    const handleConnected = () => {
      navigate("/portfolio/airdrops");
    };

    return (
      <>
        <Button
          ref={ref}
          onClick={handleClick}
          size={size}
          className={cn(
            "btn-primary font-semibold",
            size === "lg" && "h-12 px-6 text-base",
            fullWidth && "w-full",
            className
          )}
        >
          {label}
          {showArrow && <ArrowRight className="w-4 h-4 ml-1" />}
        </Button>

        {isMobile ? (
          <AuthSheet open={authOpen} onOpenChange={setAuthOpen} />
        ) : (
          <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
        )}

        <PolymarketConnectDialog
          open={connectOpen}
          onOpenChange={setConnectOpen}
          onConnected={handleConnected}
        />
      </>
    );
  }
);

HedgeCTAButton.displayName = "HedgeCTAButton";
