import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Receipt, Download, Eye, Clock, CheckCircle, XCircle } from "lucide-react";

export function Facturacion() {
  const facturas = [
    {
      id: "1",
      folio: "FAC-2025-001",
      cliente: "Constructora Moderna",
      fecha: "2025-10-10",
      monto: 345600,
      estado: "pagada",
      fechaPago: "2025-10-15",
    },
    {
      id: "2",
      folio: "FAC-2025-002",
      cliente: "Fábrica del Norte",
      fecha: "2025-10-08",
      monto: 123400,
      estado: "pendiente",
      fechaVencimiento: "2025-11-08",
    },
    {
      id: "3",
      folio: "FAC-2025-003",
      cliente: "Industrias del Bajío",
      fecha: "2025-09-28",
      monto: 89750,
      estado: "vencida",
      fechaVencimiento: "2025-10-28",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }
    > = {
      pagada: { label: "Pagada", variant: "outline", icon: CheckCircle },
      pendiente: { label: "Pendiente", variant: "secondary", icon: Clock },
      vencida: { label: "Vencida", variant: "destructive", icon: XCircle },
    };
    const config = variants[estado] || variants.pendiente;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Facturación</h1>
        <p className="text-muted-foreground">
          Gestiona facturas, cuentas por cobrar y pagos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Facturado</p>
            <p className="text-2xl">$3.2M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Por Cobrar</p>
            <p className="text-2xl text-yellow-600">$456k</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Vencidas</p>
            <p className="text-2xl text-red-600">$89k</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Cobradas</p>
            <p className="text-2xl text-green-600">$2.7M</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Facturas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-semibold">{factura.folio}</TableCell>
                  <TableCell>{factura.cliente}</TableCell>
                  <TableCell>
                    {new Date(factura.fecha).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    ${factura.monto.toLocaleString("es-MX")}
                  </TableCell>
                  <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                  <TableCell>
                    {factura.fechaPago
                      ? new Date(factura.fechaPago).toLocaleDateString("es-MX")
                      : factura.fechaVencimiento
                      ? new Date(factura.fechaVencimiento).toLocaleDateString("es-MX")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card className="bg-accent/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Integración Contable</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Esta sección vincula cotizaciones cerradas con facturación automática.
                Conecta con tu sistema contable (SAT, CFDI) para timbrado y gestión de
                cuentas por cobrar.
              </p>
              <Button variant="outline" size="sm">
                Configurar Integración
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
