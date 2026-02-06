import { useState } from "react";
import { useTreasureDrop } from "@/hooks/useTreasureDrop";
import treasurePenguin from "@/assets/treasure-penguin.gif";
import { TreasureClaimDialog } from "./TreasureClaimDialog";

interface TreasureDropButtonProps {
  className?: string;
}

export const TreasureDropButton = ({ className = "" }: TreasureDropButtonProps) => {
  const { shouldShowTreasure, claimTreasure, isClaiming, hideTreasure } = useTreasureDrop();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    pointsDropped: number;
    tier: string;
    newBalance: number;
  } | null>(null);

  if (!shouldShowTreasure) return null;

  const handleClick = async () => {
    try {
      const result = await claimTreasure();
      setClaimResult({
        pointsDropped: result.pointsDropped,
        tier: result.tier,
        newBalance: result.newBalance,
      });
      setDialogOpen(true);
    } catch (error) {
      console.error('Failed to claim treasure:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setClaimResult(null);
    hideTreasure();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isClaiming}
        className={`
          fixed bottom-24 right-4 z-50
          animate-bounce
          transition-all duration-300
          hover:scale-110
          active:scale-95
          disabled:opacity-50
          ${className}
        `}
        aria-label="Open Treasure"
      >
        <div className="relative w-20 h-20">
          <img 
            src={treasurePenguin} 
            alt="Treasure"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10 animate-pulse" />
        </div>
      </button>

      <TreasureClaimDialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        pointsDropped={claimResult?.pointsDropped || 0}
        tier={claimResult?.tier || 'mid'}
        newBalance={claimResult?.newBalance || 0}
      />
    </>
  );
};
