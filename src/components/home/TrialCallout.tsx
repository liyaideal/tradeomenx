import { ArrowRight, Gift } from "lucide-react";

interface TrialCalloutProps {
  onSignIn: () => void;
}

/**
 * Guest-only conversion strip shown after the first markets section.
 *
 * Sportsbook-style "free play" hook: focuses on the trial bonus, not on
 * generic "sign up" copy. Sits between content sections so it does not
 * dominate the first viewport.
 */
export const TrialCallout = ({ onSignIn }: TrialCalloutProps) => {
  return (
    <button
      onClick={onSignIn}
      className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-primary/30 bg-card px-4 py-3.5 text-left transition-colors hover:border-primary/60 hover:bg-card-hover"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, hsl(var(--primary) / 0.18) 0%, transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Gift className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            $10 to try. No deposit needed.
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Sign up and place your first prediction in 30 seconds.
          </p>
        </div>
      </div>
      <span className="relative flex flex-shrink-0 items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
        Claim
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
      </span>
    </button>
  );
};
