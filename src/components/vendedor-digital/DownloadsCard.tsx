import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { downloadConversaciones, downloadLeads } from "../../lib/vendedorDigital/api";
import { useState } from "react";
import { CalendarDays, Download } from "lucide-react";

export function DownloadsCard() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const handleDownload = (action: () => void) => {
    action();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Descargar datos</CardTitle>
        <p className="text-sm text-muted-foreground">
          Exporta leads y conversaciones filtrando por fecha si lo necesitas.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-4">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground" htmlFor="desde">Desde</label>
          <Input
            id="desde"
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground" htmlFor="hasta">Hasta</label>
          <Input
            id="hasta"
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full gap-2" onClick={() => handleDownload(downloadLeads)}>
            <Download className="h-4 w-4" /> Descargar leads
          </Button>
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full gap-2" onClick={() => handleDownload(downloadConversaciones)}>
            <CalendarDays className="h-4 w-4" /> Descargar conversaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
