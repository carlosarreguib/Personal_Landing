/**
 * Modelo de datos de un proyecto.
 *
 * Está en TypeScript y no en JSON a propósito: una categoría mal escrita
 * (`"Vision"` en vez de `"vision"`) es un error de compilación, no un filtro
 * que aparece vacío en silencio.
 */

export const CATEGORY_IDS = ["nlp", "vision", "automatizacion", "llms"] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  /** Etiqueta visible, en español y con acentos. */
  label: string;
  description: string;
}

export interface ProjectImage {
  src: string;
  /** Obligatorio: sin puerta de escape para la accesibilidad. */
  alt: string;
  width: number;
  height: number;
}

export interface TechItem {
  name: string;
  /** Papel de la tecnología en el proyecto. Lo consume la ficha de detalle. */
  role?: string;
}

export interface ProjectResult {
  metric: string;
  value: string;
  detail?: string;
}

export interface ProjectLinks {
  demo?: string;
  github?: string;
  article?: string;
}

export interface Project {
  /** kebab-case sin acentos. Es la URL y el nombre de la carpeta de imágenes. */
  slug: string;
  title: string;
  category: CategoryId;
  /** 2-3 líneas. Se usa en la tarjeta y como meta description. */
  summary: string;
  /** 'YYYY-MM' — ordenable como cadena. */
  date: string;
  /** Portada 16:9, para tarjetas y ficha de detalle. */
  cover: ProjectImage;
  /** Portada 1:1, para el carrusel Coverflow (sus tarjetas son cuadradas). */
  square: ProjectImage;
  /** Se rellena ya aunque la landing no lo pinte: lo consume la fase 2. */
  gallery: ProjectImage[];
  description: string[];
  tech: TechItem[];
  results: ProjectResult[];
  links?: ProjectLinks;
  featured?: boolean;
}
