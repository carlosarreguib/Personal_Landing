import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { AboutMe } from "@/components/sections/AboutMe";
import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { Resume } from "@/components/sections/Resume";
import { site } from "@/data/site";
import { getAllProjects } from "@/lib/projects";

/**
 * Página principal: Server Component.
 *
 * Lee los proyectos en el servidor y se los pasa a ProjectsSection, de modo
 * que los seis salen ya en el HTML inicial aunque el filtrado ocurra en el
 * cliente.
 */
export default function Home() {
  const projects = getAllProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    description: site.description,
  };

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="contenido">
        <Hero />
        <ProjectsSection projects={projects} />
        <Resume />
        <AboutMe />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
