import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import {
  certification,
  education,
  experience,
  highlights,
  languages,
  resumeIntro,
  skillGroups,
} from "@/data/resume";

/**
 * Formación y trayectoria.
 *
 * Server Component: es contenido estático que no necesita nada del cliente.
 * Los datos viven en `src/data/resume.ts`, extraídos de `Curriculum.md`.
 */
export function Resume() {
  return (
    <Section
      id="trayectoria"
      labelledBy="trayectoria-title"
      className="bg-surface"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <h2
            id="trayectoria-title"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Formación y trayectoria
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            {resumeIntro}
          </p>
        </Reveal>

        {/* Cifras destacadas */}
        <Reveal>
          <dl className="mt-12 grid gap-5 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border-subtle bg-surface-muted/40 p-6"
              >
                <dt className="font-display text-3xl font-bold text-teal-700">
                  {item.value}
                </dt>
                <dd className="mt-2">
                  <span className="block font-semibold text-ink">
                    {item.label}
                  </span>
                  {item.detail && (
                    <span className="mt-1 block text-sm text-ink-muted">
                      {item.detail}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Experiencia */}
          <div>
            <Reveal>
              <h3 className="font-display text-xl font-bold text-ink">
                Experiencia
              </h3>
            </Reveal>

            {/* La línea vertical es decorativa: el orden ya lo da la lista. */}
            <ol className="mt-6 list-none border-l border-border-subtle">
              {experience.map((item, index) => (
                <Reveal as="li" key={item.role} delay={index * 80}>
                  <div className="relative pb-8 pl-6">
                    <span
                      aria-hidden="true"
                      className={
                        item.current
                          ? "absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-teal-700"
                          : "absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-border-strong"
                      }
                    />
                    <p className="text-sm font-medium text-ink-muted">
                      {item.period}
                      {item.current && (
                        <span className="ml-2 rounded bg-surface-muted px-1.5 py-0.5 text-xs font-semibold text-teal-700">
                          Actual
                        </span>
                      )}
                    </p>
                    <h4 className="mt-1 font-display text-base font-bold text-ink">
                      {item.role}
                    </h4>
                    <p className="text-sm font-medium text-teal-700">
                      {item.organization}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {item.summary}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Formación, certificación e idiomas */}
          <div>
            <Reveal>
              <h3 className="font-display text-xl font-bold text-ink">
                Formación
              </h3>
            </Reveal>

            <ul className="mt-6 list-none space-y-5">
              {education.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 80}>
                  <div className="rounded-xl border border-border-subtle bg-surface p-5">
                    <p className="text-sm font-medium text-ink-muted">
                      {item.period}
                    </p>
                    <h4 className="mt-1 font-display text-base font-bold text-ink">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-teal-700">
                      {item.organization}
                    </p>
                    {item.detail && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <div className="mt-8 rounded-xl border border-border-subtle bg-surface-muted/40 p-5">
                <h3 className="font-display text-sm font-bold tracking-wide text-ink uppercase">
                  Certificación
                </h3>
                <p className="mt-2 font-semibold text-ink">
                  {certification.title}
                </p>
                <p className="text-sm text-ink-muted">
                  {certification.organization} · {certification.period}
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-6">
                <h3 className="font-display text-sm font-bold tracking-wide text-ink uppercase">
                  Idiomas
                </h3>
                <dl className="mt-3 space-y-1.5">
                  {languages.map((language) => (
                    <div
                      key={language.name}
                      className="flex items-baseline justify-between gap-4 text-sm"
                    >
                      <dt className="font-medium text-ink">{language.name}</dt>
                      <dd className="text-ink-muted">{language.level}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Aptitudes */}
        <Reveal>
          <h3 className="mt-16 font-display text-xl font-bold text-ink">
            Aptitudes
          </h3>
        </Reveal>

        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.label} delay={index * 80}>
              <h4 className="font-display text-sm font-bold tracking-wide text-ink-muted uppercase">
                {group.label}
              </h4>
              <ul className="mt-3 flex list-none flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="inline-flex items-center rounded border border-border-subtle px-2 py-0.5 text-xs font-medium text-ink-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
