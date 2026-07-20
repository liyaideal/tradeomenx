import { SectionWrapper, SubSection } from "../components/SectionWrapper";
import { SingleDevicePreview } from "../components/DeviceFrame";
import { Logo } from "@/components/Logo";

/**
 * Mobile Patterns — 真组件 + 全状态 + 375 真态。
 *
 * MobileHeader presets A/B/C/D, rightContent variants, MobileDrawer content
 * specs (Read-only / Edit / Destructive), BottomNav safe area, and mobile
 * card consistency — all rendered from real components inside a 375px iframe.
 *
 * Preview keys live in `../preview/mobilePatternsPreviews.tsx`.
 */
export const MobilePatternsSection = () => {
  return (
    <div className="space-y-10">
      <SectionWrapper
        id="logo-guidelines"
        title="Logo usage"
        description="See DESIGN.md §10 Logo table. Only sizes shown here — for header placement rules see the presets below."
        platform="shared"
      >
        <SubSection title="Sizes" platform="shared">
          <div className="rounded-xl border border-border/40 bg-card p-6 flex items-end gap-8 flex-wrap">
            <div className="flex flex-col items-center gap-2"><Logo size="sm" /><span className="text-[10px] font-mono text-muted-foreground">sm</span></div>
            <div className="flex flex-col items-center gap-2"><Logo size="md" /><span className="text-[10px] font-mono text-muted-foreground">md · mobile header</span></div>
            <div className="flex flex-col items-center gap-2"><Logo size="lg" /><span className="text-[10px] font-mono text-muted-foreground">lg</span></div>
            <div className="flex flex-col items-center gap-2"><Logo size="xl" /><span className="text-[10px] font-mono text-muted-foreground">xl · desktop nav / marketing</span></div>
          </div>
        </SubSection>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-header"
        title="MobileHeader — all four canonical presets"
        description="Real <MobileHeader> rendered inside a 375px iframe. Preset D is Preset A header + non-sticky <HomeEquityHero> as the first body card (see DESIGN.md §10 Preset D spec)."
        platform="mobile"
      >
        <div className="space-y-4">
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-preset-a"
            label="Preset A · Home / hub · showLogo + rightContent"
            minHeight={110}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-preset-b"
            label="Preset B · Functional inner page · back + centered title"
            minHeight={90}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-preset-c"
            label="Preset C · SEO / marketing sub-page · same chrome as B"
            minHeight={90}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-preset-d"
            label="Preset D · MobileHome ONLY · Preset A header + HomeEquityHero card"
            minHeight={320}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-header-rightcontent"
        title="MobileHeader rightContent variants"
        description="showActions (favorite + share), custom rightContent (Save button), and stats-row extension (endTime countdown + price + tweetCount)."
        platform="mobile"
      >
        <div className="space-y-4">
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-actions"
            label="showActions · favorite + share"
            minHeight={90}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-custom-right"
            label="rightContent · custom Save button"
            minHeight={90}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-header-stats-row"
            label="Stats row · endTime + currentPrice + tweetCount"
            minHeight={140}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-patterns"
        title="MobileDrawer — content spec (real component)"
        description="Three canonical drawer contents from DESIGN.md §5.1: Read-only (no footer), Edit (Cancel + Primary), Destructive (Cancel + trading-red primary). Rendered from real <MobileDrawer>; drawer auto-opens for inspection and can be re-opened via the shell button."
        platform="mobile"
      >
        <div className="space-y-4">
          <SingleDevicePreview device="mobile"
            previewKey="mpat-drawer-readonly"
            label="Read-only · no footer (e.g. Position Details)"
            minHeight={520}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-drawer-edit"
            label="Edit · Cancel (Outline) + Primary shadcn Button, both h-11"
            minHeight={560}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mpat-drawer-destructive"
            label="Destructive · Cancel + trading-red primary (e.g. Close Position)"
            minHeight={520}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-bottom-nav"
        title="BottomNav safe area"
        description="Real <BottomNav> with pb-6 safe-area padding, fixed positioning, and blurred surface."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mpat-bottom-nav-safe-area"
          label="Live · fixed bottom · safe area padding"
          minHeight={280}
        />
      </SectionWrapper>

      <SectionWrapper
        id="mobile-card-consistency"
        title="Mobile card consistency (DESIGN.md §15)"
        description="stats-card, trading-card, and generic rounded-xl border-border/40 bg-card surfaces — all shared with desktop; radii unified to rounded-xl on mobile."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mpat-card-consistency"
          label="Live · three canonical mobile card surfaces"
          minHeight={340}
        />
      </SectionWrapper>
    </div>
  );
};
