import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Clock, ArrowRight, X, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAirdropPositions, AirdropPosition } from "@/hooks/useAirdropPositions";
import { useUserProfile } from "@/hooks/useUserProfile";

const DAILY_MAX = 3;
const STORAGE_PREFIX = "omenx-airdrop-modal-count:";
const SESSION_PREFIX = "omenx-airdrop-modal-shown-ids:";

const getTodayKey = (userId: string) => `${STORAGE_PREFIX}${userId}:${new Date().toISOString().slice(0, 10)}`;
const getSessionKey = (userId: string) => `${SESSION_PREFIX}${userId}`;

const getDailyCount = (userId: string): number => {
  try {
    return parseInt(localStorage.getItem(getTodayKey(userId)) || "0", 10);
  } catch {
    return 0;
  }
};

const incrementDailyCount = (userId: string) => {
  try {
    const key = getTodayKey(userId);
    const current = parseInt(localStorage.getItem(key) || "0", 10);
    localStorage.setItem(key, String(current + 1));
  } catch {}
};

const getShownIds = (userId: string): Set<string> => {
  try {
    const raw = sessionStorage.getItem(getSessionKey(userId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const markIdShown = (userId: string, id: string) => {
  try {
    const shown = getShownIds(userId);
    shown.add(id);
    sessionStorage.setItem(getSessionKey(userId), JSON.stringify([...shown]));
  } catch {}
};

// Countdown hook
const useCountdown = (expiresAt: string) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
};

// Modal body content
const AirdropModalBody = ({
  airdrop,
  onActivate,
  onDismiss,
  isActivating,
}: {
  airdrop: AirdropPosition;
  onActivate: () => void;
  onDismiss: () => void;
  isActivating: boolean;
}) => {
  const countdown = useCountdown(airdrop.expiresAt);

  return (
    <div className="space-y-5 py-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-trading-green/20 flex items-center justify-center">
          <Gift className="w-6 h-6 text-trading-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">New Airdrop Position!</h3>
          <p className="text-xs text-muted-foreground">Free hedge detected from your Polymarket activity</p>
        </div>
      </div>

      {/* Detected position */}
      <div className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-trading-yellow" />
          <span>Detected Polymarket Position</span>
        </div>
        <p className="text-sm font-medium text-foreground leading-snug">{airdrop.externalEventName}</p>
        <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
          {airdrop.externalSide} @ ${airdrop.externalPrice.toFixed(2)}
        </Badge>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-trading-green/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-trading-green rotate-90" />
        </div>
      </div>

      {/* Free hedge */}
      <div className="bg-trading-green/5 rounded-xl p-4 space-y-3 border border-trading-green/20">
        <div className="flex items-center gap-2 text-xs text-trading-green">
          <Shield className="w-3.5 h-3.5" />
          <span>FREE OmenX Hedge Position</span>
        </div>
        <p className="text-sm font-medium text-foreground leading-snug">{airdrop.counterEventName}</p>
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-trading-green/20 text-trading-green border-trading-green/30">
            {airdrop.counterOptionLabel} · {airdrop.counterSide.toUpperCase()}
          </Badge>
          <span className="text-lg font-bold text-trading-green font-mono">${airdrop.airdropValue}</span>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-2 text-sm bg-muted/30 rounded-lg py-2.5 px-4 border border-border/50">
        <Clock className="w-4 h-4 text-trading-yellow" />
        <span className="text-muted-foreground">Activate within</span>
        <span className="font-mono font-bold text-foreground">{countdown}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
        <Button
          className="flex-1 bg-trading-green hover:bg-trading-green/90 text-white gap-2"
          onClick={onActivate}
          disabled={isActivating}
        >
          <Zap className="w-4 h-4" />
          {isActivating ? "Activating..." : "Activate Now"}
        </Button>
      </div>
    </div>
  );
};

export const AirdropHomepageModal = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { pendingAirdrops, activateAirdrop, isActivating } = useAirdropPositions();
  const { user } = useUserProfile();
  const [currentAirdrop, setCurrentAirdrop] = useState<AirdropPosition | null>(null);
  const [open, setOpen] = useState(false);
  const processedRef = useRef(false);

  const userId = user?.id ?? "guest";

  // Find the first unshown pending airdrop to display
  useEffect(() => {
    if (processedRef.current || pendingAirdrops.length === 0) return;

    const dailyCount = getDailyCount(userId);
    if (dailyCount >= DAILY_MAX) return;

    const shownIds = getShownIds(userId);
    const unshown = pendingAirdrops.find((a) => !shownIds.has(a.id));
    if (!unshown) return;

    processedRef.current = true;
    setCurrentAirdrop(unshown);
    setOpen(true);
    markIdShown(userId, unshown.id);
    incrementDailyCount(userId);
  }, [pendingAirdrops, userId]);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    setCurrentAirdrop(null);
  }, []);

  const handleActivate = useCallback(async () => {
    if (!currentAirdrop) return;
    await activateAirdrop(currentAirdrop.id);
    setOpen(false);
    navigate(`/trade?event=${currentAirdrop.counterEventId}`);
  }, [currentAirdrop, activateAirdrop, navigate]);

  if (!currentAirdrop) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => { if (!o) handleDismiss(); }}>
        <DrawerContent className="px-5 pb-8 pt-4">
          <AirdropModalBody
            airdrop={currentAirdrop}
            onActivate={handleActivate}
            onDismiss={handleDismiss}
            isActivating={isActivating}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md p-6 gap-0">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <AirdropModalBody
          airdrop={currentAirdrop}
          onActivate={handleActivate}
          onDismiss={handleDismiss}
          isActivating={isActivating}
        />
      </DialogContent>
    </Dialog>
  );
};
