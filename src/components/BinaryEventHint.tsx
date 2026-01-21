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
  /** 展示模式：inline=内联文字+图标, icon=仅图标 */
  variant?: "inline" | "icon";
  /** 自定义类名 */
  className?: string;
}

// Three-tier hint copy
const HINT_TEXTS = {
  // Layer 1: One-liner (default display)
  brief: "Yes/No belong to the same event; positions are displayed together.",
  // Layer 2: Explanation (hover/info)
  detailed: "In a binary event, Yes and No are opposite outcomes of the same event. Regardless of which side you choose, positions are consolidated for unified P&L calculation and settlement.",
};

/**
 * 二元事件仓位合并提示组件
 * 用于解释 Yes/No 仓位统一展示的逻辑
 */
export const BinaryEventHint = ({ 
  variant = "inline",
  className = ""
}: BinaryEventHintProps) => {
  const isMobile = useIsMobile();

  const DetailContent = () => (
    <div className="space-y-2 text-xs">
      <p className="font-medium text-foreground">Why is it displayed this way?</p>
      <p className="text-muted-foreground leading-relaxed">{HINT_TEXTS.detailed}</p>
    </div>
  );

  if (variant === "icon") {
    // 仅图标模式 - 用于空间有限的地方
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

  // 内联文字模式 - 完整展示第一层 + 可展开第二层
  return (
    <div className={`flex items-center gap-1.5 text-[11px] text-muted-foreground ${className}`}>
      <Info className="w-3 h-3 flex-shrink-0" />
      <span>{HINT_TEXTS.brief}</span>
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
 * 检查一个事件是否为二元事件（只有 Yes/No 两个选项）
 * @param options 事件选项列表
 * @returns 是否为二元事件
 */
export const isBinaryEvent = (options: { label: string }[]): boolean => {
  if (options.length !== 2) return false;
  const labels = options.map(o => o.label.toLowerCase());
  return labels.includes("yes") && labels.includes("no");
};

/**
 * 检查选项是否为 No 选项
 */
export const isNoOption = (optionLabel: string): boolean => {
  return optionLabel.toLowerCase() === "no";
};
