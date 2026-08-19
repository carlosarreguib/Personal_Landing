"use client";

import { useMemo, useState } from "react";
import { FilterBar, type FilterValue } from "@/components/projects/FilterBar";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { Container } from "@/components/ui/Container";
import { categories, getCategoryLabel } from "@/data/categories";
import type { Project } from "@/types/project";

/**
 * Única frontera cliente de la zona de proyectos.
 *
 * Recibe la lista COMPLETA como props desde el servidor, así que los seis
 * proyectos salen en el HTML inicial y el filtrado es solo un refinamiento de
 * la vista. Eso es lo que permite usar estado local en vez de search params
 * sin perder nada de cara al rastreador.
 */
export function ProjectsSection({ projects }: { projects: readonly Project[] }) {
  const [filter, setFilter] = useState<FilterValue>("todos");

  const counts = useMemo(() => {
    const result = { todos: projects.length } as Record<FilterValue, number>;
    for (const category of categories) {
      result[category.id] = projects.filter(
        (project) => project.category === category.id,
      ).length;
    }
    return result;
  }, [projects]);

  const visibleProjects = useMemo(
    () =>
      filter === "todos"
        ? projects
        : projects.filter((project) => project.category === filter),
    [projects, filter],
  );

  const announcement =
    filter === "todos"
      ? `Mostrando los ${visibleProjects.length} proyectos`
      : `Mostrando ${visibleProjects.length} ${
          visibleProjects.length === 1 ? "proyecto" : "proyectos"
        } de ${getCategoryLabel(filter)}`;

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-title"
      className="scroll-mt-24 bg-surface py-20 sm:py-28"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="proyectos-title"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Proyectos
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Una selección de trabajos de Inteligencia Artificial, del
            procesamiento de lenguaje a la visión por computador. Arrastra el
            carrusel o usa las flechas para recorrerlos.
          </p>
        </div>

        <div className="mt-10">
          <FilterBar value={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Anuncia el cambio de filtro a los lectores de pantalla. */}
        <p aria-live="polite" className="sr-only-live">
          {announcement}
        </p>

        <div
          id="panel-proyectos"
          role="tabpanel"
          aria-labelledby={`filtro-${filter}`}
          className="mt-6"
        >
          <ProjectCarousel
            // Al cambiar de filtro se remonta el carrusel: así se reinicia su
            // posición interna en vez de quedar apuntando a un índice viejo.
            key={filter}
            projects={visibleProjects}
          />
        </div>
      </Container>
    </section>
  );
}
