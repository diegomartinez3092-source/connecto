import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { KPIData } from "../../lib/vendedorDigital/types";

interface KPIGridProps {
  data: KPIData | null;
  loading: boolean;
  error?: string;
}

const placeholders = {
  value: "—",
  helper: "Disponible cuando se conecte el módulo de pagos/cotizaciones",
};

export function KPIGrid({ data, loading, error }: KPIGridProps) {
  const primary = [
    { label: "Conversaciones (hoy)", value: data?.conversacionesHoy ?? null },
    { label: "Leads capturados (hoy)", value: data?.leadsHoy ?? null },
    { label: "Respuesta <2 min", value: data?.respuestaMenos2m ?? null, suffix: "%" },
  ];

  const secondary = [
    { label: "Cotizaciones enviadas (7d)", value: data?.quotations7d },
    { label: "Pagos iniciados (7d)", value: data?.paymentsStarted7d },
    { label: "Pagos confirmados (7d)", value: data?.paymentsConfirmed7d },
    { label: "Clientes perdidos (7d)", value: data?.lostClients7d },
    { label: "Conversión a pago", value: data?.payConversion, suffix: "%" },
    { label: "Tiempo promedio de cierre", value: data?.closingTimeHours, suffix: " h" },
  ];

  const renderValue = (value: number | null | undefined, suffix?: string) => {
    if (value === null || value === undefined) return placeholders.value;
    return `${value}${suffix ?? ""}`;
  };

  const renderCard = (
    item: { label: string; value: number | null | undefined; suffix?: string },
    key: string,
    highlight?: boolean
  ) => (
    <Card key={key} className={highlight ? "border-primary/60 bg-primary/5" : ""}>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">{item.label}</p>
        <CardTitle className="text-2xl">
          {loading ? <Skeleton className="h-7 w-20" /> : renderValue(item.value, item.suffix)}
        </CardTitle>
        {(item.value === null || item.value === undefined) && !loading && (
          <p className="text-xs text-muted-foreground">{placeholders.helper}</p>
        )}
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-3">
        {primary.map((item) => renderCard(item, item.label, true))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {secondary.map((item) => renderCard(item, item.label))}
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
