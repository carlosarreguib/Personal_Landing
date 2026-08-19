/** Etiqueta de tecnología del stack. Texto en `ink-muted` (10,98:1). */
export function TechTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded border border-border-subtle px-2 py-0.5 text-xs font-medium text-ink-muted">
      {name}
    </span>
  );
}
