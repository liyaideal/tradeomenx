import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAirdropPositions } from "@/hooks/useAirdropPositions";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";

const TOAST_ACCOUNTS_KEY = "airdrop_toast_account_ids";

export const AirdropNotificationToast = () => {
  const navigate = useNavigate();
  const { pendingAirdrops } = useAirdropPositions();
  const { activeAccounts } = useConnectedAccounts();
  const firedForRef = useRef<Set<string>>(new Set());

  // Track which account IDs we've already toasted for
  useEffect(() => {
    // Initialize from sessionStorage
    try {
      const saved = sessionStorage.getItem(TOAST_ACCOUNTS_KEY);
      if (saved) firedForRef.current = new Set(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const activeIds = activeAccounts.map((a) => a.id).sort().join(",");
  const pendingCount = pendingAirdrops.length;

  useEffect(() => {
    if (pendingCount === 0 || activeAccounts.length === 0) return;

    // Check if any active account is new (not yet toasted)
    const newAccountIds = activeAccounts
      .filter((a) => !firedForRef.current.has(a.id))
      .map((a) => a.id);

    if (newAccountIds.length === 0) return;

    // Mark as fired
    newAccountIds.forEach((id) => firedForRef.current.add(id));
    try {
      sessionStorage.setItem(TOAST_ACCOUNTS_KEY, JSON.stringify([...firedForRef.current]));
    } catch { /* ignore */ }

    // Fire toasts with delay
    const timer = setTimeout(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIds, pendingCount]);

  return null;
};
