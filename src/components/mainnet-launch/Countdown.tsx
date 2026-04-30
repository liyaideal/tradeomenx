import { useEffect, useState } from "react";
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
    <span className={cn("inline-flex items-center gap-2 font-mono", className)}>
      {compact ? formatShortCountdown(parts) : formatLongCountdown(parts)}
    </span>
  );
};
