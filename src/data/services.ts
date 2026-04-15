export type ServiceItem = {
  title: string;
  description: string;
  bullets: string[];
};

export const serviceCatalog: ServiceItem[] = [
  {
    title: 'Desarrollo de software a medida',
    description:
      'Construimos aplicaciones y plataformas ajustadas a procesos, reglas de negocio y objetivos específicos.',
    bullets: ['Portales y sistemas internos', 'Aplicaciones web corporativas', 'APIs y servicios backend'],
  },
  {
    title: 'Modernización tecnológica',
    description:
      'Actualizamos aplicaciones, flujos y componentes para reducir deuda técnica y mejorar operación.',
    bullets: ['Refactorización gradual', 'Migraciones controladas', 'Optimización de desempeño'],
  },
  {
    title: 'Integración de sistemas',
    description:
      'Conectamos plataformas, datos y procesos para eliminar fricción operativa y duplicidad.',
    bullets: ['Integración entre ERPs y CRMs', 'Automatización de intercambio de datos', 'Diseño de contratos API'],
  },
  {
    title: 'Consultoría y arquitectura',
    description:
      'Diagnosticamos estado actual, proponemos hoja de ruta técnica y ayudamos a tomar decisiones de inversión.',
    bullets: ['Evaluación de arquitectura', 'Análisis de procesos', 'Definición de roadmap tecnológico'],
  },
  {
    title: 'BI y reporting',
    description:
      'Estructuramos información útil para seguimiento operativo y toma de decisiones.',
    bullets: ['Tableros ejecutivos', 'Indicadores operativos', 'Integración de fuentes de datos'],
  },
  {
    title: 'Soporte evolutivo y QA',
    description:
      'Aseguramos continuidad, estabilidad y mejora progresiva de soluciones ya implementadas.',
    bullets: ['Corrección y mantenimiento', 'Pruebas funcionales', 'Acompañamiento post-lanzamiento'],
  },
];

export const serviceBenefits = [
  'Mayor visibilidad sobre procesos y operación',
  'Menor dependencia de tareas manuales y reprocesos',
  'Plataformas más estables, escalables y preparadas para crecer',
  'Mejor trazabilidad para decisiones técnicas y de negocio',
];
