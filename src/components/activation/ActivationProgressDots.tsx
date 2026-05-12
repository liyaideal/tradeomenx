import { useActivationStage } from "@/hooks/useActivationStage";
import { FUNNEL_STEPS } from "@/lib/activation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActivationProgressDotsProps {
  className?: string;
}

const STAGE_INDEX: Record<string, number> = { S0: 0, S1: 1, S2: 2, S3: 3, S4: 4 };

/**
 * Tiny 4-dot funnel indicator. Hidden for guests and fully-engaged users
 * (zero noise once they've graduated).
 */
export function ActivationProgressDots({ className }: ActivationProgressDotsProps) {
  const { stage, isLoading } = useActivationStage();
  if (isLoading) return null;
  if (stage === "S0" || stage === "S4") return null;

  const reached = STAGE_INDEX[stage];

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn("flex items-center gap-1", className)}
            aria-label={`Activation progress: ${stage}`}
          >
            {FUNNEL_STEPS.map((step, i) => {
              const idx = i + 1; // S1=1, S2=2 ...
              const done = idx <= reached;
              const current = idx === reached;
              return (
                <span
                  key={step.id}
                  className={cn(
                    "block h-1.5 w-1.5 rounded-full transition-colors",
                    done ? "bg-success" : "bg-muted",
                    current && "ring-2 ring-success/30",
                  )}
                />
              );
            })}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-mono text-xs">
          {FUNNEL_STEPS.map((step, i) => {
            const idx = i + 1;
            const done = idx <= reached;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <span className={done ? "text-success" : "text-muted-foreground"}>
                  {done ? "✓" : "◌"}
                </span>
                <span>{step.label}</span>
              </div>
            );
          })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
