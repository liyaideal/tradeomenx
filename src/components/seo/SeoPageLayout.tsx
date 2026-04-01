import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { SeoFooter } from "./SeoFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SeoPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const SeoPageLayout = ({ children, title, description }: SeoPageLayoutProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {isMobile ? (
        <header className="sticky top-0 z-50 border-b border-border/30 backdrop-blur-md px-4 py-3 flex items-center gap-3"
          style={{ background: "linear-gradient(180deg, hsl(222 47% 8% / 0.98) 0%, hsl(222 47% 6% / 0.95) 100%)" }}
        >
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        </header>
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
