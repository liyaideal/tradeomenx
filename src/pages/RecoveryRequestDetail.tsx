import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Copy, Loader2, ExternalLink, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRecoveryRequest, useRecoveryRequests } from '@/hooks/useRecoveryRequests';
import { RecoveryStatusTimeline, RecoveryStatusBadge } from '@/components/recovery/RecoveryStatusTimeline';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { EventsDesktopHeader } from '@/components/EventsDesktopHeader';
import { BottomNav } from '@/components/BottomNav';

export default function RecoveryRequestDetailPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams();
  const { data: req, isLoading } = useRecoveryRequest(id);
  const { respondToQuote } = useRecoveryRequests();

  if (isMobile === undefined) return null;

  const back = () => navigate('/wallet/recovery');

  const renderShell = (children: React.ReactNode) => {
    if (isMobile) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <MobileHeader onBack={back} />
          {children}
          <BottomNav />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <EventsDesktopHeader />
        {children}
      </div>
    );
  };

  if (isLoading) {
    return renderShell(
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>,
    );
  }

  if (!req) {
    return renderShell(
      <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Request not found.
      </div>,
    );
  }

  const copy = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    toast.success(`${label} copied`);
  };

  const onAccept = async () => {
    try {
      await respondToQuote.mutateAsync({ id: req.id, accept: true });
      toast.success('Quote accepted. Processing will begin shortly.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to accept');
    }
  };

  const onDecline = async () => {
    try {
      await respondToQuote.mutateAsync({ id: req.id, accept: false });
      toast.success('Quote declined.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to decline');
    }
  };

  const showQuoteActions = req.status === 'quoted';

  // Reusable card content blocks
  const statusCard = (
    <div className={`rounded-xl border bg-card ${isMobile ? 'p-4' : 'p-6'} space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className={isMobile ? 'text-sm font-semibold' : 'text-base font-semibold'}>Status</h2>
        <RecoveryStatusBadge status={req.status} />
      </div>
      <RecoveryStatusTimeline status={req.status} />
    </div>
  );

  const quoteCard = showQuoteActions && req.estimated_return != null && (
    <div className={`rounded-xl border border-trading-yellow/30 bg-trading-yellow/5 ${isMobile ? 'p-4' : 'p-6'} space-y-3`}>
      <div className="text-sm font-semibold">Quote received — please confirm</div>
      <div className="space-y-1.5 text-sm">
        <Row label="Amount sent" value={`$${Number(req.claimed_amount).toFixed(2)}`} />
        <Row
          label={`Recovery fee (${req.fee_percent}%)`}
          value={`-$${((Number(req.claimed_amount) * Number(req.fee_percent)) / 100).toFixed(2)}`}
        />
        <div className="border-t pt-2 flex items-center justify-between">
          <span className="font-medium">You will receive</span>
          <span className="font-mono font-semibold text-trading-yellow">
            ${Number(req.estimated_return).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onDecline}
          disabled={respondToQuote.isPending}
          className={`flex-1 ${isMobile ? 'h-11 rounded-xl' : 'h-10 rounded-lg'}`}
        >
          <X className="w-4 h-4 mr-1.5" />
          Decline
        </Button>
        <Button
          onClick={onAccept}
          disabled={respondToQuote.isPending}
          className={`flex-1 ${isMobile ? 'h-11 rounded-xl' : 'h-10 rounded-lg'}`}
        >
          <Check className="w-4 h-4 mr-1.5" />
          Accept
        </Button>
      </div>
    </div>
  );

  const creditedCard = req.status === 'completed' && req.estimated_return != null && (
    <div className={`rounded-xl border border-trading-green/30 bg-trading-green/5 ${isMobile ? 'p-4' : 'p-6'} space-y-2`}>
      <div className="text-sm font-semibold text-trading-green">Funds credited</div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Credited to balance</span>
        <span className="font-mono font-semibold text-trading-green">
          +${Number(req.estimated_return).toFixed(2)}
        </span>
      </div>
      {req.processed_tx_hash && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-trading-green/20">
          <span className="text-muted-foreground">Internal ref</span>
          <span className="font-mono">{truncate(req.processed_tx_hash)}</span>
        </div>
      )}
    </div>
  );

  const detailsCard = (
    <div className={`rounded-xl border bg-card ${isMobile ? 'p-4' : 'p-6'} space-y-3`}>
      <h2 className={isMobile ? 'text-sm font-semibold mb-1' : 'text-base font-semibold mb-1'}>
        Request details
      </h2>
      <DetailRow label="Amount sent" value={`$${Number(req.claimed_amount).toFixed(2)}`} mono />
      <DetailRow label="Token" value={req.wrong_token} />
      <DetailRow label="Wrong network" value={req.wrong_network} />
      <DetailRow
        label="Transaction hash"
        value={truncate(req.tx_hash)}
        mono
        onCopy={() => copy(req.tx_hash, 'Hash')}
      />
      <DetailRow
        label="Sender wallet"
        value={truncate(req.sender_address)}
        mono
        onCopy={() => copy(req.sender_address, 'Address')}
      />
      <DetailRow label="Submitted" value={new Date(req.created_at).toLocaleString()} />
      {req.user_note && (
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">Your note</div>
          <div className="text-sm text-foreground whitespace-pre-wrap">{req.user_note}</div>
        </div>
      )}
    </div>
  );

  const adminCard = req.admin_note && (
    <div className={`rounded-xl border bg-card ${isMobile ? 'p-4' : 'p-6'} space-y-1.5`}>
      <h2 className={isMobile ? 'text-sm font-semibold' : 'text-base font-semibold'}>
        Message from OmenX
      </h2>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{req.admin_note}</p>
    </div>
  );

  const supportFooter = (
    <div className="text-xs text-muted-foreground text-center pt-2">
      Questions?{' '}
      <a
        href={`mailto:customerservice@omenx.com?subject=Recovery request ${req.id}`}
        className="text-primary hover:underline inline-flex items-center gap-0.5"
      >
        Contact support
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );

  // ---- Desktop ----
  if (!isMobile) {
    return renderShell(
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div>
            <button
              onClick={back}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Recovery requests
            </button>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-semibold">Recovery request</h1>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  #{req.id.slice(0, 8)}
                </p>
              </div>
              <RecoveryStatusBadge status={req.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
            <div className="space-y-6">
              {statusCard}
              {quoteCard}
              {creditedCard}
              {adminCard}
            </div>
            <div className="space-y-6">
              {detailsCard}
              {supportFooter}
            </div>
          </div>
        </div>
      </main>,
    );
  }

  // ---- Mobile ----
  return renderShell(
    <main className="flex-1 overflow-auto pb-24 px-4 py-5 space-y-5">
      {statusCard}
      {quoteCard}
      {creditedCard}
      {detailsCard}
      {adminCard}
      {supportFooter}
    </main>,
  );
}

const MobileHeader = ({ onBack }: { onBack: () => void }) => (
  <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
    <div className="flex items-center justify-between px-4 h-14">
      <button
        onClick={onBack}
        className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold">Recovery request</h1>
      <div className="w-9" />
    </div>
  </header>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-mono">{value}</span>
  </div>
);

const DetailRow = ({
  label,
  value,
  mono,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) => (
  <div className="flex items-center justify-between text-sm gap-3">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <div className="flex items-center gap-1.5 min-w-0">
      <span className={mono ? 'font-mono' : ''}>{value}</span>
      {onCopy && (
        <button
          onClick={onCopy}
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

const truncate = (s: string) =>
  s.length <= 14 ? s : `${s.slice(0, 6)}...${s.slice(-6)}`;
