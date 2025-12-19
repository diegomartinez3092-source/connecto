export type DigitalEmployeeId =
  | "marketing"
  | "ventas"
  | "cajero"
  | "vendedor-digital"
  | "soporte"
  | "operaciones";

export type DigitalEmployeeStatus =
  | "Operando"
  | "Requiere atención"
  | "Inactivo"
  | "En configuración"
  | "Detenido por decisión humana";

export interface ActivityItem {
  title: string;
  detail?: string;
  meta?: string;
}

export interface DigitalEmployee {
  id: DigitalEmployeeId;
  name: string;
  status: DigitalEmployeeStatus;
  availability?: string;
  responsibility: string;
  description: string;
  headline: string;
  attributedRevenue7d?: number;
  capacityRecovered7d?: number;
  kpis: {
    label: string;
    value: string;
    helper?: string;
  }[];
  detailMetrics: {
    label: string;
    value: string;
    helper?: string;
  }[];
  actions: string[];
  recentActivity: ActivityItem[];
  configuration?: Record<string, string>;
  toggles?: Record<string, boolean>;
}

export const centerMetrics = {
  activos: 2,
  enAlerta: 1,
  tiempoRespuestaPromedio: "0:38",
  leads7d: 126,
  ingresos7d: "$24,800",
  pagosPendientes: 6,
};

export const insights = [
  {
    title: "Optimiza el flujo de leads",
    description:
      "Envía leads con score >80 directamente al Asistente de Ventas para acelerar la conversión.",
    priority: "Alta",
    action: "Aplicar regla",
  },
  {
    title: "Presupuesto de campañas",
    description:
      "El Especialista de Marketing podría incrementar un 12% las conversiones ajustando el hook creativo.",
    priority: "Media",
    action: "Ajustar campañas",
  },
  {
    title: "Pagos pendientes",
    description:
      "Cajero detectó 6 pagos sin comprobante. Activa seguimiento automático en T+24h.",
    priority: "Alta",
    action: "Activar seguimiento",
  },
  {
    title: "Scripts de venta",
    description:
      "Define 1 CTA por mensaje y máximo 2 opciones para reducir fricción en conversaciones largas.",
    priority: "Baja",
    action: "Actualizar scripts",
  },
];

export const digitalEmployees: DigitalEmployee[] = [
  {
    id: "vendedor-digital",
    name: "Vendedor digital",
    status: "Operando",
    availability: "24/7",
    responsibility: "Atiende, califica y agenda para impulsar cierres.",
    description:
      "Reduce la carga operativa y mantiene atención constante sin depender del equipo humano.",
    headline: "Atiende, cotiza y empuja a pago sin fricción",
    attributedRevenue7d: 18200,
    capacityRecovered7d: 0.12,
    kpis: [
      { label: "Conversaciones hoy", value: "—" },
      { label: "Leads hoy", value: "—" },
      { label: "Resp. <2m", value: "—" },
    ],
    detailMetrics: [
      { label: "Conversaciones hoy", value: "—" },
      { label: "Leads hoy", value: "—" },
      { label: "Respuesta <2m", value: "—" },
      { label: "Pagos confirmados", value: "—" },
    ],
    actions: ["Ver dashboard", "Configurar"],
    recentActivity: [
      { title: "Modo demo", meta: "Conecta tus canales para ver actividad" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing digital",
    status: "En configuración",
    availability: "Horario",
    responsibility: "Activa campañas y nutre prospectos.",
    description:
      "Termina la configuración para estabilizar adquisición y evitar semanas flojas.",
    headline: "Activa campañas omnicanal y nutre leads calificados.",
    attributedRevenue7d: 4900,
    capacityRecovered7d: 0.07,
    kpis: [
      { label: "Leads 7d", value: "126" },
      { label: "Leads calificados", value: "72%" },
      { label: "CPL", value: "$18" },
    ],
    detailMetrics: [
      { label: "Leads 7d", value: "126" },
      { label: "Leads calificados", value: "72%", helper: "Objetivo 68%" },
      { label: "CPL", value: "$18" },
      { label: "Conversión a pago", value: "19%" },
    ],
    actions: ["Ver actividad", "Ajustar reglas", "Pausar"],
    recentActivity: [
      { title: "Lead creado (IG Ads)", meta: "Score 82" },
      { title: "Formulario web enviado", meta: "Score 90" },
      { title: "Lead nutrir", meta: "Score 28" },
    ],
    configuration: {
      "Objetivo de campaña": "Leads calificados B2B",
      "Canal prioritario": "IG Ads",
      Hook: "Fabricación sin fricción",
      "Copy de anuncio": "Cotiza en minutos y recibe asesoría personalizada.",
      "Presupuesto diario": "$320",
      "Meta leads/día": "18",
    },
  },
  {
    id: "ventas",
    name: "Asistente de Ventas",
    status: "Inactivo",
    availability: "Horario",
    responsibility: "Responde, califica y agenda siguiendo guías de conversación.",
    description:
      "Actívalo cuando quieras cobertura comercial dedicada sin saturar al equipo humano.",
    headline:
      "Conecta prospectos con propuestas claras y escalamiento automático.",
    attributedRevenue7d: undefined,
    capacityRecovered7d: undefined,
    kpis: [
      { label: "Conversaciones 7d", value: "418" },
      { label: "Conversión a pago", value: "19%" },
      { label: "Respuesta promedio", value: "0:38" },
    ],
    detailMetrics: [
      { label: "Conversaciones 7d", value: "418" },
      { label: "Conversión a cotización", value: "24%" },
      { label: "Conversión a pago", value: "19%" },
      { label: "Respuesta promedio", value: "0:38" },
    ],
    actions: ["Ver conversaciones", "Mensajes clave", "Escalamiento"],
    recentActivity: [
      { title: "Cotización generada", meta: "Ticket $820 → a Cajero" },
      { title: "Follow-up", meta: "T+24h" },
      { title: "Escalamiento por palabra clave" },
    ],
    configuration: {
      "Mensaje de bienvenida":
        "Hola, soy tu asistente digital. ¿Qué necesitas cotizar hoy?",
      "Máx. mensajes antes de pago": "3",
      "CTA por mensaje": "Activo",
      "Máx. opciones": "2",
    },
    toggles: {
      oneCta: true,
      maxOptions: true,
    },
  },
  {
    id: "cajero",
    name: "Cajero digital",
    status: "Requiere atención",
    availability: "24/7",
    responsibility: "Gestiona cobros, links y recordatorios.",
    description:
      "Hay pagos pendientes. Resolver esto puede recuperar ventas sin esfuerzo extra.",
    headline: "Recupera pagos pendientes y prioriza métodos seguros.",
    attributedRevenue7d: 1700,
    capacityRecovered7d: 0.11,
    kpis: [
      { label: "Pagos completados", value: "42" },
      { label: "Pendientes", value: "6" },
      { label: "Ventas recuperadas", value: "31%" },
    ],
    detailMetrics: [
      { label: "Pagos 7d", value: "42" },
      { label: "Pagos pendientes", value: "6" },
      { label: "Ventas recuperadas", value: "31%" },
      { label: "Tiempo promedio de pago", value: "1.8 h" },
    ],
    actions: ["Ver pendientes", "Métodos de pago", "Plantillas follow-up"],
    recentActivity: [
      { title: "Link enviado hace 2h", meta: "Pendiente" },
      { title: "Transferencia sin comprobante", meta: "24h" },
      { title: "Pago iniciado sin confirmación", meta: "Webhook" },
    ],
    configuration: {
      Stripe: "Activo",
      Transferencia: "Activo",
      Depósito: "Activo",
      Efectivo: "Activo",
      "Stripe primero": "Sí",
      "Máx. métodos por mensaje": "2",
      "Cadencia follow-up": "T+2h, T+24h, T+72h",
    },
    toggles: {
      stripe: true,
      transferencia: true,
      deposito: true,
      efectivo: true,
      stripePrimero: true,
    },
  },
  {
    id: "soporte",
    name: "Soporte digital",
    status: "Detenido por decisión humana",
    availability: "—",
    responsibility: "Resuelve preguntas frecuentes y reduce la carga al equipo.",
    description:
      "Reanuda si el volumen de preguntas vuelve a subir o si tu equipo se satura.",
    headline: "Mantiene atención postventa y filtra solicitudes repetitivas.",
    attributedRevenue7d: 0,
    capacityRecovered7d: 0,
    kpis: [
      { label: "Casos resueltos", value: "—" },
      { label: "Satisfacción", value: "—" },
      { label: "Escalados", value: "—" },
    ],
    detailMetrics: [
      { label: "Casos resueltos", value: "—" },
      { label: "Satisfacción", value: "—" },
      { label: "Escalados", value: "—" },
      { label: "Tiempo promedio", value: "—" },
    ],
    actions: ["Ver historial", "Reactivar"],
    recentActivity: [
      { title: "Sin actividad", meta: "Detenido por decisión humana" },
    ],
  },
  {
    id: "operaciones",
    name: "Operaciones digital",
    status: "Operando",
    availability: "Horario",
    responsibility: "Monitorea procesos y detecta cuellos de botella.",
    description:
      "Asegura continuidad operativa y anticipa riesgos antes de que impacten al equipo.",
    headline: "Supervisa procesos críticos y documenta mejoras continuas.",
    attributedRevenue7d: 0,
    capacityRecovered7d: 0.05,
    kpis: [
      { label: "Alertas mitigadas", value: "—" },
      { label: "SLA interno", value: "—" },
      { label: "Incidentes", value: "—" },
    ],
    detailMetrics: [
      { label: "Alertas mitigadas", value: "—" },
      { label: "SLA interno", value: "—" },
      { label: "Incidentes", value: "—" },
      { label: "Tiempo de respuesta", value: "—" },
    ],
    actions: ["Ver tablero", "Configurar"],
    recentActivity: [
      { title: "Checklist semanal completado", meta: "Hace 2h" },
    ],
  },
];
