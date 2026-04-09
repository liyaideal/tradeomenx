import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";

export const AirdropNotificationToast = () => {
  const navigate = useNavigate();
  const { pendingAirdrops } = useAirdropPositions();
  const prevCountRef = useRef(0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Skip the very first render to avoid showing toast on page load
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevCountRef.current = pendingAirdrops.length;
      return;
    }

    const newCount = pendingAirdrops.length;
    const prevCount = prevCountRef.current;

    if (newCount > prevCount) {
      const newAirdrops = pendingAirdrops.slice(0, newCount - prevCount);
      newAirdrops.forEach((airdrop) => {
        toast("🎁 New Airdrop Received!", {
          description: `You have a $${airdrop.airdropValue} counter-position on "${airdrop.counterEventName}". Activate it by making a trade.`,
          duration: 8000,
          action: {
            label: "View",
            onClick: () => navigate("/portfolio?tab=airdrops"),
          },
        });
      });
    }

    prevCountRef.current = newCount;
  }, [pendingAirdrops, navigate]);

  return null;
};
