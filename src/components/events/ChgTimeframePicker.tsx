import { cn } from "@/lib/utils";
import { ChgTimeframe } from "@/hooks/useMarketListData";

const OPTIONS: { value: ChgTimeframe; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "24h", label: "24H" },
];

interface Props {
  value: ChgTimeframe;
  onChange: (v: ChgTimeframe) => void;
}

export const ChgTimeframePicker = ({ value, onChange }: Props) => (
  <div className="inline-flex items-center rounded-md border border-border/50 overflow-hidden">
    {OPTIONS.map(({ value: v, label }) => (
      <button
        key={v}
        onClick={() => onChange(v)}
        className={cn(
          "px-2 py-1 text-[10px] font-medium transition-colors",
          value === v
            ? "bg-primary/20 text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
      </button>
    ))}
  </div>
);
