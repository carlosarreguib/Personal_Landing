import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import {
  GradientShimmer,
  type GradientStop,
} from "@/components/ui/GradientShimmer";
import { NoiseBackground } from "@/components/ui/NoiseBackground";
import { site } from "@/data/site";
import { getActiveCategories, getProjectCount } from "@/lib/projects";

interface HeroAction {
  label: string;
  href: string;
}

/**
 * Degradado del destello: el preset `twilight` del componente, con su primera
 * parada sustituida.
 *
 * La original (`#E3CCE6`, un lila muy claro) medía 1,50:1 sobre las zonas
 * blancas del fondo animado, así que ese punto del barrido se volvía
 * invisible al pasar. `#7C6E93` conserva el mismo carácter crepuscular y sube
 * a más de 4:1 en el peor caso. Si cambias la paleta del fondo, vuelve a medir
 * este degradado.
 */
const HERO_SHIMMER: GradientStop[] = [
  { color: "#7C6E93", position: 0 },
  { color: "#4E8CD5", position: 0.35 },
  { color: "#6068C2", position: 0.64 },
  { color: "#38364E", position: 1 },
];

export interface HeroProps {
  /** Titular principal. Por defecto, el nombre configurado en `site`. */
  title?: string;
  /** Segunda línea del titular, con el destello. */
  headline?: string;
  /** Subtítulo bajo el titular. */
  tagline?: string;
  /** Botón principal. */
  primaryAction?: HeroAction;
  /** Botón secundario. */
  secondaryAction?: HeroAction;
  /** Velocidad del fondo animado. 1 es el ritmo lento por defecto. */
  animationSpeed?: number;
  /** Contenido extra a la derecha; por defecto, el panel de cifras. */
  aside?: ReactNode;
}

/**
 * Cabecero del hero con fondo animado de ruido simplex.
 *
 * El fondo es claro (blancos y grises), así que TODO el texto de aquí va en
 * tonos oscuros. Ojo al tocarlo: el resto de la landing usa texto claro sobre
 * oscuro y es fácil traerse una clase que aquí resultaría ilegible.
 */
export function Hero({
  title = site.name,
  headline = site.headline,
  tagline = site.tagline,
  primaryAction = { label: "Explora mis proyectos", href: "#proyectos" },
  secondaryAction = { label: "Contacto", href: "#contacto" },
  animationSpeed = 1,
  aside,
}: HeroProps = {}) {
  const projectCount = getProjectCount();
  // Solo las áreas con proyectos: anunciar categorías vacías infla la cifra.
  const activeCategories = getActiveCategories();

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate min-h-screen overflow-hidden bg-surface pt-32 pb-24 sm:pt-40"
    >
      <NoiseBackground speed={animationSpeed} />

      {/* Difuminado hacia la sección siguiente: evita una línea de corte
          y hace que el hero se funda con el blanco de "Proyectos". */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-surface"
      />

      <Container className="relative flex min-h-[calc(100vh-14rem)] flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Columna de texto: asimétrica, 7 de 12 */}
          <div className="lg:col-span-7">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/40 px-4 py-1.5 text-sm font-medium text-ink-muted backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-teal-700"
              />
              {site.role}
            </p>

            <h1
              id="hero-title"
              className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              {title}
              {/* El destello barre un degradado sobre el texto (ver
                  HERO_SHIMMER arriba: es `twilight` con la parada clara
                  corregida para que se lea sobre el fondo blanco). */}
              <GradientShimmer
                as="span"
                gradient={HERO_SHIMMER}
                duration={2.2}
                pauseBetween={2600}
                baseColor="#2C3E50"
                // El display va por `style` y no por clase: el componente
                // fija `inline-block` en línea, que gana a cualquier clase de
                // Tailwind. Con `className="block"` el titular no saltaba de
                // línea y se leía "Carlos ArreguiAI Projects Portfolio".
                style={{ display: "block", marginTop: "0.25rem" }}
              >
                {headline}
              </GradientShimmer>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              <GradientShimmer
                as="span"
                gradient={HERO_SHIMMER}
                duration={2.6}
                pauseBetween={3400}
                spread={2}
                baseColor="#2C3E50"
              >
                {tagline}
              </GradientShimmer>
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={primaryAction.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-ink px-7 py-3 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-ink-muted motion-reduce:hover:translate-y-0"
              >
                {primaryAction.label}
              </a>
              <a
                href={secondaryAction.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-ink/20 bg-white/50 px-7 py-3 font-semibold text-ink backdrop-blur-sm transition-colors duration-200 hover:bg-white/80"
              >
                {secondaryAction.label}
              </a>
            </div>
          </div>

          {/* Columna de datos: 5 de 12 */}
          <div className="lg:col-span-5 lg:pl-8">
            {aside ?? (
              <dl className="grid grid-cols-2 gap-4 sm:gap-5">
                <div className="rounded-2xl border border-ink/10 bg-white/45 p-5 backdrop-blur-sm">
                  <dt className="text-sm text-ink-muted">Proyectos</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-ink">
                    {projectCount}
                  </dd>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/45 p-5 backdrop-blur-sm">
                  <dt className="text-sm text-ink-muted">Áreas</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-ink">
                    {activeCategories.length}
                  </dd>
                </div>
                <div className="col-span-2 rounded-2xl border border-ink/10 bg-white/45 p-5 backdrop-blur-sm">
                  <dt className="text-sm text-ink-muted">Especialidades</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {activeCategories.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-md bg-ink/8 px-2.5 py-1 text-sm font-medium text-ink-muted"
                      >
                        {category.label}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
