import { getCategoryLabel } from "@/data/categories";
import type { CategoryId } from "@/types/project";

/**
 * Distintivo de categoría.
 *
 * Usa fondo `surface-muted` con texto `teal-700` (7,58:1). Tentaba más pintar
 * el texto de brand-primary sobre blanco, pero eso da 3,03:1 y no pasa AA.
 */
export function CategoryBadge({ category }: { category: CategoryId }) {
  return (
    <span className="inline-flex items-center rounded-md bg-surface-muted px-2.5 py-1 text-xs font-semibold tracking-wide text-teal-700 uppercase">
      {getCategoryLabel(category)}
    </span>
  );
}
