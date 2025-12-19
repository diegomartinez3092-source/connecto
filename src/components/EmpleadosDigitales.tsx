import { useEffect, useMemo, useState } from "react";
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
import { VendedorDigitalPanel } from "./VendedorDigitalPanel";
import { VendedorDigitalTrainingPage } from "./VendedorDigitalTrainingPage";

type EmployeeFromWebhook = {
  id: string;
  isActive: boolean;
  status: string;
  availability: string;
  name: string;
  subtitle: string;
  description: string;
  ingresosAtribuidos7d: string;
  capacidadRecuperada7d: string;
  agentMessage: string;
};

type Payload = {
  summary: {
    activosRatio: string;
    enAtencion: string;
    ingresosAtribuidos7d: string;
    capacidadRecuperada7d: string;
    corte?: string;
  };
  team: {
    employees: EmployeeFromWebhook[];
  };
};

type EmployeeStatus =
  | "Operando"
  | "Requiere atención"
  | "Inactivo"
  | "En configuración"
  | "Detenido por decisión humana";

const WEBHOOK_URL = "https://hook.us2.make.com/u42uf80dkpzjeyjx5vouvvbllv8o5ke3";

const statusClasses: Record<EmployeeStatus, string> = {
  Operando: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Requiere atención": "border-amber-200 bg-amber-50 text-amber-700",
  Inactivo: "border-slate-200 bg-slate-50 text-slate-700",
  "En configuración": "border-blue-200 bg-blue-50 text-blue-700",
  "Detenido por decisión humana": "border-rose-200 bg-rose-50 text-rose-700",
};

const primaryCtaLabels: Record<EmployeeStatus, string> = {
  Operando: "Abrir panel",
  "Requiere atención": "Resolver ahora",
  Inactivo: "Activar",
  "En configuración": "Terminar configuración",
  "Detenido por decisión humana": "Reanudar",
};

const getStatusClass = (status?: string) =>
  statusClasses[(status as EmployeeStatus) ?? "Inactivo"] ??
  statusClasses.Inactivo;

const getPrimaryCtaLabel = (status?: string) =>
  primaryCtaLabels[(status as EmployeeStatus) ?? "Inactivo"] ?? "Ver";

const formatValue = (value?: string) => value ?? "—";

const getAvailabilityLabel = (availability?: string) => availability || "—";

interface EmpleadosDigitalesProps {
  view?: string;
  onNavigate?: (view: string) => void;
}

export function EmpleadosDigitales({
  onNavigate,
  view,
}: EmpleadosDigitalesProps) {
  if (view === "empleados-digitales-vendedor-digital-panel") {
    return (
      <VendedorDigitalPanel
        onBack={() => onNavigate?.("empleados-digitales")}
        onTrain={() =>
          onNavigate?.("empleados-digitales-vendedor-digital-entrenamiento")
        }
      />
    );
  }

  if (view === "empleados-digitales-vendedor-digital-entrenamiento") {
    return (
      <VendedorDigitalTrainingPage
        onBackToPanel={() =>
          onNavigate?.("empleados-digitales-vendedor-digital-panel")
        }
        onBackToEmployees={() => onNavigate?.("empleados-digitales")}
      />
    );
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    employeeId: EmployeeFromWebhook["id"];
    nextActive: boolean;
    name: string;
  } | null>(null);

  const employees = useMemo(
    () => data?.team?.employees ?? [],
    [data?.team?.employees],
  );

  const summary = data?.summary;

  const handleToggleRequest = (
    employee: EmployeeFromWebhook,
    nextActive: boolean,
  ) => {
    setPendingToggle({
      employeeId: employee.id,
      nextActive,
      name: employee.name,
    });
    setDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingToggle) {
      setDialogOpen(false);
      return;
    }

    setData((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        team: {
          ...prev.team,
          employees: prev.team.employees.map((employee) =>
            employee.id === pendingToggle.employeeId
              ? { ...employee, isActive: pendingToggle.nextActive }
              : employee,
          ),
        },
      };
    });

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

  const handlePrimaryAction = (employee: EmployeeFromWebhook) => {
    if (employee.id === "vendedor-digital") {
      onNavigate?.("empleados-digitales-vendedor-digital-panel");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const userEmail = localStorage.getItem("email") ?? "";
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "empleados_digitales_view_loaded",
            email: userEmail,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as Payload;

        if (isMounted) {
          setData(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError("No se pudo cargar");
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                error ? "bg-rose-400" : "bg-amber-400",
                !loading && !error && "bg-emerald-400",
              )}
            />
            {loading
              ? "Cargando datos…"
              : error
                ? error
                : `Actualizado: ${summary?.corte ?? "Corte no disponible"}`}
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
              {summary?.activosRatio ?? "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Operando hoy</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Corte: {summary?.corte ?? "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-muted/80">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">En atención</p>
            <p className="mt-2 text-2xl font-semibold">
              {summary?.enAtencion ?? "—"}
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
              {formatValue(summary?.ingresosAtribuidos7d)}
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
              {formatValue(summary?.capacidadRecuperada7d)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Trabajo automatizado
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Estimado</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Empleados digitales
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {employees.length === 0 ? (
            <Card className="border-dashed border-muted/80 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <Badge
                    variant="outline"
                    className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700"
                  >
                    Sin empleados activos
                  </Badge>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    Empieza aquí
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Activa tu primer empleado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Crea tu primer rol para empezar a automatizar y liberar capacidad
                    operativa.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-muted/80 pt-4">
                  <Button size="sm" disabled>
                    Activar empleado
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {employees.map((employee) => {
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
                          {employee.status || "Inactivo"}
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
                          {employee.subtitle}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-muted/80 bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">
                            Ingresos atribuidos
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            {formatValue(employee.ingresosAtribuidos7d)}
                          </p>
                          <p className="text-xs text-muted-foreground">7 días</p>
                        </div>
                        <div className="rounded-xl border border-muted/80 bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">
                            Capacidad recuperada
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            {formatValue(employee.capacidadRecuperada7d)}
                          </p>
                          <p className="text-xs text-muted-foreground">Estimado</p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">
                        {employee.description}
                      </p>

                      <div className="mt-4 rounded-xl border border-dashed border-muted/80 bg-gradient-to-b from-primary/5 to-transparent p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Mensaje del empleado
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                          {employee.agentMessage}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-muted/80 pt-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePrimaryAction(employee)}
                          >
                            {primaryCtaLabel}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => undefined}>
                            Configurar
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          {employee.isActive ? "Activo" : "Inactivo"}
                          <Switch
                            checked={employee.isActive}
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

              <Card className="border-dashed border-muted/80 bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      Agregar empleado
                    </Badge>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                      Disponible en plan Pro
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Agrega otro empleado digital
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Escala tu equipo digital con un rol adicional. Este botón
                      llevará a la sección de pago.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-muted/80 pt-4">
                    <Button size="sm" disabled>
                      Ir a pago
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      {error && (
        <p className="text-xs text-rose-500">
          No se pudo cargar la información. Intenta nuevamente más tarde.
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingToggle?.nextActive
                ? `¿Activar a ${pendingToggle.name}?`
                : `¿Desactivar a ${pendingToggle?.name}?`}
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
