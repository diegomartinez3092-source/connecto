import { KPIData, KPIResponse } from "./types";

export function adaptKpiResponse(payload: KPIResponse): KPIData {
  return {
    conversacionesHoy: payload.conv_today ?? null,
    leadsHoy: payload.leads ?? null,
    respuestaMenos2m: payload.resp_lt_2m_pct ?? null,
    leadsGoal: payload.leads_goal ?? null,
    respuestaGoal: payload.resp_goal_pct ?? null,
    trendConversaciones: payload.trend_conv ?? null,
    plan: payload.plan,
    quotations7d: payload.quotations_7d ?? null,
    paymentsStarted7d: payload.payments_started_7d ?? null,
    paymentsConfirmed7d: payload.payments_confirmed_7d ?? null,
    lostClients7d: payload.lost_clients_7d ?? null,
    payConversion: payload.pay_conversion ?? null,
    closingTimeHours: payload.closing_time_hours ?? null,
  };
}
