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
        <MobileHeader title={title} />
      ) : (
        <EventsDesktopHeader />
      )}

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {description && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground text-sm md:text-base">{description}</p>
          </div>
        )}
        {!description && (
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{title}</h1>
        )}
        <div className="prose prose-invert prose-sm md:prose-base max-w-none
          prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary
          prose-strong:text-foreground prose-li:text-muted-foreground
          prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3
        ">
          {children}
        </div>
      </main>

      {/* Footer */}
      <SeoFooter />
    </div>
  );
};
