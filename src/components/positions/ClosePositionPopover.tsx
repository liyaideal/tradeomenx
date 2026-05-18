import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ClosePositionForm } from "./ClosePositionForm";

interface ClosePositionPopoverProps {
  children: React.ReactNode;
  event: string;
  option: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  markPrice: number;
  margin: number;
  leverage: string;
  fullCloseOnly?: boolean;
  onConfirm: (closeQty: number) => void | Promise<void>;
  isClosing?: boolean;
  side_?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

/**
 * Desktop-only Close Position popover. Mobile must use ClosePositionDrawer.
 */
export const ClosePositionPopover = ({
  children,
  option,
  side,
  size,
  entryPrice,
  markPrice,
  margin,
  fullCloseOnly = false,
  onConfirm,
  isClosing = false,
  side_ = "top",
  align = "end",
}: ClosePositionPopoverProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async (qty: number) => {
    await onConfirm(qty);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side_}
        align={align}
        className="w-[300px] p-0 bg-card border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2.5 border-b border-border/40">
          <div className="text-sm font-semibold text-foreground">Close position</div>
        </div>
        <div className="px-3 py-3">
          <ClosePositionForm
            option={option}
            side={side}
            size={size}
            entryPrice={entryPrice}
            markPrice={markPrice}
            margin={margin}
            fullCloseOnly={fullCloseOnly}
            onConfirm={handleConfirm}
            isClosing={isClosing}
            showHeader
            variant="compact"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
