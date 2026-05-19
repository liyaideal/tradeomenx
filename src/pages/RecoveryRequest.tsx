import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, ChevronRight, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRecoveryRequests } from '@/hooks/useRecoveryRequests';
import { RecoveryStatusBadge } from '@/components/recovery/RecoveryStatusTimeline';
import { RecoveryForm } from '@/components/recovery/RecoveryForm';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function RecoveryRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { list } = useRecoveryRequests();
  const [showForm, setShowForm] = useState(false);

  const requests = list.data ?? [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-3 max-w-sm">
            <AlertTriangle className="w-10 h-10 text-trading-yellow mx-auto" />
            <h2 className="text-lg font-semibold">Sign in required</h2>
            <p className="text-sm text-muted-foreground">
              Please sign in to submit or view your recovery requests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-auto pb-16">
        {/* Intro card */}
        <div className="mx-4 mt-5 rounded-xl border border-trading-yellow/30 bg-trading-yellow/5 p-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-trading-yellow shrink-0 mt-0.5" />
            <div className="text-sm space-y-1.5 leading-relaxed">
              <div className="font-semibold text-foreground">Wrong-chain recovery service</div>
              <p className="text-muted-foreground text-xs">
                We can attempt to retrieve funds sent to the wrong network or with the wrong token.
                A flat <span className="text-trading-yellow font-medium">10% recovery fee</span> applies
                (covers source-chain gas, bridge cost, and manual processing).
              </p>
              <p className="text-muted-foreground text-xs">
                Estimated processing time: <span className="text-foreground">3–7 business days</span>.
                We cannot recover funds sent to chains we do not operate on. We will review and reply within 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Existing requests */}
        {!showForm && (
          <div className="px-4 mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Your requests</h2>
              <Button size="sm" onClick={() => setShowForm(true)} className="h-8 rounded-lg">
                <Plus className="w-3.5 h-3.5 mr-1" />
                New request
              </Button>
            </div>

            {list.isLoading ? (
              <div className="py-10 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
                You have no recovery requests yet.
              </div>
            ) : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/wallet/recovery/${r.id}`)}
                    className="w-full text-left rounded-xl border bg-card hover:bg-accent/40 transition-colors p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          ${Number(r.claimed_amount).toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {r.wrong_token} on {r.wrong_network}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RecoveryStatusBadge status={r.status} />
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New request form */}
        {showForm && (
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">New recovery request</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="h-8 rounded-lg"
              >
                Cancel
              </Button>
            </div>
            <RecoveryForm />
          </div>
        )}
      </main>
    </div>
  );
}

const Header = ({ onBack }: { onBack: () => void }) => (
  <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
    <div className="flex items-center justify-between px-4 h-14">
      <button
        onClick={onBack}
        className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold">Recovery</h1>
      <div className="w-9" />
    </div>
  </header>
);
