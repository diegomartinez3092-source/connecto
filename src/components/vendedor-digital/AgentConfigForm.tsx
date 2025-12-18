import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { submitConfig } from "../../lib/vendedorDigital/api";
import { Loader2 } from "lucide-react";

export function AgentConfigForm() {
  const [asistenteNombre, setAsistenteNombre] = useState("");
  const [tono, setTono] = useState("Consultivo y claro");
  const [bienvenida, setBienvenida] = useState("");
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [maxMensajes, setMaxMensajes] = useState(3);
  const [oneCta, setOneCta] = useState(true);
  const [maxOpciones, setMaxOpciones] = useState(2);
  const [keywords, setKeywords] = useState("");
  const [horario247, setHorario247] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("asistente_nombre", asistenteNombre);
      form.append("tono", tono);
      form.append("bienvenida", bienvenida);
      if (archivos) {
        Array.from(archivos).forEach((file) => form.append("archivos", file));
      }
      form.append("max_mensajes_antes_pago", String(maxMensajes));
      form.append("one_cta", String(oneCta));
      form.append("max_opciones", String(maxOpciones));
      form.append("escalamiento_palabras_clave", keywords);
      form.append("horario_247", String(horario247));
      await submitConfig(form);
      setFeedback("Configuración guardada");
    } catch (error) {
      setFeedback("No pudimos guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Identidad y reglas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Define cómo se presenta y responde el Vendedor digital.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="nombre">
                Nombre del agente
              </label>
              <Input
                id="nombre"
                placeholder="Ej. Sofía"
                value={asistenteNombre}
                onChange={(e) => setAsistenteNombre(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="tono">
                Tono
              </label>
              <Input
                id="tono"
                value={tono}
                onChange={(e) => setTono(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="bienvenida">
                Instrucciones / bienvenida
              </label>
              <Textarea
                id="bienvenida"
                placeholder="Ej. Saluda, presenta beneficios y ofrece cotización al minuto"
                value={bienvenida}
                onChange={(e) => setBienvenida(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="archivos">
                Subir archivos (entrenamiento)
              </label>
              <Input
                id="archivos"
                type="file"
                multiple
                onChange={(e) => setArchivos(e.target.files)}
              />
              <p className="text-xs text-muted-foreground">
                Mantén PDFs o DOC con scripts y respuestas frecuentes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Máx. mensajes antes de pago</label>
                <Input
                  type="number"
                  min={1}
                  value={maxMensajes}
                  onChange={(e) => setMaxMensajes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Máx. opciones</label>
                <Input
                  type="number"
                  min={1}
                  value={maxOpciones}
                  onChange={(e) => setMaxOpciones(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Una CTA por mensaje</p>
                <p className="text-sm text-muted-foreground">Reduce fricción y acelera decisiones.</p>
              </div>
              <Switch checked={oneCta} onCheckedChange={setOneCta} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Horario 24/7</p>
                <p className="text-sm text-muted-foreground">Mantener activo fuera de horario.</p>
              </div>
              <Switch checked={horario247} onCheckedChange={setHorario247} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Escalamiento por palabras clave</label>
              <Textarea
                placeholder="ej. urgente, factura, pago manual, VIP"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <Button type="submit" className="gap-2" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar
            </Button>
            {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
