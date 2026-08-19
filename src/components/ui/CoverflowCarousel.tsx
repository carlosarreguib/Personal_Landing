"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Carrusel 3D estilo Coverflow.
 *
 * Adaptado del componente original a las convenciones de este proyecto:
 * usa `@/lib/cn` en vez de `@/lib/utils`, los tokens semánticos del sistema de
 * diseño en vez de los de shadcn, y respeta `prefers-reduced-motion`.
 *
 * Cómo funciona: `posRef` guarda el índice fraccionario que hay en el centro y
 * es la única fuente de verdad. Se pinta directamente sobre el DOM en cada
 * frame porque sesenta actualizaciones de estado por segundo re-renderizarían
 * todas las tarjetas para unos números que React no necesita ver.
 */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  /** Clave estable; evita usar el índice del array al re-filtrar. */
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Índice activo (componente controlado). */
  selected: number;
  onSelectedChange: (index: number) => void;
  /** Grados que se inclina la primera tarjeta vecina. */
  rotate?: number;
  /** Cuánto retrocede la vecina, como fracción del ancho de tarjeta. */
  depth?: number;
  /** Distancia del espectador, en múltiplos del ancho de tarjeta. */
  perspective?: number;
  /** Exponente sobre la distancia. Por debajo de 1 la inclinación se suaviza. */
  falloff?: number;
  /** Opacidad que se pierde por cada paso desde el centro. */
  fade?: number;
  /** Cualquier longitud CSS. Todo lo demás se deriva de aquí. */
  cardWidth?: string;
  /** Separación entre tarjetas, como fracción del ancho. */
  gap?: number;
  loop?: boolean;
  /** Nombra el carrusel para las tecnologías de apoyo. */
  label?: string;
  className?: string;
  cardClassName?: string;
  /** Se pinta encima de cada tarjeta (p. ej. un rótulo). */
  renderOverlay?: (slide: CoverflowSlide, index: number) => React.ReactNode;
}

export function CoverflowCarousel({
  slides,
  selected,
  onSelectedChange,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(180px, 26vw, 300px)",
  gap = 0.05,
  loop = true,
  label = "Carrusel de proyectos",
  className,
  cardClassName,
  renderOverlay,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Índice fraccionario en el centro. La única fuente de verdad. */
  const posRef = React.useRef(0);
  /** Hacia dónde va el asentamiento actual. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  /** Índice entero más cercano, plegado dentro de 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Se pliega la distancia por el camino más corto del anillo: este es
      // todo el mecanismo del bucle, sin nodos clonados ni reordenar el DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // La inclinación y el retroceso se suavizan al alejarse: una rampa
      // lineal cerraría la segunda tarjeta y la haría ilegible.
      const ramp = Math.pow(distance, falloff);
      // Topado antes del canto para que una tarjeta lejana no dé la espalda.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // Una tarjeta se teletransporta al otro lado del anillo a media vuelta,
      // así que debe haber desaparecido para entonces o el salto se ve.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      // Solo la tarjeta central es accesible por teclado y lectores: las demás
      // están giradas y parcialmente transparentes.
      const isCentre = Math.round(distance) === 0;
      card.setAttribute("aria-hidden", isCentre ? "false" : "true");
      card.style.pointerEvents = isCentre ? "auto" : "none";
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      onSelectedChange(indexAt(target));

      // Con movimiento reducido se salta la animación y se coloca de golpe.
      const prefersReduced =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        posRef.current = target;
        paint();
        return;
      }

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // Suavizado exponencial, no un muelle: aquí no hace falta rebote.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, onSelectedChange, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Se va por el camino corto en vez de desenrollar todo el anillo.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  // Permite que el contenedor mueva el carrusel desde fuera (botones, filtros).
  React.useEffect(() => {
    if (indexAt(targetRef.current) !== selected) goTo(selected);
    // Solo debe reaccionar a un cambio de `selected` venido de fuera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Tarjetas por segundo, para el impulso al soltar.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) onSelectedChange(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Un gesto rápido arrastra, pero nunca más de dos tarjetas.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // El ancho de tarjeta gobierna paso, profundidad y perspectiva, así que es
  // lo único que merece medirse, y solo cuando la caja cambia de verdad.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  // Si cambia el número de tarjetas (al filtrar), se vuelve al principio.
  React.useEffect(() => {
    posRef.current = 0;
    targetRef.current = 0;
    cardRefs.current.length = count;
    paint();
  }, [count, paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          role="group"
          aria-label="Usa las flechas izquierda y derecha para cambiar de proyecto"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // El relleno vertical mantiene las sombras fuera del recorte.
          className="cursor-grab overflow-hidden py-10 outline-none active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // El arrastre horizontal es nuestro; el vertical sigue siendo scroll.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{ height: "var(--cf-card)", transformStyle: "preserve-3d" }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${count}`}
                className={cn(
                  "absolute top-0 left-1/2 aspect-square overflow-hidden rounded-2xl bg-surface-muted shadow-xl will-change-transform",
                  cardClassName,
                )}
                style={{ width: "var(--cf-card)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  draggable={false}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover select-none"
                />
                {renderOverlay?.(slide, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
