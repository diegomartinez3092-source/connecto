import { adaptKpiResponse } from "./adapters";
import { KPIData, KPIResponse } from "./types";

export const ENDPOINTS = {
  KPI: "https://starmarket-xcrm.s3.us-east-2.amazonaws.com/zenti/panel/kpi.json",
  CONFIG: "https://hooks.zapier.com/hooks/catch/12800655/3yuppv4/",
  CONEX: "https://hooks.zapier.com/hooks/catch/12800655/3yuyqax/",
  DL_LEADS: "https://hooks.zapier.com/hooks/catch/12800655/3yuxzjo/",
  DL_CONV: "https://hooks.zapier.com/hooks/catch/12800655/3yuyq0g/",
  SOPORTE: "https://hooks.zapier.com/hooks/catch/12800655/3yuq3bn/",
};

export const TIMEOUT_MS = 12000;

export function appendIdentity(url: string): string {
  const storedEmail = localStorage.getItem("email") || "";
  const storedClient = localStorage.getItem("client_code") || "";
  const params = new URLSearchParams();
  const urlObj = new URL(url);

  const urlClient = urlObj.searchParams.get("client_code");
  const urlEmail = urlObj.searchParams.get("email");

  if (storedEmail || urlEmail) {
    params.set("email", urlEmail || storedEmail);
  }
  if (storedClient || urlClient) {
    params.set("client_code", urlClient || storedClient);
  }

  const combined = new URL(url);
  params.forEach((value, key) => combined.searchParams.set(key, value));
  return combined.toString();
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout = TIMEOUT_MS
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function loadKPIs(): Promise<KPIData> {
  const url = appendIdentity(ENDPOINTS.KPI);
  const response = await fetchWithTimeout(url, { method: "GET" });
  if (!response.ok) {
    throw new Error("No se pudieron cargar los indicadores");
  }
  const data = (await response.json()) as KPIResponse;
  return adaptKpiResponse(data);
}

export async function submitConfig(form: FormData) {
  const response = await fetchWithTimeout(appendIdentity(ENDPOINTS.CONFIG), {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    throw new Error("No se pudo guardar la configuración");
  }
  return response;
}

export async function submitChannels(queryString: string) {
  const url = `${appendIdentity(ENDPOINTS.CONEX)}${queryString ? `?${queryString}` : ""}`;
  const response = await fetchWithTimeout(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudo conectar canales");
  }
  return response;
}

export function downloadLeads() {
  window.open(appendIdentity(ENDPOINTS.DL_LEADS), "_blank");
}

export function downloadConversaciones() {
  window.open(appendIdentity(ENDPOINTS.DL_CONV), "_blank");
}

export async function submitSoporte(form: FormData) {
  const response = await fetchWithTimeout(appendIdentity(ENDPOINTS.SOPORTE), {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    throw new Error("No se pudo enviar la solicitud de soporte");
  }
  return response;
}
