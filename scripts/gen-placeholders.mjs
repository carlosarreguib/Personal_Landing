/**
 * Genera imágenes SVG de relleno para los proyectos.
 *
 *   node scripts/gen-placeholders.mjs
 *
 * Son deterministas: regenerarlas da exactamente el mismo fichero, así que no
 * ensucian el historial. Se usan SVG y no un servicio externo porque los
 * enlaces externos se rompen con el tiempo y puede no haber red.
 *
 * Al añadir un proyecto, añade su entrada a PROJECTS y vuelve a ejecutar el
 * script (o deja tus imágenes reales en /public/img/projects/<slug>/).
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "img", "projects");

/** Debe reflejar los slugs de src/data/projects.ts. */
const PROJECTS = [
  { slug: "agente-inversion", title: "Agente de inversión cuantitativa", category: "llms", gallery: 2 },
  { slug: "gestion-residuos-grit", title: "Valorización de refrigerantes", category: "automatizacion", gallery: 2 },
  { slug: "gemelo-digital-grit", title: "Gemelo digital VPTSA", category: "automatizacion", gallery: 1 },
  { slug: "extraccion-datos-facturas", title: "Extracción de datos de facturas", category: "automatizacion", gallery: 2 },
  { slug: "resumen-actas-reuniones", title: "Resumen automático de actas", category: "llms", gallery: 1 },
  { slug: "deteccion-epi-obra", title: "Detección de EPI en obra", category: "vision", gallery: 2 },
];

/** Paleta de marca por categoría. Cumple el sistema de tokens del proyecto. */
const PALETTE = {
  nlp: { from: "#6B9D9D", to: "#115E59", label: "NLP" },
  vision: { from: "#2C3E50", to: "#1A2332", label: "Visión" },
  automatizacion: { from: "#D4A574", to: "#8A6A45", label: "Automatización" },
  llms: { from: "#0F766E", to: "#1A2332", label: "LLMs" },
};

/** Hash entero estable a partir de una cadena (FNV-1a de 32 bits). */
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Generador pseudoaleatorio determinista sembrado con el hash del slug. */
function makeRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function escapeXml(text) {
  return text.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      default: return "&quot;";
    }
  });
}

/** Construye el SVG: degradado de marca + formas geométricas + rótulo. */
function buildSvg({ width, height, title, category, seed }) {
  const palette = PALETTE[category];
  const random = makeRandom(seed);
  const id = `g${seed.toString(16)}`;

  const shapes = [];
  // Tres círculos de baja opacidad que riman con las formas del hero.
  for (let i = 0; i < 3; i += 1) {
    const cx = Math.round(random() * width);
    const cy = Math.round(random() * height);
    const r = Math.round((0.12 + random() * 0.22) * Math.min(width, height));
    const opacity = (0.06 + random() * 0.08).toFixed(3);
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" opacity="${opacity}"/>`,
    );
  }
  // Un rectángulo girado para romper la simetría.
  const rx = Math.round(random() * width * 0.6);
  const ry = Math.round(random() * height * 0.6);
  const rw = Math.round((0.2 + random() * 0.25) * width);
  const angle = Math.round(random() * 60 - 30);
  shapes.push(
    `<rect x="${rx}" y="${ry}" width="${rw}" height="${rw}" fill="#FFFFFF" opacity="0.05" transform="rotate(${angle} ${rx + rw / 2} ${ry + rw / 2})"/>`,
  );

  // El tamaño del texto se deriva del lado MENOR, no de la altura: si no, en
  // formato cuadrado el rótulo saldría desproporcionado respecto al de 16:9.
  const base = Math.min(width, height);
  const titleSize = Math.round(base * 0.072);
  const labelSize = Math.round(base * 0.038);
  const safeTitle = escapeXml(title);
  const safeLabel = escapeXml(palette.label);

  // Ajuste de línea sencillo para que los títulos largos no se salgan de una
  // tarjeta cuadrada. ~0.58em por carácter es una aproximación prudente.
  const maxChars = Math.floor((width * 0.88) / (titleSize * 0.58));
  const words = safeTitle.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  const lineHeight = Math.round(titleSize * 1.2);
  const titleBlockBottom = Math.round(height * 0.92);
  const titleTop = titleBlockBottom - (lines.length - 1) * lineHeight;
  const titleTspans = lines
    .map(
      (line, index) =>
        `<tspan x="${Math.round(width * 0.06)}" y="${titleTop + index * lineHeight}">${line}</tspan>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="${id}-t">
  <title id="${id}-t">${safeTitle}</title>
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.from}"/>
      <stop offset="100%" stop-color="${palette.to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${id})"/>
  ${shapes.join("\n  ")}
  <text x="${Math.round(width * 0.06)}" y="${titleTop - lineHeight}" font-family="Outfit, ui-sans-serif, system-ui, sans-serif" font-size="${labelSize}" font-weight="500" fill="#FFFFFF" opacity="0.75" letter-spacing="2">${safeLabel.toUpperCase()}</text>
  <text font-family="Outfit, ui-sans-serif, system-ui, sans-serif" font-size="${titleSize}" font-weight="700" fill="#FFFFFF">${titleTspans}</text>
</svg>
`;
}

async function main() {
  let written = 0;

  for (const project of PROJECTS) {
    const dir = join(OUT, project.slug);
    await mkdir(dir, { recursive: true });

    const base = hash(project.slug);

    await writeFile(
      join(dir, "cover.svg"),
      buildSvg({
        width: 1200,
        height: 675,
        title: project.title,
        category: project.category,
        seed: base,
      }),
      "utf8",
    );
    written += 1;

    // Portada cuadrada para el carrusel Coverflow, cuyas tarjetas son 1:1.
    // Se genera aparte en vez de recortar la 16:9 para que el rótulo no quede
    // cortado por los lados.
    await writeFile(
      join(dir, "square.svg"),
      buildSvg({
        width: 900,
        height: 900,
        title: project.title,
        category: project.category,
        seed: base,
      }),
      "utf8",
    );
    written += 1;

    for (let i = 1; i <= project.gallery; i += 1) {
      await writeFile(
        join(dir, `g${i}.svg`),
        buildSvg({
          width: 1600,
          height: 1000,
          title: project.title,
          category: project.category,
          seed: base + i * 7919,
        }),
        "utf8",
      );
      written += 1;
    }
  }

  // Retrato de relleno para la sección "Sobre mí".
  const profile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-labelledby="p-t">
  <title id="p-t">Retrato de relleno</title>
  <defs>
    <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6B9D9D"/>
      <stop offset="100%" stop-color="#1A2332"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#pg)"/>
  <circle cx="200" cy="158" r="62" fill="#FFFFFF" opacity="0.85"/>
  <path d="M200 236c-62 0-112 40-112 90v74h224v-74c0-50-50-90-112-90z" fill="#FFFFFF" opacity="0.85"/>
</svg>
`;
  await writeFile(join(ROOT, "public", "profile-placeholder.svg"), profile, "utf8");
  written += 1;

  console.log(`Generadas ${written} imágenes SVG en public/img/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
