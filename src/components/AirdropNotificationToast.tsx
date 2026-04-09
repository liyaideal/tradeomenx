import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";
import { useUserProfile } from "@/hooks/useUserProfile";

export const AirdropNotificationToast = () => {
  const navigate = useNavigate();
  const { pendingAirdrops } = useAirdropPositions();
  const { user } = useUserProfile();
  const prevIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const userId = user?.id ?? "guest";

  useEffect(() => {
    // Build current set of pending airdrop IDs
    const currentIds = new Set(pendingAirdrops.map((a) => a.id));

    // On first render with data, just record the IDs without toasting
    // This prevents toasting on page navigation when airdrops already exist
    if (!initializedRef.current) {
      // Only initialize once we have actual data or confirmed empty
      prevIdsRef.current = currentIds;
      initializedRef.current = true;
      return;
    }

    // Find newly appeared airdrop IDs
    const newIds = [...currentIds].filter((id) => !prevIdsRef.current.has(id));

    if (newIds.length > 0) {
      // Fire toast for each new airdrop
      const timer = setTimeout(() => {
        newIds.forEach((id) => {
          const airdrop = pendingAirdrops.find((a) => a.id === id);
          if (!airdrop) return;
          toast("🎁 New Airdrop Received!", {
            description: `You have a $${airdrop.airdropValue} counter-position on "${airdrop.counterEventName}". Activate it by making a trade.`,
            duration: 8000,
            action: {
              label: "View",
              onClick: () => navigate("/portfolio?tab=airdrops"),
            },
          });
        });
      }, 500);

      prevIdsRef.current = currentIds;
      return () => clearTimeout(timer);
    }

    prevIdsRef.current = currentIds;
  }, [pendingAirdrops, navigate, userId]);

  // Reset initialization when user changes
  useEffect(() => {
    initializedRef.current = false;
    prevIdsRef.current = new Set();
  }, [userId]);

  return null;
};
