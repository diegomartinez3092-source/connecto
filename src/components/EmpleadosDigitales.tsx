import { useMemo, useState } from "react";
import {
  DigitalEmployee,
  DigitalEmployeeStatus,
  digitalEmployees,
} from "../data/digitalEmployees";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";

const activeStatuses: DigitalEmployeeStatus[] = [
  "Operando",
  "Requiere atención",
  "En configuración",
];

const statusLabels: Record<DigitalEmployeeStatus, string> = {
  Operando: "Operando",
  "Requiere atención": "Requiere atención",
  Inactivo: "Inactivo",
  "En configuración": "En configuración",
  "Detenido por decisión humana": "Detenido por decisión humana",
};

const statusClasses: Record<DigitalEmployeeStatus, string> = {
  Operando: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Requiere atención": "border-amber-200 bg-amber-50 text-amber-700",
  Inactivo: "border-slate-200 bg-slate-50 text-slate-700",
  "En configuración": "border-blue-200 bg-blue-50 text-blue-700",
  "Detenido por decisión humana": "border-rose-200 bg-rose-50 text-rose-700",
};

const primaryCtaLabels: Record<DigitalEmployeeStatus, string> = {
  Operando: "Abrir panel",
  "Requiere atención": "Resolver ahora",
  Inactivo: "Activar",
  "En configuración": "Terminar configuración",
  "Detenido por decisión humana": "Reanudar",
};

const getStatusLabel = (status: DigitalEmployeeStatus) => statusLabels[status];

const getStatusClass = (status: DigitalEmployeeStatus) => statusClasses[status];

const getPrimaryCtaLabel = (status: DigitalEmployeeStatus) =>
  primaryCtaLabels[status];

const formatCurrency = (value?: number) => {
  if (value === undefined) {
    return "—";
  }

  const formatted = new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(value);

  return `$${formatted}`;
};

const formatCapacity = (value?: number) => {
  if (value === undefined) {
    return "—";
  }

  const formatted = new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} persona`;
};

const getMetricHelper = (value?: number, fallback = "Sin datos") =>
  value === undefined ? fallback : "Estimado";

const getAvailabilityLabel = (availability?: string) =>
  availability || "—";

const getPrimaryCtaAction = (
  status: DigitalEmployeeStatus,
  employee: DigitalEmployee,
  onNavigate?: (view: string) => void,
) => {
  return () => {
    if (!onNavigate) {
      return;
    }

    const base = `empleados-digitales-${employee.id}`;

    switch (status) {
      case "Requiere atención":
        onNavigate(`${base}-resolver`);
        return;
      case "En configuración":
        onNavigate(`${base}-configuracion`);
        return;
      case "Inactivo":
      case "Detenido por decisión humana":
        onNavigate(`${base}-activar`);
        return;
      default:
        onNavigate(base);
    }
  };
};

const recommendations = [
  {
    id: "cajero",
    title: "Cajero digital: pagos pendientes",
    urgency: "Urgencia: Alta",
    description:
      "Resolver cobros pendientes puede recuperar ingresos sin aumentar carga de trabajo.",
    expected: "Recuperar ventas + liberar tiempo.",
    cta: "Ir a resolver",
    target: "empleados-digitales-cajero-resolver",
  },
  {
    id: "marketing",
    title: "Marketing digital: terminar configuración",
    urgency: "Urgencia: Media",
    description:
      "Completa la configuración para estabilizar adquisición y reducir intervención manual.",
    expected: "Flujo constante + más tiempo libre.",
    cta: "Abrir configuración",
    target: "empleados-digitales-marketing-configuracion",
  },
  {
    id: "soporte",
    title: "Soporte digital: reactivar en picos",
    urgency: "Urgencia: Baja",
    description:
      "Define el umbral de volumen para reactivar soporte sin esperar saturación humana.",
    expected: "Atención estable + menos tickets repetidos.",
    cta: "Definir umbral",
    target: "empleados-digitales-soporte-configuracion",
  },
];

interface EmpleadosDigitalesProps {
  view?: string;
  onNavigate?: (view: string) => void;
}

export function EmpleadosDigitales({ onNavigate }: EmpleadosDigitalesProps) {
  const [employees, setEmployees] = useState<DigitalEmployee[]>(digitalEmployees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    employeeId: DigitalEmployee["id"];
    nextActive: boolean;
  } | null>(null);

  const summary = useMemo(() => {
    const total = employees.length;
    const activeCount = employees.filter((employee) =>
      activeStatuses.includes(employee.status),
    ).length;
    const attentionCount = employees.filter(
      (employee) => employee.status === "Requiere atención",
    ).length;
    const revenueSum = employees.reduce(
      (sum, employee) => sum + (employee.attributedRevenue7d ?? 0),
      0,
    );
    const capacitySum = employees.reduce(
      (sum, employee) => sum + (employee.capacityRecovered7d ?? 0),
      0,
    );

    return {
      total,
      activeCount,
      attentionCount,
      revenueSum,
      capacitySum,
    };
  }, [employees]);

  const handleToggleRequest = (employee: DigitalEmployee, nextActive: boolean) => {
    setPendingToggle({ employeeId: employee.id, nextActive });
    setDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingToggle) {
      setDialogOpen(false);
      return;
    }

    setEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id !== pendingToggle.employeeId) {
          return employee;
        }

        return {
          ...employee,
          status: pendingToggle.nextActive ? "Operando" : "Inactivo",
        };
      }),
    );

    setDialogOpen(false);
    setPendingToggle(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPendingToggle(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPendingToggle(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Badge className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            Centro de Empleados Digitales
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
              Tu equipo digital
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Roles inteligentes que trabajan por tu empresa, sostienen la operación
              diaria y liberan tiempo para decisiones estratégicas.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="space-y-2">
            <Button disabled className="w-full sm:w-auto">
              Agregar empleado
            </Button>
            <p className="text-xs text-muted-foreground">
              Disponible en plan Pro (próximamente).
            </p>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onNavigate?.("empleados-digitales-resumen")}
            >
              Ver resumen semanal
            </Button>
            <p className="text-xs text-muted-foreground">
              Ingresos atribuidos y capacidad recuperada.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-muted/80">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Empleados activos</p>
            <p className="mt-2 text-2xl font-semibold">
              {summary.activeCount} / {summary.total}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Operando hoy</p>
            <p className="mt-4 text-xs text-muted-foreground">Corte actual</p>
          </CardContent>
        </Card>
        <Card className="border-muted/80">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">En atención</p>
            <p className="mt-2 text-2xl font-semibold">
              {summary.attentionCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Requiere decisión
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Prioridad ejecutiva
            </p>
          </CardContent>
        </Card>
        <Card className="border-muted/80">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">
              Ingresos atribuidos (7 días)
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {formatCurrency(summary.revenueSum)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ventas influenciadas
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Últimos 7 días</p>
          </CardContent>
        </Card>
        <Card className="border-muted/80">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">
              Capacidad recuperada (7 días)
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {formatCapacity(summary.capacitySum)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Trabajo automatizado
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Estimado</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Equipo
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {employees.map((employee) => {
              const isActive = activeStatuses.includes(employee.status);
              const primaryCtaLabel = getPrimaryCtaLabel(employee.status);
              const availability = getAvailabilityLabel(employee.availability);

              return (
                <Card key={employee.id} className="border-muted/80">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <Badge
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold",
                          getStatusClass(employee.status),
                        )}
                        variant="outline"
                      >
                        {getStatusLabel(employee.status)}
                      </Badge>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                        Disponibilidad: {availability}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {employee.responsibility}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-muted/80 bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">
                          Ingresos atribuidos
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {formatCurrency(employee.attributedRevenue7d)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee.attributedRevenue7d === undefined
                            ? "Sin datos"
                            : "7 días"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-muted/80 bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">
                          Capacidad recuperada
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {formatCapacity(employee.capacityRecovered7d)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getMetricHelper(employee.capacityRecovered7d)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      {employee.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-muted/80 pt-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={getPrimaryCtaAction(
                            employee.status,
                            employee,
                            onNavigate,
                          )}
                        >
                          {primaryCtaLabel}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onNavigate?.(
                              `empleados-digitales-${employee.id}-configuracion`,
                            )
                          }
                        >
                          Configurar
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        {isActive ? "Activo" : "Inactivo"}
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            handleToggleRequest(employee, checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Recomendaciones del equipo
          </p>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-muted/80">
                <CardContent className="border-l-4 border-primary/70 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {rec.title}
                    </p>
                    <span className="rounded-full border border-muted/80 bg-muted/40 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                      {rec.urgency}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Resultado esperado:
                    </span>{" "}
                    {rec.expected}
                  </p>
                  <Button
                    size="sm"
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={() => onNavigate?.(rec.target)}
                  >
                    {rec.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>
      </section>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingToggle?.nextActive
                ? "¿Activar este empleado digital?"
                : "¿Desactivar este empleado digital?"}
            </DialogTitle>
            <DialogDescription>
              {pendingToggle?.nextActive
                ? "Reanudará la atención automática y comenzará a trabajar de inmediato."
                : "Dejará de operar y no atenderá clientes hasta que lo reanudes."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmToggle}>
              {pendingToggle?.nextActive ? "Activar" : "Desactivar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
