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

// Confetti particle component with more variety
const Confetti = ({ delay, left, color, size }: { delay: number; left: string; color: string; size: number }) => (
  <div
    className="absolute rounded-sm pointer-events-none"
    style={{
      left,
      top: '-20px',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      animation: `confetti-fall ${2 + Math.random() * 2}s ease-out ${delay}ms forwards`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }}
  />
);

// Sparkle component with better positioning
const SparkleParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <Sparkles
    className="absolute text-yellow-400 pointer-events-none"
    style={{
      left: x,
      top: y,
      animation: `sparkle 1.5s ease-in-out ${delay}ms infinite`,
      width: size,
      height: size,
    }}
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
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate confetti particles with more variety
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF69B4', '#00CED1'];
  const confetti = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1500,
    left: `${Math.random() * 100}%`,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: 6 + Math.random() * 8,
  }));

  // Generate sparkles around the treasure
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 800,
    x: `${15 + Math.random() * 70}%`,
    y: `${15 + Math.random() * 50}%`,
    size: 16 + Math.random() * 12,
  }));

  // Animate points counting up
  useEffect(() => {
    if (open) {
      setShowContent(false);
      setAnimatedPoints(0);
      setShowConfetti(false);
      
      // Show content after a brief delay
      const showTimer = setTimeout(() => {
        setShowContent(true);
        setShowConfetti(true);
      }, 200);
      
      // Animate points with easing
      const startTime = Date.now();
      const duration = 2000;
      
      const countTimer = setInterval(() => {
        const elapsed = Date.now() - startTime - 400; // delay start
        if (elapsed < 0) return;
        
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * pointsDropped);
        
        setAnimatedPoints(current);
        
        if (progress >= 1) {
          clearInterval(countTimer);
        }
      }, 16);

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

  const getTierEmoji = () => {
    switch (tier) {
      case 'high':
        return '💎';
      case 'low':
        return '🌟';
      default:
        return '✨';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent 
        className="sm:max-w-md border-primary/30 bg-gradient-to-b from-background to-background/95 overflow-visible"
        style={{ overflow: 'visible' }}
      >
        <DialogTitle className="sr-only">Treasure Claimed</DialogTitle>
        
        {/* Confetti container - positioned absolutely to cover the screen */}
        {showConfetti && (
          <div 
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 9999 }}
          >
            {confetti.map((c) => (
              <Confetti 
                key={c.id} 
                delay={c.delay} 
                left={c.left} 
                color={c.color} 
                size={c.size}
              />
            ))}
          </div>
        )}

        {/* Sparkles within dialog */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {sparkles.map((s) => (
              <SparkleParticle 
                key={s.id} 
                delay={s.delay} 
                x={s.x} 
                y={s.y}
                size={s.size}
              />
            ))}
          </div>
        )}

        {showContent && (
          <div className="relative z-10 flex flex-col items-center py-6 animate-scale-in">
            {/* Treasure image with glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-3xl animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <img 
                src={treasurePenguin} 
                alt="Treasure"
                className="w-28 h-28 object-contain relative z-10 drop-shadow-2xl"
              />
              <span className="absolute -top-2 -right-2 text-3xl animate-bounce">{getTierEmoji()}</span>
            </div>

            {/* Tier message */}
            <p className="text-base text-muted-foreground mb-3 text-center font-medium">
              {getTierMessage()}
            </p>

            {/* Points display with glow */}
            <div className="flex items-center gap-3 mb-3 relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500 animate-pulse relative z-10" />
              <span className="text-6xl font-bold text-primary font-mono tracking-tight relative z-10 tabular-nums">
                +{animatedPoints.toLocaleString()}
              </span>
            </div>
            
            <p className="text-xl font-semibold text-foreground mb-5">
              Points Received!
            </p>

            {/* New balance card */}
            <div className="bg-muted/60 rounded-xl px-6 py-3 mb-6 border border-primary/20">
              <p className="text-sm text-muted-foreground text-center">New Balance</p>
              <p className="text-2xl font-bold text-primary font-mono text-center tabular-nums">
                {newBalance.toLocaleString()} pts
              </p>
            </div>

            {/* Close button */}
            <Button 
              onClick={onClose}
              className="w-full btn-primary text-lg"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Awesome!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
