import type { Project } from "@/types/project";

/**
 * ============================================================================
 * ESTE ES EL ÚNICO FICHERO QUE HAY QUE EDITAR PARA AÑADIR UN PROYECTO.
 * ============================================================================
 *
 * Para añadir uno:
 *   1. Copia un objeto de los de abajo y cambia sus campos.
 *   2. El `slug` debe ir en kebab-case y sin acentos: es la URL y también el
 *      nombre de la carpeta de imágenes en /public/img/projects/<slug>/.
 *   3. Ejecuta `node scripts/gen-placeholders.mjs` para generar las imágenes
 *      de relleno, o deja las tuyas reales en esa carpeta.
 *
 * No hace falta tocar ningún componente: la tarjeta, el filtro y el contador
 * se actualizan solos.
 *
 * NOTA: los 6 proyectos siguientes son EJEMPLOS DE MUESTRA para que se vea
 * la rejilla funcionando. Sustitúyelos por los tuyos reales.
 */

const IMG = (slug: string, file: string) => `/img/projects/${slug}/${file}.svg`;

export const projects = [
  {
    slug: "agente-inversion",
    title: "El agente que invierte sin poder pulsar el botón",
    category: "llms",
    summary:
      "Agente de inversión cuantitativa donde ningún componente de IA puede enviar una orden: tres capas de defensa y auditoría con hash encadenado.",
    date: "2026-08",
    featured: true,
    cover: {
      src: IMG("agente-inversion", "cover"),
      alt: "Panel de un agente de inversión cuantitativa en modo simulación",
      width: 1200,
      height: 675,
    },
    square: {
      src: IMG("agente-inversion", "square"),
      alt: "Panel de un agente de inversión cuantitativa en modo simulación",
      width: 900,
      height: 900,
    },
    gallery: [
      {
        src: IMG("agente-inversion", "g1"),
        alt: "Esquema de las tres capas de defensa que impiden enviar órdenes a un broker",
        width: 1600,
        height: 1000,
      },
      {
        src: IMG("agente-inversion", "g2"),
        alt: "Registro de auditoría con hash encadenado SHA-256",
        width: 1600,
        height: 1000,
      },
    ],
    description: [
      "La tesis del proyecto es incómoda pero deliberada: un sistema que pierde un 3 % con trazabilidad completa es un éxito, y uno que gana un 40 % con una orden duplicada sin explicar es un fracaso.",
      "El agente opera en modo estrictamente de simulación sobre un capital ficticio. No existe ninguna ruta de código hacia un broker real, y ningún componente de IA tiene capacidad de enviar órdenes: el LLM propone, pero la ejecución pasa por tres capas de defensa independientes.",
      "Cada decisión queda registrada en una auditoría con hash SHA-256 encadenado, de modo que el histórico es verificable y no se puede alterar a posteriori. La disciplina de ingeniería es parte del producto: tipado estricto con mypy, 17 contratos de arquitectura verificados con import-linter y una batería de más de 600 pruebas.",
    ],
    tech: [
      { name: "Python 3.12", role: "Lenguaje principal" },
      { name: "Pandas", role: "Tratamiento de series financieras" },
      { name: "Pydantic", role: "Validación de entidades" },
      { name: "Streamlit", role: "Panel de control" },
      { name: "structlog", role: "Trazabilidad estructurada" },
      { name: "mypy", role: "Tipado estricto" },
    ],
    results: [
      { metric: "Pruebas automatizadas", value: "620" },
      { metric: "Rutas a un broker real", value: "0", detail: "Por diseño, no por configuración" },
      { metric: "Contratos de arquitectura", value: "17", detail: "Verificados con import-linter" },
    ],
    links: { github: "https://github.com/carlosarreguib/Agente-Inversion" },
  },

  {
    slug: "gestion-residuos-grit",
    title: "Convertir residuo en producto: refrigerantes valorizados con IA",
    category: "automatizacion",
    summary:
      "Plataforma que sustituye la intuición del técnico por datos: clasifica, agrupa y decide el tratamiento de cada botella de gas refrigerante.",
    date: "2026-08",
    featured: true,
    cover: {
      src: IMG("gestion-residuos-grit", "cover"),
      alt: "Panel de la plataforma de valorización de refrigerantes con indicadores de recuperación",
      width: 1200,
      height: 675,
    },
    square: {
      src: IMG("gestion-residuos-grit", "square"),
      alt: "Panel de la plataforma de valorización de refrigerantes con indicadores de recuperación",
      width: 900,
      height: 900,
    },
    gallery: [
      {
        src: IMG("gestion-residuos-grit", "g1"),
        alt: "Motor de similitud comparando una muestra contra los patrones AHRI de referencia",
        width: 1600,
        height: 1000,
      },
      {
        src: IMG("gestion-residuos-grit", "g2"),
        alt: "Recomendación de lote con porcentaje de compatibilidad entre botellas",
        width: 1600,
        height: 1000,
      },
    ],
    description: [
      "La gestión de refrigerantes fluorados dependía del criterio individual: se clasificaba botella a botella a mano, se segregaba por experiencia y el tratamiento se elegía por intuición. El conocimiento vivía en las personas, no en el proceso.",
      "La plataforma convierte años de experiencia operativa y de análisis MicroGC en un sistema de apoyo a la decisión. Un motor de similitud compara cada muestra contra los patrones AHRI de referencia, recomienda con qué lote agruparla según su compatibilidad y predice el rendimiento de limpieza frente a regeneración, siempre con el razonamiento a la vista.",
      "El ajuste con gas virgen deja de ser prueba y error: se resuelve como una optimización matemática que calcula el aporte mínimo para cumplir la norma AHRI 700. Y el sistema aprende: cada tratamiento real registrado alimenta un modelo que se reentrena, de modo que la plataforma mejora con el uso.",
    ],
    tech: [
      { name: "Next.js 15", role: "Aplicación web" },
      { name: "React", role: "Interfaz de usuario" },
      { name: "Supabase", role: "Autenticación y Postgres" },
      { name: "Tailwind CSS", role: "Sistema de estilos" },
      { name: "Random Forest", role: "Predicción de rendimiento" },
      { name: "Recharts", role: "Visualización de datos" },
    ],
    results: [
      { metric: "Módulos operativos", value: "6", detail: "Con trazabilidad y exportación a PDF" },
      { metric: "Patrones de referencia", value: "6 AHRI", detail: "Con reserva a categorías CAT1/2 y CAT6" },
      { metric: "Modelo reentrenable", value: "Sí", detail: "Aprende de cada tratamiento registrado" },
    ],
    links: { github: "https://github.com/carlosarreguib/gestion_residuos_GRIT" },
  },

  {
    slug: "gemelo-digital-grit",
    title: "El gemelo digital que decide qué experimento hacer mañana",
    category: "automatizacion",
    summary:
      "Gemelo híbrido de física y machine learning de una planta de separación de gases: no solo predice, propone el siguiente ensayo a ejecutar.",
    date: "2026-08",
    cover: {
      src: IMG("gemelo-digital-grit", "cover"),
      alt: "Panel del gemelo digital de una planta piloto de separación de gases",
      width: 1200,
      height: 675,
    },
    square: {
      src: IMG("gemelo-digital-grit", "square"),
      alt: "Panel del gemelo digital de una planta piloto de separación de gases",
      width: 900,
      height: 900,
    },
    gallery: [
      {
        src: IMG("gemelo-digital-grit", "g1"),
        alt: "Frente de Pareto entre pureza y productividad del proceso",
        width: 1600,
        height: 1000,
      },
    ],
    description: [
      "Gemelo digital híbrido, de física y machine learning, de un banco de ensayos de separación de gases por VPTSA (adsorción por oscilación de vacío, presión y temperatura) de seis columnas, con adquisición de datos desde un autómata Allen-Bradley CompactLogix 5380.",
      "El entregable de más valor no es el predictor, sino el diseñador de experimentos: el sistema propone qué ensayo conviene ejecutar a continuación para avanzar hacia el frente de Pareto entre pureza y productividad. En un banco donde cada ensayo cuesta horas, elegir bien el siguiente es donde está el ahorro.",
      "La seguridad se resolvió en la arquitectura y no en la configuración: el acceso al autómata es estrictamente de solo lectura y no existe ninguna ruta de escritura en el código. Un modelo riguroso de física convive con el sustituto aprendido, y las pruebas de propiedad verifican que se conservan la masa y la energía.",
    ],
    tech: [
      { name: "Python", role: "Lenguaje principal" },
      { name: "Pydantic", role: "Validación de entidades" },
      { name: "Pint", role: "Unidades físicas explícitas" },
      { name: "TimescaleDB", role: "Series temporales de proceso" },
      { name: "Hypothesis", role: "Pruebas de propiedad" },
      { name: "Docker", role: "Entorno reproducible" },
    ],
    results: [
      { metric: "Rutas de escritura al PLC", value: "0", detail: "Solo lectura por arquitectura" },
      { metric: "Columnas simuladas", value: "6", detail: "Banco de ensayos VPTSA" },
      { metric: "Estado", value: "En desarrollo", detail: "Fase de andamiaje" },
    ],
    links: { github: "https://github.com/carlosarreguib/gemelo_digital_GRIT" },
  },

  {
    slug: "extraccion-datos-facturas",
    title: "Extracción de datos de facturas",
    category: "automatizacion",
    summary:
      "Pipeline que lee facturas en PDF e imagen, extrae los campos clave y los concilia contra el ERP sin intervención manual.",
    date: "2025-02",
    cover: {
      src: IMG("extraccion-datos-facturas", "cover"),
      alt: "Factura digitalizada con los campos detectados resaltados",
      width: 1200,
      height: 675,
    },
    square: {
      src: IMG("extraccion-datos-facturas", "square"),
      alt: "Factura digitalizada con los campos detectados resaltados",
      width: 900,
      height: 900,
    },
    gallery: [
      {
        src: IMG("extraccion-datos-facturas", "g1"),
        alt: "Diagrama del flujo de extracción y conciliación con el ERP",
        width: 1600,
        height: 1000,
      },
      {
        src: IMG("extraccion-datos-facturas", "g2"),
        alt: "Cola de excepciones pendientes de revisión humana",
        width: 1600,
        height: 1000,
      },
    ],
    description: [
      "Contabilidad recibía facturas de más de 300 proveedores, cada una con su maquetación, y las transcribía a mano al ERP.",
      "El pipeline combina OCR con un modelo de extracción por campos, y valida lo extraído contra reglas de negocio duras: que las líneas sumen el total, que el NIF exista y que el pedido esté abierto.",
      "Diseñé el sistema para que fallara de forma visible: lo que no supera la validación va a una cola de excepciones con el campo dudoso resaltado, en lugar de escribir un dato incorrecto en el ERP.",
    ],
    tech: [
      { name: "Python", role: "Lenguaje principal" },
      { name: "Tesseract", role: "Reconocimiento óptico" },
      { name: "Pydantic", role: "Validación de esquemas" },
      { name: "Airflow", role: "Orquestación por lotes" },
      { name: "PostgreSQL", role: "Persistencia y trazabilidad" },
    ],
    results: [
      { metric: "Facturas automatizadas", value: "91 %" },
      { metric: "Exactitud de campos", value: "98,7 %", detail: "En los campos obligatorios" },
      { metric: "Horas liberadas", value: "~120 al mes" },
    ],
    links: {},
  },

  {
    slug: "resumen-actas-reuniones",
    title: "Resumen automático de actas",
    category: "llms",
    summary:
      "Genera actas estructuradas a partir de transcripciones de reunión, separando decisiones, tareas asignadas y puntos abiertos.",
    date: "2024-11",
    cover: {
      src: IMG("resumen-actas-reuniones", "cover"),
      alt: "Acta generada automáticamente con secciones de decisiones y tareas",
      width: 1200,
      height: 675,
    },
    square: {
      src: IMG("resumen-actas-reuniones", "square"),
      alt: "Acta generada automáticamente con secciones de decisiones y tareas",
      width: 900,
      height: 900,
    },
    gallery: [
      {
        src: IMG("resumen-actas-reuniones", "g1"),
        alt: "Comparación entre la transcripción original y el acta estructurada",
        width: 1600,
        height: 1000,
      },
    ],
    description: [
      "Las reuniones se grababan y se transcribían, pero nadie releía 40 páginas de transcripción, así que los acuerdos se perdían.",
      "El sistema trocea la transcripción por turnos de intervención, extrae los compromisos con su responsable y fecha, y produce un acta con una estructura fija que siempre distingue lo decidido de lo meramente comentado.",
      "Añadí una comprobación posterior que verifica que cada tarea del acta aparece literalmente en la transcripción, para evitar que el modelo invente compromisos que nadie adquirió.",
    ],
    tech: [
      { name: "Python", role: "Lenguaje principal" },
      { name: "Claude API", role: "Extracción y redacción" },
      { name: "Whisper", role: "Transcripción del audio" },
      { name: "Streamlit", role: "Interfaz de revisión" },
    ],
    results: [
      { metric: "Tiempo de redacción", value: "−85 %" },
      { metric: "Tareas detectadas", value: "93 %", detail: "Frente al acta redactada a mano" },
      { metric: "Compromisos inventados", value: "0", detail: "Gracias a la verificación literal" },
    ],
    links: {},
  },

  {
    slug: "deteccion-epi-obra",
    title: "Detección de EPI en obra",
    category: "vision",
    summary:
      "Sistema que verifica el uso de equipos de protección individual en accesos a obra y avisa en tiempo real, sin identificar a personas.",
    date: "2024-06",
    cover: {
      src: IMG("deteccion-epi-obra", "cover"),
      alt: "Vista de un acceso a obra con detecciones de casco y chaleco señaladas",
      width: 1200,
      height: 675,
    },
    square: {
      src: IMG("deteccion-epi-obra", "square"),
      alt: "Vista de un acceso a obra con detecciones de casco y chaleco señaladas",
      width: 900,
      height: 900,
    },
    gallery: [
      {
        src: IMG("deteccion-epi-obra", "g1"),
        alt: "Detecciones de casco y chaleco reflectante sobre varias personas",
        width: 1600,
        height: 1000,
      },
      {
        src: IMG("deteccion-epi-obra", "g2"),
        alt: "Panel con la evolución semanal de incidencias detectadas",
        width: 1600,
        height: 1000,
      },
    ],
    description: [
      "El control de EPI en los accesos dependía de que alguien estuviera mirando, y las incidencias solo se conocían cuando ya había ocurrido algo.",
      "Entrené un detector de objetos para casco y chaleco reflectante, ajustado a las condiciones reales de luz de exterior, desde primera hora hasta el atardecer.",
      "El diseño es deliberadamente respetuoso con la privacidad: el sistema no identifica personas ni almacena imágenes. Solo cuenta detecciones agregadas y emite un aviso en el momento, que es lo único que necesita el responsable de seguridad.",
    ],
    tech: [
      { name: "Python", role: "Lenguaje principal" },
      { name: "YOLO", role: "Detección de objetos" },
      { name: "OpenCV", role: "Captura y preprocesado" },
      { name: "Docker", role: "Despliegue en el borde" },
    ],
    results: [
      { metric: "Precisión media", value: "0,89 mAP" },
      { metric: "Avisos en tiempo real", value: "< 1 s" },
      { metric: "Imágenes almacenadas", value: "Ninguna", detail: "Solo métricas agregadas" },
    ],
    links: {},
  },
] satisfies Project[];
