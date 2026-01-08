import { ExternalLink, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettlementEvidenceCardProps {
  sourceName: string | null;
  sourceUrl: string | null;
  settlementDescription: string | null;
  winningOptionLabel: string | null;
}

export const SettlementEvidenceCard = ({ 
  sourceName, 
  sourceUrl, 
  settlementDescription,
  winningOptionLabel 
}: SettlementEvidenceCardProps) => {
  return (
    <div className="space-y-4">
      {/* Winning Result */}
      {winningOptionLabel && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-trading-green/10 border border-trading-green/30">
          <div className="p-2 rounded-lg bg-trading-green/20">
            <FileCheck className="h-5 w-5 text-trading-green" />
          </div>
          <div>
            <div className="text-xs text-trading-green/80 uppercase tracking-wide mb-0.5">
              Final Result
            </div>
            <div className="text-lg font-semibold text-trading-green">
              {winningOptionLabel}
            </div>
          </div>
        </div>
      )}

      {/* Settlement Description */}
      {settlementDescription && (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Settlement Details
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {settlementDescription}
          </p>
        </div>
      )}

      {/* Source Link */}
      {sourceName && sourceUrl && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Resolution Source
            </div>
            <div className="text-sm font-medium text-foreground">
              {sourceName}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => window.open(sourceUrl, "_blank")}
          >
            <ExternalLink className="h-3 w-3" />
            View Source
          </Button>
        </div>
      )}

      {/* Fallback if no evidence */}
      {!settlementDescription && !sourceUrl && !winningOptionLabel && (
        <div className="p-4 rounded-xl bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            No settlement evidence available
          </p>
        </div>
      )}
    </div>
  );
};
