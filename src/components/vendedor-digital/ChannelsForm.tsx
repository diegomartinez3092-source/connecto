import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { submitChannels } from "../../lib/vendedorDigital/api";
import { Loader2, Send } from "lucide-react";

export function ChannelsForm() {
  const [whatsapp, setWhatsapp] = useState("");
  const [messenger, setMessenger] = useState("");
  const [instagram, setInstagram] = useState("");
  const [webchat, setWebchat] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (whatsapp) qs.append("whatsapp", whatsapp);
      if (messenger) qs.append("messenger", messenger);
      if (instagram) qs.append("instagram", instagram);
      if (webchat) qs.append("web", webchat);
      await submitChannels(qs.toString());
      setFeedback("Conexión enviada");
    } catch (error) {
      setFeedback("No pudimos conectar. Revisa los datos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conectar canales</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enlaza WhatsApp, Messenger, Instagram y Webchat. Conserva tus webhooks.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor="whatsapp">WhatsApp</label>
            <Input
              id="whatsapp"
              placeholder="Número o instancia"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor="messenger">Facebook Messenger</label>
            <Input
              id="messenger"
              placeholder="Page ID"
              value={messenger}
              onChange={(e) => setMessenger(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor="instagram">Instagram</label>
            <Input
              id="instagram"
              placeholder="Usuario o App ID"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor="webchat">Webchat</label>
            <Input
              id="webchat"
              placeholder="URL de widget"
              value={webchat}
              onChange={(e) => setWebchat(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="gap-2" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} <Send className="h-4 w-4" /> Conectar
            </Button>
          </div>
          {feedback && <p className="text-sm text-muted-foreground md:col-span-2">{feedback}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
