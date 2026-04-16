import { LayoutList, LayoutGrid, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ViewMode = "list" | "grid-b" | "grid-c";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}

const isGrid = (v: ViewMode) => v === "grid-b" || v === "grid-c";

export const ViewToggle = ({ view, onChange }: ViewToggleProps) => (
  <div className="flex items-center rounded-lg border border-border/50 overflow-hidden">
    <button
      onClick={() => onChange("list")}
      className={cn(
        "p-1.5 transition-colors",
        view === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
      )}
      aria-label="List view"
    >
      <LayoutList className="h-4 w-4" />
    </button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "p-1.5 transition-colors flex items-center gap-0.5",
            isGrid(view) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => onChange("grid-b")}
          className="flex items-center justify-between text-xs"
        >
          Style B
          {view === "grid-b" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange("grid-c")}
          className="flex items-center justify-between text-xs"
        >
          Style C
          {view === "grid-c" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
