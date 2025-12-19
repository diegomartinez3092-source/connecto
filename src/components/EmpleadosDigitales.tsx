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

const WEBHOOK_URL =
  "https://hook.us2.make.com/u42uf80dkpzjeyjx5vouvvbllv8o5ke3";

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

const statusClasses: Record<string, string> = {
  Operando: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Requiere atención": "border-amber-200 bg-amber-50 text-amber-700",
  Inactivo: "border-slate-200 bg-slate-50 text-slate-700",
  "En configuración": "border-blue-200 bg-blue-50 text-blue-700",
  "Detenido por decisión humana": "border-rose-200 bg-rose-50 text-rose-700",
};

const primaryCtaLabels: Record<string, string> = {
  Operando: "Abrir panel",
  "Requiere atención": "Resolver ahora",
  Inactivo: "Activar",
  "En configuración": "Terminar configuración",
  "Detenido por decisión humana": "Reanudar",
};

const getStatusClass = (status?: string) =>
  status ? statusClasses[status] : undefined;

const getPrimaryCtaLabel = (status?: string) =>
  (status && primaryCtaLabels[status]) || "Ver";

const getAvailabilityLabel = (availability?: string) => availability || "—";

interface EmpleadosDigitalesProps {
  view?: string;
  onNavigate?: (view: string) => void;
}

export function EmpleadosDigitales({}: EmpleadosDigitalesProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [payload, setPayload] = useState<Payload | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    employeeId: string;
    nextActive: boolean;
    name: string;
  } | null>(null);
  const [activeOverrides, setActiveOverrides] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(false);

      try {
        const userEmail =
          typeof window !== "undefined"
            ? localStorage.getItem("userEmail") || ""
            : "";

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

        const data = (await response.json()) as Payload;
        setPayload(data);

        const overrides = data?.team?.employees?.reduce(
          (acc, employee) => ({
            ...acc,
            [employee.id]: employee.isActive,
          }),
          {} as Record<string, boolean>,
        );

        setActiveOverrides(overrides || {});
      } catch (err) {
        console.error("Error cargando empleados digitales", err);
        setError(true);
        setPayload(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const summary = useMemo(() => payload?.summary, [payload]);

  const employees = payload?.team?.employees ?? [];
  const hasEmployees = employees.length > 0;

  const handleToggleRequest = (employee: EmployeeFromWebhook) => {
    const isActive = activeOverrides[employee.id] ?? employee.isActive;
    setPendingToggle({
      employeeId: employee.id,
      nextActive: !isActive,
      name: employee.name,
    });
    setDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingToggle) {
      setDialogOpen(false);
      return;
    }

    setActiveOverrides((prev) => ({
      ...prev,
      [pendingToggle.employeeId]: pendingToggle.nextActive,
    }));

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
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Badge className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            Centro de Empleados Digitales
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
              Tu equipo digital
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Roles que trabajan por tu empresa y liberan tiempo operativo para
              decisiones estratégicas.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                error ? "bg-rose-500" : loading ? "bg-amber-400" : "bg-emerald-500",
              )}
            />
            <span>
              {loading
                ? "Cargando datos…"
                : error
                ? "No se pudo cargar"
                : `Actualizado: ${summary?.corte ?? "corte no disponible"}`}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Button disabled className="w-full sm:w-auto">
            Agregar empleado
          </Button>
          <p className="text-xs text-muted-foreground">
            Disponible en plan Pro (próximamente).
          </p>
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
              {summary?.corte ?? "Corte: —"}
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
              {summary?.ingresosAtribuidos7d ?? "—"}
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
              {summary?.capacidadRecuperada7d ?? "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Trabajo automatizado
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Estimado</p>
          </CardContent>
        </Card>
      </section>

      {error && !loading && (
        <p className="text-sm text-rose-600">
          No se pudo cargar la información. Intenta nuevamente más tarde.
        </p>
      )}

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Empleados digitales
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {!hasEmployees && (
            <Card className="border-dashed border-muted/80 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge
                    variant="outline"
                    className="rounded-full border-slate-200 bg-slate-50 text-slate-700"
                  >
                    Sin empleados activos
                  </Badge>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    Empieza aquí
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Activa tu primer empleado
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crea tu primer rol para empezar a automatizar y liberar
                  capacidad operativa.
                </p>
                <div className="mt-4">
                  <Button disabled size="sm">
                    Activar empleado
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {hasEmployees &&
            employees.map((employee) => {
              const isActive =
                activeOverrides[employee.id] ?? employee.isActive;

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
                        Disponibilidad: {getAvailabilityLabel(employee.availability)}
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
                          {employee.ingresosAtribuidos7d || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">7 días</p>
                      </div>
                      <div className="rounded-xl border border-muted/80 bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">
                          Capacidad recuperada
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {employee.capacidadRecuperada7d || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">Estimado</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      {employee.description}
                    </p>

                    <div className="mt-4 rounded-xl border border-dashed border-muted/80 bg-gradient-to-b from-primary/5 to-transparent p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Mensaje del empleado
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        {employee.agentMessage || "—"}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-muted/80 pt-4">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm">
                          {getPrimaryCtaLabel(employee.status)}
                        </Button>
                        <Button size="sm" variant="outline">
                          Configurar
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        {isActive ? "Activo" : "Inactivo"}
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => handleToggleRequest(employee)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {hasEmployees && (
            <Card className="border-dashed border-muted/80 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge
                    variant="outline"
                    className="rounded-full border-slate-200 bg-slate-50 text-slate-700"
                  >
                    Agregar empleado
                  </Badge>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    Disponible en plan Pro
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Agrega otro empleado digital
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Escala tu equipo digital con un rol adicional. Este botón llevará
                  a la sección de pago.
                </p>
                <div className="mt-4">
                  <Button disabled size="sm">
                    Ir a pago
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingToggle?.nextActive
                ? "¿Activar a este empleado digital?"
                : "¿Desactivar a este empleado digital?"}
            </DialogTitle>
            <DialogDescription>
              {pendingToggle?.nextActive
                ? "Reanudará la atención automática y comenzará a trabajar de inmediato."
                : "Dejará de operar y no atenderá clientes hasta que lo reanudes."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogChange(false)}>
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
