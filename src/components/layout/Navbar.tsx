"use client";

import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

const SECTION_IDS = site.nav.map((item) => item.id);

/**
 * Barra de navegación fija con indicador de sección activa.
 *
 * El hero es CLARO, así que la barra usa texto oscuro tanto arriba del todo
 * como al hacer scroll. Solo cambia el fondo: transparente sobre el hero y
 * sólido con borde en cuanto se baja, para separarla del contenido.
 */
export function Navbar() {
  const activeId = useActiveSection(SECTION_IDS);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el menú móvil con Escape.
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled || isMenuOpen
          ? "border-b border-border-subtle bg-surface/95 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <Container>
        <nav
          aria-label="Navegación principal"
          className="flex h-20 items-center justify-between"
        >
          <a
            href="#inicio"
            className="font-display text-lg font-bold tracking-tight text-ink"
          >
            {site.name}
          </a>

          {/* Navegación de escritorio */}
          <ul className="hidden list-none items-center gap-1 md:flex">
            {site.nav.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-link" : "text-ink-muted hover:text-link",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-link"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Botón del menú móvil */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-movil"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-ink transition-colors hover:bg-surface-muted md:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <ul
            id="menu-movil"
            className="list-none border-t border-border-subtle py-3 md:hidden"
          >
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-medium transition-colors",
                    activeId === item.id
                      ? "bg-surface-muted text-link"
                      : "text-ink-muted hover:bg-surface-muted",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </header>
  );
}
