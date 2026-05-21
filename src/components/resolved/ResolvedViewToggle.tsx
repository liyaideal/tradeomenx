import { cn } from "@/lib/utils";

export type ResolvedViewMode = "all" | "mine";

interface ResolvedViewToggleProps {
  value: ResolvedViewMode;
  onChange: (next: ResolvedViewMode) => void;
}

const TABS: { id: ResolvedViewMode; label: string }[] = [
  { id: "all", label: "All Resolved" },
  { id: "mine", label: "My Settled" },
];

export const ResolvedViewToggle = ({ value, onChange }: ResolvedViewToggleProps) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-1">
      {TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
