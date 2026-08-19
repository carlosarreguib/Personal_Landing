# Landing de Portafolio de Proyectos de IA

Landing page de portafolio construida con **Next.js 16 (App Router)**,
**TypeScript** y **Tailwind CSS 4**.

## Arrancar el proyecto

```powershell
npm run dev     # desarrollo en http://localhost:3000
npm run build   # build de producción
npm start       # servir el build
```

> **Nota sobre esta ruta.** La carpeta del proyecto contiene espacios, una coma
> y un `&`. En PowerShell, `npx` y los `.cmd` de `node_modules\.bin` se rompen
> al resolver esta ruta. Si te pasa, invoca el binario a través de node:
>
> ```powershell
> node ".\node_modules\typescript\bin\tsc" --noEmit
> node ".\node_modules\next\dist\bin\next" build
> ```

---

## Cómo añadir un proyecto

Solo se toca **un fichero**: [`src/data/projects.ts`](src/data/projects.ts).

1. Copia uno de los objetos existentes y cambia sus campos.
2. El `slug` va en kebab-case y sin acentos: es la URL y también el nombre de
   la carpeta de imágenes.
3. Deja tus imágenes en `public/img/projects/<slug>/` o genera las de relleno.
   Hacen falta **dos portadas**: `cover.svg` (16:9, para tarjetas y ficha) y
   `square.svg` (1:1, para el carrusel, cuyas tarjetas son cuadradas), además
   de `g1`, `g2`… para la galería:

   ```powershell
   node scripts/gen-placeholders.mjs
   ```

   Si usas el script, añade también la entrada del proyecto a su array
   `PROJECTS`.

No hace falta tocar ningún componente: el carrusel, el filtro, los contadores y
el orden por fecha se actualizan solos. Está verificado: añadir un séptimo
proyecto genera su diapositiva y actualiza los contadores sin editar nada más.

Para enlazar el repositorio de un proyecto, rellena `links.github`: el logo de
GitHub con el texto "Ver código en GitHub" aparece automáticamente debajo del
stack. Los proyectos sin ese campo no muestran nada, así que no quedan enlaces
rotos ni huecos.

Para añadir una **categoría** nueva, añade su id a `CATEGORY_IDS` en
[`src/types/project.ts`](src/types/project.ts) y su entrada en
[`src/data/categories.ts`](src/data/categories.ts). TypeScript avisa si falta.

Las categorías **sin ningún proyecto no se muestran**: ni como filtro ni en las
especialidades del hero, y no cuentan para el número de áreas. Un filtro que
devuelve una lista vacía es un callejón sin salida para quien lo pulsa.

---

## Pendiente de rellenar (TODO)

Los datos personales son placeholders. Están todos en
[`src/data/site.ts`](src/data/site.ts) salvo la biografía:

- `url` — el dominio real (lo usan las meta tags, el sitemap y robots.txt).
- `tagline`, `role` — ajústalos a tu perfil.
- `social` — las URLs de LinkedIn y GitHub. Mientras valgan `null` no se
  renderiza ningún enlace, para no dejar enlaces rotos.
- La biografía y los tres valores, en
  [`src/components/sections/AboutMe.tsx`](src/components/sections/AboutMe.tsx).
- La foto de perfil: sustituye `public/profile-placeholder.svg` y actualiza su
  texto alternativo.
- De los 6 proyectos de `src/data/projects.ts`, **3 son reales** (agente de
  inversión, valorización de refrigerantes y gemelo digital VPTSA, con enlace a
  su repositorio) y **3 siguen siendo ejemplos de muestra** pendientes de
  sustituir: extracción de datos de facturas, resumen de actas y detección de
  EPI en obra.
- Las imágenes de los proyectos reales son placeholders generados. Sustitúyelas
  por capturas reales en `public/img/projects/<slug>/`.

---

## Tipografía

Toda la landing usa **San Francisco**, la tipografía de sistema de Apple. Es
propietaria y no se puede servir por CSS ni desde Google Fonts, así que se
invoca con `-apple-system` / `BlinkMacSystemFont`, que la resuelven en macOS e
iOS. En Windows y Android se cae a la fuente de sistema equivalente (Segoe UI
Variable, Roboto), que es la misma estrategia que usan Apple y GitHub.

La pila está en `--font-system`, en [`globals.css`](src/app/globals.css), y se
aplica a títulos y cuerpo. Los encabezados llevan `letter-spacing: -0.022em`
porque San Francisco pide tracking negativo en tamaños grandes; sin eso los
titulares se ven sueltos.

Ventaja secundaria: no se descarga ninguna fuente web, así que no hay parpadeo
de texto al cargar.

## El hero

El cabecero ([`Hero`](src/components/sections/Hero.tsx)) tiene un fondo animado
por canvas con **ruido simplex 3D** y viñeta
([`NoiseBackground`](src/components/ui/NoiseBackground.tsx)). El ruido está
implementado a mano en [`simplexNoise.ts`](src/lib/simplexNoise.ts) para no
añadir una dependencia.

Es ruido **3D** y no 2D a propósito: usando el tiempo como tercera coordenada,
las manchas se deforman mientras se desplazan, que es lo que da sensación de
fluido. Desplazando un campo 2D el resultado parece una foto arrastrándose en
bloque.

El título y el subtítulo llevan un destello de degradado
([`GradientShimmer`](src/components/ui/GradientShimmer.tsx)).

Props del hero para personalizar: `title`, `headline`, `tagline`,
`primaryAction`, `secondaryAction`, `animationSpeed` y `aside`.

Cosas que conviene no romper al tocarlo:

- **El hero es CLARO y el resto de la landing alterna claro y oscuro.** Todo el
  texto del hero va en tonos oscuros; es fácil traerse por error una clase
  `text-ink-on-dark` de otra sección y dejarlo ilegible.
- El canvas se pinta a baja resolución (160×100) y se escala con CSS: el ruido
  es suave y no se nota, pero calcular 16.000 píxeles por frame en vez de dos
  millones es la diferencia entre ir fluido y bloquear el hilo principal.
- Se detiene al salir del viewport o al ocultarse la pestaña, y con
  `prefers-reduced-motion` pinta un solo fotograma estático.
- En `NoiseBackground`, `scale` bajo produce manchas grandes y fluidas. Por
  encima de ~3 deja de parecer niebla y pasa a parecer mármol o ruido sucio.
- **`contrast` y la paleta van juntos.** El ruido simplex se agolpa en torno a
  su valor medio, así que sin la curva en S de `contrastCurve()` todo el
  lienzo cae en los grises centrales y se ve como una neblina plana. Pero la
  curva sola no basta: con una paleta corta no hay rango que separar. Si
  quieres más definición, amplía primero el recorrido tonal de la paleta.
- El extremo oscuro de la paleta (`#8E9999`) está elegido para que el texto
  oscuro del hero siga pasando AA por encima. **Si lo oscureces más, vuelve a
  medir el contraste** antes de darlo por bueno.
- **Los coeficientes de tiempo dentro de `draw()` son los que hacen que el
  movimiento se vea.** En una versión anterior eran un orden de magnitud
  menores y el fondo avanzaba un 0,2 % en 3 segundos: técnicamente animaba,
  pero a simple vista parecía congelado. Ahora cambia ~88 % de los píxeles por
  segundo. Si los bajas, vuelve a medirlo en lugar de fiarte de una captura.
- **No hay film grain**, solo un dithering ordenado de ±0,5 niveles de color
  para romper las bandas del degradado. Es invisible (la diferencia media
  entre píxeles vecinos es 0,6 sobre 255). Subir esa amplitud hace que el
  fondo parezca una imagen pixelada.
- `GradientShimmer` fija `display: inline-block` como **estilo en línea**, que
  gana a cualquier clase de Tailwind. Para ponerlo en bloque hay que pasar
  `style={{ display: "block" }}`; con `className="block"` el titular no salta
  de línea y se lee "Carlos ArreguiAI Projects Portfolio".
- El degradado del destello (`HERO_SHIMMER` en `Hero.tsx`) es el preset
  `twilight` **con su primera parada corregida**: la original (`#E3CCE6`) daba
  1,50:1 sobre las zonas blancas del fondo y ese punto del barrido se volvía
  invisible. Si cambias la paleta del fondo, vuelve a medir el degradado.

## Trayectoria y currículum

`Curriculum.md`, en la raíz, es el currículum completo. La sección
"Formación y trayectoria" de la landing
([`Resume`](src/components/sections/Resume.tsx)) muestra solo un extracto, con
los datos en [`src/data/resume.ts`](src/data/resume.ts).

**Son dos fuentes distintas a propósito**: la landing enseña lo esencial y el
documento guarda el detalle. Si actualizas uno, revisa el otro — no se
sincronizan solos.

Las cifras destacadas (años de experiencia, financiación CDTI, titulaciones)
salen del currículum y son verificables. Si cambias una, comprueba que sigue
cuadrando con `Curriculum.md`.

## Sistema de color y accesibilidad

Los tokens viven en [`src/app/globals.css`](src/app/globals.css) (Tailwind 4 usa
configuración CSS-first: **no hay `tailwind.config.js`**).

Están en **dos capas, y esto importa**. La paleta del brief no pasa el contraste
WCAG AA como color de texto:

| Color | Sobre blanco | Veredicto |
|---|---|---|
| `#6B9D9D` | 3,03:1 | Falla AA para texto normal |
| `#D4A574` | 2,23:1 | Falla incluso para texto grande |

Por eso:

- **`brand-*`** es identidad de marca: formas, degradados, bordes e iconos
  grandes. **Nunca como color de texto sobre fondo claro.**
- **Capa semántica** (`ink`, `ink-muted`, `link`, `ink-on-dark`,
  `accent-on-dark`): es lo único que deben usar los componentes.
- El dorado sí funciona como texto **sobre fondo oscuro** (7,09:1 sobre
  `#1A2332`), que es donde se usa: hero, CTA y footer.

Verificado: los 24 pares de texto/fondo que usa el sitio pasan AA (el más
ajustado da 4,52:1) y ningún componente usa `brand-primary` ni `brand-accent`
como color de texto.

## Movimiento

El revelado al hacer scroll usa un único hook
([`useReveal`](src/hooks/useReveal.ts)) y un envoltorio
([`Reveal`](src/components/ui/Reveal.tsx)). La animación vive entera en CSS y se
anula con `prefers-reduced-motion` por **dos vías independientes** (el hook y
una media query), de modo que el movimiento se suprime aunque el JS falle.

## Estructura

```
src/
├─ app/          layout, página, globals.css, sitemap, robots, 404
├─ components/
│  ├─ layout/    Navbar*, Footer, SkipLink
│  ├─ projects/  ProjectCarousel*, FilterBar*, TechTag, CategoryBadge,
│  │             ProjectCard, ProjectGrid (sin uso en la landing; fase 2)
│  ├─ sections/  Hero, AboutMe, Resume, ProjectsSection*
│  └─ ui/        Container, Section, Reveal*, CoverflowCarousel*,
│                NoiseBackground*, GradientShimmer*
├─ data/         projects.ts ← el fichero a editar · categories.ts ·
│                site.ts · resume.ts
├─ hooks/        useReveal*, useActiveSection*
├─ lib/          projects.ts (accesores), cn.ts, simplexNoise.ts
└─ types/        project.ts

* = Client Component. Todo lo demás son Server Components.
```

### El carrusel de proyectos

Los proyectos se muestran en un carrusel 3D estilo Coverflow
([`CoverflowCarousel`](src/components/ui/CoverflowCarousel.tsx)), envuelto por
[`ProjectCarousel`](src/components/projects/ProjectCarousel.tsx), que le añade
el pie con los datos del proyecto centrado.

Se maneja arrastrando, con las flechas del teclado (con el foco en el carrusel),
con los botones laterales o con los puntos de paginación. Los filtros por
categoría siguen encima y el carrusel se reinicia al cambiar de filtro.

Detalles que conviene no romper al tocarlo:

- Solo la tarjeta central queda expuesta a lectores de pantalla; las demás
  llevan `aria-hidden` porque están giradas y semitransparentes.
- El pie va con `aria-live="polite"`, así que al girar se anuncia el proyecto.
- Con `prefers-reduced-motion` el carrusel se coloca de golpe, sin animar.
- La máscara de degradado envuelve solo al carrusel, no al contenedor: si se
  sube al padre, desvanece también las flechas de navegación.

`ProjectCard` y `ProjectGrid` se conservan sin uso en la landing porque la
fase 2 los necesita para los proyectos relacionados.

## Fase 2: páginas de detalle

No están incluidas en esta entrega, pero los datos ya están cargados
(`gallery`, `description`, `results`, `links`) y los accesores escritos
(`getProjectBySlug`, `getRelatedProjects`), así que es trabajo de presentación.

Para activarlas: crea `src/app/proyectos/[slug]/page.tsx` con
`generateStaticParams`, y pon `DETAIL_PAGES_ENABLED = true` en
`src/data/site.ts` — las tarjetas pasarán a enlazar automáticamente.

> En Next 16 `params` es una **Promise**: hay que hacer `await params`. Los
> ejemplos de Next 14 que circulan por internet inducen a error aquí.
