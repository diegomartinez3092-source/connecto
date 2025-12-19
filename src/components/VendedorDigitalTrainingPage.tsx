import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const WEBHOOK_URL =
  "https://hook.us2.make.com/uhv5dk35fwk8pmza4hd4wwamhmk7cryb";

type WebhookPayload = {
  event: "training_prefill";
  email: string;
};

type RequestState = "loading" | "success" | "error";

interface VendedorDigitalTrainingPageProps {
  onBack?: () => void;
}

export function VendedorDigitalTrainingPage({
  onBack,
}: VendedorDigitalTrainingPageProps) {
  const [state, setState] = useState<RequestState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [payload, setPayload] = useState<WebhookPayload | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<unknown>(null);

  const sentRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendWebhook = useCallback(
    async (force = false) => {
      if (!force && sentRef.current) {
        return;
      }

      sentRef.current = true;
      abortRef.current?.abort();

      setState("loading");
      setError(null);
      setHttpStatus(null);
      setResponseBody(null);

      const storedEmail = localStorage.getItem("email");
      setEmail(storedEmail);

      if (!storedEmail) {
        setError(
          "No se encontró el email de sesión. Inicia sesión de nuevo.",
        );
        setState("error");
        return;
      }

      const nextPayload: WebhookPayload = {
        event: "training_prefill",
        email: storedEmail,
      };

      setPayload(nextPayload);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextPayload),
          signal: controller.signal,
        });

        setHttpStatus(response.status);

        const contentType = response.headers.get("content-type") ?? "";
        let data: unknown = null;

        if (contentType.includes("application/json")) {
          data = await response.json();
        }

        setResponseBody(data);

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof (data as { message?: unknown }).message === "string"
              ? (data as { message: string }).message
              : "Error del webhook";
          throw new Error(message);
        }

        setState("success");
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Error del webhook",
        );
        setState("error");
      }
    },
    [],
  );

  useEffect(() => {
    sendWebhook();

    return () => {
      abortRef.current?.abort();
    };
  }, [sendWebhook]);

  const isDev = import.meta.env.DEV;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entrenamiento del agente</CardTitle>
          <CardDescription>Precargando información…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state === "loading" && (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          )}

          {state === "success" && (
            <p className="text-sm text-emerald-600">
              Precarga lista
            </p>
          )}

          {state === "error" && (
            <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <p>{error}</p>
              <Button
                size="sm"
                variant="outline"
                className="border-rose-200 text-rose-700"
                onClick={() => sendWebhook(true)}
              >
                Reintentar
              </Button>
            </div>
          )}

          {isDev && (
            <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/40 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                Debug webhook
              </p>
              <div className="mt-2 space-y-1 font-mono">
                <p>Email leído: {email ?? "—"}</p>
                <p>
                  Payload enviado:{" "}
                  {payload
                    ? JSON.stringify(payload)
                    : "—"}
                </p>
                <p>
                  Status HTTP: {httpStatus ?? "—"}
                </p>
                <p>
                  Respuesta JSON:{" "}
                  {responseBody !== null
                    ? JSON.stringify(responseBody)
                    : "—"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
