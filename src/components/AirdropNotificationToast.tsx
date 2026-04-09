import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";

export const AirdropNotificationToast = () => {
  const navigate = useNavigate();
  const { pendingAirdrops } = useAirdropPositions();
  const prevLengthRef = useRef(0);
  const hasFiredRef = useRef(false);

  // Use length as stable dependency instead of array reference
  const pendingCount = pendingAirdrops.length;

  useEffect(() => {
    console.log("[AirdropToast] pendingCount:", pendingCount, "prevLength:", prevLengthRef.current, "hasFired:", hasFiredRef.current);

    if (pendingCount === 0) {
      prevLengthRef.current = 0;
      hasFiredRef.current = false;
      return;
    }

    if (prevLengthRef.current === 0 && pendingCount > 0 && !hasFiredRef.current) {
      hasFiredRef.current = true;
      prevLengthRef.current = pendingCount;

      console.log("[AirdropToast] Firing toast for", pendingCount, "airdrops");
      const timer = setTimeout(() => {
        console.log("[AirdropToast] Timer fired, showing toasts");
        pendingAirdrops.forEach((airdrop) => {
          toast("🎁 New Airdrop Received!", {
            description: `You have a $${airdrop.airdropValue} counter-position on "${airdrop.counterEventName}". Activate it by making a trade.`,
            duration: 8000,
            action: {
              label: "View",
              onClick: () => navigate("/portfolio?tab=airdrops"),
            },
          });
        });
      }, 800);

      return () => clearTimeout(timer);
    }

    prevLengthRef.current = pendingCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCount]);

  return null;
};
