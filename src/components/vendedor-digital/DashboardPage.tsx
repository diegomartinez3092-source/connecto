import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "./PageHeader";
import { KPIGrid } from "./KPIGrid";
import { ActivityTable } from "./ActivityTable";
import { ActivityCards } from "./ActivityCards";
import { FunnelSummary } from "./FunnelSummary";
import { DownloadsCard } from "./DownloadsCard";
import { SupportCard } from "./SupportCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { loadKPIs } from "../../lib/vendedorDigital/api";
import { ActivityItem, FunnelStage, KPIData } from "../../lib/vendedorDigital/types";
import { AlertTriangle } from "lucide-react";

interface DashboardPageProps {
  onNavigateConfig: () => void;
}

export function DashboardPage({ onNavigateConfig }: DashboardPageProps) {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status: "active" | "alert" = error ? "alert" : "active";

  const activity: ActivityItem[] = useMemo(
    () => [
      {
        title: "Conversación atendida",
        meta: "Respuesta 45s",
        detail: "Cliente preguntó por disponibilidad",
        status: "success",
      },
      {
        title: "Cotización enviada",
        meta: "Ticket $820",
        detail: "Plantilla premium",
        status: "success",
      },
      {
        title: "Seguimiento automático",
        meta: "T+24h",
        detail: "Recordatorio de pago",
        status: "pending",
      },
    ],
    []
  );

  const funnel: FunnelStage[] = [
    { label: "Captado", value: kpis?.leadsHoy ?? null },
    { label: "Calificado", value: kpis?.leadsHoy ? Math.round((kpis.leadsHoy ?? 0) * 0.7) : null },
    { label: "Cotizado", value: kpis?.quotations7d ?? null },
    { label: "Pago iniciado", value: kpis?.paymentsStarted7d ?? null },
    { label: "Pagado", value: kpis?.paymentsConfirmed7d ?? null },
    { label: "Perdido", value: kpis?.lostClients7d ?? null },
  ];

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadKPIs();
      setKpis(data);
    } catch (err) {
      setError((err as Error).message || "Error al cargar KPIs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader status={status} onReload={handleLoad} onConfig={onNavigateConfig} />

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base text-amber-900">Hay alertas en la carga de KPIs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-800">
            {error}. Se mostrará el modo demo hasta resolver la conexión.
          </CardContent>
        </Card>
      )}

      <KPIGrid data={kpis} loading={loading} error={error || undefined} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad reciente</CardTitle>
          <p className="text-sm text-muted-foreground">Tabla en desktop, cards en mobile.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <ActivityTable items={activity} loading={loading} />
          <ActivityCards items={activity} loading={loading} />
        </CardContent>
      </Card>

      <FunnelSummary stages={funnel} loading={loading} />

      <DownloadsCard />

      <SupportCard />
    </div>
  );
}
