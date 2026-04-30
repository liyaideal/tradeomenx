import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLongCountdown, formatShortCountdown, getCountdownParts } from "@/lib/mainnetLaunch";

interface CountdownProps {
  compact?: boolean;
  className?: string;
}

export const Countdown = ({ compact, className }: CountdownProps) => {
  const [parts, setParts] = useState(() => getCountdownParts());

  useEffect(() => {
    const timer = window.setInterval(() => setParts(getCountdownParts()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={cn("inline-flex items-center gap-2 font-mono", className)}>
      <Clock className="h-4 w-4 text-mainnet-gold" />
      <span>{compact ? formatShortCountdown(parts) : formatLongCountdown(parts)}</span>
    </div>
  );
};
