import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Etiqueta accesible de la sección, normalmente el id de su encabezado. */
  labelledBy?: string;
}

/**
 * Sección de la página.
 *
 * `scroll-mt-24` compensa la navbar sticky: sin él, al saltar a un ancla el
 * encabezado queda oculto detrás de la barra.
 */
export function Section({ id, children, className, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-24 py-20 sm:py-28", className)}
    >
      {children}
    </section>
  );
}
