import { categories } from "@/data/categories";
import { projects } from "@/data/projects";
import type { Category, CategoryId, Project } from "@/types/project";

/**
 * Único punto de acceso a los datos de proyectos.
 *
 * Los componentes importan de aquí y nunca de `data/projects.ts` directamente:
 * así, si algún día el contenido pasa a MDX o a un CMS, solo cambia este
 * fichero.
 */

/** Copia ordenada por fecha descendente (los más recientes primero). */
const sorted: readonly Project[] = [...projects].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getAllProjects(): readonly Project[] {
  return sorted;
}

export function getAllSlugs(): string[] {
  return sorted.map((project) => project.slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return sorted.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: CategoryId): Project[] {
  return sorted.filter((project) => project.category === category);
}

/**
 * Proyectos relacionados: primero los de la misma categoría y, si no llegan a
 * `limit`, se completa con los más recientes de otras. Nunca se incluye a sí
 * mismo. El relleno importa: sin él, una categoría con un solo proyecto
 * dejaría la sección vacía.
 */
export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  const others = sorted.filter((project) => project.slug !== slug);
  const sameCategory = others.filter(
    (project) => project.category === current.category,
  );
  const rest = others.filter((project) => project.category !== current.category);

  return [...sameCategory, ...rest].slice(0, limit);
}

/** Número total de proyectos publicados. */
export function getProjectCount(): number {
  return sorted.length;
}

/**
 * Categorías que tienen al menos un proyecto, en el orden del registro.
 *
 * El hero presume del número de áreas y lista las especialidades: mostrar las
 * categorías declaradas en vez de las que realmente tienen contenido daría una
 * cifra inflada y anunciaría áreas vacías en cuanto una se quedase sin
 * proyectos.
 */
export function getActiveCategories(): Category[] {
  const used = new Set(sorted.map((project) => project.category));
  return categories.filter((category) => used.has(category.id));
}

/** Número de categorías con al menos un proyecto. */
export function getActiveCategoryCount(): number {
  return getActiveCategories().length;
}

/* -------------------------------------------------------------------------
   Comprobaciones de integridad, solo en desarrollo.

   El único acoplamiento que queda en el modelo de datos es que el `slug` debe
   coincidir con la carpeta de imágenes. Si no cuadran, la imagen simplemente
   no carga y es un fallo silencioso difícil de ver; mejor avisar en consola
   al arrancar.
   ------------------------------------------------------------------------- */
if (process.env.NODE_ENV === "development") {
  const seen = new Set<string>();

  for (const project of sorted) {
    if (seen.has(project.slug)) {
      console.warn(`[projects] slug duplicado: "${project.slug}"`);
    }
    seen.add(project.slug);

    const expectedPrefix = `/img/projects/${project.slug}/`;
    const images = [project.cover, ...project.gallery];

    for (const image of images) {
      if (!image.src.startsWith(expectedPrefix)) {
        console.warn(
          `[projects] "${project.slug}": la imagen "${image.src}" no está en ${expectedPrefix}`,
        );
      }
    }
  }
}
