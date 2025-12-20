import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

const WEBHOOK_URL =
  "https://hook.us2.make.com/uhv5dk35fwk8pmza4hd4wwamhmk7cryb";

const AGENT_ID = "vendedor-digital";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

type Category = "faq" | "brand" | "items" | "escalation" | "promos";

type WebhookPrefillPayload = {
  event: "training_prefill";
  email: string;
  agentId: string;
};

type WebhookSavePayload = {
  event: "training_save";
  email: string;
  agentId: string;
  text: TrainingText;
  guided: GuidedFields;
};

type WebhookChatPayload = {
  event: "training_chat";
  email: string;
  agentId: string;
  message: string;
};

type WebhookDownloadPayload = {
  event: "training_download_file";
  email: string;
  agentId: string;
  category: Category;
};

type TrainingFile = {
  name: string;
  mime: string;
  sizeBytes: number;
  uploadedAt?: string;
};

type TrainingText = {
  faq: string;
  brand: string;
  items: string;
  escalationRules: string;
  promos: string;
  instructionsPrompt: string;
};

type GuidedFields = {
  tone: string;
  mainObjective: string;
  primaryCta: string;
  oneCtaPerMsg: boolean;
  maxOptionsPerMsg: number;
  humanHours: string;
  humanHoursDetail: string;
  escalationTriggers: string[];
};

type PrefillResponse = {
  ok?: boolean;
  meta?: { corte?: string };
  agent?: { status?: string; availability?: string };
  files?: Partial<Record<Category, TrainingFile | null>>;
  text?: Partial<TrainingText>;
  guided?: Partial<GuidedFields>;
  chatHistory?: ChatMessage[];
};

type ChatMessage = {
  role: "user" | "agent";
  text: string;
  at?: string;
};

interface VendedorDigitalTrainingPageProps {
  onBackToPanel?: () => void;
}

type DebugInfo = {
  payload: unknown;
  status: number | null;
  response: unknown;
};

const fileCategories: {
  key: Category;
  label: string;
  description: string;
}[] = [
  {
    key: "faq",
    label: "Preguntas frecuentes",
    description: "Respuestas rápidas para las dudas más comunes.",
  },
  {
    key: "brand",
    label: "Datos de la marca",
    description: "Historia, tono y lineamientos clave de marca.",
  },
  {
    key: "items",
    label: "Lista de artículos",
    description: "Catálogo con precios, SKUs y descripciones.",
  },
  {
    key: "escalation",
    label: "Reglas de escalamiento",
    description: "Cuándo y cómo pasar a un humano.",
  },
  {
    key: "promos",
    label: "Promociones activas",
    description: "Ofertas vigentes y restricciones principales.",
  },
];

const toneOptions = [
  "Directo y ejecutivo",
  "Cálido y consultivo",
  "Experto técnico",
  "Cercano y empático",
];

const availabilityOptions = ["24/7", "Horario"];

const defaultText: TrainingText = {
  faq: "",
  brand: "",
  items: "",
  escalationRules: "",
  promos: "",
  instructionsPrompt: "",
};

const defaultGuided: GuidedFields = {
  tone: "Directo y ejecutivo",
  mainObjective: "",
  primaryCta: "",
  oneCtaPerMsg: true,
  maxOptionsPerMsg: 2,
  humanHours: "24/7",
  humanHoursDetail: "",
  escalationTriggers: [],
};

const createCategoryRecord = <T,>(value: T) =>
  fileCategories.reduce((acc, item) => {
    acc[item.key] = value;
    return acc;
  }, {} as Record<Category, T>);

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const getEscalationTriggersValue = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const decodeBase64ToBlob = (base64: string, mime: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

export function VendedorDigitalTrainingPage({
  onBackToPanel,
}: VendedorDigitalTrainingPageProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [missingEmail, setMissingEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<PrefillResponse | null>(null);
  const [files, setFiles] = useState<Record<Category, TrainingFile | null>>(
    createCategoryRecord<TrainingFile | null>(null),
  );
  const [text, setText] = useState<TrainingText>(defaultText);
  const [guided, setGuided] = useState<GuidedFields>(defaultGuided);
  const [selectedFiles, setSelectedFiles] = useState<
    Record<Category, File | null>
  >(createCategoryRecord<File | null>(null));
  const [fileUploading, setFileUploading] = useState<
    Record<Category, boolean>
  >(createCategoryRecord<boolean>(false));
  const [fileDownloading, setFileDownloading] = useState<
    Record<Category, boolean>
  >(createCategoryRecord<boolean>(false));
  const [saving, setSaving] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    payload: null,
    status: null,
    response: null,
  });

  const sentRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const isDev = import.meta.env.DEV;

  const trimmedChatHistory = useMemo(
    () => chatHistory.slice(-25),
    [chatHistory],
  );

  const updateDebug = useCallback(
    (payload: unknown, status: number | null, response: unknown) => {
      setDebugInfo({ payload, status, response });
    },
    [],
  );

  const sendPrefill = useCallback(async () => {
    if (sentRef.current) return;
    sentRef.current = true;

    abortRef.current?.abort();

    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);

    if (!storedEmail) {
      setMissingEmail(true);
      setLoading(false);
      setError("No se encontró el email de sesión. Inicia sesión de nuevo.");
      return;
    }

    const payload: WebhookPrefillPayload = {
      event: "training_prefill",
      email: storedEmail,
      agentId: AGENT_ID,
    };

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") ?? "";
      let data: PrefillResponse | null = null;

      if (contentType.includes("application/json")) {
        data = (await response.json()) as PrefillResponse;
      }

      updateDebug(payload, response.status, data);

      if (!response.ok) {
        throw new Error("No se pudo precargar el entrenamiento");
      }

      const nextData = data ?? {};
      setPrefill(nextData);

      const nextFiles = createCategoryRecord<TrainingFile | null>(null);
      fileCategories.forEach(({ key }) => {
        nextFiles[key] = nextData.files?.[key] ?? null;
      });
      setFiles(nextFiles);

      setText({ ...defaultText, ...nextData.text });
      setGuided({
        ...defaultGuided,
        ...nextData.guided,
        escalationTriggers: nextData.guided?.escalationTriggers ?? [],
      });
      setChatHistory(nextData.chatHistory ?? []);
      setLoading(false);
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo precargar el entrenamiento",
      );
      setLoading(false);
    }
  }, [updateDebug]);

  useEffect(() => {
    sendPrefill();

    return () => {
      abortRef.current?.abort();
    };
  }, [sendPrefill]);

  const handleFileSelection = (category: Category, file?: File | null) => {
    if (!file) {
      setSelectedFiles((prev) => ({ ...prev, [category]: null }));
      return;
    }

    if (!allowedMimeTypes.includes(file.type)) {
      window.alert("Tipo de archivo no permitido.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      window.alert("El archivo supera los 10 MB recomendados.");
      return;
    }

    setSelectedFiles((prev) => ({ ...prev, [category]: file }));
  };

  const handleUpload = async (category: Category) => {
    const file = selectedFiles[category];
    if (!file || !email) return;

    if (files[category]) {
      const confirmed = window.confirm(
        "Ya existe un archivo cargado. ¿Deseas reemplazarlo?",
      );
      if (!confirmed) return;
    }

    const formData = new FormData();
    formData.append("event", "training_upload_file");
    formData.append("email", email);
    formData.append("agentId", AGENT_ID);
    formData.append("category", category);
    formData.append("file", file);

    setFileUploading((prev) => ({ ...prev, [category]: true }));

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        ok?: boolean;
        file?: TrainingFile;
      };
      updateDebug(
        { event: "training_upload_file", category, email },
        response.status,
        data,
      );

      if (!response.ok || !data.ok || !data.file) {
        throw new Error("No se pudo subir el archivo");
      }

      setFiles((prev) => ({ ...prev, [category]: data.file ?? null }));
      setSelectedFiles((prev) => ({ ...prev, [category]: null }));
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "No se pudo subir el archivo",
      );
    } finally {
      setFileUploading((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleDownload = async (category: Category) => {
    if (!email) return;

    setFileDownloading((prev) => ({ ...prev, [category]: true }));

    const payload: WebhookDownloadPayload = {
      event: "training_download_file",
      email,
      agentId: AGENT_ID,
      category,
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const data = (await response.json()) as {
          ok?: boolean;
          file?: { name?: string; mime?: string; base64?: string };
        };
        updateDebug(payload, response.status, data);

        if (!response.ok || !data.ok || !data.file?.base64) {
          throw new Error("No se pudo descargar el archivo");
        }

        const blob = decodeBase64ToBlob(
          data.file.base64,
          data.file.mime ?? "application/octet-stream",
        );
        const fileName =
          data.file.name || files[category]?.name || `${category}.bin`;
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
        URL.revokeObjectURL(url);
        return;
      }

      const blob = await response.blob();
      updateDebug(payload, response.status, { binary: true });

      if (!response.ok) {
        throw new Error("No se pudo descargar el archivo");
      }

      const fileName = files[category]?.name || `${category}.bin`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "No se pudo descargar el archivo",
      );
    } finally {
      setFileDownloading((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleSave = async () => {
    if (!email) return;

    if (prefill) {
      const confirmed = window.confirm(
        "Esto sobrescribirá el entrenamiento actual. ¿Deseas continuar?",
      );
      if (!confirmed) return;
    }

    const payload: WebhookSavePayload = {
      event: "training_save",
      email,
      agentId: AGENT_ID,
      text,
      guided,
    };

    setSaving(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };
      updateDebug(payload, response.status, data);

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se pudo guardar");
      }

      window.alert(data.message ?? "Entrenamiento guardado");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleChatSend = async () => {
    if (!email || !chatInput.trim()) return;

    const payload: WebhookChatPayload = {
      event: "training_chat",
      email,
      agentId: AGENT_ID,
      message: chatInput.trim(),
    };

    setChatLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        reply?: string;
        chatHistory?: ChatMessage[];
      };
      updateDebug(payload, response.status, data);

      if (!response.ok || !data.ok) {
        throw new Error("No se pudo enviar el mensaje");
      }

      if (data.chatHistory) {
        setChatHistory(data.chatHistory);
      } else if (data.reply) {
        setChatHistory((prev) => [
          ...prev,
          { role: "user", text: payload.message },
          { role: "agent", text: data.reply },
        ]);
      }

      setChatInput("");
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "No se pudo enviar el mensaje",
      );
    } finally {
      setChatLoading(false);
    }
  };

  const statusLabel = prefill?.agent?.status ?? "En configuración";
  const availabilityLabel = prefill?.agent?.availability ?? "—";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Empleados Digitales</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Vendedor digital</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Entrenamiento</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Entrenar al agente
            </h1>
            <p className="text-sm text-muted-foreground">
              Carga archivos, define reglas y prueba las respuestas del agente.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBackToPanel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel
          </Button>
          <Button onClick={handleSave} disabled={saving || missingEmail}>
            Guardar entrenamiento
          </Button>
        </div>
      </header>

      {missingEmail && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="py-6 text-sm text-rose-700">
            No se encontró el email de sesión. Inicia sesión de nuevo.
          </CardContent>
        </Card>
      )}

      {!missingEmail && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Archivos de entrenamiento</CardTitle>
                <CardDescription>
                  Un archivo por categoría. PDF, Word o TXT (máx 10 MB).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fileCategories.map((category) => {
                  const fileInfo = files[category.key];
                  const isUploading = fileUploading[category.key];
                  const isDownloading = fileDownloading[category.key];

                  return (
                    <div
                      key={category.key}
                      className="rounded-lg border border-muted/60 p-4"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {category.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">
                              {fileInfo ? "Cargado" : "Sin archivo"}
                            </Badge>
                            {fileInfo?.name && (
                              <span>{fileInfo.name}</span>
                            )}
                            {fileInfo?.sizeBytes && (
                              <span>{formatFileSize(fileInfo.sizeBytes)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Input
                            type="file"
                            accept={allowedMimeTypes.join(",")}
                            onChange={(event) =>
                              handleFileSelection(
                                category.key,
                                event.target.files?.[0],
                              )
                            }
                            className="max-w-[220px]"
                            disabled={isUploading || isDownloading}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleUpload(category.key)}
                            disabled={
                              isUploading ||
                              !selectedFiles[category.key] ||
                              loading
                            }
                          >
                            <Upload className="h-4 w-4" />
                            {isUploading ? "Subiendo" : "Subir"}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-2"
                            onClick={() => handleDownload(category.key)}
                            disabled={!fileInfo || isDownloading || loading}
                          >
                            <Download className="h-4 w-4" />
                            {isDownloading ? "Descargando" : "Descargar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Texto y reglas operativas</CardTitle>
                <CardDescription>
                  Ajusta la información que usará el agente en producción.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>FAQ</Label>
                    <Textarea
                      value={text.faq}
                      onChange={(event) =>
                        setText((prev) => ({
                          ...prev,
                          faq: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Datos de la marca</Label>
                    <Textarea
                      value={text.brand}
                      onChange={(event) =>
                        setText((prev) => ({
                          ...prev,
                          brand: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lista de artículos</Label>
                    <Textarea
                      value={text.items}
                      onChange={(event) =>
                        setText((prev) => ({
                          ...prev,
                          items: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reglas de escalamiento</Label>
                    <Textarea
                      value={text.escalationRules}
                      onChange={(event) =>
                        setText((prev) => ({
                          ...prev,
                          escalationRules: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Promociones</Label>
                    <Textarea
                      value={text.promos}
                      onChange={(event) =>
                        setText((prev) => ({
                          ...prev,
                          promos: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instrucciones generales</Label>
                    <Textarea
                      value={text.instructionsPrompt}
                      onChange={(event) =>
                        setText((prev) => ({
                          ...prev,
                          instructionsPrompt: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">
                    Campos guiados
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tono del agente</Label>
                      <Select
                        value={guided.tone}
                        onValueChange={(value) =>
                          setGuided((prev) => ({ ...prev, tone: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tono" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Objetivo principal</Label>
                      <Input
                        value={guided.mainObjective}
                        onChange={(event) =>
                          setGuided((prev) => ({
                            ...prev,
                            mainObjective: event.target.value,
                          }))
                        }
                        placeholder="Ej: Convertir leads en cotizaciones"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA principal</Label>
                      <Input
                        value={guided.primaryCta}
                        onChange={(event) =>
                          setGuided((prev) => ({
                            ...prev,
                            primaryCta: event.target.value,
                          }))
                        }
                        placeholder="Ej: Agendar llamada con ventas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máximo de opciones por mensaje</Label>
                      <Input
                        type="number"
                        min={1}
                        value={guided.maxOptionsPerMsg}
                        onChange={(event) =>
                          setGuided((prev) => ({
                            ...prev,
                            maxOptionsPerMsg: Number(event.target.value || 0),
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Un CTA por mensaje
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mantén las respuestas enfocadas.
                        </p>
                      </div>
                      <Switch
                        checked={guided.oneCtaPerMsg}
                        onCheckedChange={(checked) =>
                          setGuided((prev) => ({
                            ...prev,
                            oneCtaPerMsg: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horario humano</Label>
                      <Select
                        value={guided.humanHours}
                        onValueChange={(value) =>
                          setGuided((prev) => ({
                            ...prev,
                            humanHours: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {availabilityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Detalle del horario humano</Label>
                      <Input
                        value={guided.humanHoursDetail}
                        onChange={(event) =>
                          setGuided((prev) => ({
                            ...prev,
                            humanHoursDetail: event.target.value,
                          }))
                        }
                        placeholder="Ej: Lun-Vie 9:00-18:00"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Disparadores de escalamiento</Label>
                      <Textarea
                        value={guided.escalationTriggers.join("\n")}
                        onChange={(event) =>
                          setGuided((prev) => ({
                            ...prev,
                            escalationTriggers: getEscalationTriggersValue(
                              event.target.value,
                            ),
                          }))
                        }
                        rows={3}
                        placeholder="Una regla por línea"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Guardar entrenamiento
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Guarda los textos y reglas actuales.
                  </p>
                </div>
                <Button onClick={handleSave} disabled={saving || loading}>
                  {saving ? "Guardando..." : "Guardar entrenamiento"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado operativo</CardTitle>
                <CardDescription>
                  Último corte recibido del webhook.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Estado: {statusLabel}</Badge>
                  <Badge variant="secondary">
                    Disponibilidad: {availabilityLabel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Corte: {prefill?.meta?.corte ?? "—"}
                </p>
                {loading && (
                  <p className="text-xs text-muted-foreground">Cargando…</p>
                )}
                {error && (
                  <p className="text-xs text-rose-600">{error}</p>
                )}
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Chat de prueba</CardTitle>
                <CardDescription>
                  Simula conversaciones para validar respuestas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[360px] rounded-md border border-muted/60 p-3">
                  {trimmedChatHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Aún no hay mensajes.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {trimmedChatHistory.map((message, index) => (
                        <div
                          key={`${message.at ?? index}-${message.role}`}
                          className={
                            message.role === "agent"
                              ? "rounded-lg bg-slate-50 px-3 py-2 text-sm"
                              : "rounded-lg bg-emerald-50 px-3 py-2 text-sm"
                          }
                        >
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            {message.role === "agent" ? "Agente" : "Usuario"}
                          </p>
                          <p className="text-sm text-foreground">
                            {message.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    rows={3}
                    placeholder="Escribe un mensaje para probar al agente"
                  />
                  <Button
                    onClick={handleChatSend}
                    disabled={chatLoading || !chatInput.trim()}
                  >
                    {chatLoading ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {isDev && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug</CardTitle>
            <CardDescription>
              Datos enviados y respuesta del webhook en desarrollo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Email:</span>{" "}
              {email ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-foreground">Payload:</span>{" "}
              {debugInfo.payload ? JSON.stringify(debugInfo.payload) : "—"}
            </p>
            <p>
              <span className="font-semibold text-foreground">Status:</span>{" "}
              {debugInfo.status ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-foreground">Respuesta:</span>{" "}
              {debugInfo.response ? JSON.stringify(debugInfo.response) : "—"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
