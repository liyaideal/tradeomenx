import { CheckCircle2, Clock, FileSearch, FileText, Loader2, XCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RecoveryStatus } from '@/hooks/useRecoveryRequests';

interface Step {
  key: RecoveryStatus;
  label: string;
}

const STEPS: Step[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
];

const ORDER: Record<RecoveryStatus, number> = {
  submitted: 0,
  reviewing: 1,
  quoted: 2,
  accepted: 3,
  rejected: -1,
  processing: 4,
  completed: 5,
  unrecoverable: -1,
};

interface RecoveryStatusTimelineProps {
  status: RecoveryStatus;
}

export const RecoveryStatusTimeline = ({ status }: RecoveryStatusTimelineProps) => {
  const isFailed = status === 'rejected' || status === 'unrecoverable';
  const currentIdx = ORDER[status];

  if (isFailed) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <XCircle className="w-5 h-5 text-destructive shrink-0" />
        <div className="text-sm">
          <div className="font-medium text-destructive">
            {status === 'rejected' ? 'Request rejected' : 'Unrecoverable'}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            See note below for details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step.key} className="flex flex-col items-center flex-1 min-w-0">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border',
                isDone && 'bg-trading-green/20 border-trading-green/40 text-trading-green',
                isCurrent && 'bg-primary/20 border-primary/50 text-primary',
                !isDone && !isCurrent && 'bg-muted border-border text-muted-foreground'
              )}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : idx + 1}
            </div>
            <div
              className={cn(
                'mt-1.5 text-[10px] text-center truncate w-full',
                isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Status badge for list rows
export const RecoveryStatusBadge = ({ status }: { status: RecoveryStatus }) => {
  const cfg: Record<RecoveryStatus, { label: string; cls: string; Icon: typeof Clock }> = {
    submitted: { label: 'Submitted', cls: 'bg-muted text-foreground border-border', Icon: Send },
    reviewing: { label: 'Reviewing', cls: 'bg-primary/10 text-primary border-primary/30', Icon: FileSearch },
    quoted: { label: 'Quote ready', cls: 'bg-trading-yellow/10 text-trading-yellow border-trading-yellow/30', Icon: FileText },
    accepted: { label: 'Accepted', cls: 'bg-primary/10 text-primary border-primary/30', Icon: CheckCircle2 },
    processing: { label: 'Processing', cls: 'bg-primary/10 text-primary border-primary/30', Icon: Loader2 },
    completed: { label: 'Completed', cls: 'bg-trading-green/10 text-trading-green border-trading-green/30', Icon: CheckCircle2 },
    rejected: { label: 'Rejected', cls: 'bg-destructive/10 text-destructive border-destructive/30', Icon: XCircle },
    unrecoverable: { label: 'Unrecoverable', cls: 'bg-destructive/10 text-destructive border-destructive/30', Icon: XCircle },
  };
  const { label, cls, Icon } = cfg[status];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium', cls)}>
      <Icon className={cn('w-3 h-3', status === 'processing' && 'animate-spin')} />
      {label}
    </span>
  );
};
