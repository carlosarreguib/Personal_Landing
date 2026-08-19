/**
 * Configuración global del sitio.
 *
 * Los valores marcados con TODO son placeholders: rellénalos con tus datos
 * reales antes de publicar.
 */

export const site = {
  name: "Carlos Arregui",

  /** Titular principal del hero. */
  headline: "AI Projects Portfolio",

  /** Subtítulo del hero. TODO: ajústalo a tu propuesta de valor real. */
  tagline: "Soluciones inteligentes con pasión por la excelencia",

  /** Descripción para las meta tags y el JSON-LD. */
  description:
    "Portafolio de proyectos de Inteligencia Artificial: procesamiento de lenguaje natural, visión por computador, automatización y modelos de lenguaje.",

  /** TODO: sustituye por tu rol real. */
  role: "Ingeniero de Inteligencia Artificial",

  email: "carregui@grit.es",

  /**
   * URL pública del sitio, usada por metadataBase, sitemap y robots.
   * TODO: cámbiala por tu dominio definitivo antes de desplegar.
   */
  url: "https://example.com",

  /**
   * Redes sociales. TODO: rellena las URLs reales.
   * Las entradas con `href: null` no se renderizan, así que puedes dejar
   * aquí las que aún no tengas sin que aparezcan enlaces rotos.
   */
  social: [
    { label: "LinkedIn", href: null as string | null },
    { label: "GitHub", href: null as string | null },
  ],

  /** Navegación principal. Los `href` apuntan a los id de cada sección. */
  nav: [
    { label: "Inicio", href: "#inicio", id: "inicio" },
    { label: "Proyectos", href: "#proyectos", id: "proyectos" },
    { label: "Trayectoria", href: "#trayectoria", id: "trayectoria" },
    { label: "Sobre mí", href: "#sobre-mi", id: "sobre-mi" },
    { label: "Contacto", href: "#contacto", id: "contacto" },
  ],
} as const;

/**
 * Las páginas de detalle (/proyectos/[slug]) llegan en la fase 2.
 * Mientras esté en `false`, las tarjetas renderizan "Ver detalles" como texto
 * inerte en lugar de un enlace, para no dejar enlaces rotos.
 * Ponlo a `true` cuando exista la ruta.
 */
export const DETAIL_PAGES_ENABLED = false;
