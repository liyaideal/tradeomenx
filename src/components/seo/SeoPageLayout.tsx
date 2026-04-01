import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { SeoFooter } from "./SeoFooter";
import { useIsMobile } from "@/hooks/use-mobile";

interface SeoPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const SeoPageLayout = ({ children, title, description }: SeoPageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {isMobile ? (
        <MobileHeader title={title} showLogo={false} />
      ) : (
        <EventsDesktopHeader />
      )}

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 md:px-8 py-6 md:py-12">
        {description && (
          <div className="mb-6 md:mb-8 pb-6 border-b border-border/30">
            <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1.5">{title}</h1>
            <p className="text-muted-foreground text-xs md:text-base">{description}</p>
          </div>
        )}
        {!description && (
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">{title}</h1>
        )}
        <div className="
          prose prose-invert prose-sm md:prose-base max-w-none
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[13px] md:prose-p:text-base
          prose-a:text-primary prose-a:underline prose-a:underline-offset-2
          prose-strong:text-foreground prose-strong:font-semibold
          prose-li:text-muted-foreground prose-li:text-[13px] md:prose-li:text-base prose-li:leading-relaxed
          prose-ul:pl-5 prose-ul:list-disc prose-ul:space-y-1.5
          prose-headings:text-foreground
          prose-h2:text-base md:prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
          prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/20
          prose-h3:text-sm md:prose-h3:text-lg prose-h3:font-medium prose-h3:mt-5 prose-h3:mb-2
          prose-h3:text-muted-foreground/90
        ">
          {children}
        </div>
      </main>

      {/* Footer */}
      <SeoFooter />
    </div>
  );
};
