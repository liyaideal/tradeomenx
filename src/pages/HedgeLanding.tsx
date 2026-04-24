import { useEffect, useRef } from "react";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { SeoFooter } from "@/components/seo/SeoFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { HedgeHero } from "@/components/hedge/HedgeHero";
import { HedgeRecentActivity } from "@/components/hedge/HedgeRecentActivity";
import { HedgeHowItWorks } from "@/components/hedge/HedgeHowItWorks";
import { HedgeLiveExample } from "@/components/hedge/HedgeLiveExample";
import { HedgeFoundersNote } from "@/components/hedge/HedgeFoundersNote";
import { HedgeKeyRules } from "@/components/hedge/HedgeKeyRules";
import { HedgeSocialProof } from "@/components/hedge/HedgeSocialProof";
import { HedgeFAQ } from "@/components/hedge/HedgeFAQ";
import { HedgeFinalCTA } from "@/components/hedge/HedgeFinalCTA";
import { HedgeMobileFloatingCTA } from "@/components/hedge/HedgeMobileFloatingCTA";

const HedgeLanding = () => {
  const isMobile = useIsMobile();
  // We watch the entire Hero section so the floating CTA only appears
  // once the user has fully scrolled past the primary CTA above the fold.
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Hedge-to-Earn — Free hedge on your Polymarket positions | OmenX";

    const desc =
      "Connect your Polymarket wallet and OmenX will airdrop you a free counter-position hedge. $0 cost, read-only access, up to $100 in free trading credit.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {isMobile ? (
        <MobileHeader title="Hedge-to-Earn" showLogo={false} showBack={true} />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className="flex-1 md:pb-0 pb-0">
        <HedgeRecentActivity />
        <div ref={heroRef}>
          <HedgeHero />
        </div>
        <HedgeHowItWorks />
        <HedgeLiveExample />
        <HedgeFoundersNote />
        <HedgeKeyRules />
        <HedgeSocialProof />
        <HedgeFAQ />
        <HedgeFinalCTA />
      </main>

      <SeoFooter />
      <HedgeMobileFloatingCTA triggerRef={heroRef} />
    </div>
  );
};

export default HedgeLanding;
