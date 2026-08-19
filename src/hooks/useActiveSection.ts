"use client";

import { useEffect, useState } from "react";

/**
 * Indica qué sección ocupa la franja central del viewport.
 *
 * Usa un observer PROPIO, distinto del de useReveal: aquí interesan otros
 * umbrales y otro ciclo de vida (nunca deja de observar). El rootMargin
 * recorta la parte superior e inferior para que solo una sección esté activa
 * a la vez y el indicador no parpadee entre dos.
 */
export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Se respeta el orden del documento, no el de notificación.
        const firstVisible = sectionIds.find((id) => visible.has(id));
        if (firstVisible) setActiveId(firstVisible);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
