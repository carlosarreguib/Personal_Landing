"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Si es `true`, deja de observar tras el primer cruce. */
  once?: boolean;
}

/**
 * Revelado al entrar en el viewport.
 *
 * Es el único sitio del proyecto donde se instancia un IntersectionObserver
 * para animar: las secciones usan <Reveal> y nunca tocan el observer.
 *
 * El contenido NUNCA debe quedarse invisible, así que las guardas van en este
 * orden: si el usuario pide reducir movimiento, o si el navegador no soporta
 * IntersectionObserver, se marca como visible de inmediato y no se crea nada.
 */
/**
 * ¿Hay que saltarse la animación por completo?
 *
 * Se evalúa de forma perezosa en el primer render del cliente, no dentro del
 * efecto: así el elemento ya nace visible y no hay un render en cascada ni un
 * parpadeo intermedio. En el servidor devuelve `false`, que es el estado
 * previo al revelado y coincide con lo que se hidrata.
 */
function shouldSkipAnimation(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof IntersectionObserver === "undefined") return true;
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(shouldSkipAnimation);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Ya visible por movimiento reducido o por falta de soporte: nada que observar.
    if (shouldSkipAnimation()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
