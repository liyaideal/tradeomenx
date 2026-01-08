import { CalendarDays, Clock, Scale, FileText } from "lucide-react";
import { format } from "date-fns";

interface EventRulesCardProps {
  startDate: string | null;
  endDate: string | null;
  settledAt: string | null;
  rules: string | null;
  isMobile?: boolean;
}

interface RuleItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const RuleItem = ({ icon, label, value }: RuleItemProps) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
    <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
    </div>
  </div>
);

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return "—";
  }
};

const formatDateRange = (start: string | null, end: string | null): string => {
  if (!start && !end) return "—";
  const startFormatted = start ? format(new Date(start), "MMM d, yyyy") : "—";
  const endFormatted = end ? format(new Date(end), "MMM d, yyyy") : "—";
  return `${startFormatted} → ${endFormatted}`;
};

export const EventRulesCard = ({ 
  startDate, 
  endDate, 
  settledAt, 
  rules,
  isMobile = false 
}: EventRulesCardProps) => {
  const items = [
    {
      icon: <CalendarDays className="h-4 w-4" />,
      label: "Created Time",
      value: formatDate(startDate),
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: "Trading Period",
      value: formatDateRange(startDate, endDate),
    },
    {
      icon: <Scale className="h-4 w-4" />,
      label: "Settlement Time",
      value: formatDate(settledAt),
    },
  ];

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {items.map((item) => (
          <RuleItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
      
      {rules && (
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Settlement Rules</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {rules}
          </p>
        </div>
      )}
    </div>
  );
};
