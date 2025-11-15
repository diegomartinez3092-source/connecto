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
import { Search, Plus, Filter, Download, Phone, Mail, MapPin, Calendar, MessageSquare, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "./ui/utils";

interface Prospecto {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  fuente: string;
  region: string;
  estado: string;
  asignadoA: string;
  fechaCaptura: string;
  ultimoContacto: string;
}

const mockProspectos: Prospecto[] = [
  {
    id: "1",
    nombre: "Roberto Sánchez",
    empresa: "Constructora del Norte",
    email: "roberto@constructora.com",
    telefono: "+52 123 456 7890",
    fuente: "WhatsApp",
    region: "Norte",
    estado: "nuevo",
    asignadoA: "María González",
    fechaCaptura: "2025-10-02",
    ultimoContacto: "2025-10-03",
  },
  {
    id: "2",
    nombre: "Patricia Hernández",
    empresa: "Industrias del Bajío",
    email: "patricia@industrias.com",
    telefono: "+52 987 654 3210",
    fuente: "Campaña Digital",
    region: "Bajío",
    estado: "contactado",
    asignadoA: "Carlos Ruiz",
    fechaCaptura: "2025-09-28",
    ultimoContacto: "2025-10-01",
  },
  {
    id: "3",
    nombre: "Fernando López",
    empresa: "Metales y Más",
    email: "fernando@metales.com",
    telefono: "+52 555 123 4567",
    fuente: "Referido",
    region: "Centro",
    estado: "calificado",
    asignadoA: "Ana Martínez",
    fechaCaptura: "2025-09-25",
    ultimoContacto: "2025-09-30",
  },
  {
    id: "4",
    nombre: "Gabriela Moreno",
    empresa: "Agroindustrias GS",
    email: "gabriela@agro.com",
    telefono: "+52 444 987 6543",
    fuente: "WhatsApp",
    region: "Sur",
    estado: "nuevo",
    asignadoA: "Luis Torres",
    fechaCaptura: "2025-10-04",
    ultimoContacto: "2025-10-04",
  },
  {
    id: "5",
    nombre: "Diego Ramírez",
    empresa: "Paneles Industriales",
    email: "diego@paneles.com",
    telefono: "+52 333 222 1111",
    fuente: "Campaña Digital",
    region: "Occidente",
    estado: "contactado",
    asignadoA: "María González",
    fechaCaptura: "2025-09-30",
    ultimoContacto: "2025-10-02",
  },
];

interface ProspectosProps {
  onNavigate: (view: string) => void;
}

export function Prospectos({ onNavigate }: ProspectosProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFuente, setFilterFuente] = useState("todos");
  const [filterRegion, setFilterRegion] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showNewProspecto, setShowNewProspecto] = useState(false);

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      nuevo: { label: "Nuevo", variant: "default" },
      contactado: { label: "Contactado", variant: "secondary" },
      calificado: { label: "Calificado", variant: "outline" },
    };
    const config = variants[estado] || variants.nuevo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProspectos = mockProspectos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuente = filterFuente === "todos" || p.fuente === filterFuente;
    const matchesRegion = filterRegion === "todos" || p.region === filterRegion;
    const matchesEstado = filterEstado === "todos" || p.estado === filterEstado;
    return matchesSearch && matchesFuente && matchesRegion && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Prospectos</h1>
          <p className="text-muted-foreground">
            Gestiona tus leads y oportunidades de venta
          </p>
        </div>
        <Dialog open={showNewProspecto} onOpenChange={setShowNewProspecto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Prospecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Prospecto</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo prospecto para agregarlo al sistema
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
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Select>
                    <SelectTrigger className="h-12 pt-4 pb-2">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="campana">Campaña Digital</SelectItem>
                      <SelectItem value="referido">Referido</SelectItem>
                      <SelectItem value="web">Sitio Web</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10">
                    Fuente
                  </label>
                </div>
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
                    Asignado a
                  </label>
                </div>
              </div>
              <TextareaWithLabel
                id="notas"
                label="Notas"
                placeholder="Información adicional sobre el prospecto..."
                rows={3}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewProspecto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" onClick={() => setShowNewProspecto(false)}>
                  Guardar Prospecto
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
                <p className="text-[28px] font-semibold text-[#242424]">360</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#DCEAFE] flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#1E88E5]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">71</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Nuevos (7 días)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E9F8F2] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">86</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Calificados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EDEAFF] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">68%</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Tasa Conversión</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF4E5] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">6.3</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Tiempo Promedio (días)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EFF3F8] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#64748B]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">4</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">Fuentes Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFEFE3] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#F97316]" />
              </div>
              <div className="text-right">
                <p className="text-[28px] font-semibold text-[#242424]">31</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5A5A] text-center mt-2">En Seguimiento</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
            <Select value={filterFuente} onValueChange={setFilterFuente}>
              <SelectTrigger>
                <SelectValue placeholder="Fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las fuentes</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Campaña Digital">Campaña Digital</SelectItem>
                <SelectItem value="Referido">Referido</SelectItem>
              </SelectContent>
            </Select>
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
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="contactado">Contactado</SelectItem>
                <SelectItem value="calificado">Calificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Prospectos ({filteredProspectos.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prospecto</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Región</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Último Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProspectos.map((prospecto) => (
                <TableRow key={prospecto.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{prospecto.nombre}</p>
                      <p className="text-sm text-muted-foreground">{prospecto.empresa}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {prospecto.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {prospecto.telefono}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{prospecto.fuente}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {prospecto.region}
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(prospecto.estado)}</TableCell>
                  <TableCell>{prospecto.asignadoA}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {new Date(prospecto.ultimoContacto).toLocaleDateString('es-MX')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("cotizaciones")}
                      >
                        Cotizar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
