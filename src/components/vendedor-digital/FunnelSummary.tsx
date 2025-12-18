import { FunnelStage } from "../../lib/vendedorDigital/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface FunnelSummaryProps {
  stages: FunnelStage[];
  loading?: boolean;
}

export function FunnelSummary({ stages, loading }: FunnelSummaryProps) {
  const placeholders = stages.length
    ? stages
    : ["Captado", "Calificado", "Cotizado", "Pago iniciado", "Pagado", "Perdido"].map(
        (label) => ({ label, value: null })
      );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Embudo de ventas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Captado → Calificado → Cotizado → Pago iniciado → Pagado → Perdido
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {placeholders.map((stage, idx) => (
            <div
              key={stage.label}
              className="rounded-lg border bg-muted/40 p-3 text-center"
            >
              <p className="text-sm text-muted-foreground">{stage.label}</p>
              {loading ? (
                <Skeleton className="h-7 w-16 mx-auto" />
              ) : (
                <p className="text-xl font-semibold">{stage.value ?? "—"}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
