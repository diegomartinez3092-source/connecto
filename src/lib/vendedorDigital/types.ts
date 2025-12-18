export interface KPIResponse {
  conv_today?: number;
  leads?: number;
  resp_lt_2m_pct?: number;
  leads_goal?: number;
  resp_goal_pct?: number;
  trend_conv?: number;
  leads_recent?: any[];
  plan?: string;
  quotations_7d?: number;
  payments_started_7d?: number;
  payments_confirmed_7d?: number;
  lost_clients_7d?: number;
  pay_conversion?: number;
  closing_time_hours?: number;
}

export interface KPIData {
  conversacionesHoy: number | null;
  leadsHoy: number | null;
  respuestaMenos2m: number | null;
  leadsGoal?: number | null;
  respuestaGoal?: number | null;
  trendConversaciones?: number | null;
  plan?: string;
  quotations7d?: number | null;
  paymentsStarted7d?: number | null;
  paymentsConfirmed7d?: number | null;
  lostClients7d?: number | null;
  payConversion?: number | null;
  closingTimeHours?: number | null;
}

export interface ActivityItem {
  title: string;
  meta?: string;
  detail?: string;
  status?: "success" | "pending" | "error";
}

export interface FunnelStage {
  label: string;
  value: number | null;
}

export interface SupportState {
  message: string;
  email: string;
  loading: boolean;
  success?: boolean;
  error?: string;
}

export interface AgentConfigPayload {
  asistente_nombre?: string;
  tono?: string;
  bienvenida?: string;
  archivos?: FileList | null;
  max_mensajes_antes_pago?: number;
  one_cta?: boolean;
  max_opciones?: number;
  escalamiento_palabras_clave?: string;
  horario_247?: boolean;
}

export interface ChannelsConfig {
  whatsapp?: string;
  messenger?: string;
  instagram?: string;
  webchat?: string;
}
