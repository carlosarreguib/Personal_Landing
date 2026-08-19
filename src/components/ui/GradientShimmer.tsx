"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

/** Una parada del degradado, situada de 0 a 1 a lo largo del barrido. */
export interface GradientStop {
  position: number;
  color: string;
}

export type GradientPresetName =
  | "sunrise"
  | "bubble"
  | "peach"
  | "tonic"
  | "mint"
  | "spring"
  | "twilight"
  | "bay";

/** Un degradado explícito de varias paradas o el nombre de un preset. */
export type GradientInput = GradientStop[] | GradientPresetName;

/** Curvas de aceleración con nombre (sin cubic-bezier crudo en la API). */
export type EasingPreset = "smooth" | "gentle" | "snappy";

export interface GradientShimmerProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** El texto a destellar. Solo cadena: el degradado lo barre por encima. */
  children: string;
  /** Degradado de varias paradas o nombre de preset. Por defecto `"sunrise"`. */
  gradient?: GradientInput;
  /** Curva del barrido. Por defecto `"smooth"`. */
  easing?: EasingPreset;
  /**
   * Velocidad de referencia del barrido, en segundos. Por defecto `1.45`.
   */
  duration?: number;
  /** Ancho de la banda en px por carácter; escala con el tamaño de fuente. */
  spread?: number;
  /** Ángulo del degradado en grados. Por defecto `105`. */
  angle?: number;
  /** Pausa (ms) tras cada barrido antes del siguiente. Por defecto `1000`. */
  pauseBetween?: number;
  /** Color base del texto sobre el que se funde la banda. */
  baseColor?: string;
  /** Pausa el barrido mientras se hace scroll. Por defecto `true`. */
  pauseOnScroll?: boolean;
  /** Pausa mientras está fuera del viewport. Por defecto `true`. */
  pauseWhenOffscreen?: boolean;
  /** Degradado estático (sin barrido) con movimiento reducido. */
  respectReducedMotion?: boolean;
  /** Elemento a renderizar. Por defecto `"span"`. */
  as?: ElementType;
}

/* -------------------------------------------------------------------------- */
/*  Presets                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Degradados incorporados. Se conservan los del componente original.
 *
 * OJO al elegir uno: la mayoría son pasteles claros, pensados para fondo
 * oscuro. Sobre el hero claro de esta landing solo `twilight` mantiene el
 * contraste, porque es el único cuyos extremos son oscuros.
 */
export const gradientPresets: Record<GradientPresetName, GradientStop[]> = {
  sunrise: [
    { color: "#B6D3EF", position: 0 },
    { color: "#CAD1D7", position: 0.153 },
    { color: "#D7CFC8", position: 0.252 },
    { color: "#E1CDB9", position: 0.341 },
    { color: "#EAC6A5", position: 0.424 },
    { color: "#EDB185", position: 0.505 },
    { color: "#EF9B62", position: 0.586 },
    { color: "#F18F60", position: 0.669 },
    { color: "#F48D7A", position: 0.758 },
    { color: "#F78A94", position: 0.857 },
    { color: "#F888A0", position: 1 },
  ],
  bubble: [
    { color: "#F5EBD9", position: 0 },
    { color: "#F2D4DB", position: 0.31 },
    { color: "#EBBDDE", position: 0.5 },
    { color: "#CCBAE3", position: 0.65 },
    { color: "#8CBFF0", position: 0.82 },
    { color: "#78B0FF", position: 1 },
  ],
  peach: [
    { color: "#D9F5FA", position: 0 },
    { color: "#FCD9D6", position: 0.31 },
    { color: "#FCBAC9", position: 0.61 },
    { color: "#F0B3F5", position: 1 },
  ],
  tonic: [
    { color: "#E3EDF0", position: 0 },
    { color: "#E8EBB8", position: 0.27 },
    { color: "#F0DEA3", position: 0.43 },
    { color: "#E8B078", position: 0.75 },
    { color: "#F29682", position: 1 },
  ],
  mint: [
    { color: "#DECEE8", position: 0 },
    { color: "#CBBAEE", position: 0.21 },
    { color: "#7DC0FB", position: 0.46 },
    { color: "#00C7A6", position: 1 },
  ],
  spring: [
    { color: "#F7D5C5", position: 0.07 },
    { color: "#46A8C0", position: 0.58 },
    { color: "#43AE7D", position: 1 },
  ],
  twilight: [
    { color: "#E3CCE6", position: 0 },
    { color: "#4E8CD5", position: 0.35 },
    { color: "#6068C2", position: 0.64 },
    { color: "#38364E", position: 1 },
  ],
  bay: [
    { color: "#DBE3D0", position: 0 },
    { color: "#8DB8A7", position: 0.23 },
    { color: "#2D8E9A", position: 0.42 },
    { color: "#076492", position: 0.59 },
    { color: "#154288", position: 0.79 },
    { color: "#262C81", position: 1 },
  ],
};

/** Curvas de aceleración con nombre. */
export const easingPresets: Record<EasingPreset, string> = {
  smooth: "cubic-bezier(0.45, 0, 0.55, 1)",
  gentle: "cubic-bezier(0.76, 0, 0.24, 1)",
  snappy: "cubic-bezier(0.3, 0, 0.2, 1)",
};

/* -------------------------------------------------------------------------- */
/*  Construcción de la banda                                                   */
/* -------------------------------------------------------------------------- */

/** Semiancho del núcleo saturado, como fracción de `--gs-spread-mid`. */
const BAND_CORE_RATIO = 0.44;

/**
 * Construye el `background-image` de la banda de luz que se desplaza.
 *
 * Las paradas se reparten por el núcleo saturado y luego se funden con el
 * color base. Es una función pura y sin DOM, así que puede ejecutarse en el
 * servidor.
 */
export function buildBandGradient(
  stops: GradientStop[],
  angle: number,
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const first = sorted[0]?.color ?? "white";
  const last = sorted[sorted.length - 1]?.color ?? "white";

  const core = sorted
    .map((stop) => {
      const factor = (stop.position - 0.5) * 2 * BAND_CORE_RATIO;
      return `${stop.color} calc(50% + var(--gs-spread-mid) * ${factor.toFixed(4)})`;
    })
    .join(", ");

  return [
    `linear-gradient(${angle}deg`,
    `var(--gs-base) calc(50% - var(--gs-spread))`,
    `color-mix(in oklab, var(--gs-base) 42%, ${first}) calc(50% - var(--gs-spread-mid))`,
    core,
    `color-mix(in oklab, var(--gs-base) 42%, ${last}) calc(50% + var(--gs-spread-mid))`,
    `var(--gs-base) calc(50% + var(--gs-spread)))`,
  ].join(", ");
}

/* -------------------------------------------------------------------------- */
/*  Comprobaciones de capacidad (seguras en servidor)                          */
/* -------------------------------------------------------------------------- */

/** ¿Se puede usar `background-clip: text`? */
function supportsBackgroundClipText(): boolean {
  if (typeof window === "undefined") return true;
  if (typeof window.CSS?.supports !== "function") return false;
  return (
    window.CSS.supports("background-clip", "text") ||
    window.CSS.supports("-webkit-background-clip", "text")
  );
}

/** ¿El usuario ha pedido reducir el movimiento? */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface GateOptions {
  pauseOnScroll: boolean;
  pauseWhenOffscreen: boolean;
}

const VIEWPORT_ROOT_MARGIN = "160px";
const SCROLL_IDLE_MS = 120;

/**
 * Conecta las condiciones de visibilidad (viewport, pestaña activa y scroll)
 * a `onChange(active)`. Devuelve la función de limpieza.
 */
function observeShimmerActive(
  el: Element,
  { pauseOnScroll, pauseWhenOffscreen }: GateOptions,
  onChange: (active: boolean) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  let inViewport =
    !pauseWhenOffscreen || typeof IntersectionObserver === "undefined";
  let pageVisible = typeof document === "undefined" ? true : !document.hidden;
  let notScrolling = true;
  const compute = () => onChange(inViewport && pageVisible && notScrolling);

  let io: IntersectionObserver | undefined;
  if (pauseWhenOffscreen && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        inViewport = entry.isIntersecting;
        compute();
      },
      { rootMargin: VIEWPORT_ROOT_MARGIN },
    );
    io.observe(el);
  }

  const onVisibility = () => {
    pageVisible = !document.hidden;
    compute();
  };
  document.addEventListener("visibilitychange", onVisibility);

  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  const onScroll = () => {
    notScrolling = false;
    compute();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      notScrolling = true;
      compute();
    }, SCROLL_IDLE_MS);
  };
  const scrollOpts = { passive: true, capture: true } as const;
  if (pauseOnScroll) window.addEventListener("scroll", onScroll, scrollOpts);

  compute();

  return () => {
    io?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    if (pauseOnScroll)
      window.removeEventListener("scroll", onScroll, { capture: true });
    clearTimeout(scrollTimer);
  };
}

/* -------------------------------------------------------------------------- */
/*  Componente                                                                 */
/* -------------------------------------------------------------------------- */

const FALLBACK_TEXT_WIDTH_PX = 96;
const MAX_SPREAD_PX = 48;
const SPREAD_MID_RATIO = 0.72;
const BASE_FONT_PX = 14;
const DEFAULT_DURATION_SECONDS = 1.45;
const DEFAULT_SPREAD = 3;
const DEFAULT_ANGLE = 105;

function resolveStops(gradient: GradientInput | undefined): GradientStop[] {
  if (!gradient) return gradientPresets.sunrise;
  if (typeof gradient === "string")
    return gradientPresets[gradient] ?? gradientPresets.sunrise;
  return gradient;
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function revealNormalText(el: HTMLElement) {
  el.style.removeProperty("background-image");
  el.style.removeProperty("-webkit-text-fill-color");
}

/**
 * Texto con un destello de degradado que lo barre.
 *
 * Movido por la Web Animations API, sin dependencias ni CSS externo.
 */
export function GradientShimmer({
  children,
  gradient,
  easing = "smooth",
  duration = DEFAULT_DURATION_SECONDS,
  spread = DEFAULT_SPREAD,
  angle = DEFAULT_ANGLE,
  pauseBetween = 1000,
  baseColor = "currentColor",
  pauseOnScroll = true,
  pauseWhenOffscreen = true,
  respectReducedMotion = true,
  as = "span",
  className,
  style,
  ...restProps
}: GradientShimmerProps) {
  const ref = useRef<HTMLElement | null>(null);
  const safeDuration = Math.max(
    0.001,
    finiteOr(duration, DEFAULT_DURATION_SECONDS),
  );
  const safeSpread = Math.max(0, finiteOr(spread, DEFAULT_SPREAD));
  const safeAngle = finiteOr(angle, DEFAULT_ANGLE);
  const stops = useMemo(() => resolveStops(gradient), [gradient]);
  const backgroundImage = useMemo(
    () => buildBandGradient(stops, safeAngle),
    [stops, safeAngle],
  );
  const easingValue = easingPresets[easing] ?? easingPresets.smooth;

  // Semilla válida para el primer pintado, antes de medir la fuente.
  const initialSpread = Math.min(children.length * safeSpread, MAX_SPREAD_PX);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const textWidth =
        el.getBoundingClientRect().width || FALLBACK_TEXT_WIDTH_PX;
      const fontSize =
        Number.parseFloat(getComputedStyle(el).fontSize) || BASE_FONT_PX;
      const fontScale = fontSize / BASE_FONT_PX;
      const spreadPx = Math.min(
        children.length * safeSpread * fontScale,
        MAX_SPREAD_PX * fontScale,
      );
      const layerWidth = Math.max(1, textWidth + spreadPx * 2);
      const start = -spreadPx - layerWidth / 2;
      const end = textWidth + spreadPx - layerWidth / 2;
      const durationMs = safeDuration * 1000;
      el.style.setProperty("--gs-spread", `${spreadPx}px`);
      el.style.setProperty("--gs-spread-mid", `${spreadPx * SPREAD_MID_RATIO}px`);
      el.style.backgroundSize = `${layerWidth}px 100%`;
      return { start, end, durationMs };
    };

    // Sin soporte de `background-clip: text`, el relleno transparente
    // escondería el texto entero: se quita y se renderiza normal.
    if (!supportsBackgroundClipText()) {
      revealNormalText(el);
      return;
    }

    measure();

    if (respectReducedMotion && prefersReducedMotion()) return; // estático
    if (typeof el.animate !== "function") return; // estático

    let anim: Animation | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let active = true;
    let cancelled = false;

    const runSweep = () => {
      if (cancelled) return;
      const { start, end, durationMs } = measure();
      const next = el.animate(
        [
          { backgroundPosition: `${start}px center` },
          { backgroundPosition: `${end}px center` },
        ],
        { duration: durationMs, easing: easingValue, fill: "forwards" },
      );
      if (!active) next.pause();
      // La anterior se cancela solo cuando la nueva ya tomó el relevo; si no,
      // las animaciones terminadas con `fill: forwards` se acumulan.
      anim?.cancel();
      anim = next;
      next.onfinish = () => {
        pauseTimer = setTimeout(runSweep, Math.max(0, pauseBetween));
      };
    };

    const stopVisibility = observeShimmerActive(
      el,
      { pauseOnScroll, pauseWhenOffscreen },
      (next) => {
        active = next;
        if (anim) {
          if (active) anim.play();
          else anim.pause();
        }
      },
    );

    runSweep();

    return () => {
      cancelled = true;
      anim?.cancel();
      clearTimeout(pauseTimer);
      stopVisibility();
    };
  }, [
    children,
    safeSpread,
    safeDuration,
    easingValue,
    pauseBetween,
    pauseOnScroll,
    pauseWhenOffscreen,
    respectReducedMotion,
  ]);

  const mergedStyle: CSSProperties = {
    position: "relative",
    // `inline-block` es el valor por defecto, pero va antes del spread de
    // `style` para que quien lo use pueda cambiarlo. OJO: como es un estilo
    // en línea, gana a cualquier clase de Tailwind, así que para ponerlo en
    // bloque hay que pasar `style={{ display: "block" }}` y no `className`.
    display: "inline-block",
    backgroundImage,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundColor: "var(--gs-base)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    // Se revela con text-fill-color y no con `color: transparent` para que
    // `currentColor` en `--gs-base` siga resolviendo al color real del texto.
    WebkitTextFillColor: "transparent",
    ["--gs-base" as string]: baseColor,
    ["--gs-spread" as string]: `${initialSpread}px`,
    ["--gs-spread-mid" as string]: `${initialSpread * SPREAD_MID_RATIO}px`,
    ...style,
  };

  // Se renderiza con JSX y no con createElement: pasar el ref como argumento
  // de una llamada hace saltar la regla `react-hooks/refs`, que no puede
  // distinguir "se lo paso a React" de "lo leo durante el render".
  const Tag = as as ElementType;

  return (
    <Tag {...restProps} ref={ref} className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
}

export default GradientShimmer;
