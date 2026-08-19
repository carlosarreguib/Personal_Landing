import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-surface-dark">
      <Container>
        <p className="font-display text-6xl font-bold text-accent-on-dark">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink-on-dark sm:text-4xl">
          Esta página no existe
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-on-dark/80">
          Puede que el enlace esté mal escrito o que la página se haya movido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-lg bg-accent-on-dark px-7 py-3 font-semibold text-brand-dark"
        >
          Volver al inicio
        </Link>
      </Container>
    </main>
  );
}
