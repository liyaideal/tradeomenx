import { Check } from "lucide-react";
import { format } from "date-fns";

interface SettlementTimelineProps {
  startDate: string | null;
  endDate: string | null;
  settledAt: string | null;
}

interface TimelineStep {
  label: string;
  date: string | null;
  completed: boolean;
}

export const SettlementTimeline = ({ startDate, endDate, settledAt }: SettlementTimelineProps) => {
  const steps: TimelineStep[] = [
    {
      label: "Market Opened",
      date: startDate,
      completed: !!startDate,
    },
    {
      label: "Trading Ended",
      date: endDate,
      completed: !!endDate,
    },
    {
      label: "Settled",
      date: settledAt,
      completed: !!settledAt,
    },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return format(new Date(dateStr), "MMM d, yyyy HH:mm");
  };

  return (
    <div className="flex items-center justify-between relative">
      {/* Connecting line */}
      <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-border" />
      <div 
        className="absolute top-3.5 left-0 h-0.5 bg-trading-green transition-all"
        style={{ 
          width: settledAt ? "100%" : endDate ? "66%" : startDate ? "33%" : "0%" 
        }}
      />
      
      {steps.map((step, index) => (
        <div key={step.label} className="flex flex-col items-center relative z-10">
          <div 
            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
              step.completed 
                ? "bg-trading-green border-trading-green" 
                : "bg-background border-border"
            }`}
          >
            {step.completed && <Check className="h-4 w-4 text-primary-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground mt-2 text-center">
            {step.label}
          </span>
          <span className="text-[10px] text-muted-foreground/70 mt-0.5 text-center font-mono">
            {formatDate(step.date)}
          </span>
        </div>
      ))}
    </div>
  );
};
