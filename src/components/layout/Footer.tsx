import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

/**
 * Pie de página y sección de contacto.
 *
 * Va sobre fondo oscuro, que es donde el dorado de la paleta (#D4A574) sí
 * funciona como color de texto: 7,09:1 sobre #1A2332.
 */
export function Footer() {
  const year = new Date().getFullYear();
  // Solo se renderizan las redes que tienen URL real configurada.
  const socialLinks = site.social
    .filter((item) => item.href !== null)
    .map((item) => ({ label: item.label as string, href: item.href as string }));

  return (
    <footer id="contacto" className="scroll-mt-24 bg-surface-dark">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
          {/* Llamada de contacto */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-on-dark sm:text-4xl">
              ¿Hablamos?
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-on-dark/80">
              Si tienes un proyecto de Inteligencia Artificial entre manos o
              quieres comentar alguno de estos trabajos, escríbeme.
            </p>

            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent-on-dark px-7 py-3 font-semibold text-brand-dark transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              {site.email}
            </a>
          </div>

          {/* Enlaces rápidos */}
          <nav aria-label="Enlaces del pie" className="lg:col-span-3">
            <h3 className="font-display text-sm font-bold tracking-wider text-ink-on-dark uppercase">
              Navegación
            </h3>
            <ul className="mt-4 list-none space-y-1">
              {site.nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-[40px] items-center text-ink-on-dark/75 transition-colors hover:text-accent-on-dark"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Redes sociales */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold tracking-wider text-ink-on-dark uppercase">
              Redes
            </h3>
            {socialLinks.length > 0 ? (
              <ul className="mt-4 list-none space-y-1">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center text-ink-on-dark/75 transition-colors hover:text-accent-on-dark"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              // Sin URLs reales no se renderiza ningún enlace: es preferible
              // a dejar enlaces que no llevan a ninguna parte.
              <p className="mt-4 text-sm text-ink-on-dark/60">
                Pendiente de configurar.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <p className="text-sm text-ink-on-dark/60">
            © {year} {site.name}. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
