import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/types/project";

/** Retardo entre tarjetas del escalonado, en ms. */
const STAGGER_MS = 60;
/** Tope del retardo: sin él, la última tarjeta de una lista larga tarda demasiado. */
const MAX_STAGGER_STEPS = 6;

/**
 * Rejilla de proyectos: 1 columna en móvil, 2 en tablet y 3 en escritorio,
 * con 2rem de separación (`gap-8`).
 *
 * Las tarjetas filtradas se DESMONTAN (quien llama filtra antes de pasar la
 * lista) en vez de ocultarse: ocultarlas rompería el cálculo de la rejilla y
 * dejaría contenido invisible en el árbol de accesibilidad.
 */
export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-strong bg-surface-muted/50 px-6 py-12 text-center text-ink-muted">
        No hay proyectos en esta categoría todavía.
      </p>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Reveal
          key={project.slug}
          as="li"
          delay={Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}
          className="h-full"
        >
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </ul>
  );
}
