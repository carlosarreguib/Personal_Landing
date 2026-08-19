import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * En la fase 2, cuando existan las rutas /proyectos/[slug], añade aquí una
 * entrada por proyecto recorriendo getAllProjects().
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
