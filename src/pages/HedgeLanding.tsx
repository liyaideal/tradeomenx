import { useEffect, useRef } from "react";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { SeoFooter } from "@/components/seo/SeoFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { HedgeHero } from "@/components/hedge/HedgeHero";
import { HedgeUpsetsStrip } from "@/components/hedge/HedgeUpsetsStrip";
import { HedgeHowItWorks } from "@/components/hedge/HedgeHowItWorks";
import { HedgeKeyRules } from "@/components/hedge/HedgeKeyRules";
import { HedgeRewardTiers } from "@/components/hedge/HedgeRewardTiers";
import { HedgeFAQ } from "@/components/hedge/HedgeFAQ";
import { HedgeFinalCTA } from "@/components/hedge/HedgeFinalCTA";
import { HedgeMobileFloatingCTA } from "@/components/hedge/HedgeMobileFloatingCTA";

const HedgeLanding = () => {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title =
      "World Cup Hedge-to-Earn — Hedge your Polymarket pick, redeem up to 500U | OmenX";

    const desc =
      "World Cup chaos? Connect your wallet, open a hedge that moves opposite your Polymarket pick on OmenX, and redeem rewards up to 500U if it closes in profit. Not guaranteed — see campaign rules.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF0] text-[#0E0E0E]">
      {isMobile ? (
        <MobileHeader title="World Cup H2E" showLogo={false} showBack={true} />
      ) : (
        <EventsDesktopHeader />
      )}

      <main className="flex-1">
        <div ref={heroRef}>
          <HedgeHero />
        </div>
        <HedgeUpsetsStrip />
        <HedgeHowItWorks />
        <HedgeKeyRules />
        <HedgeRewardTiers />
        <HedgeFAQ />
        <HedgeFinalCTA />
      </main>

      <SeoFooter />
      <HedgeMobileFloatingCTA triggerRef={heroRef} />
    </div>
  );
};

export default HedgeLanding;
