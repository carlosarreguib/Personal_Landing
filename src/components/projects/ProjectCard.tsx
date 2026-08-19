import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/projects/CategoryBadge";
import { TechTag } from "@/components/projects/TechTag";
import { DETAIL_PAGES_ENABLED } from "@/data/site";
import type { Project } from "@/types/project";

/** Máximo de tecnologías visibles en la tarjeta; el resto se resume en "+N". */
const MAX_VISIBLE_TECH = 3;

/**
 * Tarjeta de proyecto.
 *
 * Se escribe deliberadamente SIN hooks ni manejadores: solo props de datos.
 * Aunque hoy la importa un componente cliente (ProjectsSection) y acabe en su
 * bundle, así se puede reutilizar tal cual desde un componente de servidor en
 * la fase 2 (proyectos relacionados) sin duplicarla.
 */
export function ProjectCard({ project }: { project: Project }) {
  const href = `/proyectos/${project.slug}`;
  const visibleTech = project.tech.slice(0, MAX_VISIBLE_TECH);
  const hiddenTechCount = project.tech.length - visibleTech.length;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <CategoryBadge category={project.category} />
          <time
            dateTime={project.date}
            className="text-xs font-medium text-ink-muted/80"
          >
            {formatDate(project.date)}
          </time>
        </div>

        <h3 className="font-display text-xl leading-snug font-bold text-ink">
          {DETAIL_PAGES_ENABLED ? (
            // `after:absolute inset-0` hace que toda la tarjeta sea clicable
            // manteniendo un único enlace en el árbol de accesibilidad.
            <Link
              href={href}
              className="after:absolute after:inset-0 hover:text-link"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTech.map((tech) => (
            <TechTag key={tech.name} name={tech.name} />
          ))}
          {hiddenTechCount > 0 && (
            <span className="inline-flex items-center px-1 text-xs font-medium text-ink-muted/80">
              +{hiddenTechCount}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center pt-4">
          {DETAIL_PAGES_ENABLED ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-link">
              Ver detalles
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              >
                →
              </span>
            </span>
          ) : (
            // La ruta de detalle llega en la fase 2. Hasta entonces esto es
            // texto inerte: un enlace roto sería peor que no tenerlo.
            <span className="text-sm font-medium text-ink-muted/80 italic">
              Ficha detallada próximamente
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/** 'YYYY-MM' → 'noviembre de 2025'. */
function formatDate(value: string): string {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
