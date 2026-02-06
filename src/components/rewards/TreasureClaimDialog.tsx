import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "lucide-react";
import penguinGiftBox from "@/assets/penguin-gift-box.gif";
import "./TreasureClaimDialog.css";

interface TreasureClaimDialogProps {
  open: boolean;
  onClose: () => void;
  pointsDropped: number;
  tier: string;
  newBalance: number;
}

// Confetti Portal Component - renders directly to body
const ConfettiPortal = ({ show }: { show: boolean }) => {
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF69B4', '#00CED1', '#FF4500'];
  
  const confettiParticles = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1500,
      left: Math.random() * 100,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: 8 + Math.random() * 12,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
    }));
  }, [show]);

  if (!show) return null;

  return createPortal(
    <div className="treasure-confetti-container">
      {confettiParticles.map((particle) => (
        <div
          key={particle.id}
          className="treasure-confetti-particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>,
    document.body
  );
};

// Sparkle component with CSS animation
const SparkleParticle = ({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) => (
  <Sparkles
    className="treasure-sparkle"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}ms`,
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

  // Generate sparkle particles
  const sparkleParticles = useMemo(() => {
    if (!open) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 800,
      x: 10 + Math.random() * 80,
      y: 5 + Math.random() * 55,
      size: 16 + Math.random() * 12,
      duration: 1 + Math.random() * 0.5,
    }));
  }, [open]);

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
      }, 100);
      
      // Animate points with easing - start after content shows
      const startDelay = 400;
      const duration = 2000;
      const startTime = Date.now() + startDelay;
      
      const countTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 0) return;
        
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * pointsDropped);
        
        setAnimatedPoints(current);
        
        if (progress >= 1) {
          setAnimatedPoints(pointsDropped);
          clearInterval(countTimer);
        }
      }, 16);

      return () => {
        clearTimeout(showTimer);
        clearInterval(countTimer);
      };
    } else {
      setShowContent(false);
      setAnimatedPoints(0);
      setShowConfetti(false);
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
    <>
      {/* Confetti rendered via portal to body */}
      <ConfettiPortal show={showConfetti} />
      
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent 
          className="sm:max-w-md border-primary/30 bg-gradient-to-b from-background to-background/95"
          style={{ overflow: 'visible' }}
        >
          <DialogTitle className="sr-only">Treasure Claimed</DialogTitle>

          {/* Sparkles within dialog area */}
          {showContent && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              {sparkleParticles.map((particle) => (
                <SparkleParticle
                  key={particle.id}
                  x={particle.x}
                  y={particle.y}
                  size={particle.size}
                  delay={particle.delay}
                  duration={particle.duration}
                />
              ))}
            </div>
          )}

          {showContent && (
            <div className="relative z-20 flex flex-col items-center py-6 animate-scale-in">
              {/* Treasure image with enhanced glow */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-yellow-400/30 blur-3xl animate-pulse" />
                <div className="absolute -inset-6 rounded-full bg-primary/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <img 
                  src={penguinGiftBox} 
                  alt="Treasure"
                  className="w-28 h-28 object-contain relative z-10 drop-shadow-2xl"
                />
                <span className="absolute -top-3 -right-3 text-4xl animate-bounce">{getTierEmoji()}</span>
              </div>

              {/* Tier message */}
              <p className="text-base text-muted-foreground mb-3 text-center font-medium">
                {getTierMessage()}
              </p>

              {/* Points display with glow effect */}
              <div className="flex items-center gap-3 mb-3 relative">
                <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full" />
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
    </>
  );
};
