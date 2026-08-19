"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "@/lib/simplexNoise";
import { cn } from "@/lib/cn";

export interface NoiseBackgroundProps {
  /**
   * Paleta del degradado, de la zona más clara a la más oscura.
   * Por defecto, grises claros y blancos.
   */
  palette?: string[];
  /** Velocidad de la animación. 1 = ritmo fluido por defecto. */
  speed?: number;
  /** Escala del ruido: valores bajos dan manchas más grandes. */
  scale?: number;
  /** Intensidad de la viñeta, de 0 a 1. */
  vignette?: number;
  /**
   * Separación entre zonas claras y oscuras. 0 = degradado plano y difuso;
   * 2-3 = masas bien distinguibles. Por encima de ~3 se recortan los bordes.
   */
  contrast?: number;
  className?: string;
}

/**
 * Paleta por defecto: del blanco al gris medio-oscuro.
 *
 * El recorrido tonal es amplio a propósito. Con una paleta corta (todo grises
 * muy claros) da igual cuánta curva de contraste se aplique: no hay rango que
 * separar y el fondo se ve como una neblina plana. Es la paleta, no la curva,
 * la que pone el techo.
 *
 * El extremo oscuro (#8E9999) está elegido para que el texto oscuro del hero
 * siga pasando WCAG AA por encima. Si lo bajas más, vuelve a medir el
 * contraste antes de darlo por bueno.
 */
const DEFAULT_PALETTE = ["#FFFFFF", "#EFF3F3", "#DAE1E1", "#BAC3C3", "#8E9999"];

/**
 * Resolución interna del campo de ruido.
 *
 * Se pinta pequeño y se escala con CSS: el ruido simplex es suave, así que
 * ampliarlo no se nota, y calcular 16.000 píxeles por frame en vez de dos
 * millones es la diferencia entre ir fluido y bloquear el hilo principal.
 */
const FIELD_W = 160;
const FIELD_H = 100;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * Curva de contraste en forma de S centrada en 0,5.
 *
 * Hace falta porque el ruido simplex se agolpa estadísticamente alrededor del
 * valor medio: sin esto, casi todo el lienzo cae en los grises centrales de la
 * paleta, los extremos no llegan a verse y el resultado es una neblina plana.
 * La S separa las zonas claras de las oscuras y deja las transiciones amplias.
 *
 * `amount` 0 = sin efecto. Por encima de ~3 las manchas empiezan a recortarse
 * con bordes duros.
 */
function contrastCurve(t: number, amount: number): number {
  const x = Math.min(1, Math.max(0, t));
  if (amount <= 0) return x;
  // Smoothstep aplicado repetidamente: cada pasada acentúa la S.
  const passes = 1 + amount;
  let v = x;
  for (let i = 0; i < Math.floor(passes); i += 1) {
    v = v * v * (3 - 2 * v);
  }
  // La parte fraccionaria se mezcla para que el parámetro sea continuo.
  const frac = passes - Math.floor(passes);
  if (frac > 0) {
    const smoothed = v * v * (3 - 2 * v);
    v = v + (smoothed - v) * frac;
  }
  return v;
}

/** Interpola la paleta en la posición t (0..1). Es la mezcla suave de color. */
function samplePalette(
  rgbPalette: [number, number, number][],
  t: number,
): [number, number, number] {
  const clamped = Math.min(0.9999, Math.max(0, t));
  const scaled = clamped * (rgbPalette.length - 1);
  const index = Math.floor(scaled);
  const frac = scaled - index;
  const a = rgbPalette[index];
  const b = rgbPalette[Math.min(index + 1, rgbPalette.length - 1)];
  return [
    a[0] + (b[0] - a[0]) * frac,
    a[1] + (b[1] - a[1]) * frac,
    a[2] + (b[2] - a[2]) * frac,
  ];
}

/**
 * Fondo animado con ruido simplex 3D y viñeta.
 *
 * Decorativo: va marcado con `aria-hidden` y no reacciona a la interacción.
 * Se detiene al salir del viewport o al ocultarse la pestaña, y con
 * `prefers-reduced-motion` pinta un único fotograma estático.
 *
 * Por qué ruido 3D y no 2D: usando el tiempo como tercera coordenada, las
 * manchas se DEFORMAN mientras se desplazan, que es lo que da la sensación de
 * fluido. Desplazando un campo 2D el resultado parece una foto arrastrándose.
 */
export function NoiseBackground({
  palette = DEFAULT_PALETTE,
  speed = 1,
  // Escala baja = manchas grandes y fluidas. Con valores altos (>3) el
  // resultado deja de parecer niebla y pasa a parecer mármol o ruido sucio.
  scale = 1.45,
  vignette = 0.09,
  contrast = 3,
  className,
}: NoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // La paleta llega como array y, si el padre la declara en línea, sería una
  // referencia nueva en cada render y relanzaría el efecto sin parar. Se
  // memoriza por su contenido.
  const paletteKey = palette.join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    canvas.width = FIELD_W;
    canvas.height = FIELD_H;

    const noise3D = createNoise3D(20260814);
    const rgbPalette = paletteKey.split(",").map(hexToRgb);
    const image = ctx.createImageData(FIELD_W, FIELD_H);
    const data = image.data;

    // Máscara de viñeta precalculada: es constante, no tiene sentido
    // recalcular la distancia al centro en cada frame.
    const vignetteField = new Float32Array(FIELD_W * FIELD_H);
    const cx = (FIELD_W - 1) / 2;
    const cy = (FIELD_H - 1) / 2;
    const maxDist = Math.hypot(cx, cy);
    for (let y = 0; y < FIELD_H; y += 1) {
      for (let x = 0; x < FIELD_W; x += 1) {
        const d = Math.hypot(x - cx, y - cy) / maxDist;
        // Curva suave: el centro queda intacto y solo cae hacia los bordes.
        vignetteField[y * FIELD_W + x] = Math.pow(d, 2.2);
      }
    }

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (timeSeconds: number) => {
      // Estos coeficientes son los que hacen que el movimiento se VEA. Con
      // valores un orden de magnitud menores el campo avanza tan poco que a
      // simple vista parece una imagen congelada.
      const t = timeSeconds * speed;
      // Deriva del campo: da dirección al conjunto.
      const driftX = t * 0.048;
      const driftY = t * -0.032;
      // Evolución en la tercera dimensión: es la que deforma las manchas.
      const z1 = t * 0.166;
      const z2 = t * 0.115;

      let p = 0;

      for (let y = 0; y < FIELD_H; y += 1) {
        const ny = (y / FIELD_H) * scale;
        for (let x = 0; x < FIELD_W; x += 1) {
          const nx = (x / FIELD_W) * scale;

          // Dos octavas: la primera pone las masas grandes y la segunda un
          // poco de detalle. La segunda va con poco peso a propósito; subirlo
          // rompe la sensación de niebla y se ve como grano sucio.
          const n1 = noise3D(nx + driftX, ny + driftY, z1);
          const n2 =
            noise3D(nx * 1.9 - driftX, ny * 1.9 + driftY, z2 + 40) * 0.32;
          // De [-1.32, 1.32] a ~[0, 1], con un poco de margen a los extremos.
          const raw = (n1 + n2) / 2.4 + 0.5;
          // La curva en S separa claros de oscuros; sin ella todo el lienzo
          // se queda en los grises centrales y se ve como una neblina plana.
          const value = contrastCurve(raw, contrast);

          const idx = y * FIELD_W + x;
          let [r, g, b] = samplePalette(rgbPalette, value);

          // Viñeta: oscurece progresivamente hacia los bordes.
          const v = 1 - vignetteField[idx] * vignette;
          r *= v;
          g *= v;
          b *= v;

          // Dithering ordenado (Bayer 2x2) de ±0,5 niveles de color. NO es
          // grano: a esta amplitud es invisible, y solo está para romper las
          // bandas que si no aparecen en degradados tan suaves como este.
          const dither = (((x & 1) ^ (y & 1)) - 0.5) * 0.6;

          data[p] = r + dither;
          data[p + 1] = g + dither;
          data[p + 2] = b + dither;
          data[p + 3] = 255;
          p += 4;
        }
      }

      ctx.putImageData(image, 0, 0);
    };

    // Con movimiento reducido: un solo fotograma y se acabó.
    if (prefersReduced) {
      draw(0);
      return;
    }

    let raf: number | null = null;
    let running = false;
    let start: number | null = null;

    const loop = (now: number) => {
      if (start === null) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      if (!running) return;
      running = false;
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    // Se pinta ya un fotograma para que nunca se vea el canvas en blanco.
    draw(0);

    let onScreen = true;
    const update = () => {
      if (onScreen && !document.hidden) play();
      else pause();
    };

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
          update();
        },
        { rootMargin: "80px" },
      );
      observer.observe(canvas);
    }

    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      pause();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [paletteKey, speed, scale, vignette, contrast]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
