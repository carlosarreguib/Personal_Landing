"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  /** Retardo en milisegundos, para escalonar elementos de una rejilla. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Envoltorio que revela su contenido al entrar en pantalla.
 *
 * Solo conmuta el atributo `data-revealed`; la transición vive entera en
 * globals.css. Así el CSS puede además anularla bajo prefers-reduced-motion
 * aunque el JS no llegue a ejecutarse.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-revealed={isVisible}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
