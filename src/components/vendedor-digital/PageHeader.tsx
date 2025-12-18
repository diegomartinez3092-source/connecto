import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowLeft, RefreshCcw, Settings2 } from "lucide-react";
import { cn } from "../ui/utils";

interface PageHeaderProps {
  status: "active" | "alert";
  onReload?: () => void;
  onConfig?: () => void;
  onBack?: () => void;
  variant?: "dashboard" | "config";
}

const statusTone = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  alert: "bg-amber-100 text-amber-900 border-amber-200",
};

export function PageHeader({ status, onReload, onConfig, onBack, variant = "dashboard" }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer">Empleados Digitales</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Vendedor digital</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            {variant === "dashboard" ? "Vendedor digital" : "Configura tu Vendedor digital"}
          </h1>
          <Badge className={cn("border", statusTone[status])}>
            {status === "active" ? "Activo" : "En alerta"}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {variant === "dashboard"
            ? "Resultados y salud operativa del agente conversacional."
            : "Define identidad, reglas y canales para tu agente."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {variant === "dashboard" && (
          <>
            <Button variant="outline" className="gap-2" onClick={onReload}>
              <RefreshCcw className="h-4 w-4" /> Actualizar indicadores
            </Button>
            <Button className="gap-2" onClick={onConfig}>
              <Settings2 className="h-4 w-4" /> Ir a configuración
            </Button>
          </>
        )}
        {variant === "config" && (
          <Button variant="outline" className="gap-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Volver a dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
