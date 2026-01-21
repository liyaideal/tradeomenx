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

// 三层提示文案
const HINT_TEXTS = {
  // 第一层：一句话版（默认展示）
  brief: "Yes/No 属于同一事件，仓位会统一展示。",
  // 第二层：解释版（hover/info）
  detailed: "在二元事件中，Yes 和 No 是同一事件的相反结果。无论选择哪一边，仓位都会合并展示，以便统一计算盈亏和结算。",
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
      <p className="font-medium text-foreground">为什么这样显示？</p>
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
              了解更多
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
              了解更多
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
