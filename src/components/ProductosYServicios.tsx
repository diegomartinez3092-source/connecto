import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputWithLabel } from "./ui/input-with-label";
import { TextareaWithLabel } from "./ui/textarea-with-label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Plus, Filter, Download, Upload, Edit, Trash2, Grid3x3, List, Package, Box, DollarSign, TrendingUp, AlertCircle, X, ImagePlus, CheckCircle2, Loader2, Settings, Clock } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

// ============================================================================
// INTERFACES
// ============================================================================

interface Producto {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidadMedida: string;
  precioUnitario: number;
  stock: number;
  proveedor: string;
  estatus: "activo" | "inactivo";
  imagen?: string;
}

interface Servicio {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  unidadCobro: string;
  precio: number;
  duracionEstimada: string;
  areaResponsable: string;
  disponibilidadGeografica: string;
  costoInterno: number;
  margenSugerido: number;
  estatus: "activo" | "inactivo";
}

// ============================================================================
// MOCK DATA - PRODUCTOS
// ============================================================================

const mockProductos: Producto[] = [
  {
    id: "1",
    sku: "LAM-GAL-22",
    nombre: "Lámina Galvanizada Calibre 22",
    descripcion: "Lámina de acero galvanizado calibre 22, ideal para construcción y techado. Resistente a la corrosión.",
    categoria: "Láminas",
    unidadMedida: "Pieza",
    precioUnitario: 450,
    stock: 850,
    proveedor: "Aceros del Norte",
    estatus: "activo",
  },
  {
    id: "2",
    sku: "PTR-2X2-1/8",
    nombre: "Perfil PTR 2x2x1/8",
    descripcion: "Perfil tubular rectangular de acero estructural, medidas 2x2 pulgadas con espesor 1/8.",
    categoria: "Perfiles",
    unidadMedida: "Metro",
    precioUnitario: 85,
    stock: 1200,
    proveedor: "Distribuidora Industrial",
    estatus: "activo",
  },
  {
    id: "3",
    sku: "VAR-3/8",
    nombre: "Varilla Corrugada 3/8",
    descripcion: "Varilla de acero corrugado de 3/8 de pulgada, grado 42. Para uso estructural en construcción.",
    categoria: "Varillas",
    unidadMedida: "Tramo",
    precioUnitario: 125,
    stock: 450,
    proveedor: "Aceros del Norte",
    estatus: "activo",
  },
  {
    id: "4",
    sku: "ANG-2X1/4",
    nombre: "Ángulo Estructural 2x1/4",
    descripcion: "Ángulo de acero estructural de 2 pulgadas con espesor 1/4. Alta resistencia.",
    categoria: "Perfiles",
    unidadMedida: "Metro",
    precioUnitario: 95,
    stock: 780,
    proveedor: "Metalúrgica del Centro",
    estatus: "activo",
  },
  {
    id: "5",
    sku: "SOL-3/16",
    nombre: "Solera de 3x3/16",
    descripcion: "Solera de acero laminado en caliente, medidas 3 pulgadas de ancho por 3/16 de espesor.",
    categoria: "Soleras",
    unidadMedida: "Metro",
    precioUnitario: 68,
    stock: 920,
    proveedor: "Distribuidora Industrial",
    estatus: "activo",
  },
  {
    id: "6",
    sku: "PTR-4X4-1/4",
    nombre: "Perfil PTR 4x4x1/4",
    descripcion: "Perfil tubular rectangular heavy duty, 4x4 pulgadas con espesor 1/4. Para cargas pesadas.",
    categoria: "Perfiles",
    unidadMedida: "Metro",
    precioUnitario: 185,
    stock: 320,
    proveedor: "Aceros del Norte",
    estatus: "activo",
  },
];

// ============================================================================
// MOCK DATA - SERVICIOS
// ============================================================================

const mockServicios: Servicio[] = [
  {
    id: "1",
    codigo: "SRV-CORTE-001",
    nombre: "Corte de Acero a Medida",
    tipo: "Transformación",
    descripcion: "Servicio de corte de perfiles y láminas de acero según especificaciones del cliente. Incluye corte recto y angular.",
    unidadCobro: "Corte",
    precio: 85,
    duracionEstimada: "30 min",
    areaResponsable: "Taller de Transformación",
    disponibilidadGeografica: "Nacional",
    costoInterno: 45,
    margenSugerido: 47,
    estatus: "activo",
  },
  {
    id: "2",
    codigo: "SRV-DOBLEZ-002",
    nombre: "Doblado de Lámina",
    tipo: "Transformación",
    descripcion: "Servicio de doblado de láminas metálicas con prensa hidráulica. Ángulos personalizados según proyecto.",
    unidadCobro: "Metro lineal",
    precio: 120,
    duracionEstimada: "45 min",
    areaResponsable: "Taller de Transformación",
    disponibilidadGeografica: "Nacional",
    costoInterno: 65,
    margenSugerido: 46,
    estatus: "activo",
  },
  {
    id: "3",
    codigo: "SRV-ENTREGA-003",
    nombre: "Entrega Urgente 24hrs",
    tipo: "Logística",
    descripcion: "Servicio de entrega express en menos de 24 horas dentro de la zona metropolitana.",
    unidadCobro: "Servicio",
    precio: 350,
    duracionEstimada: "24 hrs",
    areaResponsable: "Logística y Distribución",
    disponibilidadGeografica: "Zona Metropolitana",
    costoInterno: 180,
    margenSugerido: 49,
    estatus: "activo",
  },
  {
    id: "4",
    codigo: "SRV-ASESORIA-004",
    nombre: "Asesoría Técnica en Sitio",
    tipo: "Consultoría",
    descripcion: "Visita técnica para evaluación de proyecto, toma de medidas y recomendaciones de materiales.",
    unidadCobro: "Hora",
    precio: 450,
    duracionEstimada: "2 hrs",
    areaResponsable: "Ingeniería y Proyectos",
    disponibilidadGeografica: "Regional",
    costoInterno: 280,
    margenSugerido: 38,
    estatus: "activo",
  },
  {
    id: "5",
    codigo: "SRV-SOLDADURA-005",
    nombre: "Servicio de Soldadura Industrial",
    tipo: "Transformación",
    descripcion: "Soldadura MIG, TIG y arco eléctrico para unión de estructuras metálicas. Certificado por AWS.",
    unidadCobro: "Hora",
    precio: 380,
    duracionEstimada: "Variable",
    areaResponsable: "Taller de Transformación",
    disponibilidadGeografica: "Nacional",
    costoInterno: 210,
    margenSugerido: 45,
    estatus: "activo",
  },
  {
    id: "6",
    codigo: "SRV-INSTALACION-006",
    nombre: "Instalación de Estructura Metálica",
    tipo: "Instalación",
    descripcion: "Servicio completo de instalación de estructuras metálicas, incluye personal especializado y equipo.",
    unidadCobro: "Proyecto",
    precio: 2500,
    duracionEstimada: "3 días",
    areaResponsable: "Instalaciones y Montaje",
    disponibilidadGeografica: "Regional",
    costoInterno: 1450,
    margenSugerido: 42,
    estatus: "activo",
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ProductosYServicios() {
  const [activeTab, setActiveTab] = useState("productos");

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado del Módulo */}
      <div className="space-y-2">
        <h1 className="text-foreground">Productos y Servicios</h1>
        <p className="text-muted-foreground">
          Gestiona el catálogo de productos y servicios disponibles para cotización
        </p>
      </div>

      <Separator />

      {/* Tabs de Productos y Servicios */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-fit">
          <TabsTrigger value="productos" className="gap-2">
            <Package className="w-4 h-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="servicios" className="gap-2">
            <Settings className="w-4 h-4" />
            Servicios
          </TabsTrigger>
        </TabsList>

        {/* Contenido Tab Productos */}
        <TabsContent value="productos" className="mt-6">
          <ProductosTab />
        </TabsContent>

        {/* Contenido Tab Servicios */}
        <TabsContent value="servicios" className="mt-6">
          <ServiciosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// TAB DE PRODUCTOS
// ============================================================================

function ProductosTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [proveedorFilter, setProveedorFilter] = useState("todos");
  const [estatusFilter, setEstatusFilter] = useState("todos");
  const [vistaActual, setVistaActual] = useState<"tabla" | "cards">("tabla");
  const [showNewProducto, setShowNewProducto] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [productos, setProductos] = useState<Producto[]>(mockProductos);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    unidadMedida: "",
    precioUnitario: "",
    stock: "",
    proveedor: "",
    estatus: "activo" as "activo" | "inactivo",
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      sku: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      unidadMedida: "",
      precioUnitario: "",
      stock: "",
      proveedor: "",
      estatus: "activo",
    });
    setFormErrors({});
    setImagePreview(null);
    setEditingProducto(null);
  };

  // Open sheet for new product
  const handleNewProducto = () => {
    resetForm();
    setShowNewProducto(true);
  };

  // Open sheet for editing
  const handleEditProducto = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      sku: producto.sku,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      unidadMedida: producto.unidadMedida,
      precioUnitario: producto.precioUnitario.toString(),
      stock: producto.stock.toString(),
      proveedor: producto.proveedor,
      estatus: producto.estatus,
    });
    setImagePreview(null);
    setShowNewProducto(true);
  };

  // Close sheet
  const handleCloseSheet = () => {
    setShowNewProducto(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.sku.trim()) {
      errors.sku = "El SKU es obligatorio";
    }
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }
    if (!formData.categoria) {
      errors.categoria = "Selecciona una categoría";
    }
    if (!formData.unidadMedida) {
      errors.unidadMedida = "Selecciona una unidad de medida";
    }
    if (!formData.precioUnitario || parseFloat(formData.precioUnitario) <= 0) {
      errors.precioUnitario = "El precio debe ser mayor a 0";
    }
    if (!formData.proveedor) {
      errors.proveedor = "Selecciona un proveedor";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save product
  const handleSaveProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (editingProducto) {
      setProductos(productos.map(p => 
        p.id === editingProducto.id 
          ? {
              ...p,
              ...formData,
              precioUnitario: parseFloat(formData.precioUnitario),
              stock: parseInt(formData.stock) || 0,
            }
          : p
      ));
      toast.success("✓ Producto actualizado correctamente", {
        description: `${formData.nombre} se ha actualizado en el catálogo`,
      });
    } else {
      const newProducto: Producto = {
        id: (productos.length + 1).toString(),
        ...formData,
        precioUnitario: parseFloat(formData.precioUnitario),
        stock: parseInt(formData.stock) || 0,
      };
      setProductos([newProducto, ...productos]);
      toast.success("✓ Producto creado correctamente", {
        description: `${formData.nombre} se ha agregado al catálogo`,
      });
    }

    setIsSaving(false);
    handleCloseSheet();
  };

  // Delete product
  const handleDeleteProducto = () => {
    if (productoToDelete) {
      setProductos(productos.filter(p => p.id !== productoToDelete.id));
      toast.success("✓ Producto eliminado correctamente", {
        description: `${productoToDelete.nombre} ha sido eliminado del catálogo`,
      });
      setProductoToDelete(null);
      if (showNewProducto) {
        handleCloseSheet();
      }
    }
  };

  // Image upload handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen es muy grande", {
          description: "El tamaño máximo permitido es 5MB",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen es muy grande", {
          description: "El tamaño máximo permitido es 5MB",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Formato no válido", {
        description: "Por favor, sube una imagen en formato PNG, JPG o WEBP",
      });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filters
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = categoriaFilter === "todas" || producto.categoria === categoriaFilter;
    const matchesProveedor = proveedorFilter === "todos" || producto.proveedor === proveedorFilter;
    const matchesEstatus = estatusFilter === "todos" || producto.estatus === estatusFilter;
    
    return matchesSearch && matchesCategoria && matchesProveedor && matchesEstatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProductos = filteredProductos.slice(startIndex, endIndex);

  // Stats
  const productosActivos = productos.filter(p => p.estatus === "activo").length;
  const valorTotalInventario = productos.reduce((sum, p) => sum + (p.precioUnitario * p.stock), 0);
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock < 100).length;

  // Badge helper
  const getEstatusBadge = (estatus: string) => {
    return estatus === "activo" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Métricas Ejecutivas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Productos Activos</p>
                <p className="text-2xl">{productosActivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Valor Total Inventario</p>
                <p className="text-2xl">${valorTotalInventario.toLocaleString("es-MX")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl">{stockBajo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Acciones */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por SKU, nombre o categoría..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoriaFilter} onValueChange={(value) => {
                setCategoriaFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  <SelectItem value="Láminas">Láminas</SelectItem>
                  <SelectItem value="Perfiles">Perfiles</SelectItem>
                  <SelectItem value="Varillas">Varillas</SelectItem>
                  <SelectItem value="Soleras">Soleras</SelectItem>
                  <SelectItem value="Mallas">Mallas</SelectItem>
                  <SelectItem value="Tubos">Tubos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={proveedorFilter} onValueChange={(value) => {
                setProveedorFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los proveedores</SelectItem>
                  <SelectItem value="Aceros del Norte">Aceros del Norte</SelectItem>
                  <SelectItem value="Distribuidora Industrial">Distribuidora Industrial</SelectItem>
                  <SelectItem value="Metalúrgica del Centro">Metalúrgica del Centro</SelectItem>
                  <SelectItem value="Acerored">Acerored</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estatusFilter} onValueChange={(value) => {
                setEstatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="underline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>

              <Button variant="outline" className="underline">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Vista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={vistaActual === "tabla" ? "default" : "outline"}
            size="sm"
            onClick={() => setVistaActual("tabla")}
          >
            <List className="w-4 h-4 mr-2" />
            Tabla
          </Button>
          <Button
            variant={vistaActual === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setVistaActual("cards")}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Cards
          </Button>
        </div>

        <Button onClick={handleNewProducto}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Vista de Tabla */}
      {vistaActual === "tabla" && (
        <Card>
          <CardContent className="p-0">
            {filteredProductos.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-muted-foreground">
                <AlertCircle className="w-12 h-12" />
                <p>No se encontraron productos con los filtros seleccionados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Estatus</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProductos.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {producto.sku}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="space-y-1">
                            <p className="truncate">{producto.nombre}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {producto.descripcion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{producto.categoria}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          ${producto.precioUnitario.toLocaleString("es-MX")}
                          <span className="text-xs text-muted-foreground ml-1">
                            / {producto.unidadMedida}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            producto.stock === 0 && "text-muted-foreground",
                            producto.stock > 0 && producto.stock < 100 && "text-orange-600"
                          )}>
                            {producto.stock === 0 ? "N/A" : producto.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{producto.proveedor}</TableCell>
                        <TableCell>{getEstatusBadge(producto.estatus)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="underline"
                              onClick={() => handleEditProducto(producto)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive underline"
                              onClick={() => setProductoToDelete(producto)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginación para tabla */}
                {filteredProductos.length > 0 && (
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Mostrar</span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          por página (mostrando {startIndex + 1}-{Math.min(endIndex, filteredProductos.length)} de {filteredProductos.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </Button>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vista de Cards */}
      {vistaActual === "cards" && (
        <div className="space-y-4">
          {filteredProductos.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-12 h-12" />
                  <p>No se encontraron productos con los filtros seleccionados</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProductos.map((producto) => (
                  <Card key={producto.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{producto.nombre}</p>
                              <code className="text-xs bg-muted px-2 py-0.5 rounded">
                                {producto.sku}
                              </code>
                            </div>
                            {getEstatusBadge(producto.estatus)}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <Badge variant="outline">{producto.categoria}</Badge>
                            <span className="text-muted-foreground">{producto.unidadMedida}</span>
                          </div>

                          <Separator />

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Precio:</span>
                              <span>${producto.precioUnitario.toLocaleString("es-MX")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Stock:</span>
                              <span className={cn(
                                producto.stock === 0 && "text-muted-foreground",
                                producto.stock > 0 && producto.stock < 100 && "text-orange-600"
                              )}>
                                {producto.stock === 0 ? "N/A" : producto.stock}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Proveedor:</span>
                              <span className="text-sm truncate max-w-[150px]">{producto.proveedor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 underline"
                            onClick={() => handleEditProducto(producto)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setProductoToDelete(producto)}
                            className="text-destructive hover:text-destructive underline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación para vista de cards */}
              {filteredProductos.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Mostrar</span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="32">32</SelectItem>
                            <SelectItem value="64">64</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          por página (mostrando {startIndex + 1}-{Math.min(endIndex, filteredProductos.length)} de {filteredProductos.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </Button>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Sheet Nuevo/Editar Producto */}
      <Sheet open={showNewProducto} onOpenChange={handleCloseSheet}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto bg-card">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>
              {editingProducto ? "Editar producto" : "Agregar nuevo producto"}
            </SheetTitle>
            <SheetDescription>
              {editingProducto 
                ? "Modifica los datos del producto en el catálogo" 
                : "Completa la información del nuevo producto para agregarlo al catálogo"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveProducto} className="flex flex-col h-[calc(100%-120px)]">
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Información Básica</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputWithLabel
                      id="sku"
                      label="SKU *"
                      placeholder="LAM-GAL-22"
                      value={formData.sku}
                      onChange={(e) => {
                        setFormData({ ...formData, sku: e.target.value });
                        if (formErrors.sku) setFormErrors({ ...formErrors, sku: "" });
                      }}
                      className={formErrors.sku ? "border-destructive" : ""}
                    />
                    {formErrors.sku && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.sku}</p>
                    )}
                  </div>
                  
                  <div>
                    <InputWithLabel
                      id="nombre"
                      label="Nombre del Producto *"
                      placeholder="Lámina Galvanizada Calibre 22"
                      value={formData.nombre}
                      onChange={(e) => {
                        setFormData({ ...formData, nombre: e.target.value });
                        if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: "" });
                      }}
                      className={formErrors.nombre ? "border-destructive" : ""}
                    />
                    {formErrors.nombre && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.nombre}</p>
                    )}
                  </div>
                </div>
                
                <TextareaWithLabel
                  id="descripcion"
                  label="Descripción Técnica"
                  placeholder="Descripción detallada del producto, especificaciones técnicas, usos recomendados..."
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <Separator />

              {/* Clasificación */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Clasificación</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Select 
                        value={formData.categoria}
                        onValueChange={(value) => {
                          setFormData({ ...formData, categoria: value });
                          if (formErrors.categoria) setFormErrors({ ...formErrors, categoria: "" });
                        }}
                      >
                        <SelectTrigger className={cn("h-12 pt-4 pb-2", formErrors.categoria && "border-destructive")}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Láminas">Láminas</SelectItem>
                          <SelectItem value="Perfiles">Perfiles</SelectItem>
                          <SelectItem value="Varillas">Varillas</SelectItem>
                          <SelectItem value="Soleras">Soleras</SelectItem>
                          <SelectItem value="Mallas">Mallas</SelectItem>
                          <SelectItem value="Tubos">Tubos</SelectItem>
                          <SelectItem value="Servicios">Servicios</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                        Categoría *
                      </label>
                    </div>
                    {formErrors.categoria && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.categoria}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <Select 
                        value={formData.unidadMedida}
                        onValueChange={(value) => {
                          setFormData({ ...formData, unidadMedida: value });
                          if (formErrors.unidadMedida) setFormErrors({ ...formErrors, unidadMedida: "" });
                        }}
                      >
                        <SelectTrigger className={cn("h-12 pt-4 pb-2", formErrors.unidadMedida && "border-destructive")}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pieza">Pieza</SelectItem>
                          <SelectItem value="Metro">Metro</SelectItem>
                          <SelectItem value="Kilogramo">Kilogramo</SelectItem>
                          <SelectItem value="Tonelada">Tonelada</SelectItem>
                          <SelectItem value="Tramo">Tramo</SelectItem>
                          <SelectItem value="Rollo">Rollo</SelectItem>
                          <SelectItem value="Servicio">Servicio</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                        Unidad de Medida *
                      </label>
                    </div>
                    {formErrors.unidadMedida && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.unidadMedida}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Precios e Inventario */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Precios e Inventario</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputWithLabel
                      id="precio"
                      type="number"
                      label="Precio Unitario ($) *"
                      placeholder="450.00"
                      value={formData.precioUnitario}
                      onChange={(e) => {
                        setFormData({ ...formData, precioUnitario: e.target.value });
                        if (formErrors.precioUnitario) setFormErrors({ ...formErrors, precioUnitario: "" });
                      }}
                      step="0.01"
                      min="0"
                      className={formErrors.precioUnitario ? "border-destructive" : ""}
                    />
                    {formErrors.precioUnitario && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.precioUnitario}</p>
                    )}
                  </div>
                  
                  <InputWithLabel
                    id="stock"
                    type="number"
                    label="Stock Disponible"
                    placeholder="850"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    min="0"
                    helperText="Dejar en 0 para servicios"
                  />
                </div>
              </div>

              <Separator />

              {/* Proveedor y Estatus */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Información Adicional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Select 
                        value={formData.proveedor}
                        onValueChange={(value) => {
                          setFormData({ ...formData, proveedor: value });
                          if (formErrors.proveedor) setFormErrors({ ...formErrors, proveedor: "" });
                        }}
                      >
                        <SelectTrigger className={cn("h-12 pt-4 pb-2", formErrors.proveedor && "border-destructive")}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aceros del Norte">Aceros del Norte</SelectItem>
                          <SelectItem value="Distribuidora Industrial">Distribuidora Industrial</SelectItem>
                          <SelectItem value="Metalúrgica del Centro">Metalúrgica del Centro</SelectItem>
                          <SelectItem value="Acerored">Acerored</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                        Proveedor *
                      </label>
                    </div>
                    {formErrors.proveedor && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.proveedor}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm">Estatus del Producto</Label>
                    <div className="flex items-center gap-3 h-12 px-3 rounded-md border-2 border-input bg-input-background">
                      <Switch
                        id="estatus"
                        checked={formData.estatus === "activo"}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, estatus: checked ? "activo" : "inactivo" })
                        }
                      />
                      <Label htmlFor="estatus" className="cursor-pointer">
                        {formData.estatus === "activo" ? "Activo" : "Inactivo"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Imagen del Producto */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Imagen del Producto</h3>
                
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg transition-all",
                    isDragging ? "border-primary bg-primary/5" : "border-border",
                    !imagePreview && "hover:border-primary/50 cursor-pointer"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative p-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-6 right-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Imagen cargada correctamente
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className={cn(
                        "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors",
                        isDragging ? "bg-primary/10" : "bg-muted"
                      )}>
                        <ImagePlus className={cn(
                          "w-8 h-8 transition-colors",
                          isDragging ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <p className="text-sm mb-1">
                        {isDragging ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic para seleccionar"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG o WEBP (máx. 5MB)
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <SheetFooter className="border-t pt-4 mt-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {editingProducto && (
                  <Button 
                    type="button" 
                    variant="outline"
                    className="sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10 underline"
                    onClick={() => {
                      setProductoToDelete(editingProducto);
                    }}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar producto
                  </Button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseSheet}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        {editingProducto ? "Guardar cambios" : "Crear producto"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Alert Dialog Eliminar */}
      <AlertDialog open={!!productoToDelete} onOpenChange={(open) => !open && setProductoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto <strong>{productoToDelete?.nombre}</strong> será eliminado permanentemente del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProducto} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// TAB DE SERVICIOS
// ============================================================================

function ServiciosTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todas");
  const [estatusFilter, setEstatusFilter] = useState("todos");
  const [vistaActual, setVistaActual] = useState<"tabla" | "cards">("tabla");
  const [showNewServicio, setShowNewServicio] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [servicioToDelete, setServicioToDelete] = useState<Servicio | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [servicios, setServicios] = useState<Servicio[]>(mockServicios);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    tipo: "",
    descripcion: "",
    unidadCobro: "",
    precio: "",
    duracionEstimada: "",
    areaResponsable: "",
    disponibilidadGeografica: "",
    costoInterno: "",
    margenSugerido: "",
    estatus: "activo" as "activo" | "inactivo",
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      codigo: "",
      nombre: "",
      tipo: "",
      descripcion: "",
      unidadCobro: "",
      precio: "",
      duracionEstimada: "",
      areaResponsable: "",
      disponibilidadGeografica: "",
      costoInterno: "",
      margenSugerido: "",
      estatus: "activo",
    });
    setFormErrors({});
    setEditingServicio(null);
  };

  // Open sheet
  const handleNewServicio = () => {
    resetForm();
    setShowNewServicio(true);
  };

  const handleEditServicio = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setFormData({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      tipo: servicio.tipo,
      descripcion: servicio.descripcion,
      unidadCobro: servicio.unidadCobro,
      precio: servicio.precio.toString(),
      duracionEstimada: servicio.duracionEstimada,
      areaResponsable: servicio.areaResponsable,
      disponibilidadGeografica: servicio.disponibilidadGeografica,
      costoInterno: servicio.costoInterno.toString(),
      margenSugerido: servicio.margenSugerido.toString(),
      estatus: servicio.estatus,
    });
    setShowNewServicio(true);
  };

  const handleCloseSheet = () => {
    setShowNewServicio(false);
    setTimeout(() => resetForm(), 300);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.codigo.trim()) errors.codigo = "El código es obligatorio";
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.tipo) errors.tipo = "Selecciona un tipo de servicio";
    if (!formData.unidadCobro) errors.unidadCobro = "Selecciona una unidad de cobro";
    if (!formData.precio || parseFloat(formData.precio) <= 0) errors.precio = "El precio debe ser mayor a 0";
    if (!formData.areaResponsable) errors.areaResponsable = "Selecciona un área responsable";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save service
  const handleSaveServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (editingServicio) {
      setServicios(servicios.map(s => 
        s.id === editingServicio.id 
          ? {
              ...s,
              ...formData,
              precio: parseFloat(formData.precio),
              costoInterno: parseFloat(formData.costoInterno) || 0,
              margenSugerido: parseFloat(formData.margenSugerido) || 0,
            }
          : s
      ));
      toast.success("✓ Servicio actualizado correctamente", {
        description: `${formData.nombre} se ha actualizado en el catálogo`,
      });
    } else {
      const newServicio: Servicio = {
        id: (servicios.length + 1).toString(),
        ...formData,
        precio: parseFloat(formData.precio),
        costoInterno: parseFloat(formData.costoInterno) || 0,
        margenSugerido: parseFloat(formData.margenSugerido) || 0,
      };
      setServicios([newServicio, ...servicios]);
      toast.success("✓ Servicio creado correctamente", {
        description: `${formData.nombre} se ha agregado al catálogo`,
      });
    }

    setIsSaving(false);
    handleCloseSheet();
  };

  // Delete service
  const handleDeleteServicio = () => {
    if (servicioToDelete) {
      setServicios(servicios.filter(s => s.id !== servicioToDelete.id));
      toast.success("✓ Servicio eliminado correctamente", {
        description: `${servicioToDelete.nombre} ha sido eliminado del catálogo`,
      });
      setServicioToDelete(null);
      if (showNewServicio) handleCloseSheet();
    }
  };

  // Filters
  const filteredServicios = servicios.filter((servicio) => {
    const matchesSearch = 
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || servicio.tipo === tipoFilter;
    const matchesArea = areaFilter === "todas" || servicio.areaResponsable === areaFilter;
    const matchesEstatus = estatusFilter === "todos" || servicio.estatus === estatusFilter;
    
    return matchesSearch && matchesTipo && matchesArea && matchesEstatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServicios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServicios = filteredServicios.slice(startIndex, endIndex);

  // Stats
  const serviciosActivos = servicios.filter(s => s.estatus === "activo").length;
  const ingresosPotenciales = servicios.reduce((sum, s) => sum + s.precio, 0);
  const margenPromedio = servicios.length > 0 
    ? servicios.reduce((sum, s) => sum + s.margenSugerido, 0) / servicios.length 
    : 0;

  // Badge helper
  const getEstatusBadge = (estatus: string) => {
    return estatus === "activo" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Métricas Ejecutivas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Servicios Activos</p>
                <p className="text-2xl">{serviciosActivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Precio Promedio</p>
                <p className="text-2xl">${Math.round(ingresosPotenciales / servicios.length).toLocaleString("es-MX")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Margen Promedio</p>
                <p className="text-2xl">{Math.round(margenPromedio)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Acciones */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, nombre o tipo de servicio..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={tipoFilter} onValueChange={(value) => {
                setTipoFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Transformación">Transformación</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Consultoría">Consultoría</SelectItem>
                  <SelectItem value="Instalación">Instalación</SelectItem>
                </SelectContent>
              </Select>

              <Select value={areaFilter} onValueChange={(value) => {
                setAreaFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las áreas</SelectItem>
                  <SelectItem value="Taller de Transformación">Taller de Transformación</SelectItem>
                  <SelectItem value="Logística y Distribución">Logística y Distribución</SelectItem>
                  <SelectItem value="Ingeniería y Proyectos">Ingeniería y Proyectos</SelectItem>
                  <SelectItem value="Instalaciones y Montaje">Instalaciones y Montaje</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estatusFilter} onValueChange={(value) => {
                setEstatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="underline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>

              <Button variant="outline" className="underline">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Vista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={vistaActual === "tabla" ? "default" : "outline"}
            size="sm"
            onClick={() => setVistaActual("tabla")}
          >
            <List className="w-4 h-4 mr-2" />
            Tabla
          </Button>
          <Button
            variant={vistaActual === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setVistaActual("cards")}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Cards
          </Button>
        </div>

        <Button onClick={handleNewServicio}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Vista de Tabla */}
      {vistaActual === "tabla" && (
        <Card>
          <CardContent className="p-0">
            {filteredServicios.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-muted-foreground">
                <AlertCircle className="w-12 h-12" />
                <p>No se encontraron servicios con los filtros seleccionados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estatus</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedServicios.map((servicio) => (
                      <TableRow key={servicio.id}>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {servicio.codigo}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="space-y-1">
                            <p className="truncate">{servicio.nombre}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {servicio.descripcion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{servicio.tipo}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{servicio.unidadCobro}</TableCell>
                        <TableCell className="text-right">
                          ${servicio.precio.toLocaleString("es-MX")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {servicio.duracionEstimada}
                          </div>
                        </TableCell>
                        <TableCell>{getEstatusBadge(servicio.estatus)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="underline"
                              onClick={() => handleEditServicio(servicio)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive underline"
                              onClick={() => setServicioToDelete(servicio)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginación */}
                {filteredServicios.length > 0 && (
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Mostrar</span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          por página (mostrando {startIndex + 1}-{Math.min(endIndex, filteredServicios.length)} de {filteredServicios.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </Button>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vista de Cards */}
      {vistaActual === "cards" && (
        <div className="space-y-4">
          {filteredServicios.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-12 h-12" />
                  <p>No se encontraron servicios con los filtros seleccionados</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedServicios.map((servicio) => (
                  <Card key={servicio.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                          <Settings className="w-12 h-12 text-primary" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{servicio.nombre}</p>
                              <code className="text-xs bg-muted px-2 py-0.5 rounded">
                                {servicio.codigo}
                              </code>
                            </div>
                            {getEstatusBadge(servicio.estatus)}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <Badge variant="outline">{servicio.tipo}</Badge>
                            <span className="text-muted-foreground">{servicio.unidadCobro}</span>
                          </div>

                          <Separator />

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Precio:</span>
                              <span>${servicio.precio.toLocaleString("es-MX")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Duración:</span>
                              <span className="text-sm flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {servicio.duracionEstimada}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Margen:</span>
                              <span className="text-sm">{servicio.margenSugerido}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 underline"
                            onClick={() => handleEditServicio(servicio)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setServicioToDelete(servicio)}
                            className="text-destructive hover:text-destructive underline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación para cards */}
              {filteredServicios.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Mostrar</span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          por página (mostrando {startIndex + 1}-{Math.min(endIndex, filteredServicios.length)} de {filteredServicios.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </Button>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Sheet Nuevo/Editar Servicio */}
      <Sheet open={showNewServicio} onOpenChange={handleCloseSheet}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto bg-card">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>
              {editingServicio ? "Editar servicio" : "Agregar nuevo servicio"}
            </SheetTitle>
            <SheetDescription>
              {editingServicio 
                ? "Modifica los datos del servicio en el catálogo" 
                : "Completa la información del nuevo servicio para agregarlo al catálogo"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveServicio} className="flex flex-col h-[calc(100%-120px)]">
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Información Básica</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputWithLabel
                      id="codigo"
                      label="Código *"
                      placeholder="SRV-CORTE-001"
                      value={formData.codigo}
                      onChange={(e) => {
                        setFormData({ ...formData, codigo: e.target.value });
                        if (formErrors.codigo) setFormErrors({ ...formErrors, codigo: "" });
                      }}
                      className={formErrors.codigo ? "border-destructive" : ""}
                    />
                    {formErrors.codigo && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.codigo}</p>
                    )}
                  </div>
                  
                  <div>
                    <InputWithLabel
                      id="nombre-servicio"
                      label="Nombre del Servicio *"
                      placeholder="Corte de Acero a Medida"
                      value={formData.nombre}
                      onChange={(e) => {
                        setFormData({ ...formData, nombre: e.target.value });
                        if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: "" });
                      }}
                      className={formErrors.nombre ? "border-destructive" : ""}
                    />
                    {formErrors.nombre && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.nombre}</p>
                    )}
                  </div>
                </div>
                
                <TextareaWithLabel
                  id="descripcion-servicio"
                  label="Descripción del Servicio"
                  placeholder="Describe el servicio, alcance, especificaciones técnicas..."
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <Separator />

              {/* Clasificación */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Clasificación</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Select 
                        value={formData.tipo}
                        onValueChange={(value) => {
                          setFormData({ ...formData, tipo: value });
                          if (formErrors.tipo) setFormErrors({ ...formErrors, tipo: "" });
                        }}
                      >
                        <SelectTrigger className={cn("h-12 pt-4 pb-2", formErrors.tipo && "border-destructive")}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Transformación">Transformación</SelectItem>
                          <SelectItem value="Logística">Logística</SelectItem>
                          <SelectItem value="Consultoría">Consultoría</SelectItem>
                          <SelectItem value="Instalación">Instalación</SelectItem>
                          <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="Capacitación">Capacitación</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                        Tipo de Servicio *
                      </label>
                    </div>
                    {formErrors.tipo && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.tipo}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <Select 
                        value={formData.unidadCobro}
                        onValueChange={(value) => {
                          setFormData({ ...formData, unidadCobro: value });
                          if (formErrors.unidadCobro) setFormErrors({ ...formErrors, unidadCobro: "" });
                        }}
                      >
                        <SelectTrigger className={cn("h-12 pt-4 pb-2", formErrors.unidadCobro && "border-destructive")}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hora">Hora</SelectItem>
                          <SelectItem value="Día">Día</SelectItem>
                          <SelectItem value="Servicio">Servicio</SelectItem>
                          <SelectItem value="Proyecto">Proyecto</SelectItem>
                          <SelectItem value="Corte">Corte</SelectItem>
                          <SelectItem value="Metro lineal">Metro lineal</SelectItem>
                          <SelectItem value="Kilogramo">Kilogramo</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                        Unidad de Cobro *
                      </label>
                    </div>
                    {formErrors.unidadCobro && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.unidadCobro}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Precios y Tiempos */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Precios y Tiempos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputWithLabel
                      id="precio-servicio"
                      type="number"
                      label="Precio ($) *"
                      placeholder="450.00"
                      value={formData.precio}
                      onChange={(e) => {
                        setFormData({ ...formData, precio: e.target.value });
                        if (formErrors.precio) setFormErrors({ ...formErrors, precio: "" });
                      }}
                      step="0.01"
                      min="0"
                      className={formErrors.precio ? "border-destructive" : ""}
                    />
                    {formErrors.precio && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.precio}</p>
                    )}
                  </div>
                  
                  <InputWithLabel
                    id="duracion"
                    label="Duración Estimada"
                    placeholder="2 horas, 3 días, etc."
                    value={formData.duracionEstimada}
                    onChange={(e) => setFormData({ ...formData, duracionEstimada: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithLabel
                    id="costo-interno"
                    type="number"
                    label="Costo Interno ($)"
                    placeholder="200.00"
                    value={formData.costoInterno}
                    onChange={(e) => setFormData({ ...formData, costoInterno: e.target.value })}
                    step="0.01"
                    min="0"
                    helperText="Costo operativo del servicio"
                  />
                  
                  <InputWithLabel
                    id="margen"
                    type="number"
                    label="Margen Sugerido (%)"
                    placeholder="45"
                    value={formData.margenSugerido}
                    onChange={(e) => setFormData({ ...formData, margenSugerido: e.target.value })}
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <Separator />

              {/* Área y Disponibilidad */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Área y Disponibilidad</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Select 
                        value={formData.areaResponsable}
                        onValueChange={(value) => {
                          setFormData({ ...formData, areaResponsable: value });
                          if (formErrors.areaResponsable) setFormErrors({ ...formErrors, areaResponsable: "" });
                        }}
                      >
                        <SelectTrigger className={cn("h-12 pt-4 pb-2", formErrors.areaResponsable && "border-destructive")}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Taller de Transformación">Taller de Transformación</SelectItem>
                          <SelectItem value="Logística y Distribución">Logística y Distribución</SelectItem>
                          <SelectItem value="Ingeniería y Proyectos">Ingeniería y Proyectos</SelectItem>
                          <SelectItem value="Instalaciones y Montaje">Instalaciones y Montaje</SelectItem>
                          <SelectItem value="Ventas y Comercial">Ventas y Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                        Área Responsable *
                      </label>
                    </div>
                    {formErrors.areaResponsable && (
                      <p className="text-xs text-destructive mt-1.5 px-1">{formErrors.areaResponsable}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Select 
                      value={formData.disponibilidadGeografica}
                      onValueChange={(value) => setFormData({ ...formData, disponibilidadGeografica: value })}
                    >
                      <SelectTrigger className="h-12 pt-4 pb-2">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Local">Local</SelectItem>
                        <SelectItem value="Zona Metropolitana">Zona Metropolitana</SelectItem>
                        <SelectItem value="Regional">Regional</SelectItem>
                        <SelectItem value="Nacional">Nacional</SelectItem>
                        <SelectItem value="Internacional">Internacional</SelectItem>
                      </SelectContent>
                    </Select>
                    <label className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-muted-foreground pointer-events-none z-10">
                      Disponibilidad Geográfica
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Estatus */}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Estatus</h3>
                
                <div className="space-y-3">
                  <Label className="text-sm">Estatus del Servicio</Label>
                  <div className="flex items-center gap-3 h-12 px-3 rounded-md border-2 border-input bg-input-background">
                    <Switch
                      id="estatus-servicio"
                      checked={formData.estatus === "activo"}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, estatus: checked ? "activo" : "inactivo" })
                      }
                    />
                    <Label htmlFor="estatus-servicio" className="cursor-pointer">
                      {formData.estatus === "activo" ? "Activo" : "Inactivo"}
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t pt-4 mt-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {editingServicio && (
                  <Button 
                    type="button" 
                    variant="outline"
                    className="sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10 underline"
                    onClick={() => setServicioToDelete(editingServicio)}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar servicio
                  </Button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseSheet}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        {editingServicio ? "Guardar cambios" : "Crear servicio"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Alert Dialog Eliminar */}
      <AlertDialog open={!!servicioToDelete} onOpenChange={(open) => !open && setServicioToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El servicio <strong>{servicioToDelete?.nombre}</strong> será eliminado permanentemente del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteServicio} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
