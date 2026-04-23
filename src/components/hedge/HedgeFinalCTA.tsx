import { Zap } from "lucide-react";
import { HedgeCTAButton } from "./HedgeCTAButton";

export const HedgeFinalCTA = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 text-center md:p-14">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Free money on the table.
            <br />
            <span className="text-primary">Why are you still scrolling?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Connect your Polymarket wallet in 30 seconds. We'll handle the rest.
          </p>

          <div className="mt-8 flex justify-center">
            <HedgeCTAButton />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
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
