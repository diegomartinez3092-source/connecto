import { ReactNode, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  centerMetrics,
  digitalEmployees,
  insights,
  type DigitalEmployee,
  type DigitalEmployeeId,
} from "../data/digitalEmployees";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MailQuestion,
  Settings2,
  Sparkles,
} from "lucide-react";
import { cn } from "./ui/utils";

interface EmpleadosDigitalesProps {
  view: string;
  onNavigate: (view: string) => void;
}

const statusStyles: Record<DigitalEmployee["status"], string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  alert: "bg-amber-100 text-amber-900 border-amber-200",
};

export function EmpleadosDigitales({ view, onNavigate }: EmpleadosDigitalesProps) {
  const isDetail = view.startsWith("empleados-digitales-");
  const employeeId = isDetail
    ? (view.replace("empleados-digitales-", "") as DigitalEmployeeId)
    : undefined;

  const employee = useMemo(
    () => digitalEmployees.find((item) => item.id === employeeId),
    [employeeId]
  );

  if (isDetail && employee) {
    return <EmpleadoDetalle empleado={employee} onNavigate={onNavigate} />;
  }

  return <EmpleadosDigitalesHome onNavigate={onNavigate} />;
}

function EmpleadosDigitalesHome({
  onNavigate,
}: {
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm font-semibold">
            <Bot className="h-4 w-4" /> Centro de Empleados Digitales
          </div>
          <h1 className="text-3xl font-bold mt-3">Empleados Digitales</h1>
          <p className="text-muted-foreground">
            Tu equipo digital activo, conectado al CRM y enfocado en vender.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" /> Ver actividad
          </Button>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" /> Activar empleado
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIStat
          title="Activos"
          value={`${centerMetrics.activos} activos / ${centerMetrics.enAlerta} en alerta`}
          tone="success"
        />
        <KPIStat
          title="Tiempo promedio respuesta"
          value={centerMetrics.tiempoRespuestaPromedio}
          helper="Últimos 7 días"
        />
        <KPIStat
          title="Leads (7d)"
          value={centerMetrics.leads7d.toString()}
          helper="Calificados y en nutrido"
        />
        <KPIStat
          title="Ingresos atribuidos (7d)"
          value={centerMetrics.ingresos7d}
          helper={`${centerMetrics.pagosPendientes} pagos pendientes`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3 space-y-4">
          {digitalEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate(`empleados-digitales-${employee.id}`)}
            >
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("border", statusStyles[employee.status])}>
                      {employee.availability}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{employee.name}</span>
                  </div>
                  <CardTitle className="text-xl mt-1">{employee.headline}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {employee.description}
                  </p>
                </div>
                <Button variant="ghost" className="gap-2" size="sm">
                  Ver detalle <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {employee.kpis.map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border p-3 bg-muted/40">
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-semibold">{kpi.value}</p>
                      {kpi.helper && (
                        <p className="text-xs text-muted-foreground">{kpi.helper}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {employee.actions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`empleados-digitales-${employee.id}`);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" /> {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Insights & Recomendaciones
          </h3>
          {insights.map((insight) => (
            <Card key={insight.title} className="border-l-4 border-l-primary/80">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings2 className="h-4 w-4" /> {insight.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmpleadoDetalle({
  empleado,
  onNavigate,
}: {
  empleado: DigitalEmployee;
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => onNavigate("empleados-digitales")}
            >
              Empleados Digitales
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{empleado.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Badge className={cn("border", statusStyles[empleado.status])}>
              {empleado.availability}
            </Badge>
            <span className="text-sm text-muted-foreground">Controles operativos • Tiempo real</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{empleado.name}</h1>
          <p className="text-muted-foreground">{empleado.headline}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="h-4 w-4" /> Actividad reciente
          </Button>
          <Button size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" /> Ajustes rápidos
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {empleado.detailMetrics.map((metric) => (
          <Card key={metric.label} className="bg-muted/40">
            <CardHeader className="pb-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
              {metric.helper && (
                <p className="text-xs text-muted-foreground">{metric.helper}</p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="configuracion">Configuración</TabsTrigger>
              <TabsTrigger value="actividad">Actividad</TabsTrigger>
              <TabsTrigger value="rol">
                {empleado.id === "marketing"
                  ? "Campañas"
                  : empleado.id === "ventas"
                  ? "Scripts"
                  : "Métodos de pago"}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="resumen">
              <ResumenTab empleado={empleado} />
            </TabsContent>
            <TabsContent value="configuracion">
              <ConfiguracionTab empleado={empleado} />
            </TabsContent>
            <TabsContent value="actividad">
              <ActividadTab empleado={empleado} />
            </TabsContent>
            <TabsContent value="rol">
              <RolTab empleado={empleado} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="border border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-4 w-4 text-primary" /> Controles operativos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ajustes rápidos para disponibilidad y escalamiento.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Prioridad alta" checked />
              <ToggleRow label="Escalar pagos pendientes" checked={empleado.id === "cajero"} />
              <ToggleRow label="Alertas en topbar" checked={empleado.status === "alert"} />
              <ToggleRow label="Notificar por email" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Siguientes pasos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Alinea a tu equipo digital con las reglas de negocio.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ActionItem
                icon={Sparkles}
                title="Optimizar prompts"
                subtitle="Mejora respuestas y tono"
              />
              <ActionItem
                icon={MailQuestion}
                title="Revisar escalamiento"
                subtitle="A clientes VIP y tickets altos"
              />
              <ActionItem
                icon={CheckCircle2}
                title="Cerrar pendientes"
                subtitle="Envía recordatorios y confirma cobros"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPIStat({
  title,
  value,
  helper,
  tone,
}: {
  title: string;
  value: string;
  helper?: string;
  tone?: "success" | "warning";
}) {
  return (
    <Card className={cn(tone === "success" ? "border-emerald-200" : "")}> 
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <CardTitle className="text-2xl">{value}</CardTitle>
        {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
      </CardHeader>
    </Card>
  );
}

function ResumenTab({ empleado }: { empleado: DigitalEmployee }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Panorama general</CardTitle>
          <p className="text-sm text-muted-foreground">
            Estado operativo, KPIs recientes y próximos pasos del rol.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Descripción</p>
            <p className="text-base leading-relaxed">{empleado.description}</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Acciones sugeridas</p>
            <ul className="space-y-2 text-sm">
              <li>• Revisar guías y mensajes clave.</li>
              <li>• Validar reglas de enrutamiento con CRM.</li>
              <li>• Publicar cambios y monitorear 24h.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad reciente</CardTitle>
          <p className="text-sm text-muted-foreground">
            Movimientos de las últimas 24h.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {empleado.recentActivity.map((item) => (
            <div
              key={item.title}
              className="flex items-start justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                {item.detail && (
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                )}
              </div>
              {item.meta && (
                <Badge variant="outline" className="text-xs">
                  {item.meta}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ConfiguracionTab({ empleado }: { empleado: DigitalEmployee }) {
  if (empleado.id === "marketing") {
    return (
      <ConfigGrid>
        <InputWithLabel label="Objetivo de campaña" defaultValue={empleado.configuration?.["Objetivo de campaña"]} />
        <InputWithLabel label="Canal prioritario" defaultValue={empleado.configuration?.["Canal prioritario"]} />
        <InputWithLabel label="Hook" defaultValue={empleado.configuration?.Hook} />
        <InputWithLabel label="Copy de anuncio" defaultValue={empleado.configuration?.["Copy de anuncio"]} />
        <InputWithLabel label="Presupuesto diario" defaultValue={empleado.configuration?.["Presupuesto diario"]} />
        <InputWithLabel label="Meta leads/día" defaultValue={empleado.configuration?.["Meta leads/día"]} />
      </ConfigGrid>
    );
  }

  if (empleado.id === "ventas") {
    return (
      <ConfigGrid>
        <InputWithLabel label="Mensaje de bienvenida" defaultValue={empleado.configuration?.["Mensaje de bienvenida"]} />
        <InputWithLabel label="Máx. mensajes antes de pago" defaultValue={empleado.configuration?.["Máx. mensajes antes de pago"]} />
        <ToggleField label="1 CTA por mensaje" defaultChecked={empleado.toggles?.oneCta} />
        <ToggleField label="Máximo 2 opciones" defaultChecked={empleado.toggles?.maxOptions} />
      </ConfigGrid>
    );
  }

  return (
    <ConfigGrid>
      <ToggleField label="Stripe" defaultChecked={empleado.toggles?.stripe} />
      <ToggleField label="Transferencia" defaultChecked={empleado.toggles?.transferencia} />
      <ToggleField label="Depósito" defaultChecked={empleado.toggles?.deposito} />
      <ToggleField label="Efectivo" defaultChecked={empleado.toggles?.efectivo} />
      <ToggleField label="Stripe primero" defaultChecked={empleado.toggles?.stripePrimero} />
      <InputWithLabel label="Máx. métodos por mensaje" defaultValue={empleado.configuration?.["Máx. métodos por mensaje"]} />
      <InputWithLabel label="Cadencia follow-up" defaultValue={empleado.configuration?.["Cadencia follow-up"]} />
    </ConfigGrid>
  );
}

function ActividadTab({ empleado }: { empleado: DigitalEmployee }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {empleado.recentActivity.map((item) => (
        <Card key={item.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" /> {item.title}
            </CardTitle>
            {item.detail && (
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.meta || "Sincronizado con CRM"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RolTab({ empleado }: { empleado: DigitalEmployee }) {
  if (empleado.id === "marketing") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campañas activas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribución por canal con copy aprobado.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="outline">IG Ads • Hook creativo</Badge>
            <Badge variant="outline">Formularios • Lead scoring</Badge>
            <Badge variant="outline">Email • Nutrición B2B</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Formularios</CardTitle>
            <p className="text-sm text-muted-foreground">
              Validaciones, campos clave y consentimientos.
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Score &gt;80 → Ventas</span>
              <Badge variant="secondary">Activo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Webhook CRM</span>
              <Badge variant="secondary">Sincronizado</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Duplicados</span>
              <Badge variant="secondary">Bloqueados</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (empleado.id === "ventas") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scripts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Secuencia conversacional con CTAs y reglas.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea defaultValue="Hola, soy tu asistente digital. ¿Quieres agendar una llamada o recibir una cotización rápida?" />
            <Textarea defaultValue="CTA único por mensaje. Máx. 2 opciones para mantener foco en cierre." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cotización</CardTitle>
            <p className="text-sm text-muted-foreground">Lógica de precios y adjuntos.</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Ticket promedio</span>
              <Badge variant="outline">$820</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Adjuntar PDF</span>
              <Badge variant="secondary">Activo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Escalar palabras clave</span>
              <Badge variant="secondary">Config.</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métodos de pago</CardTitle>
          <p className="text-sm text-muted-foreground">Disponibilidad por canal.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <ToggleRow label="Stripe" checked />
          <ToggleRow label="Transferencia" checked />
          <ToggleRow label="Depósito" checked />
          <ToggleRow label="Efectivo" checked />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Follow-up</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cadencia y prioridad de recuperación.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Stripe primero</span>
            <Badge variant="secondary">Sí</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Máx. métodos por mensaje</span>
            <Badge variant="outline">2</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Cadencia</span>
            <Badge variant="outline">T+2h, T+24h, T+72h</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConfigGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {children}
    </div>
  );
}

function InputWithLabel({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

function ToggleField({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Configuración rápida</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function ToggleRow({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <Switch defaultChecked={checked} />
    </div>
  );
}

function ActionItem({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
