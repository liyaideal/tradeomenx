import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const SectionShell = ({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => (
  <section id={id} className={cn("px-5 py-12 md:px-8 md:py-20", className)}>
    <div className="mx-auto w-full max-w-7xl">{children}</div>
  </section>
);

export const SectionTitle = ({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) => (
  <div className="mb-8 md:mb-10">
    {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-mainnet-gold">{eyebrow}</p>}
    <h2 className="text-2xl font-bold text-foreground md:text-4xl">{title}</h2>
    {desc && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{desc}</p>}
  </div>
);
