"use client";

import { useRef, type KeyboardEvent } from "react";
import { categories } from "@/data/categories";
import { cn } from "@/lib/cn";
import type { CategoryId } from "@/types/project";

export type FilterValue = CategoryId | "todos";

interface FilterBarProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  /** Nº de proyectos por categoría, para mostrar el recuento en cada filtro. */
  counts: Record<FilterValue, number>;
}

/**
 * Barra de filtros implementada como lista de pestañas (tablist).
 *
 * Es un componente CONTROLADO y sin estado propio: recibe `value` y emite
 * `onChange`. Gracias a eso, mover el filtro a la URL en el futuro sería un
 * cambio contenido en ProjectsSection, sin tocar este fichero.
 *
 * Navegación por teclado según el patrón APG: flechas para moverse, Inicio y
 * Fin para ir a los extremos, y un solo botón en el orden de tabulación
 * (roving tabindex).
 */
export function FilterBar({ value, onChange, counts }: FilterBarProps) {
  // Solo se muestran las categorías que tienen algún proyecto. Un filtro que
  // devuelve una lista vacía es un callejón sin salida para quien lo pulsa, y
  // al cambiar el contenido es fácil que una categoría se quede a cero sin que
  // nadie se dé cuenta.
  const options: { id: FilterValue; label: string }[] = [
    { id: "todos", label: "Todos" },
    ...categories
      .filter((category) => (counts[category.id as FilterValue] ?? 0) > 0)
      .map((category) => ({
        id: category.id as FilterValue,
        label: category.label,
      })),
  ];

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex((option) => option.id === value);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % options.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = options.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    onChange(options[nextIndex].id);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Filtrar proyectos por categoría"
      onKeyDown={handleKeyDown}
      className="flex flex-wrap gap-2"
    >
      {options.map((option, index) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`filtro-${option.id}`}
            aria-selected={isSelected}
            aria-controls="panel-proyectos"
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors duration-200",
              isSelected
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-border-subtle bg-surface text-ink-muted hover:border-border-strong hover:bg-surface-muted",
            )}
          >
            {option.label}
            <span
              className={cn(
                "text-xs font-medium",
                isSelected ? "text-white/75" : "text-ink-muted/70",
              )}
            >
              {counts[option.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
