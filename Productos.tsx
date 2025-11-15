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
import { Search, Plus, Filter, Download, Upload, Edit, Trash2, Grid3x3, List, Package, Box, DollarSign, TrendingUp, AlertCircle, X, ImagePlus, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

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
    precioUnitario: 225,
    stock: 340,
    proveedor: "Aceros del Norte",
    estatus: "activo",
  },
  {
    id: "7",
    sku: "MAL-HEX-1/2",
    nombre: "Malla Hexagonal 1/2",
    descripcion: "Malla hexagonal galvanizada de 1/2 pulgada, rollo de 30 metros.",
    categoria: "Mallas",
    unidadMedida: "Rollo",
    precioUnitario: 380,
    stock: 180,
    proveedor: "Metalúrgica del Centro",
    estatus: "activo",
  },
  {
    id: "8",
    sku: "SRV-CORTE",
    nombre: "Servicio de Corte Industrial",
    descripcion: "Servicio de corte a medida de perfiles, láminas y varillas. Incluye mano de obra y consumibles.",
    categoria: "Servicios",
    unidadMedida: "Servicio",
    precioUnitario: 250,
    stock: 0,
    proveedor: "Acerored",
    estatus: "activo",
  },
  {
    id: "9",
    sku: "SRV-DOBLEZ",
    nombre: "Servicio de Doblado",
    descripcion: "Servicio de doblado y conformado de láminas y perfiles según especificaciones del cliente.",
    categoria: "Servicios",
    unidadMedida: "Servicio",
    precioUnitario: 350,
    stock: 0,
    proveedor: "Acerored",
    estatus: "activo",
  },
  {
    id: "10",
    sku: "TUB-RED-2",
    nombre: "Tubo Redondo 2 pulgadas",
    descripcion: "Tubo redondo de acero estructural de 2 pulgadas de diámetro. Espesor calibre 14.",
    categoria: "Tubos",
    unidadMedida: "Metro",
    precioUnitario: 110,
    stock: 650,
    proveedor: "Distribuidora Industrial",
    estatus: "inactivo",
  },
];

const categorias = ["Todas", "Láminas", "Perfiles", "Varillas", "Soleras", "Mallas", "Tubos", "Servicios"];
const proveedores = ["Todos", "Aceros del Norte", "Distribuidora Industrial", "Metalúrgica del Centro", "Acerored"];

interface ProductosProps {
  onNavigate?: (view: string) => void;
}

export function Productos({ onNavigate }: ProductosProps) {
  const [vistaActual, setVistaActual] = useState<"lista" | "cards">("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("Todas");
  const [filterProveedor, setFilterProveedor] = useState("Todos");
  const [filterEstatus, setFilterEstatus] = useState("todos");
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

  // Filtrado
  const filteredProductos = productos.filter((p) => {
    const matchesSearch =
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === "Todas" || p.categoria === filterCategoria;
    const matchesProveedor = filterProveedor === "Todos" || p.proveedor === filterProveedor;
    const matchesEstatus = filterEstatus === "todos" || p.estatus === filterEstatus;
    return matchesSearch && matchesCategoria && matchesProveedor && matchesEstatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProductos = filteredProductos.slice(startIndex, endIndex);

  // Métricas
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.estatus === "activo").length;
  const valorInventario = productos.reduce((sum, p) => sum + (p.precioUnitario * p.stock), 0);
  const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);

  const getEstatusBadge = (estatus: string) => {
    if (estatus === "activo") {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Activo</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Inactivo</Badge>;
  };

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
    }, 300); // Wait for animation
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (editingProducto) {
      // Update existing product
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
      // Create new product
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

  const handleExportPDF = () => {
    toast.success("Exportando productos a PDF...");
    // Simular descarga
    setTimeout(() => {
      toast.success("Archivo PDF descargado correctamente");
    }, 1500);
  };

  const handleImportCSV = () => {
    toast.success("Importando productos desde CSV...");
    // Simular importación
    setTimeout(() => {
      toast.success("5 productos importados correctamente");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Productos y Servicios</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos y servicios disponibles para cotización
          </p>
        </div>
        <Button onClick={handleNewProducto}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="w-5 h-5 text-blue-700" />
              </div>
              <div className="text-right">
                <p className="text-3xl">{totalProductos}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Total Productos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-700" />
              </div>
              <div className="text-right">
                <p className="text-3xl">{productosActivos}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Productos Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <DollarSign className="w-5 h-5 text-purple-700" />
              </div>
              <div className="text-right">
                <p className="text-3xl">${(valorInventario / 1000).toFixed(0)}k</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Valor Inventario</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Box className="w-5 h-5 text-orange-700" />
              </div>
              <div className="text-right">
                <p className="text-3xl">{stockTotal.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Unidades en Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Acciones y Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Fila 1: Búsqueda y Botones */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por SKU, nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleImportCSV}>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Separator orientation="vertical" className="h-auto" />
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={vistaActual === "lista" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setVistaActual("lista")}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={vistaActual === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setVistaActual("cards")}
                    className="px-3"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Fila 2: Filtros */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <div className="flex flex-wrap gap-3 flex-1">
                <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterProveedor} onValueChange={setFilterProveedor}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((prov) => (
                      <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterEstatus} onValueChange={setFilterEstatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estatus</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                {(searchTerm || filterCategoria !== "Todas" || filterProveedor !== "Todos" || filterEstatus !== "todos") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategoria("Todas");
                      setFilterProveedor("Todos");
                      setFilterEstatus("todos");
                    }}
                    className="underline"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista de Lista (Tabla) */}
      {vistaActual === "lista" && (
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Productos ({filteredProductos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nombre del Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead className="text-right">Precio Unitario</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estatus</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProductos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <AlertCircle className="w-8 h-8" />
                          <p>No se encontraron productos con los filtros seleccionados</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProductos.map((producto) => (
                      <TableRow key={producto.id} className="hover:bg-muted/50">
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">{producto.sku}</code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{producto.nombre}</p>
                            {producto.descripcion && (
                              <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {producto.descripcion}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{producto.categoria}</Badge>
                        </TableCell>
                        <TableCell>{producto.unidadMedida}</TableCell>
                        <TableCell className="text-right">
                          ${producto.precioUnitario.toLocaleString("es-MX")}
                        </TableCell>
                        <TableCell className="text-center">
                          {producto.stock === 0 ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : producto.stock < 100 ? (
                            <span className="text-orange-600">{producto.stock}</span>
                          ) : (
                            <span>{producto.stock}</span>
                          )}
                        </TableCell>
                        <TableCell>{producto.proveedor}</TableCell>
                        <TableCell>{getEstatusBadge(producto.estatus)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProducto(producto)}
                              className="underline"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setProductoToDelete(producto)}
                              className="text-destructive hover:text-destructive underline"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            {filteredProductos.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Vista de Cards (Galería) */}
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
                        {/* Imagen placeholder */}
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>

                        {/* Info del producto */}
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

                        {/* Acciones */}
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

      {/* Alert Dialog para Eliminar */}
      <AlertDialog open={!!productoToDelete} onOpenChange={(open) => !open && setProductoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto "{productoToDelete?.nombre}" ({productoToDelete?.sku}) será eliminado permanentemente del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProducto} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar Producto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
