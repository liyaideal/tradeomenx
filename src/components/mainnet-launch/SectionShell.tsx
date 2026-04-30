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
  <section id={id} className={cn("border-t border-border/40 px-5 py-12 md:px-8 md:py-18", className)}>
    <div className="mx-auto w-full max-w-7xl">{children}</div>
  </section>
);

export const SectionTitle = ({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) => (
  <div className="mb-7 grid gap-4 md:mb-10 md:grid-cols-[0.75fr_1fr] md:items-end">
    <div>
      {eyebrow && <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-mainnet-gold">{eyebrow}</p>}
      <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-4xl">{title}</h2>
    </div>
    {desc && <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:ml-auto md:text-base">{desc}</p>}
  </div>
);
