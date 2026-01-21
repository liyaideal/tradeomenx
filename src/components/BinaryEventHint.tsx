import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface BinaryEventHintProps {
  /** Display mode: inline=text+icon, icon=icon only */
  variant?: "inline" | "icon";
  /** The side user is betting: buy (Long) or sell (Short) */
  side?: "buy" | "sell";
  /** Custom class name */
  className?: string;
}

/**
 * Get dynamic hint text based on the side
 * No Long → Yes Short, No Short → Yes Long
 */
const getHintTexts = (side?: "buy" | "sell") => {
  const resultPosition = side === "buy" ? "Yes Short" : "Yes Long";
  return {
    brief: `This creates a ${resultPosition} position.`,
    detailed: `No Long = Yes Short. No Short = Yes Long. Your P&L is calculated correctly.`,
  };
};

/**
 * Binary event position hint component
 * Explains that No trades become Yes positions
 */
export const BinaryEventHint = ({ 
  variant = "inline",
  side,
  className = ""
}: BinaryEventHintProps) => {
  const isMobile = useIsMobile();
  const hintTexts = getHintTexts(side);

  const DetailContent = () => (
    <div className="space-y-2 text-xs">
      <p className="font-medium text-foreground">How does this work?</p>
      <p className="text-muted-foreground leading-relaxed">{hintTexts.detailed}</p>
    </div>
  );

  if (variant === "icon") {
    // Icon only mode - for limited space
    return isMobile ? (
      <Popover>
        <PopoverTrigger asChild>
          <button className={`inline-flex items-center justify-center ${className}`}>
            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72" side="top">
          <DetailContent />
        </PopoverContent>
      </Popover>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={`inline-flex items-center justify-center ${className}`}>
            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-72">
          <DetailContent />
        </TooltipContent>
      </Tooltip>
    );
  }

  // Inline text mode - show brief + expandable detail
  return (
    <div className={`flex items-center gap-1.5 text-[11px] text-muted-foreground ${className}`}>
      <Info className="w-3 h-3 flex-shrink-0" />
      <span>{hintTexts.brief}</span>
      {isMobile ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-primary hover:underline underline-offset-2">
              Learn more
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72" side="top">
            <DetailContent />
          </PopoverContent>
        </Popover>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-primary hover:underline underline-offset-2">
              Learn more
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-72">
            <DetailContent />
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

/**
 * Check if an event is binary (only Yes/No options)
 * @param options Event options list
 * @returns Whether it's a binary event
 */
export const isBinaryEvent = (options: { label: string }[]): boolean => {
  if (options.length !== 2) return false;
  const labels = options.map(o => o.label.toLowerCase());
  return labels.includes("yes") && labels.includes("no");
};

/**
 * Check if option is a No option
 */
export const isNoOption = (optionLabel: string): boolean => {
  return optionLabel.toLowerCase() === "no";
};
