import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { submitSoporte } from "../../lib/vendedorDigital/api";
import { Loader2 } from "lucide-react";

export function SupportCard() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("message", message);
      await submitSoporte(form);
      setFeedback("Solicitud enviada con éxito. Nuestro equipo te contactará.");
      setMessage("");
    } catch (error) {
      setFeedback("No pudimos enviar tu solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Soporte</CardTitle>
        <p className="text-sm text-muted-foreground">
          Dudas, feedback o ajustes rápidos. Te responderemos por correo.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor="support-email">
              Correo
            </label>
            <Input
              id="support-email"
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor="support-msg">
              Mensaje
            </label>
            <Textarea
              id="support-msg"
              required
              placeholder="Cuéntanos qué necesitas"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" className="gap-2" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Enviar
          </Button>
          {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
