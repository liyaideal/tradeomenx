import { useEffect, useState, RefObject } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { HedgeCTAButton } from "./HedgeCTAButton";

interface Props {
  triggerRef: RefObject<HTMLElement>;
}

/**
 * Mobile-only floating CTA bar that slides in from the bottom
 * once the Hero CTA leaves the viewport.
 */
export const HedgeMobileFloatingCTA = ({ triggerRef }: Props) => {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, triggerRef]);

  if (!isMobile) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 pt-2.5 backdrop-blur-md transition-transform duration-300 shadow-[0_-4px_12px_hsl(var(--background)/0.6)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <HedgeCTAButton fullWidth />
    </div>
  );
};
