import { Zap } from "lucide-react";
import { HedgeCTAButton } from "./HedgeCTAButton";

export const HedgeFinalCTA = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 text-center md:p-14">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
          </div>

          <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-5xl md:leading-tight">
            Free money on the table.
            <br />
            <span className="text-primary">Why are you still scrolling?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:mt-4 md:text-lg">
            Connect your Polymarket wallet in 30 seconds. We'll handle the rest.
          </p>

          <div className="mt-6 flex justify-center md:mt-8">
            <HedgeCTAButton />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground md:mt-6 md:text-xs">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>
              Limited H2E Fund — first come, first served
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
