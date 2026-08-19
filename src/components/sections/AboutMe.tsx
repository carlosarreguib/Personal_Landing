import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";

/**
 * Valores/enfoque, extraídos de la trayectoria real (ver Curriculum.md).
 */
const VALUES = [
  {
    title: "Ingeniería con normativa",
    body: "Las soluciones de refrigeración tienen que funcionar en condiciones reales y cumplir la normativa presente y futura (UNE-EN 378, RSIF, F-Gas), no solo el papel.",
  },
  {
    title: "De la investigación a la planta",
    body: "He llevado tecnologías de separación y captura de gases desde el laboratorio y la simulación hasta plantas piloto y proyectos de I+D financiados.",
  },
  {
    title: "Ingeniería más datos",
    body: "Combino el criterio técnico de la ingeniería química con herramientas de ciencia de datos e Inteligencia Artificial para acelerar decisiones y reducir incertidumbre.",
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

              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                Soy {site.name}, Ingeniero Químico especializado en
                refrigeración industrial, refrigerantes fluorados y gases
                industriales. Ayudo a instaladores, fabricantes e
                ingenierías a convertir retos técnicos y normativos en
                soluciones de refrigeración viables y rentables.
              </p>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Mi trayectoria combina más de cinco años de I+D industrial
                en GRIT &mdash;diseñando y validando plantas piloto de
                separación y purificación de gases, hasta la propuesta y
                gestión de un proyecto de I+D financiado por el CDTI&mdash;
                con un perfil técnico-comercial que traduce esa ingeniería
                en decisiones de negocio. A ese conocimiento le he sumado
                una formación avanzada en Inteligencia Artificial y ciencia
                de datos, que aplico para acelerar el análisis técnico y
                apoyar mejores decisiones.
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
