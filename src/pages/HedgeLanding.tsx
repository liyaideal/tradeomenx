import { useRef } from "react";
import { Helmet } from "react-helmet-async";
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

  const seoData = {
    title: "Hedge Your Polymarket World Cup Pick | OMENX — Redeem up to 500U",
    description: "World Cup upsets wiping out your Polymarket picks? Connect your wallet on OMENX, open a hedge, and redeem rewards up to 500U if it closes in profit. Not guaranteed.",
    ogTitle: "World Cup chaos? Hedge your Polymarket pick on OMENX.",
    ogDescription: "Open a hedge that moves opposite your pick — redeem up to 500U if it closes in profit. Not guaranteed, see campaign rules.",
    keywords: "leveraged prediction market, Polymarket hedge, hedge Polymarket position, World Cup prediction trading, Polymarket alternative",
    canonical: "https://omenx.lovable.app/campaign/world-cup-polymarket-hedge"
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF0] text-[#0E0E0E]">
      <Helmet prioritizeSeoTags>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.ogTitle} />
        <meta name="twitter:description" content={seoData.ogDescription} />
      </Helmet>
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