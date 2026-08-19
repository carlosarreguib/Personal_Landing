import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

// No se cargan fuentes web: la tipografía es San Francisco, que se resuelve
// desde el sistema (ver --font-system en globals.css). Esto ahorra además la
// descarga de fuentes y elimina cualquier parpadeo al cargar.

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.headline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title: `${site.name} — ${site.headline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.headline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
