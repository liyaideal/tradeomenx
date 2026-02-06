import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "lucide-react";
import treasurePenguin from "@/assets/treasure-penguin.gif";

interface TreasureClaimDialogProps {
  open: boolean;
  onClose: () => void;
  pointsDropped: number;
  tier: string;
  newBalance: number;
}

// Confetti particle component
const Confetti = ({ delay, left, color }: { delay: number; left: string; color: string }) => (
  <div
    className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
    style={{
      left,
      top: '-10px',
      backgroundColor: color,
      animationDelay: `${delay}ms`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }}
  />
);

// Sparkle component
const Sparkle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <Sparkles
    className="absolute text-yellow-400 animate-sparkle"
    style={{
      left: x,
      top: y,
      animationDelay: `${delay}ms`,
    }}
    size={20}
  />
);

export const TreasureClaimDialog = ({
  open,
  onClose,
  pointsDropped,
  tier,
  newBalance,
}: TreasureClaimDialogProps) => {
  const [showContent, setShowContent] = useState(false);
  const [animatedPoints, setAnimatedPoints] = useState(0);

  // Generate confetti particles
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2000,
    left: `${Math.random() * 100}%`,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));

  // Generate sparkles
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1000,
    x: `${20 + Math.random() * 60}%`,
    y: `${20 + Math.random() * 60}%`,
  }));

  // Animate points counting up
  useEffect(() => {
    if (open) {
      setShowContent(false);
      setAnimatedPoints(0);
      
      // Show content after a brief delay
      const showTimer = setTimeout(() => setShowContent(true), 300);
      
      // Animate points
      const duration = 2000;
      const steps = 60;
      const increment = pointsDropped / steps;
      let current = 0;
      
      const countTimer = setInterval(() => {
        current += increment;
        if (current >= pointsDropped) {
          setAnimatedPoints(pointsDropped);
          clearInterval(countTimer);
        } else {
          setAnimatedPoints(Math.floor(current));
        }
      }, duration / steps);

      return () => {
        clearTimeout(showTimer);
        clearInterval(countTimer);
      };
    }
  }, [open, pointsDropped]);

  const getTierMessage = () => {
    switch (tier) {
      case 'high':
        return '🎉 JACKPOT! You hit the legendary tier!';
      case 'low':
        return '🎁 Nice! You found some bonus points!';
      default:
        return '✨ Amazing! You discovered a treasure!';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden border-primary/30 bg-gradient-to-b from-background to-background/95">
        <DialogTitle className="sr-only">Treasure Claimed</DialogTitle>
        
        {/* Confetti overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c) => (
            <Confetti key={c.id} delay={c.delay} left={c.left} color={c.color} />
          ))}
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((s) => (
            <Sparkle key={s.id} delay={s.delay} x={s.x} y={s.y} />
          ))}
        </div>

        {showContent && (
          <div className="relative z-10 flex flex-col items-center py-6 animate-scale-in">
            {/* Treasure image */}
            <div className="relative mb-4">
              <img 
                src={treasurePenguin} 
                alt="Treasure"
                className="w-24 h-24 object-contain"
              />
              <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-2xl -z-10" />
            </div>

            {/* Tier message */}
            <p className="text-sm text-muted-foreground mb-2 text-center">
              {getTierMessage()}
            </p>

            {/* Points display */}
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="text-5xl font-bold text-primary font-mono tracking-tight">
                +{animatedPoints.toLocaleString()}
              </span>
            </div>
            
            <p className="text-lg font-medium text-foreground mb-4">
              Points Received!
            </p>

            {/* New balance */}
            <div className="bg-muted/50 rounded-lg px-4 py-2 mb-6">
              <p className="text-sm text-muted-foreground">New Balance</p>
              <p className="text-xl font-bold text-primary font-mono">
                {newBalance.toLocaleString()} pts
              </p>
            </div>

            {/* Close button */}
            <Button 
              onClick={onClose}
              className="w-full btn-primary"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Awesome!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
