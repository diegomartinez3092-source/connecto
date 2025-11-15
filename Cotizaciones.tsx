import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputWithLabel } from "./ui/input-with-label";
import { PhoneInputWithLabel } from "./ui/phone-input-with-label";
import { TextareaWithLabel } from "./ui/textarea-with-label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Plus, Trash2, FileText, Download, Send, Calculator, Search, ChevronLeft, ChevronRight, FilePenLine, CheckCircle2, XCircle, TrendingUp, Filter, X, ArrowUp, GripVertical, Edit2, Mic, Image as ImageIcon, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { cn } from "./ui/utils";
import { format } from "date-fns@4.1.0";
import { es } from "date-fns@4.1.0/locale";

interface LineItem {
  id: string;
  tipo: "producto" | "servicio";
  nombre: string;
  sku: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

interface CotizacionExistente {
  id: string;
  folio: string;
  cliente: string;
  empresa: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  total: number;
  estado: string;
  vendedor: string;
  version: number;
  tipo: "prospecto" | "cliente";
  fuente: string;
}

interface VersionHistorial {
  version: number;
  fechaCreacion: string;
  fechaVencimiento: string;
  vendedor: string;
  estado: string;
  total: number;
  cambios: string;
  fuente: string;
}

// Lista de 15 vendedores
const vendedores = [
  "María González",
  "Carlos Ruiz",
  "Ana Martínez",
  "José López",
  "Laura Fernández",
  "Roberto Sánchez",
  "Patricia Hernández",
  "Miguel Torres",
  "Carmen Ramírez",
  "David Morales",
  "Elena Castro",
  "Francisco Ortiz",
  "Sofía Jiménez",
  "Javier Romero",
  "Isabel Navarro"
];

// Catálogo de productos para el dropdown
const catalogoProductos = [
  { id: "1", nombre: "Lámina galvanizada calibre 22", sku: "LG-22-001" },
  { id: "2", nombre: "Lámina galvanizada calibre 24", sku: "LG-24-001" },
  { id: "3", nombre: "Perfil PTR 2x2x1/8", sku: "PTR-2X2-001" },
  { id: "4", nombre: "Perfil PTR 4x4x1/4", sku: "PTR-4X4-001" },
  { id: "5", nombre: "Varilla corrugada 3/8", sku: "VC-38-001" },
  { id: "6", nombre: "Varilla corrugada 1/2", sku: "VC-12-001" },
  { id: "7", nombre: "Alambrón", sku: "ALM-001" },
  { id: "8", nombre: "Malla electrosoldada 6x6-10/10", sku: "ME-66-001" },
  { id: "9", nombre: "Ángulo estructural 2x2x1/4", sku: "AE-2X2-001" },
  { id: "10", nombre: "Canal estructural 6x2.5", sku: "CE-6X25-001" },
  { id: "11", nombre: "Viga IPR 6", sku: "IPR-6-001" },
  { id: "12", nombre: "Viga IPR 8", sku: "IPR-8-001" },
  { id: "13", nombre: "Placa de acero A36 1/4", sku: "PA-36-001" },
  { id: "14", nombre: "Tornillo estructural 3/4x3", sku: "TE-34-001" },
  { id: "15", nombre: "Pintura anticorrosiva", sku: "PANT-001" },
];

// Catálogo de servicios
const catalogoServicios = [
  { id: "s1", nombre: "Instalación de estructura metálica", sku: "SRV-INST-001" },
  { id: "s2", nombre: "Soldadura especializada", sku: "SRV-SOLD-001" },
  { id: "s3", nombre: "Corte y doblado de lámina", sku: "SRV-CORT-001" },
  { id: "s4", nombre: "Montaje de techumbre", sku: "SRV-MONT-001" },
  { id: "s5", nombre: "Mantenimiento preventivo", sku: "SRV-MANT-001" },
  { id: "s6", nombre: "Pintura y acabados", sku: "SRV-PINT-001" },
  { id: "s7", nombre: "Diseño estructural", sku: "SRV-DISE-001" },
  { id: "s8", nombre: "Consultoría técnica", sku: "SRV-CONS-001" },
];

// Nombres de clientes y empresas para generar datos realistas
const clientes = [
  { nombre: "Roberto Sánchez", empresa: "Constructora del Norte" },
  { nombre: "Patricia Hernández", empresa: "Industrias del Bajío" },
  { nombre: "Fernando López", empresa: "Metales y Más" },
  { nombre: "Alejandro Díaz", empresa: "Aceros del Pacífico" },
  { nombre: "Carmen Rodríguez", empresa: "Construcciones Monterrey" },
  { nombre: "José Martínez", empresa: "Estructuras Industriales" },
  { nombre: "Laura García", empresa: "Techados y Acabados" },
  { nombre: "Miguel Torres", empresa: "Soluciones Metálicas" },
  { nombre: "Ana Jiménez", empresa: "Grupo Constructor del Bajío" },
  { nombre: "Carlos Moreno", empresa: "Industrias del Acero" },
  { nombre: "Isabel Romero", empresa: "Metales Industrializados" },
  { nombre: "Francisco Gutiérrez", empresa: "Construcciones Modernas" },
  { nombre: "Elena Castro", empresa: "Láminas y Perfiles SA" },
  { nombre: "David Vargas", empresa: "Aceroindustria del Norte" },
  { nombre: "Sofía Mendoza", empresa: "Techosol Industrial" },
];

const estados = ["borrador", "enviada", "aceptada", "declinada", "expirada"];

const fuentes = ["WhatsApp", "Campaña Digital", "Referido", "Sitio Web", "Llamada Directa"];

// Generar 360 cotizaciones
const generarCotizaciones = (): CotizacionExistente[] => {
  const cotizaciones: CotizacionExistente[] = [];
  const hoy = new Date("2025-10-04");
  
  for (let i = 1; i <= 360; i++) {
    const diasAtras = Math.floor(Math.random() * 180);
    const fechaCreacion = new Date(hoy);
    fechaCreacion.setDate(fechaCreacion.getDate() - diasAtras);
    
    const diasVigencia = 15 + Math.floor(Math.random() * 46);
    const fechaVencimiento = new Date(fechaCreacion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasVigencia);
    
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];
    const vendedor = vendedores[Math.floor(Math.random() * vendedores.length)];
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const fuente = fuentes[Math.floor(Math.random() * fuentes.length)];
    const total = 10000 + Math.random() * 490000;
    const version = 1 + Math.floor(Math.random() * 5);
    const tipo: "prospecto" | "cliente" = i <= 240 ? "prospecto" : "cliente";
    
    cotizaciones.push({
      id: i.toString(),
      folio: `COT-2025-${String(i).padStart(3, "0")}`,
      cliente: cliente.nombre,
      empresa: cliente.empresa,
      fechaCreacion: fechaCreacion.toISOString().split("T")[0],
      fechaVencimiento: fechaVencimiento.toISOString().split("T")[0],
      total: Math.round(total * 100) / 100,
      estado,
      vendedor,
      version,
      tipo,
      fuente,
    });
  }
  
  return cotizaciones.sort((a, b) => 
    new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  );
};

const mockCotizaciones: CotizacionExistente[] = generarCotizaciones();

// Componente para el filtro de vendedores con buscador
function VendedorFilterContent({ 
  vendedores, 
  selectedVendedores, 
  toggleVendedor 
}: { 
  vendedores: string[]; 
  selectedVendedores: string[]; 
  toggleVendedor: (vendedor: string) => void;
}) {
  const [searchVendedor, setSearchVendedor] = useState("");
  
  const filteredVendedores = useMemo(() => {
    if (!searchVendedor.trim()) return vendedores;
    return vendedores.filter(vendedor => 
      vendedor.toLowerCase().includes(searchVendedor.toLowerCase())
    );
  }, [vendedores, searchVendedor]);

  return (
    <div className="space-y-3">
      <h4>Filtrar por Ejecutivo</h4>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ejecutivo..."
          value={searchVendedor}
          onChange={(e) => setSearchVendedor(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredVendedores.length > 0 ? (
          filteredVendedores.map((vendedor) => (
            <div key={vendedor} className="flex items-center space-x-2">
              <Checkbox
                id={`vendedor-${vendedor}`}
                checked={selectedVendedores.includes(vendedor)}
                onCheckedChange={() => toggleVendedor(vendedor)}
              />
              <label
                htmlFor={`vendedor-${vendedor}`}
                className="text-sm cursor-pointer flex-1"
              >
                {vendedor}
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No se encontraron ejecutivos
          </p>
        )}
      </div>
    </div>
  );
}

// Componente de selector de ejecutivo
function EjecutivoSelector({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [searchEjecutivo, setSearchEjecutivo] = useState("");
  const [open, setOpen] = useState(false);
  
  const filteredEjecutivos = useMemo(() => {
    if (!searchEjecutivo.trim()) return vendedores;
    return vendedores.filter(ejecutivo => 
      ejecutivo.toLowerCase().includes(searchEjecutivo.toLowerCase())
    );
  }, [searchEjecutivo]);

  const handleSelect = (ejecutivo: string) => {
    onChange(ejecutivo);
    setOpen(false);
    setSearchEjecutivo("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full h-12 px-3 bg-card border border-border rounded-md text-left flex items-center justify-between hover:bg-accent transition-colors">
          <span className={value ? "" : "text-muted-foreground"}>
            {value || "Seleccionar ejecutivo"}
          </span>
          <ChevronRight className="w-4 h-4 opacity-50 rotate-90" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="p-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ejecutivo..."
              value={searchEjecutivo}
              onChange={(e) => setSearchEjecutivo(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredEjecutivos.length > 0 ? (
              filteredEjecutivos.map((ejecutivo) => (
                <button
                  key={ejecutivo}
                  onClick={() => handleSelect(ejecutivo)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                >
                  {ejecutivo}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron ejecutivos
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Componente de selector de producto/servicio
function ProductoSelector({ 
  tipo,
  value, 
  onChange,
  onSelectProduct
}: { 
  tipo: "producto" | "servicio";
  value: string; 
  onChange: (value: string) => void;
  onSelectProduct?: (nombre: string, sku: string) => void;
}) {
  const [searchProducto, setSearchProducto] = useState("");
  const [open, setOpen] = useState(false);
  
  const catalogo = tipo === "producto" ? catalogoProductos : catalogoServicios;
  
  const filteredProductos = useMemo(() => {
    if (!searchProducto.trim()) return catalogo;
    return catalogo.filter(item => 
      item.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
      ('sku' in item && item.sku.toLowerCase().includes(searchProducto.toLowerCase()))
    );
  }, [searchProducto, catalogo]);

  const handleSelect = (item: typeof catalogo[0]) => {
    onChange(item.nombre);
    if (onSelectProduct && 'sku' in item) {
      onSelectProduct(item.nombre, item.sku);
    }
    setOpen(false);
    setSearchProducto("");
  };

  const placeholderText = tipo === "producto" 
    ? "Selecciona o agrega producto" 
    : "Selecciona o agrega servicio";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full h-12 px-3 bg-card border border-border rounded-md text-left flex items-center justify-between hover:bg-accent transition-colors">
          <span className={value ? "" : "text-muted-foreground"}>
            {value || placeholderText}
          </span>
          <ChevronRight className="w-4 h-4 opacity-50 rotate-90" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${tipo}...`}
              value={searchProducto}
              onChange={(e) => setSearchProducto(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredProductos.length > 0 ? (
              filteredProductos.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                >
                  <div>{item.nombre}</div>
                  {'sku' in item && (
                    <div className="text-xs text-muted-foreground">{item.sku}</div>
                  )}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron resultados
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CotizacionesProps {
  onModeChange?: (isNewCotizacion: boolean) => void;
}

// Helper para capitalizar la primera letra
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function Cotizaciones({ onModeChange }: CotizacionesProps = {}) {
  const topRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"todas" | "prospectos" | "clientes">("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [selectedVendedores, setSelectedVendedores] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewCotizacion, setShowNewCotizacion] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState<CotizacionExistente | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Estados para nueva cotización
  const [tipoCliente, setTipoCliente] = useState<"prospecto" | "cliente">("prospecto");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [movil, setMovil] = useState("");
  const [correo, setCorreo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [direccionEmpresa, setDireccionEmpresa] = useState("");
  const [ejecutivoAsignado, setEjecutivoAsignado] = useState("");
  const [nombreCotizacion, setNombreCotizacion] = useState("");
  const [moneda, setMoneda] = useState("MXN");
  const [estadoCotizacion, setEstadoCotizacion] = useState("borrador");
  const [fechaCreacion, setFechaCreacion] = useState<Date>(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [impuesto, setImpuesto] = useState(16);
  const [flete, setFlete] = useState(2500);
  const [comentarios, setComentarios] = useState("");
  const [esBorrador, setEsBorrador] = useState(false);

  const itemsPerPage = 50;

  // Notificar cambios de modo a App.tsx
  useEffect(() => {
    onModeChange?.(showNewCotizacion);
  }, [showNewCotizacion, onModeChange]);

  // Detectar scroll para mostrar botón
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filtrar cotizaciones
  const filteredCotizaciones = useMemo(() => {
    let filtered = mockCotizaciones;

    // Filtrar por tab
    if (activeTab === "prospectos") {
      filtered = filtered.filter(c => c.tipo === "prospecto");
    } else if (activeTab === "clientes") {
      filtered = filtered.filter(c => c.tipo === "cliente");
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.folio.toLowerCase().includes(search) ||
        c.cliente.toLowerCase().includes(search) ||
        c.empresa.toLowerCase().includes(search)
      );
    }

    // Filtrar por estado
    if (selectedEstados.length > 0) {
      filtered = filtered.filter(c => selectedEstados.includes(c.estado));
    }

    // Filtrar por vendedor
    if (selectedVendedores.length > 0) {
      filtered = filtered.filter(c => selectedVendedores.includes(c.vendedor));
    }

    return filtered;
  }, [activeTab, searchTerm, selectedEstados, selectedVendedores]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const cotizaciones = activeTab === "todas" ? mockCotizaciones :
                        activeTab === "prospectos" ? mockCotizaciones.filter(c => c.tipo === "prospecto") :
                        mockCotizaciones.filter(c => c.tipo === "cliente");

    return {
      total: cotizaciones.length,
      borradores: cotizaciones.filter(c => c.estado === "borrador").length,
      enviadas: cotizaciones.filter(c => c.estado === "enviada").length,
      aceptadas: cotizaciones.filter(c => c.estado === "aceptada").length,
      declinadas: cotizaciones.filter(c => c.estado === "declinada").length,
      expiradas: cotizaciones.filter(c => c.estado === "expirada").length,
      valorTotal: cotizaciones.reduce((sum, c) => sum + c.total, 0),
    };
  }, [activeTab]);

  // Totales para tabs
  const totalTodas = mockCotizaciones.length;
  const totalProspectos = mockCotizaciones.filter(c => c.tipo === "prospecto").length;
  const totalClientes = mockCotizaciones.filter(c => c.tipo === "cliente").length;

  // Paginación
  const totalCotizaciones = filteredCotizaciones.length;
  const totalPages = Math.ceil(totalCotizaciones / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCotizaciones);
  const paginatedCotizaciones = filteredCotizaciones.slice(startIndex, endIndex);

  // Handlers
  const handleTabChange = (tab: "todas" | "prospectos" | "clientes") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const toggleEstado = (estado: string) => {
    setSelectedEstados(prev =>
      prev.includes(estado) ? prev.filter(e => e !== estado) : [...prev, estado]
    );
    setCurrentPage(1);
  };

  const toggleVendedor = (vendedor: string) => {
    setSelectedVendedores(prev =>
      prev.includes(vendedor) ? prev.filter(v => v !== vendedor) : [...prev, vendedor]
    );
    setCurrentPage(1);
  };

  const removeEstadoFilter = (estado: string) => {
    setSelectedEstados(prev => prev.filter(e => e !== estado));
  };

  const removeVendedorFilter = (vendedor: string) => {
    setSelectedVendedores(prev => prev.filter(v => v !== vendedor));
  };

  const clearAllFilters = () => {
    setSelectedEstados([]);
    setSelectedVendedores([]);
    setSearchTerm("");
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      scrollToTop();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      scrollToTop();
    }
  };

  const handleVerDetalle = (cotizacion: CotizacionExistente) => {
    setSelectedCotizacion(cotizacion);
    setShowDetalle(true);
  };

  const handleVolverALista = () => {
    setShowDetalle(false);
    setSelectedCotizacion(null);
  };

  const handleOpenNewCotizacion = () => {
    // Reset form
    setTipoCliente("prospecto");
    setNombreCompleto("");
    setMovil("");
    setCorreo("");
    setEmpresa("");
    setDireccionEmpresa("");
    setEjecutivoAsignado("");
    setNombreCotizacion("");
    setMoneda("MXN");
    setEstadoCotizacion("borrador");
    setFechaCreacion(new Date());
    setFechaVencimiento(new Date(new Date().setDate(new Date().getDate() + 30)));
    setLineItems([]);
    setImpuesto(16);
    setFlete(2500);
    setComentarios("");
    setShowNewCotizacion(true);
  };

  const handleAddLineItem = (tipo: "producto" | "servicio") => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      tipo,
      nombre: "",
      sku: "",
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0,
    };
    setLineItems(prev => [...prev, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const updated = { ...item, [field]: value };
      
      // Recalcular subtotal
      const subtotalBase = updated.cantidad * updated.precioUnitario;
      const descuentoAmount = subtotalBase * (updated.descuento / 100);
      updated.subtotal = subtotalBase - descuentoAmount;
      
      return updated;
    }));
  };

  const handleProductSelect = (itemId: string, nombre: string, sku: string) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, nombre, sku };
    }));
  };

  // Calcular totales
  const totales = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentoTotal = lineItems.reduce((sum, item) => {
      const subtotalItem = item.cantidad * item.precioUnitario;
      return sum + (subtotalItem * (item.descuento / 100));
    }, 0);
    const totalImpuesto = subtotal * (impuesto / 100);
    const total = subtotal + totalImpuesto + flete;
    
    return {
      subtotal,
      descuentoTotal,
      totalImpuesto,
      total,
    };
  }, [lineItems, impuesto, flete]);

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { bg: string; color: string; label: string }> = {
      borrador: { bg: "#d6eafe", color: "#1e40af", label: "Borrador" },
      enviada: { bg: "#e8e7ff", color: "#4338ca", label: "Enviada" },
      aceptada: { bg: "#d1fae5", color: "#065f46", label: "Aceptada" },
      declinada: { bg: "#fee2e2", color: "#991b1b", label: "Declinada" },
      expirada: { bg: "#fed7aa", color: "#9a3412", label: "Expirada" },
    };

    const config = variants[estado] || { bg: "#E8E7E4", color: "#6B6B6B", label: estado };
    return (
      <Badge 
        variant="secondary" 
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </Badge>
    );
  };

  const getEstadoConfig = (estado: string) => {
    const configs: Record<string, { bg: string; color: string; label: string; icon: any }> = {
      borrador: { bg: "#d6eafe", color: "#1e40af", label: "Borrador", icon: FilePenLine },
      enviada: { bg: "#e8e7ff", color: "#4338ca", label: "Enviada", icon: Send },
      aceptada: { bg: "#d1fae5", color: "#065f46", label: "Aceptada", icon: CheckCircle2 },
      declinada: { bg: "#fee2e2", color: "#991b1b", label: "Declinada", icon: XCircle },
    };
    return configs[estado] || { bg: "#E8E7E4", color: "#6B6B6B", label: estado, icon: FileText };
  };

  // Generar historial de versiones mock
  const generarHistorial = (cotizacion: CotizacionExistente): VersionHistorial[] => {
    const historial: VersionHistorial[] = [];
    
    for (let v = 1; v <= cotizacion.version; v++) {
      const fechaBase = new Date(cotizacion.fechaCreacion);
      fechaBase.setDate(fechaBase.getDate() - (cotizacion.version - v) * 5);
      
      const vencimientoBase = new Date(fechaBase);
      vencimientoBase.setDate(vencimientoBase.getDate() + 30);
      
      historial.push({
        version: v,
        fechaCreacion: fechaBase.toISOString().split("T")[0],
        fechaVencimiento: vencimientoBase.toISOString().split("T")[0],
        vendedor: cotizacion.vendedor,
        estado: v === cotizacion.version ? cotizacion.estado : (v === 1 ? "borrador" : "enviada"),
        total: cotizacion.total * (0.9 + Math.random() * 0.2),
        cambios: v === 1 ? "Versión inicial" : `Actualización ${v}: Ajuste de precios y descuentos`,
        fuente: cotizacion.fuente,
      });
    }
    
    // Invertir el orden para que la cotización actual aparezca primero (descendente)
    return historial.reverse();
  };

  // Vista de Nueva Cotización (pantalla completa)
  if (showNewCotizacion) {
    return (
      <div className="space-y-6 min-h-screen -m-8 p-8 transition-colors duration-300" style={{ backgroundColor: '#BFF6FD' }}>
        {/* Breadcrumb */}
        <div className="container mx-auto flex items-center gap-2">
          <button
            onClick={() => setShowNewCotizacion(false)}
            className="text-foreground hover:text-foreground/80 underline flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a Cotizaciones
          </button>
        </div>

        {/* Formulario en bloque blanco */}
        <div className="container mx-auto bg-card rounded-lg p-8 space-y-6 border-2 border-border shadow-sm">
          {/* Header dentro del bloque con ejecutivo y estado */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] font-bold leading-[1.4]">Nueva: COT-1025-001</h1>
                <Badge variant="outline" className="border-foreground text-foreground">V1</Badge>
              </div>
              <p className="text-muted-foreground">
                Completa la información para generar una cotización
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="min-w-[240px]">
                <EjecutivoSelector
                  value={ejecutivoAsignado}
                  onChange={setEjecutivoAsignado}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-12 px-3 bg-card border border-border rounded-md flex items-center gap-2 hover:bg-accent transition-colors min-w-[180px]">
                    {(() => {
                      const config = getEstadoConfig(estadoCotizacion);
                      const Icon = config.icon;
                      return (
                        <>
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: config.bg }}
                          >
                            <Icon className="w-4 h-4" style={{ color: config.color }} />
                          </div>
                          <span>{config.label}</span>
                        </>
                      );
                    })()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2" align="end">
                  <div className="space-y-1">
                    {["borrador", "enviada", "aceptada", "declinada"].map((estado) => {
                      const config = getEstadoConfig(estado);
                      const Icon = config.icon;
                      return (
                        <button
                          key={estado}
                          onClick={() => setEstadoCotizacion(estado)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-left"
                        >
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: config.bg }}
                          >
                            <Icon className="w-4 h-4" style={{ color: config.color }} />
                          </div>
                          <span className="text-sm">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="-mx-8 border-t-[3px]" style={{ borderColor: '#242424' }} />

          {/* 1. Datos prospecto */}
          <div className="space-y-4">
            <h3 className="font-bold">Datos {tipoCliente === "prospecto" ? "prospecto" : "cliente"}</h3>
            
            {/* Todos los campos en una línea horizontal */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <InputWithLabel
                  id="nombreCompleto"
                  label="Nombre completo"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="col-span-2">
                <PhoneInputWithLabel
                  id="movil"
                  label="Móvil"
                  value={movil}
                  onChange={setMovil}
                />
              </div>
              
              <div className="col-span-2">
                <InputWithLabel
                  id="correo"
                  type="email"
                  label="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="col-span-2">
                <InputWithLabel
                  id="empresa"
                  label="Empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="col-span-3">
                <InputWithLabel
                  id="direccionEmpresa"
                  label="Dirección de empresa"
                  value={direccionEmpresa}
                  onChange={(e) => setDireccionEmpresa(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 2. Detalles generales */}
          <div className="space-y-4">
            <h3 className="font-bold">Detalles generales</h3>
            
            {/* Todos los campos en una línea horizontal */}
            <div className="flex gap-4 items-end">
              {/* Moneda - ahora primero y ancho reducido */}
              <div className="w-24">
                <div className="relative">
                  <Select value={moneda} onValueChange={setMoneda}>
                    <SelectTrigger className="h-12 pt-4 pb-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">MXN</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10">
                    Moneda
                  </label>
                </div>
              </div>
              
              {/* Creación - ancho reducido */}
              <div className="w-[140px]">
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full h-12 px-3 bg-card border border-border rounded-md text-left flex items-center gap-2 hover:bg-accent transition-colors pt-4 pb-2">
                        <CalendarIcon className="w-4 h-4" />
                        {format(fechaCreacion, "d/M/yy")}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fechaCreacion}
                        onSelect={(date) => date && setFechaCreacion(date)}
                        locale={es}
                        formatters={{
                          formatCaption: (date) => {
                            const monthYear = format(date, "MMMM yyyy", { locale: es });
                            return capitalizeFirstLetter(monthYear);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10">
                    Creación
                  </label>
                </div>
              </div>
              
              {/* Vencimiento - ancho reducido */}
              <div className="w-[140px]">
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full h-12 px-3 bg-card border border-border rounded-md text-left flex items-center gap-2 hover:bg-accent transition-colors pt-4 pb-2">
                        <CalendarIcon className="w-4 h-4" />
                        {format(fechaVencimiento, "d/M/yy")}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fechaVencimiento}
                        onSelect={(date) => date && setFechaVencimiento(date)}
                        locale={es}
                        formatters={{
                          formatCaption: (date) => {
                            const monthYear = format(date, "MMMM yyyy", { locale: es });
                            return capitalizeFirstLetter(monthYear);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10">
                    Vencimiento
                  </label>
                </div>
              </div>
              
              {/* Nombre de cotización - ocupa el espacio restante */}
              <div className="flex-1">
                <InputWithLabel
                  id="nombreCotizacion"
                  label="Nombre de la cotización"
                  value={nombreCotizacion}
                  onChange={(e) => setNombreCotizacion(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 3. Artículos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Artículos</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddLineItem("producto")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Producto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddLineItem("servicio")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Servicio
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    {/* Header con icono arrastrar, Badge y link Eliminar - todo en línea */}
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      
                      <Badge 
                        variant={item.tipo === "producto" ? "default" : "outline"}
                        className={item.tipo === "servicio" ? "border-2 border-foreground" : ""}
                      >
                        {item.tipo === "producto" ? "Producto" : "Servicio"}
                      </Badge>
                      
                      <div className="flex-1" />
                      
                      <button
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="text-sm text-foreground hover:text-foreground/80 underline transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    {/* Todos los inputs en una sola línea horizontal */}
                    <div className="flex items-end gap-3 mt-3">
                      {/* Nombre - más ancho - alineado al bottom */}
                      <div className="flex-[2]">
                        <ProductoSelector
                          tipo={item.tipo}
                          value={item.nombre}
                          onChange={(nombre) => handleLineItemChange(item.id, "nombre", nombre)}
                          onSelectProduct={(nombre, sku) => handleProductSelect(item.id, nombre, sku)}
                        />
                      </div>
                      
                      {/* SKU - ancho reducido */}
                      <div className="w-28">
                        <Label>SKU</Label>
                        <Input
                          id={`sku-${item.id}`}
                          value={item.sku}
                          onChange={(e) => handleLineItemChange(item.id, "sku", e.target.value)}
                          maxLength={10}
                          className="h-12 mt-2"
                        />
                      </div>
                      
                      {/* Cantidad/Horas - ancho reducido */}
                      <div className="w-24">
                        <Label>{item.tipo === "servicio" ? "Horas" : "Cant."}</Label>
                        <Input
                          id={`cantidad-${item.id}`}
                          type="number"
                          value={item.cantidad.toString()}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            handleLineItemChange(item.id, "cantidad", value);
                          }}
                          maxLength={item.tipo === "servicio" ? 3 : 7}
                          className="h-12 mt-2"
                        />
                      </div>
                      
                      {/* Precio unitario - ancho reducido */}
                      <div className="w-28">
                        <Label>P. Unit.</Label>
                        <Input
                          id={`precio-${item.id}`}
                          type="number"
                          value={item.precioUnitario.toString()}
                          onChange={(e) => handleLineItemChange(item.id, "precioUnitario", parseFloat(e.target.value) || 0)}
                          maxLength={7}
                          className="h-12 mt-2"
                        />
                      </div>
                      
                      {/* Descuento - ancho reducido */}
                      <div className="w-20">
                        <Label>Desc. %</Label>
                        <Input
                          id={`descuento-${item.id}`}
                          type="number"
                          value={item.descuento.toString()}
                          onChange={(e) => handleLineItemChange(item.id, "descuento", parseFloat(e.target.value) || 0)}
                          maxLength={3}
                          className="h-12 mt-2"
                        />
                      </div>
                      
                      {/* Subtotal - con fondo celeste */}
                      <div className="w-32">
                        <Label className="text-[#0c4a6e]">Subtotal</Label>
                        <Input
                          id={`subtotal-${item.id}`}
                          value={`${item.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
                          readOnly
                          className="bg-[#bae6fd] text-[#0c4a6e] border-0 font-semibold h-12 mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {lineItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Agrega productos o servicios
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 4. Impuesto/flete e Imágenes - En dos columnas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda: Impuesto y flete */}
            <div className="space-y-4">
              <h3 className="font-bold">Impuesto y flete</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  id="impuesto"
                  type="number"
                  label="Impuesto (%)"
                  value={impuesto.toString()}
                  onChange={(e) => setImpuesto(parseFloat(e.target.value) || 0)}
                />
                
                <InputWithLabel
                  id="flete"
                  type="number"
                  label="Flete ($)"
                  value={flete.toString()}
                  onChange={(e) => setFlete(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Columna derecha: Imágenes */}
            <div className="space-y-4">
              <h3 className="font-bold">Imágenes (opcionales)</h3>
              <Button variant="outline" className="w-full">
                <ImageIcon className="w-4 h-4 mr-2" />
                Agregar imágenes
              </Button>
            </div>
          </div>

          <Separator />

          {/* 5. Comentarios y Desglose - En dos columnas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda: Comentarios */}
            <div className="space-y-4 flex flex-col">
              <h3 className="font-bold">Comentarios</h3>
              
              <div className="border-2 border-border rounded-lg p-4 flex flex-col flex-1">
                <Textarea
                  id="comentarios"
                  placeholder="Escribe tus comentarios aquí..."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  rows={4}
                  className="border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                />
                
                <div className="flex gap-2 justify-end mt-3">
                  {comentarios && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setComentarios("")}
                      className="underline"
                    >
                      Eliminar
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Mic className="w-4 h-4 mr-2" />
                    Dictar
                  </Button>
                </div>
              </div>
            </div>

            {/* Columna derecha: Desglose */}
            <div className="space-y-4 flex flex-col">
              <h3 className="font-bold">Desglose</h3>
              
              <Card className="flex-1">
                <CardContent className="p-4 space-y-2 flex flex-col h-full justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({lineItems.length} artículos)</span>
                      <span>${totales.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuesto (IVA {impuesto}%)</span>
                      <span>${totales.totalImpuesto.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    {flete > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Flete</span>
                        <span>${flete.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    
                    {totales.descuentoTotal > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Descuento</span>
                        <span>-${totales.descuentoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span>Total ({moneda}):</span>
                      <span>${totales.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="-mx-8 border-t-[3px]" style={{ borderColor: '#242424' }} />

          {/* 6. Botones de acción */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              className="underline"
              onClick={() => setShowNewCotizacion(false)}
            >
              Cancelar
            </Button>
            
            <Button variant="outline" className="underline">
              Vista previa en PDF
            </Button>
            
            <Button onClick={() => setShowNewCotizacion(false)}>
              Guardar cotización
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Detalle/Trazabilidad
  if (showDetalle && selectedCotizacion) {
    const historialVersiones = generarHistorial(selectedCotizacion);
    
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={handleVolverALista}
              className="text-muted-foreground hover:text-foreground underline flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver a Cotizaciones
            </button>
          </div>
          <h1>Trazabilidad - {selectedCotizacion.folio}</h1>
          <p className="text-muted-foreground">
            Historial completo de versiones y cambios
          </p>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cliente / Prospecto</p>
                <p>{selectedCotizacion.cliente}</p>
                <p className="text-sm text-muted-foreground">{selectedCotizacion.empresa}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                <Badge variant={selectedCotizacion.tipo === "prospecto" ? "secondary" : "default"}>
                  {selectedCotizacion.tipo === "prospecto" ? "Prospecto" : "Cliente"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fuente</p>
                <Badge variant="outline">{selectedCotizacion.fuente}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado Actual</p>
                {getEstadoBadge(selectedCotizacion.estado)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Versión Actual</p>
                <Badge variant="outline">V{selectedCotizacion.version}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial de Versiones */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Versiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historialVersiones.map((version) => (
                <div
                  key={version.version}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={version.version === selectedCotizacion.version ? "default" : "outline"}>
                        Versión {version.version}
                      </Badge>
                      {getEstadoBadge(version.estado)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(version.fechaCreacion).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Ejecutivo</p>
                      <p className="text-sm">{version.vendedor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vencimiento</p>
                      <p className="text-sm">{new Date(version.fechaVencimiento).toLocaleDateString("es-MX")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-sm">${version.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">{version.cambios}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista Principal
  return (
    <div className="space-y-6" ref={topRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Cotizaciones</h1>
          <p className="text-muted-foreground">
            Crea y gestiona cotizaciones para tus prospectos y clientes
          </p>
        </div>
        <Button onClick={handleOpenNewCotizacion}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva cotización
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          <button
            onClick={() => handleTabChange("todas")}
            className={cn(
              "pb-3 px-1 relative transition-colors",
              activeTab === "todas"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todas ({totalTodas})
            {activeTab === "todas" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("prospectos")}
            className={cn(
              "pb-3 px-1 relative transition-colors",
              activeTab === "prospectos"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Prospectos ({totalProspectos})
            {activeTab === "prospectos" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("clientes")}
            className={cn(
              "pb-3 px-1 relative transition-colors",
              activeTab === "clientes"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Clientes ({totalClientes})
            {activeTab === "clientes" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1 text-center">
              <p className="text-3xl">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Totales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#d6eafe' }}>
                <FilePenLine className="w-5 h-5" style={{ color: '#1e40af' }} />
              </div>
              <div className="text-right">
                <p className="text-3xl">{stats.borradores}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Borradores</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e8e7ff' }}>
                <Send className="w-5 h-5" style={{ color: '#4338ca' }} />
              </div>
              <div className="text-right">
                <p className="text-3xl">{stats.enviadas}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#d1fae5' }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: '#065f46' }} />
              </div>
              <div className="text-right">
                <p className="text-3xl">{stats.aceptadas}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Aceptadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#fee2e2' }}>
                <XCircle className="w-5 h-5" style={{ color: '#991b1b' }} />
              </div>
              <div className="text-right">
                <p className="text-3xl">{stats.declinadas}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Declinadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#fed7aa' }}>
                <AlertCircle className="w-5 h-5" style={{ color: '#9a3412' }} />
              </div>
              <div className="text-right">
                <p className="text-3xl">{stats.expiradas}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Expiradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1 text-center">
              <p className="text-3xl">
                ${(stats.valorTotal / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por folio, cliente o empresa..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Estado
                    {selectedEstados.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedEstados.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-3">
                    <h4>Filtrar por Estado</h4>
                    <div className="space-y-2">
                      {estados.map((estado) => (
                        <div key={estado} className="flex items-center space-x-2">
                          <Checkbox
                            id={`estado-${estado}`}
                            checked={selectedEstados.includes(estado)}
                            onCheckedChange={() => toggleEstado(estado)}
                          />
                          <label
                            htmlFor={`estado-${estado}`}
                            className="text-sm cursor-pointer flex-1 capitalize"
                          >
                            {estado}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Ejecutivo
                    {selectedVendedores.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedVendedores.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <VendedorFilterContent
                    vendedores={vendedores}
                    selectedVendedores={selectedVendedores}
                    toggleVendedor={toggleVendedor}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(selectedEstados.length > 0 || selectedVendedores.length > 0) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Filtros activos:</span>
                
                {selectedEstados.map((estado) => (
                  <Badge key={estado} variant="outline" className="gap-1 rounded-full">
                    {capitalizeFirstLetter(estado)}
                    <button
                      onClick={() => removeEstadoFilter(estado)}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {selectedVendedores.map((vendedor) => (
                  <Badge key={vendedor} variant="outline" className="gap-1 rounded-full">
                    {vendedor}
                    <button
                      onClick={() => removeVendedorFilter(vendedor)}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2>Historial de Cotizaciones</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {startIndex + 1} - {endIndex} de {totalCotizaciones.toLocaleString("es-MX")}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folio</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>
                  {activeTab === "prospectos" ? "Prospecto" : activeTab === "clientes" ? "Cliente" : "Cliente / Prospecto"}
                </TableHead>
                <TableHead>Creación</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ejecutivo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCotizaciones.map((cotizacion) => (
                <TableRow 
                  key={cotizacion.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleVerDetalle(cotizacion)}
                >
                  <TableCell>{cotizacion.folio}</TableCell>
                  <TableCell>
                    <Badge variant="outline">V{cotizacion.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{cotizacion.cliente}</p>
                      <p className="text-sm text-muted-foreground">
                        {cotizacion.empresa}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(cotizacion.fechaCreacion).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    {new Date(cotizacion.fechaVencimiento).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    $
                    {cotizacion.total.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{getEstadoBadge(cotizacion.estado)}</TableCell>
                  <TableCell>{cotizacion.vendedor}</TableCell>
                  <TableCell className="text-right">
                    <div 
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calculator className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Botón Volver al inicio */}
      {showScrollButton && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={scrollToTop}
            className="gap-2 shadow-lg"
            size="lg"
          >
            <ArrowUp className="w-5 h-5" />
            Volver al inicio
          </Button>
        </div>
      )}
    </div>
  );
}
