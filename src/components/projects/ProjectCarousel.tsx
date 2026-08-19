"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryBadge } from "@/components/projects/CategoryBadge";
import { TechTag } from "@/components/projects/TechTag";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/CoverflowCarousel";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { DETAIL_PAGES_ENABLED } from "@/data/site";
import type { Project } from "@/types/project";

/**
 * Carrusel Coverflow de proyectos, con pie de datos del proyecto activo.
 *
 * Las tarjetas del carrusel son cuadradas y solo llevan imagen, así que toda
 * la información textual vive debajo y cambia al girar. Ese pie es además la
 * versión accesible del contenido: los lectores de pantalla anuncian el
 * proyecto centrado mediante `aria-live`.
 */
export function ProjectCarousel({ projects }: { projects: readonly Project[] }) {
  // Al cambiar de filtro, ProjectsSection remonta este componente con
  // `key={filter}`, así que el estado arranca de cero solo: no hace falta un
  // efecto que lo reinicie.
  const [selected, setSelected] = useState(0);

  const slides = useMemo<CoverflowSlide[]>(
    () =>
      projects.map((project) => ({
        key: project.slug,
        src: project.square.src,
        alt: project.square.alt,
        width: project.square.width,
        height: project.square.height,
      })),
    [projects],
  );

  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-strong bg-surface-muted/50 px-6 py-12 text-center text-ink-muted">
        No hay proyectos en esta categoría todavía.
      </p>
    );
  }

  const active = projects[Math.min(selected, projects.length - 1)];
  const total = projects.length;

  const step = (by: number) =>
    setSelected((current) => (current + by + total) % total);

  return (
    <div>
      <div className="relative">
        {/* El degradado lateral funde las tarjetas lejanas con el fondo en vez
            de dejarlas cortadas a hachazo contra el borde. La máscara envuelve
            SOLO al carrusel: aplicada al contenedor, desvanecería también las
            flechas de navegación. */}
        <div className="[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]">
          <CoverflowCarousel
            slides={slides}
            selected={selected}
            onSelectedChange={setSelected}
            label="Proyectos destacados"
            cardClassName="ring-1 ring-black/5"
          />
        </div>

        {/* Botones de navegación. Solo tienen sentido con más de una tarjeta. */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Proyecto anterior"
              className="absolute top-1/2 left-0 z-[200] inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-surface-muted sm:left-4"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Proyecto siguiente"
              className="absolute top-1/2 right-0 z-[200] inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-surface-muted sm:right-4"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Pie con los datos del proyecto centrado. */}
      <div
        aria-live="polite"
        className="mx-auto mt-6 flex max-w-2xl flex-col items-center px-4 text-center"
      >
        <CategoryBadge category={active.category} />

        <h3 className="mt-4 font-display text-2xl leading-snug font-bold text-ink sm:text-3xl">
          {active.title}
        </h3>

        <p className="mt-3 leading-relaxed text-ink-muted">{active.summary}</p>

        <ul className="mt-5 flex list-none flex-wrap justify-center gap-1.5">
          {active.tech.map((tech) => (
            <li key={tech.name}>
              <TechTag name={tech.name} />
            </li>
          ))}
        </ul>

        {/* Enlace al repositorio, justo debajo del stack. Solo se renderiza si
            el proyecto tiene `links.github`, así que los que no lo tengan no
            dejan un hueco ni un enlace roto. */}
        {active.links?.github && (
          <a
            href={active.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            <GitHubIcon className="h-5 w-5" />
            Ver código en GitHub
          </a>
        )}

        {DETAIL_PAGES_ENABLED ? (
          <a
            href={`/proyectos/${active.slug}`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-link"
          >
            Ver detalles
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          // La ruta de detalle llega en la fase 2; hasta entonces, texto inerte.
          <p className="mt-6 text-sm font-medium text-ink-muted/80 italic">
            Ficha detallada próximamente
          </p>
        )}
      </div>

      {/* Paginación por puntos. */}
      {total > 1 && (
        <div
          role="tablist"
          aria-label="Ir a un proyecto concreto"
          className="mt-8 flex items-center justify-center gap-2"
        >
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              role="tab"
              aria-selected={index === selected}
              aria-label={project.title}
              onClick={() => setSelected(index)}
              className="inline-flex h-11 w-6 cursor-pointer items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={
                  index === selected
                    ? "block h-2.5 w-2.5 rounded-full bg-teal-700"
                    : "block h-2.5 w-2.5 rounded-full bg-ink-muted/30 transition-colors hover:bg-ink-muted/50"
                }
              />
            </button>
          ))}
        </div>
      )}

      {/* Contador textual, útil también para lectores de pantalla. */}
      <p className="mt-3 text-center text-sm text-ink-muted/80">
        {selected + 1} de {total}
      </p>
    </div>
  );
}
