import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";

const NOTIFIED_KEY = "airdrop_toast_notified_ids";

const getNotifiedIds = (): Set<string> => {
  try {
    const raw = sessionStorage.getItem(NOTIFIED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveNotifiedIds = (ids: Set<string>) => {
  sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
};

export const AirdropNotificationToast = () => {
  const navigate = useNavigate();
  const { pendingAirdrops } = useAirdropPositions();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (pendingAirdrops.length === 0) return;
    // Small delay to avoid firing during initial hydration flicker
    const timer = setTimeout(() => {
      const notified = getNotifiedIds();
      const newOnes = pendingAirdrops.filter((a) => !notified.has(a.id));

      if (newOnes.length === 0) return;

      newOnes.forEach((airdrop) => {
        notified.add(airdrop.id);
        toast("🎁 New Airdrop Received!", {
          description: `You have a $${airdrop.airdropValue} counter-position on "${airdrop.counterEventName}". Activate it by making a trade.`,
          duration: 8000,
          action: {
            label: "View",
            onClick: () => navigate("/portfolio?tab=airdrops"),
          },
        });
      });

      saveNotifiedIds(notified);
    }, 500);

    return () => clearTimeout(timer);
  }, [pendingAirdrops, navigate]);

  return null;
};
