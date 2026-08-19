import type { Category } from "@/types/project";

/**
 * Registro de categorías. El orden aquí es el orden de los filtros.
 *
 * Para añadir una categoría: añade su id a CATEGORY_IDS en
 * `src/types/project.ts` y su entrada aquí. TypeScript avisará si falta.
 */
export const categories: readonly Category[] = [
  {
    id: "nlp",
    label: "NLP",
    description: "Procesamiento de lenguaje natural",
  },
  {
    id: "vision",
    label: "Visión",
    description: "Visión por computador",
  },
  {
    id: "automatizacion",
    label: "Automatización",
    description: "Automatización de procesos",
  },
  {
    id: "llms",
    label: "LLMs",
    description: "Modelos grandes de lenguaje",
  },
];

const byId = new Map(categories.map((category) => [category.id, category]));

/** Devuelve la categoría por su id. */
export function getCategory(id: Category["id"]): Category | undefined {
  return byId.get(id);
}

/** Etiqueta visible de una categoría; cae al id si no existe. */
export function getCategoryLabel(id: Category["id"]): string {
  return byId.get(id)?.label ?? id;
}
