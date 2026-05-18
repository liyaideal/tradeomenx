import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClosePositionForm } from "./ClosePositionForm";

interface ClosePositionDialogProps {
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
}

/**
 * Desktop Close Position dialog (per DESIGN.md §5 Overlays:
 * 资金/不可逆确认类操作在桌面必须使用 Dialog；移动端对等组件为 ClosePositionDrawer)。
 */
export const ClosePositionDialog = ({
  children,
  option,
  side,
  size,
  entryPrice,
  markPrice,
  margin,
  leverage,
  fullCloseOnly = false,
  onConfirm,
  isClosing = false,
}: ClosePositionDialogProps) => {
  const safeSize = Math.max(1, Math.floor(size));
  const description = `${option} · ${side === "long" ? "Long" : "Short"} ${leverage} · ${safeSize.toLocaleString()} contracts`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Close position</DialogTitle>
          <DialogDescription className="text-xs">{description}</DialogDescription>
        </DialogHeader>
        <ClosePositionForm
          option={option}
          side={side}
          size={size}
          entryPrice={entryPrice}
          markPrice={markPrice}
          margin={margin}
          fullCloseOnly={fullCloseOnly}
          onConfirm={onConfirm}
          isClosing={isClosing}
          showHeader={false}
          variant="comfortable"
        />
      </DialogContent>
    </Dialog>
  );
};
