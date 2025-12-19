import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Download,
  Loader2,
  MessageCircle,
  Save,
  Upload,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

const WEBHOOK_URL =
  "https://hook.us2.make.com/uhv5dk35fwk8pmza4hd4wwamhmk7cryb";
const AGENT_ID = "vendedor-digital";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

type TrainingCategory =
  | "faq"
  | "brand"
  | "items"
  | "escalation"
  | "promos";

type FileMeta = {
  name: string;
  mime?: string;
  sizeBytes?: number;
  uploadedAt?: string;
};

type ChatMessage = {
  role: "user" | "agent";
  text: string;
  at?: string;
};

type PrefillResponse = {
  text?: {
    faq?: string;
    brand?: string;
    items?: string;
    escalationRules?: string;
    promos?: string;
    instructionsPrompt?: string;
  };
  guided?: {
    tone?: string;
    mainObjective?: string;
    primaryCta?: string;
    oneCtaPerMsg?: boolean;
    maxOptionsPerMsg?: number;
    humanHours?: string;
    humanHoursDetail?: string;
    escalationTriggers?: string[];
  };
  files?: Partial<Record<TrainingCategory, FileMeta | null>>;
  chatHistory?: ChatMessage[];
};

const categories: {
  key: TrainingCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "faq",
    label: "Preguntas frecuentes",
    description: "Respuestas rápidas para dudas comunes.",
  },
  {
    key: "brand",
    label: "Datos de la marca",
    description: "Promesa, tono y lineamientos clave.",
  },
  {
    key: "items",
    label: "Artículos con precios",
    description: "Catálogo actualizado con precios y descripciones.",
  },
  {
    key: "escalation",
    label: "Reglas de escalamiento",
    description: "Criterios para pasar a humano.",
  },
  {
    key: "promos",
    label: "Promociones activas",
    description: "Ofertas vigentes y restricciones.",
  },
];

const formatBytes = (value?: number) => {
  if (!value) return "—";
  const kb = value / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const base64ToBlob = (base64: string, mime: string) => {
  const bytes = Uint8Array.from(atob(base64), (char) =>
    char.charCodeAt(0),
  );
  return new Blob([bytes], { type: mime });
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

const getFileExtension = (filename: string) =>
  filename.split(".").pop()?.toLowerCase() ?? "";

const isAllowedFile = (file: File) => {
  if (ALLOWED_MIME_TYPES.includes(file.type)) {
    return true;
  }
  const extension = getFileExtension(file.name);
  return ["pdf", "doc", "docx", "txt"].includes(extension);
};

interface VendedorDigitalTrainingPageProps {
  onBackToPanel?: () => void;
  onBackToEmployees?: () => void;
}

type ConfirmAction =
  | { type: "upload"; category: TrainingCategory }
  | { type: "save" }
  | null;

export function VendedorDigitalTrainingPage({
  onBackToEmployees,
  onBackToPanel,
}: VendedorDigitalTrainingPageProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [files, setFiles] = useState<
    Record<TrainingCategory, FileMeta | null>
  >({
    faq: null,
    brand: null,
    items: null,
    escalation: null,
    promos: null,
  });
  const [textFields, setTextFields] = useState({
    faq: "",
    brand: "",
    items: "",
    escalationRules: "",
    promos: "",
    instructionsPrompt: "",
  });
  const [guidedFields, setGuidedFields] = useState({
    tone: "Directo y ejecutivo",
    mainObjective: "",
    primaryCta: "",
    oneCtaPerMsg: true,
    maxOptionsPerMsg: 2,
    humanHours: "24/7",
    humanHoursDetail: "",
    escalationTriggers: "",
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploading, setUploading] = useState<
    Partial<Record<TrainingCategory, boolean>>
  >({});
  const [downloadLoading, setDownloadLoading] = useState<
    Partial<Record<TrainingCategory, boolean>>
  >({});
  const [selectedFiles, setSelectedFiles] = useState<
    Partial<Record<TrainingCategory, File | null>>
  >({});
  const [activeTab, setActiveTab] = useState("archivos");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(
    null,
  );

  const prefillControllerRef = useRef<AbortController | null>(
    null,
  );
  const chatControllerRef = useRef<AbortController | null>(null);
  const sentRef = useRef(false);

  const hasExistingTraining = useMemo(() => {
    const hasFiles = Object.values(files).some((file) => !!file);
    const hasText = Object.values(textFields).some((value) =>
      value.trim(),
    );
    const hasGuided =
      guidedFields.mainObjective.trim() ||
      guidedFields.primaryCta.trim() ||
      guidedFields.escalationTriggers.trim();
    const hasChat = chatHistory.length > 0;
    return Boolean(hasFiles || hasText || hasGuided || hasChat);
  }, [chatHistory.length, files, guidedFields, textFields]);

  const handlePrefill = useCallback(
    async (overrideEmail?: string) => {
      const activeEmail = overrideEmail ?? email;
      if (!activeEmail) {
      setPrefillError(
        "No se encontró el email de sesión. Inicia sesión de nuevo.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setPrefillError(null);

    prefillControllerRef.current?.abort();
    const controller = new AbortController();
    prefillControllerRef.current = controller;

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "training_prefill",
          email: activeEmail,
          agentId: AGENT_ID,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") ?? "";
      const data: PrefillResponse | null = contentType.includes(
        "application/json",
      )
        ? ((await response.json()) as PrefillResponse)
        : null;

      if (!response.ok) {
        throw new Error("Error del webhook");
      }

      if (data) {
        setFiles((prev) => ({
          ...prev,
          ...data.files,
        }));
        setTextFields({
          faq: data.text?.faq ?? "",
          brand: data.text?.brand ?? "",
          items: data.text?.items ?? "",
          escalationRules: data.text?.escalationRules ?? "",
          promos: data.text?.promos ?? "",
          instructionsPrompt: data.text?.instructionsPrompt ?? "",
        });
        setGuidedFields((prev) => ({
          ...prev,
          tone: data.guided?.tone ?? prev.tone,
          mainObjective: data.guided?.mainObjective ?? "",
          primaryCta: data.guided?.primaryCta ?? "",
          oneCtaPerMsg:
            data.guided?.oneCtaPerMsg ?? prev.oneCtaPerMsg,
          maxOptionsPerMsg: data.guided?.maxOptionsPerMsg ?? 2,
          humanHours: data.guided?.humanHours ?? prev.humanHours,
          humanHoursDetail: data.guided?.humanHoursDetail ?? "",
          escalationTriggers: (
            data.guided?.escalationTriggers ?? []
          ).join("\n"),
        }));
        setChatHistory((data.chatHistory ?? []).slice(-25));
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setPrefillError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar",
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  },
    [email],
  );

  const handleUpload = useCallback(
    async (category: TrainingCategory) => {
      const file = selectedFiles[category];
      if (!email || !file) {
        toast.error("Selecciona un archivo válido.");
        return;
      }

      if (!isAllowedFile(file)) {
        toast.error("Formato no permitido. Usa PDF, Word o TXT.");
        return;
      }

      if (file.size > MAX_FILE_BYTES) {
        toast.error("Archivo demasiado grande. Máximo 10 MB.");
        return;
      }

      setUploading((prev) => ({ ...prev, [category]: true }));

      try {
        const formData = new FormData();
        formData.append("event", "training_upload_file");
        formData.append("email", email);
        formData.append("agentId", AGENT_ID);
        formData.append("category", category);
        formData.append("timestamp", new Date().toISOString());
        formData.append("file", file, file.name);

        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type") ?? "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            (data as { message?: string } | null)?.message ||
              "Error del webhook",
          );
        }

        toast.success("Archivo cargado");
        setSelectedFiles((prev) => ({ ...prev, [category]: null }));
        await handlePrefill();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al subir",
        );
      } finally {
        setUploading((prev) => ({ ...prev, [category]: false }));
      }
    },
    [email, handlePrefill, selectedFiles],
  );

  const handleDownload = useCallback(
    async (category: TrainingCategory) => {
      if (!email) return;
      setDownloadLoading((prev) => ({ ...prev, [category]: true }));

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "training_download_file",
            email,
            agentId: AGENT_ID,
            category,
            timestamp: new Date().toISOString(),
          }),
        });

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = (await response.json()) as {
            file?: { name: string; mime: string; base64: string };
            message?: string;
          };

          if (!response.ok) {
            throw new Error(data.message || "Error del webhook");
          }

          if (!data.file?.base64) {
            throw new Error("Respuesta inválida del webhook");
          }

          const blob = base64ToBlob(
            data.file.base64,
            data.file.mime,
          );
          triggerDownload(blob, data.file.name);
          toast.success("Descarga iniciada");
          return;
        }

        if (!response.ok) {
          throw new Error("Error del webhook");
        }

        const blob = await response.blob();
        const fileName =
          response
            .headers.get("content-disposition")
            ?.match(/filename\*?=(?:UTF-8''|\")?([^";]+)/i)?.[1]
            ?.replace(/\"/g, "") ||
          `${category}.${files[category]?.name?.split(".").pop() || "file"}`;
        triggerDownload(blob, decodeURIComponent(fileName));
        toast.success("Descarga iniciada");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al descargar",
        );
      } finally {
        setDownloadLoading((prev) => ({ ...prev, [category]: false }));
      }
    },
    [email, files],
  );

  const handleSave = useCallback(async () => {
    if (!email) return;

    setSaveLoading(true);
    try {
      const payload = {
        event: "training_save",
        email,
        agentId: AGENT_ID,
        text: {
          faq: textFields.faq,
          brand: textFields.brand,
          items: textFields.items,
          escalationRules: textFields.escalationRules,
          promos: textFields.promos,
          instructionsPrompt: textFields.instructionsPrompt,
        },
        guided: {
          tone: guidedFields.tone,
          mainObjective: guidedFields.mainObjective,
          primaryCta: guidedFields.primaryCta,
          oneCtaPerMsg: guidedFields.oneCtaPerMsg,
          maxOptionsPerMsg: guidedFields.maxOptionsPerMsg,
          humanHours: guidedFields.humanHours,
          humanHoursDetail: guidedFields.humanHoursDetail,
          escalationTriggers: guidedFields.escalationTriggers
            .split("\n")
            .map((value) => value.trim())
            .filter(Boolean),
        },
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          (data as { message?: string } | null)?.message ||
            "Error del webhook",
        );
      }

      toast.success("Entrenamiento guardado");
      await handlePrefill();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al guardar",
      );
    } finally {
      setSaveLoading(false);
    }
  }, [email, guidedFields, handlePrefill, textFields]);

  const handleChatSend = useCallback(async () => {
    if (!email || !chatInput.trim()) return;

    const message = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    chatControllerRef.current?.abort();
    const controller = new AbortController();
    chatControllerRef.current = controller;

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "training_chat",
          email,
          agentId: AGENT_ID,
          message,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          (data as { message?: string } | null)?.message ||
            "Error del webhook",
        );
      }

      if (Array.isArray(data?.chatHistory)) {
        setChatHistory(data.chatHistory.slice(-25));
      } else {
        setChatHistory((prev) =>
          [...prev, { role: "user", text: message },
          { role: "agent", text: data?.reply || "(sin respuesta)" }].slice(
            -25,
          ),
        );
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      toast.error(
        err instanceof Error ? err.message : "Error en el chat",
      );
    } finally {
      if (!controller.signal.aborted) {
        setChatLoading(false);
      }
    }
  }, [chatInput, email]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);

    if (!storedEmail) {
      setEmailError(
        "No se encontró el email de sesión. Inicia sesión de nuevo.",
      );
      setLoading(false);
      return () => {
        prefillControllerRef.current?.abort();
        chatControllerRef.current?.abort();
      };
    }

    if (!sentRef.current) {
      sentRef.current = true;
      handlePrefill(storedEmail);
    }

    return () => {
      prefillControllerRef.current?.abort();
      chatControllerRef.current?.abort();
    };
  }, [handlePrefill]);

  const handleFileSelection = (
    category: TrainingCategory,
    file: File | null,
  ) => {
    setSelectedFiles((prev) => ({ ...prev, [category]: file }));
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "upload") {
      handleUpload(confirmAction.category);
    }
    if (confirmAction.type === "save") {
      handleSave();
    }
    setConfirmAction(null);
  };

  if (emailError) {
    return (
      <Card className="border-rose-200 bg-rose-50">
        <CardHeader>
          <CardTitle className="text-rose-700">
            Sesión requerida
          </CardTitle>
          <CardDescription className="text-rose-700">
            {emailError}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBackToPanel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel
          </Button>
          <Button variant="outline" onClick={onBackToEmployees}>
            Volver a empleados digitales
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Entrenamiento</Badge>
            <Badge variant="secondary">vendedor-digital</Badge>
          </div>
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Entrenamiento · Vendedor digital
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Conocimiento, reglas y promociones que el agente usará en
            operación.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={onBackToPanel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel
          </Button>
          <Button
            className="gap-2"
            onClick={() =>
              hasExistingTraining
                ? setConfirmAction({ type: "save" })
                : handleSave()
            }
            disabled={saveLoading || loading}
          >
            {saveLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar entrenamiento
          </Button>
        </div>
      </div>

      {prefillError && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-rose-700">
            <span>{prefillError}</span>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-200 text-rose-700"
              onClick={handlePrefill}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="archivos">Archivos</TabsTrigger>
          <TabsTrigger value="texto">Texto y reglas</TabsTrigger>
          <TabsTrigger value="chat">Chat de prueba</TabsTrigger>
        </TabsList>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card className="border-muted/60">
            <CardContent className="pt-6">
              <TabsContent value="archivos" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Archivos de entrenamiento
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sube un archivo por categoría. Se aceptan PDF, Word o
                    TXT (máximo 10 MB).
                  </p>
                </div>

                <div className="space-y-3">
                  {categories.map((category) => {
                    const fileMeta = files[category.key];
                    return (
                      <Card key={category.key} className="border-muted/70">
                        <CardContent className="space-y-3 pt-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {category.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {category.description}
                              </p>
                            </div>
                            {fileMeta ? (
                              <Badge className="bg-emerald-50 text-emerald-700">
                                Archivo listo
                              </Badge>
                            ) : (
                              <Badge variant="outline">Sin archivo</Badge>
                            )}
                          </div>

                          {fileMeta && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex flex-wrap gap-3">
                                <span>Nombre: {fileMeta.name}</span>
                                <span>Tamaño: {formatBytes(fileMeta.sizeBytes)}</span>
                                <span>Subido: {fileMeta.uploadedAt ?? "—"}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                              onChange={(event) =>
                                handleFileSelection(
                                  category.key,
                                  event.target.files?.[0] ?? null,
                                )
                              }
                            />
                            <Button
                              className="gap-2"
                              variant="outline"
                              onClick={() =>
                                fileMeta
                                  ? setConfirmAction({
                                      type: "upload",
                                      category: category.key,
                                    })
                                  : handleUpload(category.key)
                              }
                              disabled={
                                uploading[category.key] ||
                                !selectedFiles[category.key]
                              }
                            >
                              {uploading[category.key] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                              Subir
                            </Button>
                            <Button
                              className="gap-2"
                              variant="outline"
                              onClick={() => handleDownload(category.key)}
                              disabled={!fileMeta || downloadLoading[category.key]}
                            >
                              {downloadLoading[category.key] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              Descargar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="texto" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Texto y reglas
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complementa el entrenamiento con texto directo y reglas
                    guiadas.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Tono
                    </p>
                    <Select
                      value={guidedFields.tone}
                      onValueChange={(value) =>
                        setGuidedFields((prev) => ({
                          ...prev,
                          tone: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Directo y ejecutivo">
                          Directo y ejecutivo
                        </SelectItem>
                        <SelectItem value="Cálido y consultivo">
                          Cálido y consultivo
                        </SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Objetivo principal
                    </p>
                    <Input
                      value={guidedFields.mainObjective}
                      onChange={(event) =>
                        setGuidedFields((prev) => ({
                          ...prev,
                          mainObjective: event.target.value,
                        }))
                      }
                      placeholder="Ej. Generar leads calificados"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      CTA principal
                    </p>
                    <Input
                      value={guidedFields.primaryCta}
                      onChange={(event) =>
                        setGuidedFields((prev) => ({
                          ...prev,
                          primaryCta: event.target.value,
                        }))
                      }
                      placeholder="Ej. Agendar llamada"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Máx. opciones por mensaje
                    </p>
                    <Input
                      type="number"
                      min={1}
                      value={guidedFields.maxOptionsPerMsg}
                      onChange={(event) =>
                        setGuidedFields((prev) => ({
                          ...prev,
                          maxOptionsPerMsg: Number(event.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Una CTA por mensaje
                    </p>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={guidedFields.oneCtaPerMsg}
                        onCheckedChange={(checked) =>
                          setGuidedFields((prev) => ({
                            ...prev,
                            oneCtaPerMsg: checked,
                          }))
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {guidedFields.oneCtaPerMsg ? "Sí" : "No"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Disponibilidad humana
                    </p>
                    <Select
                      value={guidedFields.humanHours}
                      onValueChange={(value) =>
                        setGuidedFields((prev) => ({
                          ...prev,
                          humanHours: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24/7">24/7</SelectItem>
                        <SelectItem value="Horario">Horario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {guidedFields.humanHours === "Horario" && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Detalle de horario
                    </p>
                    <Input
                      value={guidedFields.humanHoursDetail}
                      onChange={(event) =>
                        setGuidedFields((prev) => ({
                          ...prev,
                          humanHoursDetail: event.target.value,
                        }))
                      }
                      placeholder="Ej. L-V 9:00 - 18:00"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Triggers de escalamiento (uno por línea)
                  </p>
                  <Textarea
                    value={guidedFields.escalationTriggers}
                    onChange={(event) =>
                      setGuidedFields((prev) => ({
                        ...prev,
                        escalationTriggers: event.target.value,
                      }))
                    }
                    placeholder="Ej. Quiero hablar con un humano"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      FAQ (texto)
                    </p>
                    <Textarea
                      value={textFields.faq}
                      onChange={(event) =>
                        setTextFields((prev) => ({
                          ...prev,
                          faq: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Datos de la marca
                    </p>
                    <Textarea
                      value={textFields.brand}
                      onChange={(event) =>
                        setTextFields((prev) => ({
                          ...prev,
                          brand: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Artículos
                    </p>
                    <Textarea
                      value={textFields.items}
                      onChange={(event) =>
                        setTextFields((prev) => ({
                          ...prev,
                          items: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Reglas de escalamiento
                    </p>
                    <Textarea
                      value={textFields.escalationRules}
                      onChange={(event) =>
                        setTextFields((prev) => ({
                          ...prev,
                          escalationRules: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Promociones activas
                    </p>
                    <Textarea
                      value={textFields.promos}
                      onChange={(event) =>
                        setTextFields((prev) => ({
                          ...prev,
                          promos: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Instrucciones (opcional)
                    </p>
                    <Textarea
                      value={textFields.instructionsPrompt}
                      onChange={(event) =>
                        setTextFields((prev) => ({
                          ...prev,
                          instructionsPrompt: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="chat"
                className="mt-0 space-y-4 lg:hidden"
              >
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Chat de prueba
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Usa el contexto cargado y guarda hasta 25 mensajes.
                  </p>
                </div>
                <Card className="border-muted/70">
                  <CardContent className="space-y-4 pt-4">
                    <div className="max-h-[360px] space-y-3 overflow-auto rounded-xl border border-muted/60 bg-muted/20 p-3">
                      {chatHistory.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          Aún no hay mensajes.
                        </p>
                      )}
                      {chatHistory.map((message, index) => (
                        <div
                          key={`${message.role}-${index}`}
                          className={`max-w-[90%] rounded-xl border px-3 py-2 text-sm ${
                            message.role === "user"
                              ? "ml-auto border-blue-200 bg-blue-50"
                              : "mr-auto border-muted/60 bg-background"
                          }`}
                        >
                          <p className="text-xs font-semibold text-muted-foreground">
                            {message.role === "user"
                              ? "Usuario"
                              : "Agente"}
                          </p>
                          <p className="text-sm text-foreground">
                            {message.text}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Input
                        value={chatInput}
                        onChange={(event) =>
                          setChatInput(event.target.value)
                        }
                        placeholder="Escribe un mensaje…"
                      />
                      <Button
                        className="gap-2"
                        onClick={handleChatSend}
                        disabled={chatLoading || !chatInput.trim()}
                      >
                        {chatLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}
                        Enviar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {loading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="hidden lg:block">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-base">
                  Chat de prueba
                </CardTitle>
                <CardDescription>
                  Usa el contexto cargado y guarda hasta 25 mensajes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[480px] space-y-3 overflow-auto rounded-xl border border-muted/60 bg-muted/20 p-3">
                  {chatHistory.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Aún no hay mensajes.
                    </p>
                  )}
                  {chatHistory.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`max-w-[90%] rounded-xl border px-3 py-2 text-sm ${
                        message.role === "user"
                          ? "ml-auto border-blue-200 bg-blue-50"
                          : "mr-auto border-muted/60 bg-background"
                      }`}
                    >
                      <p className="text-xs font-semibold text-muted-foreground">
                        {message.role === "user" ? "Usuario" : "Agente"}
                      </p>
                      <p className="text-sm text-foreground">
                        {message.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(event.target.value)
                    }
                    placeholder="Escribe un mensaje…"
                  />
                  <Button
                    className="gap-2"
                    onClick={handleChatSend}
                    disabled={chatLoading || !chatInput.trim()}
                  >
                    {chatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "save"
                ? "Sobrescribir entrenamiento"
                : "Reemplazar archivo"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "save"
                ? "Esto sobrescribirá el entrenamiento actual. ¿Deseas continuar?"
                : "Esto reemplazará el archivo actual. ¿Deseas continuar?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
