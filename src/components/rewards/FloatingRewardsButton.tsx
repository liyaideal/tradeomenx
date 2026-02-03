import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { usePoints } from "@/hooks/usePoints";
import { useTasks } from "@/hooks/useTasks";

interface FloatingRewardsButtonProps {
  className?: string;
}

export const FloatingRewardsButton = ({ className = "" }: FloatingRewardsButtonProps) => {
  const navigate = useNavigate();
  const { pointsBalance } = usePoints();
  const { tasks } = useTasks();
  const [isAnimating, setIsAnimating] = useState(true);

  // Check if there are claimable tasks
  const claimableTasks = tasks.filter(t => t.isCompleted && !t.isClaimed);
  const hasClaimable = claimableTasks.length > 0;

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => navigate("/rewards")}
      className={`
        fixed z-50 group
        ${className}
      `}
      aria-label="Open Rewards Center"
    >
      {/* Outer glow ring */}
      <div 
        className={`
          absolute inset-0 rounded-full bg-primary/30 blur-xl
          transition-all duration-1000
          ${isAnimating ? 'scale-150 opacity-40' : 'scale-100 opacity-20'}
        `}
      />
      
      {/* Middle glow ring */}
      <div 
        className={`
          absolute inset-0 rounded-full bg-primary/40
          transition-all duration-700 delay-100
          ${isAnimating ? 'scale-125 opacity-60' : 'scale-100 opacity-30'}
        `}
      />

      {/* Main button */}
      <div 
        className={`
          relative w-14 h-14 rounded-full 
          bg-gradient-to-br from-primary via-primary to-primary/80
          shadow-lg shadow-primary/30
          flex items-center justify-center
          transition-all duration-300
          group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/40
          group-active:scale-95
        `}
      >
        <Gift 
          className={`
            w-6 h-6 text-primary-foreground
            transition-transform duration-300
            ${isAnimating ? 'rotate-12' : 'rotate-0'}
            group-hover:rotate-12 group-hover:scale-110
          `}
        />

        {/* Notification badge */}
        {hasClaimable && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-trading-red flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {claimableTasks.length}
            </span>
          </div>
        )}
      </div>

      {/* Points preview tooltip */}
      <div 
        className={`
          absolute right-full mr-3 top-1/2 -translate-y-1/2
          px-3 py-1.5 rounded-lg
          bg-background/95 backdrop-blur-sm border border-border/50
          shadow-lg
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          pointer-events-none
          whitespace-nowrap
        `}
      >
        <p className="text-xs text-muted-foreground">Points Balance</p>
        <p className="font-bold text-primary font-mono">{pointsBalance.toLocaleString()}</p>
      </div>
    </button>
  );
};
