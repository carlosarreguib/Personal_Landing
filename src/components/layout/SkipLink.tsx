/**
 * Enlace para saltar al contenido principal.
 *
 * Está oculto hasta que recibe el foco: es lo primero que encuentra quien
 * navega con teclado y le evita recorrer toda la navegación.
 */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-lg focus:bg-teal-700 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
    >
      Saltar al contenido principal
    </a>
  );
}
