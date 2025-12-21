import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Upload, X } from "lucide-react";
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
import { Checkbox } from "./ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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

type WebhookSavePayloadWithConfig = WebhookSavePayload & {
  config: SalesAgentConfig;
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

type SalesAgentConfig = {
  profile: {
    name: string;
    useEmojis: boolean;
    emojiLevel: "bajo" | "medio" | "alto";
    responseLength: "corta" | "media" | "larga";
    maxOptionsPerMsg: number;
    bannedPhrases: string[];
  };
  ads: {
    objective: string;
    dailyCap: number;
    monthlyCap: number;
    canCreate: boolean;
    canPause: boolean;
    canReallocate: boolean;
    canTarget: boolean;
    autoPublish: boolean;
    stopLoss: {
      cpl: number;
      hours: number;
      action: string;
    };
  };
  whatsapp: {
    number: string | null;
    status: string | null;
    objective: string;
    maxQuestions: number;
    oneCtaPerMsg: boolean;
    dataAllowed: string[];
  };
  quote: {
    format: string;
    validityDays: number;
    taxMode: string;
    canNegotiate: boolean;
    negotiateMaxPct: number;
    canPromiseDelivery: boolean;
    template: string;
  };
  followUp: {
    step1Hours: number;
    step2Hours: number;
    step3Days: number;
    maxAttempts: number;
    stopAfterDays: number;
    closeMessage: string;
    templates: string[];
  };
  billing: {
    methods: string[];
    canSendLink: boolean;
    confirmAlwaysEscalate: boolean;
    invoiceEscalate: boolean;
    template: string;
  };
  escalation: {
    amountThreshold: number;
    summaryMode: string;
    humanHours: string;
    triggers: string[];
    onComplaint: boolean;
    onExceptions: boolean;
    onSensitiveData: boolean;
  };
  advanced: {
    instructionsPrompt: string;
    workNotes: string;
    securityPolicy: string;
  };
};

type PrefillResponse = {
  ok?: boolean;
  meta?: { corte?: string };
  agent?: { status?: string; availability?: string; whatsappNumber?: string };
  files?: Partial<Record<Category, TrainingFile | null>>;
  text?: Partial<TrainingText>;
  guided?: Partial<GuidedFields>;
  chatHistory?: ChatMessage[];
  config?: Partial<SalesAgentConfig>;
  whatsapp?: { number?: string; status?: string };
};

type ChatMessage = {
  role: "user" | "agent";
  text: string;
  at?: string;
};

interface VendedorDigitalTrainingPageProps {
  onBackToPanel?: () => void;
}

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

const emojiLevelOptions = ["bajo", "medio", "alto"] as const;
const responseLengthOptions = ["corta", "media", "larga"] as const;

const whatsappDataAllowedOptions = [
  "nombre",
  "ciudad",
  "producto",
  "cantidad",
  "urgencia",
  "presupuesto",
  "envio",
  "rfc",
];

const billingMethodsOptions = [
  "transferencia",
  "link",
  "tarjeta",
  "oxxo",
  "efectivo",
];

const adsSwitches: {
  label: string;
  key: "canCreate" | "canPause" | "canReallocate" | "canTarget" | "autoPublish";
}[] = [
  { label: "Puede crear campañas", key: "canCreate" },
  { label: "Puede pausar campañas", key: "canPause" },
  { label: "Puede reasignar presupuesto", key: "canReallocate" },
  { label: "Puede segmentar", key: "canTarget" },
  { label: "Auto publicar", key: "autoPublish" },
];

const escalationSwitches: {
  label: string;
  key: "onComplaint" | "onExceptions" | "onSensitiveData";
}[] = [
  { label: "Escalar por quejas", key: "onComplaint" },
  { label: "Escalar excepciones", key: "onExceptions" },
  { label: "Escalar datos sensibles", key: "onSensitiveData" },
];

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

const defaultConfig: SalesAgentConfig = {
  profile: {
    name: "",
    useEmojis: true,
    emojiLevel: "medio",
    responseLength: "media",
    maxOptionsPerMsg: 3,
    bannedPhrases: [],
  },
  ads: {
    objective: "",
    dailyCap: 0,
    monthlyCap: 0,
    canCreate: true,
    canPause: true,
    canReallocate: true,
    canTarget: true,
    autoPublish: false,
    stopLoss: {
      cpl: 0,
      hours: 0,
      action: "",
    },
  },
  whatsapp: {
    number: null,
    status: null,
    objective: "",
    maxQuestions: 3,
    oneCtaPerMsg: true,
    dataAllowed: [],
  },
  quote: {
    format: "",
    validityDays: 0,
    taxMode: "",
    canNegotiate: false,
    negotiateMaxPct: 0,
    canPromiseDelivery: false,
    template: "",
  },
  followUp: {
    step1Hours: 4,
    step2Hours: 24,
    step3Days: 3,
    maxAttempts: 3,
    stopAfterDays: 10,
    closeMessage: "",
    templates: [],
  },
  billing: {
    methods: [],
    canSendLink: true,
    confirmAlwaysEscalate: false,
    invoiceEscalate: false,
    template: "",
  },
  escalation: {
    amountThreshold: 0,
    summaryMode: "",
    humanHours: "",
    triggers: [],
    onComplaint: true,
    onExceptions: true,
    onSensitiveData: true,
  },
  advanced: {
    instructionsPrompt: "",
    workNotes: "",
    securityPolicy: "",
  },
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

const getLinesValue = (value: string) =>
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

const mergeConfig = (
  base: SalesAgentConfig,
  update?: Partial<SalesAgentConfig>,
): SalesAgentConfig => ({
  profile: {
    ...base.profile,
    ...update?.profile,
    bannedPhrases: update?.profile?.bannedPhrases ?? base.profile.bannedPhrases,
  },
  ads: {
    ...base.ads,
    ...update?.ads,
    stopLoss: {
      ...base.ads.stopLoss,
      ...update?.ads?.stopLoss,
    },
  },
  whatsapp: {
    ...base.whatsapp,
    ...update?.whatsapp,
    dataAllowed: update?.whatsapp?.dataAllowed ?? base.whatsapp.dataAllowed,
  },
  quote: {
    ...base.quote,
    ...update?.quote,
  },
  followUp: {
    ...base.followUp,
    ...update?.followUp,
    templates: update?.followUp?.templates ?? base.followUp.templates,
  },
  billing: {
    ...base.billing,
    ...update?.billing,
    methods: update?.billing?.methods ?? base.billing.methods,
  },
  escalation: {
    ...base.escalation,
    ...update?.escalation,
    triggers: update?.escalation?.triggers ?? base.escalation.triggers,
  },
  advanced: {
    ...base.advanced,
    ...update?.advanced,
  },
});

const toggleListItem = (items: string[], value: string) =>
  items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];

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
  const [config, setConfig] = useState<SalesAgentConfig>(defaultConfig);
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
  const [dirty, setDirty] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [bannedPhraseInput, setBannedPhraseInput] = useState("");
  const [whatsappRequestStatus, setWhatsappRequestStatus] = useState<
    string | null
  >(null);
  const [whatsappRequestLoading, setWhatsappRequestLoading] = useState(false);

  const sentRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const trimmedChatHistory = useMemo(
    () => chatHistory.slice(-25),
    [chatHistory],
  );

  const markDirty = useCallback(() => {
    setDirty(true);
    setValidationError(null);
  }, []);

  const updateConfig = useCallback(
    (updater: (prev: SalesAgentConfig) => SalesAgentConfig) => {
      setConfig((prev) => updater(prev));
      markDirty();
    },
    [markDirty],
  );

  const sendPrefill = useCallback(
    async (force = false) => {
      if (sentRef.current && !force) return;
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

        const mergedConfig = mergeConfig(defaultConfig, nextData.config);
        const resolvedWhatsappNumber =
          nextData.config?.whatsapp?.number ??
          nextData.whatsapp?.number ??
          nextData.agent?.whatsappNumber ??
          null;
        const resolvedWhatsappStatus =
          nextData.config?.whatsapp?.status ??
          nextData.whatsapp?.status ??
          null;

        setConfig({
          ...mergedConfig,
          whatsapp: {
            ...mergedConfig.whatsapp,
            number: resolvedWhatsappNumber ?? mergedConfig.whatsapp.number,
            status: resolvedWhatsappStatus ?? mergedConfig.whatsapp.status,
          },
        });

        setChatHistory(nextData.chatHistory ?? []);
        setDirty(false);
        setValidationError(null);
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
    },
    [],
  );

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

    if (!config.profile.name.trim()) {
      setValidationError("El nombre visible es obligatorio.");
      return;
    }

    if (config.profile.maxOptionsPerMsg < 1) {
      setValidationError("El máximo de opciones por mensaje debe ser mayor a 0.");
      return;
    }

    if (prefill) {
      const confirmed = window.confirm(
        "Esto sobrescribirá el entrenamiento actual. ¿Deseas continuar?",
      );
      if (!confirmed) return;
    }

    const payload: WebhookSavePayloadWithConfig = {
      event: "training_save",
      email,
      agentId: AGENT_ID,
      text,
      guided,
      config,
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

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se pudo guardar");
      }

      window.alert(data.message ?? "Entrenamiento guardado");
      setDirty(false);
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

  const handleBannedPhraseAdd = () => {
    const value = bannedPhraseInput.trim();
    if (!value) return;

    updateConfig((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        bannedPhrases: prev.profile.bannedPhrases.includes(value)
          ? prev.profile.bannedPhrases
          : [...prev.profile.bannedPhrases, value],
      },
    }));
    setBannedPhraseInput("");
  };

  const handleWhatsappRequest = async () => {
    if (!email) return;

    setWhatsappRequestLoading(true);
    setWhatsappRequestStatus(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "training_whatsapp_request",
          email,
          agentId: AGENT_ID,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await response.json()) as { ok?: boolean; message?: string })
        : null;

      if (!response.ok || !data?.ok) {
        setWhatsappRequestStatus(
          "El backend aún no soporta solicitud de alta",
        );
        return;
      }

      setWhatsappRequestStatus(
        data.message ?? "Solicitud enviada. Te avisaremos cuando esté listo.",
      );
      sentRef.current = false;
      await sendPrefill(true);
    } catch (err) {
      setWhatsappRequestStatus("El backend aún no soporta solicitud de alta");
    } finally {
      setWhatsappRequestLoading(false);
    }
  };

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
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={onBackToPanel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel
          </Button>
          <Button onClick={handleSave} disabled={saving || missingEmail}>
            Guardar entrenamiento
          </Button>
          {dirty && <Badge variant="secondary">Cambios sin guardar</Badge>}
        </div>
      </header>

      {missingEmail && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="py-6 text-sm text-rose-700">
            No se encontró el email de sesión. Inicia sesión de nuevo.
          </CardContent>
        </Card>
      )}

      {error && !missingEmail && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="py-4 text-sm text-rose-700">
            {error}
          </CardContent>
        </Card>
      )}

      {!missingEmail && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Agente de Ventas</CardTitle>
                <CardDescription>
                  Ajusta el comportamiento del agente en cada etapa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="identidad">
                  <TabsList className="flex flex-wrap gap-2">
                    <TabsTrigger value="identidad">Identidad</TabsTrigger>
                    <TabsTrigger value="ads">Ads</TabsTrigger>
                    <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                    <TabsTrigger value="cotizacion">Cotización</TabsTrigger>
                    <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
                    <TabsTrigger value="cobro">Cobro</TabsTrigger>
                    <TabsTrigger value="escalamiento">Escalamiento</TabsTrigger>
                    <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
                  </TabsList>

                  <TabsContent value="identidad" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nombre visible</Label>
                        <Input
                          value={config.profile.name}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                name: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Usar emojis
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Controla si el agente responde con emojis.
                          </p>
                        </div>
                        <Switch
                          checked={config.profile.useEmojis}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                useEmojis: checked,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nivel de emojis</Label>
                        <Select
                          value={config.profile.emojiLevel}
                          onValueChange={(value) =>
                            updateConfig((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                emojiLevel: value as
                                  | "bajo"
                                  | "medio"
                                  | "alto",
                              },
                            }))
                          }
                          disabled={!config.profile.useEmojis}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {emojiLevelOptions.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Longitud de respuesta</Label>
                        <Select
                          value={config.profile.responseLength}
                          onValueChange={(value) =>
                            updateConfig((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                responseLength: value as
                                  | "corta"
                                  | "media"
                                  | "larga",
                              },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {responseLengthOptions.map((length) => (
                              <SelectItem key={length} value={length}>
                                {length}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Máximo de opciones por mensaje</Label>
                        <Input
                          type="number"
                          min={1}
                          value={config.profile.maxOptionsPerMsg}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                maxOptionsPerMsg: Number(
                                  event.target.value || 0,
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Frases prohibidas</Label>
                        <div className="flex flex-wrap gap-2">
                          {config.profile.bannedPhrases.map((phrase) => (
                            <Badge
                              key={phrase}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {phrase}
                              <button
                                type="button"
                                onClick={() =>
                                  updateConfig((prev) => ({
                                    ...prev,
                                    profile: {
                                      ...prev.profile,
                                      bannedPhrases: prev.profile.bannedPhrases.filter(
                                        (item) => item !== phrase,
                                      ),
                                    },
                                  }))
                                }
                                className="ml-1 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                          <Input
                            value={bannedPhraseInput}
                            onChange={(event) =>
                              setBannedPhraseInput(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleBannedPhraseAdd();
                              }
                            }}
                            placeholder="Agregar frase y presiona Enter"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleBannedPhraseAdd}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ads" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Objetivo de Ads</Label>
                        <Input
                          value={config.ads.objective}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              ads: { ...prev.ads, objective: event.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tope diario</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.ads.dailyCap}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              ads: {
                                ...prev.ads,
                                dailyCap: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tope mensual</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.ads.monthlyCap}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              ads: {
                                ...prev.ads,
                                monthlyCap: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Acción de stop loss</Label>
                        <Input
                          value={config.ads.stopLoss.action}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              ads: {
                                ...prev.ads,
                                stopLoss: {
                                  ...prev.ads.stopLoss,
                                  action: event.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Ej: Pausar campañas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stop loss CPL</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.ads.stopLoss.cpl}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              ads: {
                                ...prev.ads,
                                stopLoss: {
                                  ...prev.ads.stopLoss,
                                  cpl: Number(event.target.value || 0),
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stop loss horas</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.ads.stopLoss.hours}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              ads: {
                                ...prev.ads,
                                stopLoss: {
                                  ...prev.ads.stopLoss,
                                  hours: Number(event.target.value || 0),
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {adsSwitches.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          <Switch
                            checked={config.ads[item.key]}
                            onCheckedChange={(checked) =>
                              updateConfig((prev) => ({
                                ...prev,
                                ads: {
                                  ...prev.ads,
                                  [item.key]: checked,
                                },
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="whatsapp" className="space-y-4">
                    <Card className="border border-muted/60">
                      <CardContent className="space-y-2 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          Número asignado
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {config.whatsapp.number || "Sin número asignado"}
                        </p>
                        {config.whatsapp.status && (
                          <p className="text-xs text-muted-foreground">
                            Estado: {config.whatsapp.status}
                          </p>
                        )}
                        {!config.whatsapp.number && (
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleWhatsappRequest}
                              disabled={whatsappRequestLoading}
                            >
                              {whatsappRequestLoading
                                ? "Solicitando..."
                                : "Solicitar alta"}
                            </Button>
                            {whatsappRequestStatus && (
                              <span className="text-xs text-muted-foreground">
                                {whatsappRequestStatus}
                              </span>
                            )}
                          </div>
                        )}
                        {config.whatsapp.number && whatsappRequestStatus && (
                          <p className="text-xs text-muted-foreground">
                            {whatsappRequestStatus}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Objetivo WhatsApp</Label>
                        <Input
                          value={config.whatsapp.objective}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              whatsapp: {
                                ...prev.whatsapp,
                                objective: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Máximo de preguntas</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.whatsapp.maxQuestions}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              whatsapp: {
                                ...prev.whatsapp,
                                maxQuestions: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2 md:col-span-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Un CTA por mensaje
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Controla el foco en WhatsApp.
                          </p>
                        </div>
                        <Switch
                          checked={config.whatsapp.oneCtaPerMsg}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              whatsapp: {
                                ...prev.whatsapp,
                                oneCtaPerMsg: checked,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Datos permitidos</Label>
                        <div className="grid gap-2 md:grid-cols-2">
                          {whatsappDataAllowedOptions.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Checkbox
                                checked={config.whatsapp.dataAllowed.includes(
                                  option,
                                )}
                                onCheckedChange={() =>
                                  updateConfig((prev) => ({
                                    ...prev,
                                    whatsapp: {
                                      ...prev.whatsapp,
                                      dataAllowed: toggleListItem(
                                        prev.whatsapp.dataAllowed,
                                        option,
                                      ),
                                    },
                                  }))
                                }
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cotizacion" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Formato de cotización</Label>
                        <Input
                          value={config.quote.format}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              quote: { ...prev.quote, format: event.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Días de vigencia</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.quote.validityDays}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              quote: {
                                ...prev.quote,
                                validityDays: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Modo de impuestos</Label>
                        <Input
                          value={config.quote.taxMode}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              quote: { ...prev.quote, taxMode: event.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Negociación máxima (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.quote.negotiateMaxPct}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              quote: {
                                ...prev.quote,
                                negotiateMaxPct: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          Puede negociar
                        </p>
                        <Switch
                          checked={config.quote.canNegotiate}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              quote: { ...prev.quote, canNegotiate: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          Puede prometer entrega
                        </p>
                        <Switch
                          checked={config.quote.canPromiseDelivery}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              quote: {
                                ...prev.quote,
                                canPromiseDelivery: checked,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Plantilla de cotización</Label>
                      <Textarea
                        value={config.quote.template}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            quote: { ...prev.quote, template: event.target.value },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="seguimiento" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Horas para primer seguimiento</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.followUp.step1Hours}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              followUp: {
                                ...prev.followUp,
                                step1Hours: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Horas para segundo seguimiento</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.followUp.step2Hours}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              followUp: {
                                ...prev.followUp,
                                step2Hours: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Días para tercer seguimiento</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.followUp.step3Days}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              followUp: {
                                ...prev.followUp,
                                step3Days: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Intentos máximos</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.followUp.maxAttempts}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              followUp: {
                                ...prev.followUp,
                                maxAttempts: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Días para detener seguimiento</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.followUp.stopAfterDays}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              followUp: {
                                ...prev.followUp,
                                stopAfterDays: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Mensaje de cierre</Label>
                      <Textarea
                        value={config.followUp.closeMessage}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            followUp: {
                              ...prev.followUp,
                              closeMessage: event.target.value,
                            },
                          }))
                        }
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Templates de seguimiento (una por línea)</Label>
                      <Textarea
                        value={config.followUp.templates.join("\n")}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            followUp: {
                              ...prev.followUp,
                              templates: getLinesValue(event.target.value),
                            },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="cobro" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Métodos de cobro</Label>
                      <div className="grid gap-2 md:grid-cols-2">
                        {billingMethodsOptions.map((method) => (
                          <label
                            key={method}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={config.billing.methods.includes(method)}
                              onCheckedChange={() =>
                                updateConfig((prev) => ({
                                  ...prev,
                                  billing: {
                                    ...prev.billing,
                                    methods: toggleListItem(
                                      prev.billing.methods,
                                      method,
                                    ),
                                  },
                                }))
                              }
                            />
                            {method}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          Puede enviar link de pago
                        </p>
                        <Switch
                          checked={config.billing.canSendLink}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, canSendLink: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          Confirmación siempre escala
                        </p>
                        <Switch
                          checked={config.billing.confirmAlwaysEscalate}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              billing: {
                                ...prev.billing,
                                confirmAlwaysEscalate: checked,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          Escalar facturación
                        </p>
                        <Switch
                          checked={config.billing.invoiceEscalate}
                          onCheckedChange={(checked) =>
                            updateConfig((prev) => ({
                              ...prev,
                              billing: {
                                ...prev.billing,
                                invoiceEscalate: checked,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Plantilla de cobro</Label>
                      <Textarea
                        value={config.billing.template}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            billing: {
                              ...prev.billing,
                              template: event.target.value,
                            },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="escalamiento" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Monto mínimo para escalar</Label>
                        <Input
                          type="number"
                          min={0}
                          value={config.escalation.amountThreshold}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              escalation: {
                                ...prev.escalation,
                                amountThreshold: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Modo de resumen</Label>
                        <Input
                          value={config.escalation.summaryMode}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              escalation: {
                                ...prev.escalation,
                                summaryMode: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Horario humano</Label>
                        <Input
                          value={config.escalation.humanHours}
                          onChange={(event) =>
                            updateConfig((prev) => ({
                              ...prev,
                              escalation: {
                                ...prev.escalation,
                                humanHours: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Disparadores (una por línea)</Label>
                      <Textarea
                        value={config.escalation.triggers.join("\n")}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            escalation: {
                              ...prev.escalation,
                              triggers: getLinesValue(event.target.value),
                            },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {escalationSwitches.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-lg border border-muted/60 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          <Switch
                            checked={config.escalation[item.key]}
                            onCheckedChange={(checked) =>
                              updateConfig((prev) => ({
                                ...prev,
                                escalation: {
                                  ...prev.escalation,
                                  [item.key]: checked,
                                },
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="avanzado" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Instructions prompt</Label>
                      <Textarea
                        value={config.advanced.instructionsPrompt}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            advanced: {
                              ...prev.advanced,
                              instructionsPrompt: event.target.value,
                            },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Work notes</Label>
                      <Textarea
                        value={config.advanced.workNotes}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            advanced: {
                              ...prev.advanced,
                              workNotes: event.target.value,
                            },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Security policy</Label>
                      <Textarea
                        value={config.advanced.securityPolicy}
                        onChange={(event) =>
                          updateConfig((prev) => ({
                            ...prev,
                            advanced: {
                              ...prev.advanced,
                              securityPolicy: event.target.value,
                            },
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

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
                            {fileInfo?.name && <span>{fileInfo.name}</span>}
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
                      onChange={(event) => {
                        markDirty();
                        setText((prev) => ({
                          ...prev,
                          faq: event.target.value,
                        }));
                      }}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Datos de la marca</Label>
                    <Textarea
                      value={text.brand}
                      onChange={(event) => {
                        markDirty();
                        setText((prev) => ({
                          ...prev,
                          brand: event.target.value,
                        }));
                      }}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lista de artículos</Label>
                    <Textarea
                      value={text.items}
                      onChange={(event) => {
                        markDirty();
                        setText((prev) => ({
                          ...prev,
                          items: event.target.value,
                        }));
                      }}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reglas de escalamiento</Label>
                    <Textarea
                      value={text.escalationRules}
                      onChange={(event) => {
                        markDirty();
                        setText((prev) => ({
                          ...prev,
                          escalationRules: event.target.value,
                        }));
                      }}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Promociones</Label>
                    <Textarea
                      value={text.promos}
                      onChange={(event) => {
                        markDirty();
                        setText((prev) => ({
                          ...prev,
                          promos: event.target.value,
                        }));
                      }}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instrucciones generales</Label>
                    <Textarea
                      value={text.instructionsPrompt}
                      onChange={(event) => {
                        markDirty();
                        setText((prev) => ({
                          ...prev,
                          instructionsPrompt: event.target.value,
                        }));
                      }}
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
                        onValueChange={(value) => {
                          markDirty();
                          setGuided((prev) => ({ ...prev, tone: value }));
                        }}
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
                        onChange={(event) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            mainObjective: event.target.value,
                          }));
                        }}
                        placeholder="Ej: Convertir leads en cotizaciones"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA principal</Label>
                      <Input
                        value={guided.primaryCta}
                        onChange={(event) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            primaryCta: event.target.value,
                          }));
                        }}
                        placeholder="Ej: Agendar llamada con ventas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máximo de opciones por mensaje</Label>
                      <Input
                        type="number"
                        min={1}
                        value={guided.maxOptionsPerMsg}
                        onChange={(event) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            maxOptionsPerMsg: Number(event.target.value || 0),
                          }));
                        }}
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
                        onCheckedChange={(checked) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            oneCtaPerMsg: checked,
                          }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horario humano</Label>
                      <Select
                        value={guided.humanHours}
                        onValueChange={(value) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            humanHours: value,
                          }));
                        }}
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
                        onChange={(event) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            humanHoursDetail: event.target.value,
                          }));
                        }}
                        placeholder="Ej: Lun-Vie 9:00-18:00"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Disparadores de escalamiento</Label>
                      <Textarea
                        value={guided.escalationTriggers.join("\n")}
                        onChange={(event) => {
                          markDirty();
                          setGuided((prev) => ({
                            ...prev,
                            escalationTriggers: getEscalationTriggersValue(
                              event.target.value,
                            ),
                          }));
                        }}
                        rows={3}
                        placeholder="Una regla por línea"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {validationError && (
              <Card className="border-rose-200 bg-rose-50">
                <CardContent className="py-4 text-sm text-rose-700">
                  {validationError}
                </CardContent>
              </Card>
            )}

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
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={handleSave} disabled={saving || loading}>
                    {saving ? "Guardando..." : "Guardar entrenamiento"}
                  </Button>
                  {dirty && <Badge variant="secondary">Cambios sin guardar</Badge>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
    </div>
  );
}
