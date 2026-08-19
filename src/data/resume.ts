/**
 * Resumen de trayectoria para la sección "Formación y trayectoria".
 *
 * Es un extracto de `Curriculum.md`, no una copia: la landing muestra lo
 * esencial y el currículum completo queda como documento aparte. Si actualizas
 * uno, revisa el otro.
 */

export interface ExperienceItem {
  /** Cargo. */
  role: string;
  organization: string;
  /** Periodo ya formateado, tal como debe leerse. */
  period: string;
  /** Una o dos líneas sobre qué se hizo ahí. */
  summary: string;
  /** Marca el puesto actual, que se destaca visualmente. */
  current?: boolean;
}

export interface EducationItem {
  title: string;
  organization: string;
  period: string;
  detail?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Highlight {
  value: string;
  label: string;
  detail?: string;
}

/** Titular de la sección: lo que resume la trayectoria en una frase. */
export const resumeIntro =
  "Ingeniero Químico especializado en refrigeración industrial, gases fluorados y captura de carbono, con formación avanzada en Inteligencia Artificial y ciencia de datos.";

/**
 * Cifras destacadas. Todas salen del currículum y son verificables: nada de
 * redondeos favorables ni métricas inventadas.
 */
export const highlights: Highlight[] = [
  {
    value: "+5 años",
    label: "En I+D industrial",
    detail: "Separación y purificación de gases",
  },
  {
    value: "641.000 €",
    label: "Financiación CDTI",
    detail: "Proyecto de captura de H₂ y CO₂",
  },
  {
    value: "2",
    label: "Titulaciones en IQS",
    detail: "Grado y máster en Ingeniería Química",
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "Technical Sales Representative — Refrigerants",
    organization: "GRIT Gases Research Innovation & Technology",
    period: "Enero de 2026 – actualidad",
    summary:
      "Acompaño a clientes industriales en la transición a refrigerantes de bajo GWP, uniendo criterio técnico, normativa F-Gas y aplicación real para que las decisiones se tomen antes y con menos incertidumbre.",
    current: true,
  },
  {
    role: "R&D Projects Engineer",
    organization: "GRIT Gases Research Innovation & Technology",
    period: "Junio de 2020 – enero de 2026 · 5 años 8 meses",
    summary:
      "Diseñé y validé plantas piloto de separación y purificación de gases por adsorción, desde el concepto hasta la validación experimental, incluida la propuesta de I+D de un proyecto CDTI.",
  },
  {
    role: "External Researcher",
    organization: "Khalifa University · Masdar Institute, Abu Dhabi",
    period: "Octubre de 2019 – septiembre de 2020",
    summary:
      "Evaluación técnico-económica de la captura de CO₂ con MEA en una central de ciclo combinado, modelando la combustión con CHEMKIN-PRO y el proceso con Aspen HYSYS y Aspen Plus.",
  },
];

export const education: EducationItem[] = [
  {
    title: "Especialización Avanzada en Inteligencia Artificial y Ciencia de Datos",
    organization: "IMPELIA Campus Profesional",
    period: "2024 – 2025",
    detail:
      "Aprendizaje automático con Python, bases de datos SQL, visualización con Power BI, automatización e IA generativa.",
  },
  {
    title: "Máster en Ingeniería Química",
    organization: "IQS Barcelona",
    period: "2018 – 2020",
  },
  {
    title: "Grado en Ingeniería Química",
    organization: "IQS Barcelona",
    period: "2014 – 2018",
    detail:
      "Trabajo final sobre simulación de captura de CO₂ con tecnología VPSA en Aspen Adsorption.",
  },
];

/** Certificación relevante para el perfil técnico. */
export const certification = {
  title: "ELA210 CHS Hydrogen Laboratory Safety",
  organization: "AIChE — American Institute of Chemical Engineers",
  period: "Diciembre de 2024",
};

/**
 * Aptitudes agrupadas. Es una selección: el currículum completo lista muchas
 * más, pero una nube de 80 etiquetas no comunica nada.
 */
export const skillGroups: SkillGroup[] = [
  {
    label: "Sector y procesos",
    items: [
      "Refrigeración industrial",
      "Refrigerantes fluorados",
      "F-Gas",
      "RSIF",
      "Captura de carbono",
      "Gases industriales",
      "Adsorción",
      "Simulación de procesos",
    ],
  },
  {
    label: "Datos e Inteligencia Artificial",
    items: [
      "Python",
      "Aprendizaje automático",
      "SQL",
      "Power BI",
      "IA generativa",
      "Automatización",
    ],
  },
  {
    label: "Ingeniería y simulación",
    items: [
      "Aspen Plus",
      "Aspen HYSYS",
      "Aspen Adsorption",
      "Matlab",
      "Programación PLC",
      "Studio 5000",
      "AutoCAD",
    ],
  },
];

export const languages = [
  { name: "Catalán", level: "Nativo" },
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "Profesional" },
];
