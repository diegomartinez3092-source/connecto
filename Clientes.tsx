import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputWithLabel } from "./ui/input-with-label";
import { TextareaWithLabel } from "./ui/textarea-with-label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Search, Plus, Filter, Download, Phone, Mail, MapPin, Calendar, FileText, DollarSign, Package, CreditCard, StickyNote, Paperclip, TrendingUp, Users, ShoppingCart, AlertCircle, Upload, CheckCircle2, XCircle, Repeat, ChevronLeft } from "lucide-react";
import { cn } from "./ui/utils";

interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  direccion: string;
  region: string;
  rfc: string;
  fechaRegistro: string;
  ejecutivoAsignado: string;
  totalCompras: number;
  cotizacionesActivas: number;
  estadoPagos: string;
  creditoDisponible: number;
  limiteCredito: number;
}

interface Compra {
  id: string;
  folio: string;
  fecha: string;
  total: number;
  productos: string;
  estado: string;
}

interface Cotizacion {
  id: string;
  folio: string;
  fecha: string;
  total: number;
  estado: string;
}

interface Pago {
  id: string;
  folio: string;
  fecha: string;
  monto: number;
  metodo: string;
  estado: string;
}

interface PreferenciaProducto {
  nombre: string;
  frecuencia: number;
  ultimaCompra: string;
}

interface Nota {
  id: string;
  fecha: string;
  autor: string;
  contenido: string;
}

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string;
  tamaño: string;
}

const mockClientes: Cliente[] = [
  {
    id: "1",
    nombre: "Roberto Sánchez",
    empresa: "Constructora del Norte",
    email: "roberto@constructora.com",
    telefono: "+52 123 456 7890",
    direccion: "Av. Industrial 1234, Monterrey, NL",
    region: "Norte",
    rfc: "CDN980523AB4",
    fechaRegistro: "2024-03-15",
    ejecutivoAsignado: "María González",
    totalCompras: 2450000,
    cotizacionesActivas: 3,
    estadoPagos: "al-corriente",
    creditoDisponible: 150000,
    limiteCredito: 500000,
  },
  {
    id: "2",
    nombre: "Patricia Hernández",
    empresa: "Industrias del Bajío",
    email: "patricia@industrias.com",
    telefono: "+52 987 654 3210",
    direccion: "Calle Reforma 567, León, GTO",
    region: "Bajío",
    rfc: "IDB890712CD2",
    fechaRegistro: "2023-11-08",
    ejecutivoAsignado: "Carlos Ruiz",
    totalCompras: 4820000,
    cotizacionesActivas: 1,
    estadoPagos: "al-corriente",
    creditoDisponible: 800000,
    limiteCredito: 1000000,
  },
  {
    id: "3",
    nombre: "Fernando López",
    empresa: "Metales y Más",
    email: "fernando@metales.com",
    telefono: "+52 555 123 4567",
    direccion: "Blvd. Tecnológico 890, CDMX",
    region: "Centro",
    rfc: "MYM920305EF6",
    fechaRegistro: "2024-01-20",
    ejecutivoAsignado: "Ana Martínez",
    totalCompras: 1890000,
    cotizacionesActivas: 2,
    estadoPagos: "pendiente",
    creditoDisponible: 50000,
    limiteCredito: 300000,
  },
  {
    id: "4",
    nombre: "Gabriela Moreno",
    empresa: "Agroindustrias GS",
    email: "gabriela@agro.com",
    telefono: "+52 444 987 6543",
    direccion: "Carr. Panamericana Km 45, Querétaro",
    region: "Bajío",
    rfc: "AGS850918GH8",
    fechaRegistro: "2023-08-12",
    ejecutivoAsignado: "Luis Torres",
    totalCompras: 6230000,
    cotizacionesActivas: 4,
    estadoPagos: "al-corriente",
    creditoDisponible: 1200000,
    limiteCredito: 1500000,
  },
  {
    id: "5",
    nombre: "Diego Ramírez",
    empresa: "Paneles Industriales",
    email: "diego@paneles.com",
    telefono: "+52 333 222 1111",
    direccion: "Av. Vallarta 2345, Guadalajara, JAL",
    region: "Occidente",
    rfc: "PIN930623IJ9",
    fechaRegistro: "2024-05-03",
    ejecutivoAsignado: "María González",
    totalCompras: 3150000,
    cotizacionesActivas: 2,
    estadoPagos: "vencido",
    creditoDisponible: 0,
    limiteCredito: 600000,
  },
];

const mockCompras: Record<string, Compra[]> = {
  "1": [
    { id: "c1", folio: "FAC-2024-0234", fecha: "2025-09-15", total: 125000, productos: "Lámina galvanizada, PTR 2x2", estado: "entregado" },
    { id: "c2", folio: "FAC-2024-0198", fecha: "2025-08-20", total: 98000, productos: "Varilla corrugada, Alambrón", estado: "entregado" },
    { id: "c3", folio: "FAC-2024-0156", fecha: "2025-07-10", total: 156000, productos: "Perfil PTR 4x4, Ángulo estructural", estado: "entregado" },
  ],
};

const mockCotizaciones: Record<string, Cotizacion[]> = {
  "1": [
    { id: "cot1", folio: "COT-1025-045", fecha: "2025-10-05", total: 185000, estado: "enviada" },
    { id: "cot2", folio: "COT-1025-032", fecha: "2025-09-28", total: 220000, estado: "aceptada" },
    { id: "cot3", folio: "COT-1025-018", fecha: "2025-09-15", total: 98000, estado: "borrador" },
  ],
};

const mockPagos: Record<string, Pago[]> = {
  "1": [
    { id: "p1", folio: "PAG-2024-0456", fecha: "2025-09-20", monto: 125000, metodo: "Transferencia", estado: "completado" },
    { id: "p2", folio: "PAG-2024-0423", fecha: "2025-08-25", monto: 98000, metodo: "Cheque", estado: "completado" },
    { id: "p3", folio: "PAG-2024-0401", fecha: "2025-07-15", monto: 156000, metodo: "Transferencia", estado: "completado" },
  ],
};

const mockPreferencias: Record<string, PreferenciaProducto[]> = {
  "1": [
    { nombre: "Lámina galvanizada calibre 22", frecuencia: 8, ultimaCompra: "2025-09-15" },
    { nombre: "Perfil PTR 2x2x1/8", frecuencia: 6, ultimaCompra: "2025-09-15" },
    { nombre: "Varilla corrugada 3/8", frecuencia: 5, ultimaCompra: "2025-08-20" },
  ],
};

const mockNotas: Record<string, Nota[]> = {
  "1": [
    { id: "n1", fecha: "2025-10-05", autor: "María González", contenido: "Cliente solicitó cotización para nuevo proyecto de construcción. Requiere entrega para noviembre." },
    { id: "n2", fecha: "2025-09-28", autor: "María González", contenido: "Confirmó recepción de material. Muy satisfecho con la calidad del producto." },
  ],
};

const mockDocumentos: Record<string, Documento[]> = {
  "1": [
    { id: "d1", nombre: "Contrato_Marco_2024.pdf", tipo: "PDF", fecha: "2024-03-15", tamaño: "2.4 MB" },
    { id: "d2", nombre: "RFC_ConstNorte.pdf", tipo: "PDF", fecha: "2024-03-15", tamaño: "1.1 MB" },
    { id: "d3", nombre: "Cedula_Fiscal.pdf", tipo: "PDF", fecha: "2024-03-15", tamaño: "890 KB" },
  ],
};

interface ClientesProps {
  onNavigate?: (view: string) => void;
  clienteDetalleId?: string;
  onClienteDetalleClose?: () => void;
}

export function Clientes({ onNavigate, clienteDetalleId, onClienteDetalleClose }: ClientesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("todos");
  const [filterEstadoPagos, setFilterEstadoPagos] = useState("todos");
  const [filterEjecutivo, setFilterEjecutivo] = useState("todos");
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const getEstadoPagosBadge = (estado: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      "al-corriente": { label: "Al corriente", className: "bg-green-100 text-green-800 border-green-300" },
      "pendiente": { label: "Pendiente", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      "vencido": { label: "Vencido", className: "bg-red-100 text-red-800 border-red-300" },
    };
    const config = variants[estado] || variants["al-corriente"];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const filteredClientes = mockClientes.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === "todos" || c.region === filterRegion;
    const matchesEstadoPagos = filterEstadoPagos === "todos" || c.estadoPagos === filterEstadoPagos;
    const matchesEjecutivo = filterEjecutivo === "todos" || c.ejecutivoAsignado === filterEjecutivo;
    return matchesSearch && matchesRegion && matchesEstadoPagos && matchesEjecutivo;
  });

  const handleVerDetalle = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    if (onNavigate) {
      onNavigate(`cliente-detalle-${cliente.id}`);
    }
  };

  // Calcular métricas
  const totalClientes = 248;
  const nuevosClientes = 14;
  const clientesActivos = 172;
  const clientesInactivos = 76;
  const valorTotalYTD = 12.4; // en millones
  const ticketPromedio = 72; // en miles
  const tasaRetencion = 81; // porcentaje
  
  // Si estamos viendo el detalle de un cliente
  if (clienteDetalleId) {
    const clienteId = clienteDetalleId.replace('cliente-detalle-', '');
    const cliente = mockClientes.find(c => c.id === clienteId);
    
    if (!cliente) {
      return (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => onClienteDetalleClose && onClienteDetalleClose()}
              className="text-muted-foreground hover:text-foreground underline flex items-center gap-1 transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a Clientes
            </button>
            <p>Cliente no encontrado</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div>
          <button
            onClick={() => onClienteDetalleClose && onClienteDetalleClose()}
            className="text-muted-foreground hover:text-foreground underline flex items-center gap-1 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a Clientes
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">{cliente.nombre}</h1>
            {getEstadoPagosBadge(cliente.estadoPagos)}
          </div>
          <p className="text-muted-foreground">{cliente.empresa}</p>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">RFC</p>
                <p>{cliente.rfc}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Región</p>
                <p>{cliente.region}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ejecutivo Asignado</p>
                <p>{cliente.ejecutivoAsignado}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cliente desde</p>
                <p>{new Date(cliente.fechaRegistro).toLocaleDateString("es-MX")}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p>{cliente.telefono}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p>{cliente.direccion}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Financiera */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Total Compras</p>
              </div>
              <p className="text-2xl">${cliente.totalCompras.toLocaleString("es-MX")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Crédito Disponible</p>
              </div>
              <p className="text-2xl">${cliente.creditoDisponible.toLocaleString("es-MX")}</p>
              <p className="text-sm text-muted-foreground">de ${cliente.limiteCredito.toLocaleString("es-MX")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Cotizaciones Activas</p>
              </div>
              <p className="text-2xl">{cliente.cotizacionesActivas}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes secciones */}
        <Tabs defaultValue="compras" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="compras">Compras</TabsTrigger>
            <TabsTrigger value="cotizaciones">Cotizaciones</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
            <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          {/* Historial de Compras */}
          <TabsContent value="compras" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(mockCompras[cliente.id] || []).map((compra) => (
                      <TableRow key={compra.id}>
                        <TableCell className="font-medium">{compra.folio}</TableCell>
                        <TableCell>{new Date(compra.fecha).toLocaleDateString("es-MX")}</TableCell>
                        <TableCell>{compra.productos}</TableCell>
                        <TableCell>${compra.total.toLocaleString("es-MX")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            {compra.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cotizaciones */}
          <TabsContent value="cotizaciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(mockCotizaciones[cliente.id] || []).map((cot) => (
                      <TableRow key={cot.id}>
                        <TableCell className="font-medium">{cot.folio}</TableCell>
                        <TableCell>{new Date(cot.fecha).toLocaleDateString("es-MX")}</TableCell>
                        <TableCell>${cot.total.toLocaleString("es-MX")}</TableCell>
                        <TableCell>
                          <Badge variant={cot.estado === "aceptada" ? "default" : "outline"}>
                            {cot.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seguimiento de Pagos */}
          <TabsContent value="pagos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(mockPagos[cliente.id] || []).map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell className="font-medium">{pago.folio}</TableCell>
                        <TableCell>{new Date(pago.fecha).toLocaleDateString("es-MX")}</TableCell>
                        <TableCell>${pago.monto.toLocaleString("es-MX")}</TableCell>
                        <TableCell>{pago.metodo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            {pago.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferencias de Productos */}
          <TabsContent value="preferencias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Comprados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(mockPreferencias[cliente.id] || []).map((pref, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{pref.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            Última compra: {new Date(pref.ultimaCompra).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{pref.frecuencia} compras</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notas</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(mockNotas[cliente.id] || []).map((nota) => (
                    <div key={nota.id} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start gap-3">
                        <StickyNote className="w-5 h-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              {nota.autor} • {new Date(nota.fecha).toLocaleDateString("es-MX")}
                            </p>
                          </div>
                          <p>{nota.contenido}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Adjuntos */}
          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documentos Adjuntos</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Subir Documento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(mockDocumentos[cliente.id] || []).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.tipo} • {doc.tamaño} • {new Date(doc.fecha).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes y su historial comercial
          </p>
        </div>
        <Dialog open={showNewCliente} onOpenChange={setShowNewCliente}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo cliente para agregarlo al sistema
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  id="nombre"
                  label="Nombre Completo"
                  placeholder="Juan Pérez"
                />
                <InputWithLabel
                  id="empresa"
                  label="Empresa"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  id="email"
                  type="email"
                  label="Correo Electrónico"
                  placeholder="juan@empresa.com"
                />
                <InputWithLabel
                  id="telefono"
                  label="Teléfono"
                  placeholder="+52 123 456 7890"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  id="rfc"
                  label="RFC"
                  placeholder="ABC123456XYZ"
                />
                <div className="relative">
                  <Select>
                    <SelectTrigger className="h-12 pt-4 pb-2">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="norte">Norte</SelectItem>
                      <SelectItem value="sur">Sur</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="bajio">Bajío</SelectItem>
                      <SelectItem value="occidente">Occidente</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10">
                    Región
                  </label>
                </div>
              </div>
              <InputWithLabel
                id="direccion"
                label="Dirección Fiscal"
                placeholder="Calle, número, colonia, ciudad, estado"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  id="limiteCredito"
                  type="number"
                  label="Límite de Crédito ($)"
                  placeholder="500000"
                />
                <div className="relative">
                  <Select>
                    <SelectTrigger className="h-12 pt-4 pb-2">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria">María González</SelectItem>
                      <SelectItem value="carlos">Carlos Ruiz</SelectItem>
                      <SelectItem value="ana">Ana Martínez</SelectItem>
                      <SelectItem value="luis">Luis Torres</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10">
                    Ejecutivo Asignado
                  </label>
                </div>
              </div>
              <TextareaWithLabel
                id="notas"
                label="Notas Iniciales"
                placeholder="Información adicional sobre el cliente..."
                rows={3}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewCliente(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" onClick={() => setShowNewCliente(false)}>
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F0FE] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#4285F4]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">{totalClientes}</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Clientes Totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#DCEAFE] flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#1E88E5]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">{nuevosClientes}</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Nuevos (30 días)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E9F8F2] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">{clientesActivos}</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Clientes Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#9CA3AF]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">{clientesInactivos}</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Clientes Inactivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF4E5] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">${valorTotalYTD}M</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Valor Total (YTD)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EDEAFF] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">${ticketPromedio}K</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Ticket Promedio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFEFE3] flex items-center justify-center">
                <Repeat className="w-5 h-5 text-[#F97316]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">{tasaRetencion}%</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Tasa de Retención</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, empresa o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las regiones</SelectItem>
                <SelectItem value="Norte">Norte</SelectItem>
                <SelectItem value="Sur">Sur</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
                <SelectItem value="Bajío">Bajío</SelectItem>
                <SelectItem value="Occidente">Occidente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstadoPagos} onValueChange={setFilterEstadoPagos}>
              <SelectTrigger>
                <SelectValue placeholder="Estado de Pagos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="al-corriente">Al corriente</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEjecutivo} onValueChange={setFilterEjecutivo}>
              <SelectTrigger>
                <SelectValue placeholder="Ejecutivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los ejecutivos</SelectItem>
                <SelectItem value="María González">María González</SelectItem>
                <SelectItem value="Carlos Ruiz">Carlos Ruiz</SelectItem>
                <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                <SelectItem value="Luis Torres">Luis Torres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Clientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cartera de Clientes ({filteredClientes.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>Ejecutivo</TableHead>
                  <TableHead>Total Compras</TableHead>
                  <TableHead>Cot. Activas</TableHead>
                  <TableHead>Estado Pagos</TableHead>
                  <TableHead>Crédito</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleVerDetalle(cliente)}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cliente.nombre}</p>
                        <p className="text-sm text-muted-foreground">{cliente.empresa}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span>{cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{cliente.telefono}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cliente.region}</Badge>
                    </TableCell>
                    <TableCell>{cliente.ejecutivoAsignado}</TableCell>
                    <TableCell>${cliente.totalCompras.toLocaleString("es-MX")}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cliente.cotizacionesActivas}</Badge>
                    </TableCell>
                    <TableCell>{getEstadoPagosBadge(cliente.estadoPagos)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>${cliente.creditoDisponible.toLocaleString("es-MX")}</p>
                        <p className="text-muted-foreground">de ${cliente.limiteCredito.toLocaleString("es-MX")}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(cliente);
                        }}
                      >
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
