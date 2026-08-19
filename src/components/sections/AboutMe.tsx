import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";

/**
 * Valores/enfoque. TODO: sustituye estos tres por los tuyos reales.
 */
const VALUES = [
  {
    title: "Rigor sobre novedad",
    body: "Una métrica bien elegida y un conjunto de evaluación honesto valen más que el modelo de moda.",
  },
  {
    title: "Fallar de forma visible",
    body: "Prefiero un sistema que derive a revisión humana cuando duda antes que uno que acierte de media y falle en silencio.",
  },
  {
    title: "Que se pueda mantener",
    body: "Código y datos pensados para que otra persona los entienda dentro de seis meses.",
  },
];

export function AboutMe() {
  return (
    <Section id="sobre-mi" labelledBy="sobre-mi-title" className="bg-surface-muted/40">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <div className="relative mx-auto w-48 lg:mx-0 lg:w-full lg:max-w-[16rem]">
              <Image
                src="/profile-placeholder.svg"
                // TODO: cambia el texto alternativo cuando pongas tu foto real.
                alt="Retrato de relleno pendiente de sustituir"
                width={400}
                height={400}
                className="aspect-square w-full rounded-full border-4 border-surface object-cover shadow-md"
              />
              <span
                aria-hidden="true"
                className="absolute -right-2 -bottom-2 h-16 w-16 rounded-full border-2 border-brand-primary/40 lg:right-6"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            <Reveal>
              <h2
                id="sobre-mi-title"
                className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
              >
                Sobre mí
              </h2>

              {/* TODO: sustituye estos dos párrafos por tu biografía real
                  (máximo unas 200 palabras). */}
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                Soy {site.name}, {site.role.toLowerCase()}. Trabajo en llevar
                modelos de Inteligencia Artificial desde el cuaderno de pruebas
                hasta producción, que suele ser la parte difícil.
              </p>
              <p className="mt-4 leading-relaxed text-ink-muted">
                [TODO: cuenta aquí tu trayectoria, en qué problemas te gusta
                trabajar y qué te diferencia. Un par de párrafos bastan.]
              </p>
            </Reveal>

            <ul className="mt-10 grid list-none gap-5 sm:grid-cols-3">
              {VALUES.map((value, index) => (
                <Reveal as="li" key={value.title} delay={index * 80}>
                  <div className="h-full rounded-xl border border-border-subtle bg-surface p-5">
                    <span
                      aria-hidden="true"
                      className="mb-3 block h-1 w-10 rounded-full bg-brand-primary"
                    />
                    <h3 className="font-display text-base font-bold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {value.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
