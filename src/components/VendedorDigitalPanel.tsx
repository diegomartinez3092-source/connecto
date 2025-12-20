import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Brain,
  RefreshCcw,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "./ui/utils";

const WEBHOOK_URL =
  "https://hook.us2.make.com/48eqvghgow15niqqp7jbtgb60kfqrnq6";

type QuickRange = "today" | "24h" | "7d" | "30d" | "custom";

type Channel = "all" | "whatsapp" | "web" | "fbads";

type ViewMode = "operativo" | "ejecutivo";

type Filters = {
  quickRange: QuickRange;
  dateFrom: string | null;
  dateTo: string | null;
  channel: Channel;
  viewMode: ViewMode;
};

type Payload = {
  meta?: { corte?: string };
  agent?: { status?: string; availability?: string };
  kpis?: KPIs;
  funnel?: Funnel;
  tables?: Tables;
  analysis?: Analysis;
};

type KPIs = {
  ventasCobradas?: string;
  ventasCerradas?: string;
  ticketPromedio?: string;
  conversaciones?: string;
  abandonadas?: string;
  tiempoAhorrado?: string;
};

type Funnel = {
  conversaciones?: string;
  leadsCalificados?: string;
  cotizacionesGeneradas?: string;
  ventasCobradasCount?: string;
  conversionPct?: string;
  leadsHelp?: string;
  cotizacionesHelp?: string;
  ventasHelp?: string;
  tones?: {
    conversaciones?: Tone;
    leads?: Tone;
    cotizaciones?: Tone;
    ventas?: Tone;
    conversion?: Tone;
  };
};

type Tables = {
  porHora?: TableRowHora[];
  abandonadas?: TableRowAbandonada[];
  cotizaciones?: TableRowCotizacion[];
  ventas?: TableRowVenta[];
};

type TableRowHora = {
  hora?: string;
  conversaciones?: string;
  abandonadas?: string;
};

type TableRowAbandonada = {
  cliente?: string;
  motivo?: string;
  valor?: string;
};

type TableRowCotizacion = {
  id?: string;
  cliente?: string;
  estado?: string;
  monto?: string;
  nota?: string;
};

type TableRowVenta = {
  id?: string;
  cliente?: string;
  metodo?: string;
  monto?: string;
  fecha?: string;
};

type Analysis = {
  summary?: string;
  bullets?: string[];
  callouts?: Callout[];
};

type Callout = {
  title?: string;
  message?: string;
  tag?: string;
};

type Tone = "good" | "warn" | "bad";

type WebhookRequest = {
  event: "vendedor_digital_dashboard_loaded";
  reason: "view_loaded" | "filter_change" | "manual_refresh";
  email: string;
  filters: Filters;
  timestamp: string;
};

type VendedorDigitalPanelProps = {
  onBack?: () => void;
  onTrain?: () => void;
};

const statusStyles: Record<string, string> = {
  Operando: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Requiere atención": "border-amber-200 bg-amber-50 text-amber-700",
  Inactivo: "border-slate-200 bg-slate-50 text-slate-700",
  "En configuración": "border-blue-200 bg-blue-50 text-blue-700",
  "Detenido por decisión humana": "border-rose-200 bg-rose-50 text-rose-700",
};

const toneStyles: Record<Tone, string> = {
  good: "border-emerald-200 bg-emerald-50/40",
  warn: "border-amber-200 bg-amber-50/50",
  bad: "border-rose-200 bg-rose-50/50",
};

const quickRanges: { value: QuickRange; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "custom", label: "Personalizado" },
];

const channelOptions: { value: Channel; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "web", label: "Web" },
  { value: "fbads", label: "Facebook Ads" },
];

const viewModes: { value: ViewMode; label: string }[] = [
  { value: "operativo", label: "Operativo" },
  { value: "ejecutivo", label: "Ejecutivo" },
];

const getTodayIsoDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const safeParseJson = (value: string) => {
  try {
    return JSON.parse(value) as { email?: string } | undefined;
  } catch (error) {
    return undefined;
  }
};

const getEmailFromLocalStorage = () => {
  const direct = localStorage.getItem("email") ?? localStorage.getItem("userEmail");
  if (direct) {
    return direct;
  }

  const connectoUser = localStorage.getItem("connecto_user");
  if (connectoUser) {
    const parsed = safeParseJson(connectoUser);
    if (parsed?.email) {
      return parsed.email;
    }
  }

  const user = localStorage.getItem("user");
  if (user) {
    const parsed = safeParseJson(user);
    if (parsed?.email) {
      return parsed.email;
    }
  }

  return null;
};

export function VendedorDigitalPanel({
  onBack,
  onTrain,
}: VendedorDigitalPanelProps) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [quickRange, setQuickRange] = useState<QuickRange>("today");
  const [dateFrom, setDateFrom] = useState<string>(getTodayIsoDate());
  const [dateTo, setDateTo] = useState<string>(getTodayIsoDate());
  const [channel, setChannel] = useState<Channel>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("operativo");
  const [email, setEmail] = useState<string | null>(() =>
    typeof window === "undefined" ? null : getEmailFromLocalStorage(),
  );
  const abortRef = useRef<AbortController | null>(null);
  const isFirstFilterRender = useRef(true);

  const handleTrainClick = useCallback(() => {
    onTrain?.();
  }, [onTrain]);

  const filters = useMemo<Filters>(
    () => ({
      quickRange,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      channel,
      viewMode,
    }),
    [channel, dateFrom, dateTo, quickRange, viewMode],
  );

  const sendWebhook = useCallback(
    async (reason: WebhookRequest["reason"]) => {
      if (!email) {
        setEmailError(
          "No se encontró el email de sesión. Inicia sesión de nuevo.",
        );
        setLoading(false);
        return;
      }

      setEmailError(null);
      setError(null);
      setLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const payload: WebhookRequest = {
        event: "vendedor_digital_dashboard_loaded",
        reason,
        email,
        filters,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payloadResponse = (await response.json()) as Payload;
        if (!controller.signal.aborted) {
          setData(payloadResponse);
        }
      } catch (fetchError) {
        if ((fetchError as DOMException).name === "AbortError") {
          return;
        }
        setError("No se pudo cargar el panel");
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [email, filters],
  );

  useEffect(() => {
    if (!email) {
      setEmailError(
        "No se encontró el email de sesión. Inicia sesión de nuevo.",
      );
      setLoading(false);
      return;
    }

    sendWebhook("view_loaded");

    return () => {
      abortRef.current?.abort();
    };
  }, [email, sendWebhook]);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      sendWebhook("filter_change");
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [filters, sendWebhook]);

  const statusLabel = data?.agent?.status || "Operando";
  const availabilityLabel = data?.agent?.availability || "24/7";
  const kpis = data?.kpis ?? {};
  const funnel = data?.funnel ?? {};
  const tables = data?.tables ?? {};
  const analysis = data?.analysis ?? {};

  const renderValue = (value?: string) => {
    if (loading && !data) {
      return (
        <span className="inline-block h-7 w-24 rounded-md bg-accent animate-pulse" />
      );
    }
    return <span className="text-2xl font-semibold">{value ?? "—"}</span>;
  };

  const renderCellValue = (value?: string) => {
    if (loading && !data) {
      return (
        <span className="inline-block h-4 w-20 rounded-md bg-accent animate-pulse" />
      );
    }
    return value ?? "—";
  };

  const renderTableRows = (
    rows: Array<JSX.Element>,
    columns: number,
    emptyLabel: string,
  ) => {
    if (loading && !data) {
      return (
        <TableRow>
          <TableCell colSpan={columns} className="text-muted-foreground">
            Cargando…
          </TableCell>
        </TableRow>
      );
    }

    if (!rows.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns} className="text-muted-foreground">
            {emptyLabel}
          </TableCell>
        </TableRow>
      );
    }

    return rows;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Panel del vendedor digital
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              Vendedor digital
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Ventas y operación
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold",
                statusStyles[statusLabel] ?? statusStyles.Operando,
              )}
            >
              {statusLabel}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700"
            >
              Disponibilidad: {availabilityLabel}
            </Badge>
            {data?.meta?.corte && (
              <span className="text-xs font-medium text-muted-foreground">
                Actualizado: {data.meta.corte}
              </span>
            )}
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
                ? "No se pudo cargar el panel"
                : "Datos listos"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="gap-2"
            onClick={handleTrainClick}
            disabled={!!emailError}
          >
            <Brain className="h-4 w-4" />
            Entrenar agente
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => sendWebhook("manual_refresh")}
            disabled={loading || !!emailError}
          >
            <RefreshCcw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </header>

      {emailError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {emailError}
        </div>
      )}

      {error && !emailError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>No se pudo cargar el panel.</span>
          <Button
            size="sm"
            variant="outline"
            className="border-rose-200 text-rose-700"
            onClick={() => sendWebhook("manual_refresh")}
          >
            Reintentar
          </Button>
        </div>
      )}

      <Card className="border-muted/80">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Filtros
              </p>
              <p className="text-sm text-muted-foreground">
                Selecciona rango para analizar desempeño.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickRanges.map((range) => (
                <Button
                  key={range.value}
                  size="sm"
                  variant={quickRange === range.value ? "default" : "outline"}
                  className={cn(
                    "rounded-full",
                    quickRange === range.value
                      ? "bg-primary text-primary-foreground"
                      : "border-muted/80",
                  )}
                  onClick={() => setQuickRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Desde</p>
              <Input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Hasta</p>
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Canal</p>
              <Select value={channel} onValueChange={(value) => setChannel(value as Channel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  {channelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Vista</p>
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <SelectTrigger>
                  <SelectValue placeholder="Vista" />
                </SelectTrigger>
                <SelectContent>
                  {viewModes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card className="border-muted/80">
              <CardContent className="space-y-2 pt-6">
                <p className="text-xs text-muted-foreground">Ventas cobradas</p>
                {renderValue(kpis.ventasCobradas)}
                <p className="text-xs text-muted-foreground">
                  Dinero confirmado en el periodo.
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted/80">
              <CardContent className="space-y-2 pt-6">
                <p className="text-xs text-muted-foreground">Ventas cerradas</p>
                {renderValue(kpis.ventasCerradas)}
                <p className="text-xs text-muted-foreground">
                  Cierres logrados en el periodo.
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted/80">
              <CardContent className="space-y-2 pt-6">
                <p className="text-xs text-muted-foreground">Ticket promedio</p>
                {renderValue(kpis.ticketPromedio)}
                <p className="text-xs text-muted-foreground">
                  Promedio por venta cerrada.
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted/80">
              <CardContent className="space-y-2 pt-6">
                <p className="text-xs text-muted-foreground">Conversaciones</p>
                {renderValue(kpis.conversaciones)}
                <p className="text-xs text-muted-foreground">
                  Volumen total atendido.
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted/80">
              <CardContent className="space-y-2 pt-6">
                <p className="text-xs text-muted-foreground">Abandonadas</p>
                {renderValue(kpis.abandonadas)}
                <p className="text-xs text-muted-foreground">
                  Sin siguiente paso definido.
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted/80">
              <CardContent className="space-y-2 pt-6">
                <p className="text-xs text-muted-foreground">Tiempo ahorrado</p>
                {renderValue(kpis.tiempoAhorrado)}
                <p className="text-xs text-muted-foreground">
                  Equivalente de persona (estimado).
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-muted/80">
            <CardContent className="space-y-4 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Embudo de conversión
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <div
                  className={cn(
                    "rounded-xl border bg-muted/30 p-3",
                    funnel.tones?.conversaciones &&
                      toneStyles[funnel.tones.conversaciones],
                  )}
                >
                  <p className="text-xs text-muted-foreground">Conversaciones</p>
                  <p className="mt-2 text-lg font-semibold">
                    {renderCellValue(funnel.conversaciones)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Entrada total
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl border bg-muted/30 p-3",
                    funnel.tones?.leads && toneStyles[funnel.tones.leads],
                  )}
                >
                  <p className="text-xs text-muted-foreground">Leads calificados</p>
                  <p className="mt-2 text-lg font-semibold">
                    {renderCellValue(funnel.leadsCalificados)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {funnel.leadsHelp || "—"}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl border bg-muted/30 p-3",
                    funnel.tones?.cotizaciones &&
                      toneStyles[funnel.tones.cotizaciones],
                  )}
                >
                  <p className="text-xs text-muted-foreground">
                    Cotizaciones generadas
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {renderCellValue(funnel.cotizacionesGeneradas)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {funnel.cotizacionesHelp || "—"}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl border bg-muted/30 p-3",
                    funnel.tones?.ventas && toneStyles[funnel.tones.ventas],
                  )}
                >
                  <p className="text-xs text-muted-foreground">Ventas cobradas</p>
                  <p className="mt-2 text-lg font-semibold">
                    {renderCellValue(funnel.ventasCobradasCount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {funnel.ventasHelp || "—"}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl border bg-muted/30 p-3",
                    funnel.tones?.conversion &&
                      toneStyles[funnel.tones.conversion],
                  )}
                >
                  <p className="text-xs text-muted-foreground">Conversión</p>
                  <p className="mt-2 text-lg font-semibold">
                    {renderCellValue(funnel.conversionPct)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Conversación → cobro
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-muted/80">
              <CardContent className="space-y-3 pt-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Conversaciones por hora
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Picos para ajustar mensajes.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Conversaciones</TableHead>
                      <TableHead>Abandonadas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderTableRows(
                      (tables.porHora ?? []).map((row, index) => (
                        <TableRow key={`${row.hora ?? "hora"}-${index}`}>
                          <TableCell>{row.hora ?? "—"}</TableCell>
                          <TableCell>{row.conversaciones ?? "—"}</TableCell>
                          <TableCell>{row.abandonadas ?? "—"}</TableCell>
                        </TableRow>
                      )),
                      3,
                      "Sin datos",
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-muted/80">
              <CardContent className="space-y-3 pt-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Abandonadas (recuperables)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lista para seguimiento.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderTableRows(
                      (tables.abandonadas ?? []).map((row, index) => (
                        <TableRow key={`${row.cliente ?? "cliente"}-${index}`}>
                          <TableCell>{row.cliente ?? "—"}</TableCell>
                          <TableCell>{row.motivo ?? "—"}</TableCell>
                          <TableCell>{row.valor ?? "—"}</TableCell>
                        </TableRow>
                      )),
                      3,
                      "Sin datos",
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="border-muted/80">
            <CardContent className="space-y-3 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Últimas cotizaciones
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRows(
                    (tables.cotizaciones ?? []).map((row, index) => (
                      <TableRow key={`${row.id ?? "cot"}-${index}`}>
                        <TableCell className="font-medium">
                          {row.id ?? "—"}
                        </TableCell>
                        <TableCell>{row.cliente ?? "—"}</TableCell>
                        <TableCell>
                          {row.estado ? (
                            <Badge
                              variant="outline"
                              className="border-blue-200 bg-blue-50 text-blue-700"
                            >
                              {row.estado}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{row.monto ?? "—"}</TableCell>
                        <TableCell>{row.nota ?? "—"}</TableCell>
                      </TableRow>
                    )),
                    5,
                    "Sin datos",
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-muted/80">
            <CardContent className="space-y-3 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Ventas cobradas recientes
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRows(
                    (tables.ventas ?? []).map((row, index) => (
                      <TableRow key={`${row.id ?? "venta"}-${index}`}>
                        <TableCell className="font-medium">
                          {row.id ?? "—"}
                        </TableCell>
                        <TableCell>{row.cliente ?? "—"}</TableCell>
                        <TableCell>{row.metodo ?? "—"}</TableCell>
                        <TableCell>{row.monto ?? "—"}</TableCell>
                        <TableCell>{row.fecha ?? "—"}</TableCell>
                      </TableRow>
                    )),
                    5,
                    "Sin datos",
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="border-muted/80 bg-muted/20">
          <CardContent className="space-y-4 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Análisis general
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {loading && !data ? (
                  <span className="inline-block h-4 w-3/4 rounded-md bg-accent animate-pulse" />
                ) : (
                  analysis.summary || "—"
                )}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {loading && !data ? (
                <li>
                  <span className="inline-block h-4 w-2/3 rounded-md bg-accent animate-pulse" />
                </li>
              ) : (analysis.bullets ?? []).length ? (
                analysis.bullets?.map((bullet, index) => (
                  <li key={`${bullet}-${index}`}>• {bullet}</li>
                ))
              ) : (
                <li>—</li>
              )}
            </ul>
            <div className="space-y-3">
              {(analysis.callouts ?? []).length
                ? analysis.callouts?.map((callout, index) => (
                    <Card key={`${callout.title ?? "call"}-${index}`}>
                      <CardContent className="space-y-2 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {callout.title ?? "Alerta"}
                        </p>
                        <p className="text-sm text-foreground">
                          {callout.message ?? "—"}
                        </p>
                        <Badge variant="outline" className="w-fit">
                          {callout.tag ?? "—"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                : !loading && (
                    <Card>
                      <CardContent className="space-y-2 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Sin análisis
                        </p>
                        <p className="text-sm text-foreground">—</p>
                        <Badge variant="outline" className="w-fit">
                          —
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleTrainClick}
            >
              <Brain className="h-4 w-4" />
              Entrenar agente
            </Button>
            <p className="text-xs text-muted-foreground">
              Te llevará al módulo de entrenamiento (próximamente).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
