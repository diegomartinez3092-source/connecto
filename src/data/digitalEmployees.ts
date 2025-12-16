export type DigitalEmployeeId = "marketing" | "ventas" | "cajero";

export interface ActivityItem {
  title: string;
  detail?: string;
  meta?: string;
}

export interface DigitalEmployee {
  id: DigitalEmployeeId;
  name: string;
  status: "active" | "alert";
  availability?: string;
  description: string;
  headline: string;
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
    id: "marketing",
    name: "Especialista de Marketing",
    status: "active",
    availability: "Activo",
    description: "Genera y califica leads desde campañas digitales integradas al CRM.",
    headline: "Activa campañas omnicanal y nutre leads calificados.",
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
    status: "active",
    availability: "Activo 24/7",
    description: "Responde, califica y agenda siguiendo guías de conversación.",
    headline: "Conecta prospectos con propuestas claras y escalamiento automático.",
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
      "Mensaje de bienvenida": "Hola, soy tu asistente digital. ¿Qué necesitas cotizar hoy?",
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
    name: "Cajero",
    status: "alert",
    availability: "En alerta",
    description: "Gestiona cobros, links de pago y recordatorios automáticos.",
    headline: "Recupera pagos pendientes y prioriza métodos seguros.",
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
      "Stripe": "Activo",
      "Transferencia": "Activo",
      "Depósito": "Activo",
      "Efectivo": "Activo",
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
];
