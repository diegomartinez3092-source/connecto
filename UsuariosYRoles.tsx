import { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { 
  Search, 
  Filter, 
  X, 
  UserPlus, 
  Edit2, 
  Trash2,
  UserCircle,
  Mail,
  Briefcase,
  MapPin,
  Shield
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { InputWithLabel } from "./ui/input-with-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "Administrador" | "Gerente" | "Vendedor" | "Pendiente";
  departamento: string;
  region: string;
  estatus: "Activo" | "Inactivo";
  avatar?: string;
  telefono?: string;
}

// Datos mock de usuarios
const usuariosMock: Usuario[] = [
  // Administradores (3)
  { id: "1", nombre: "Roberto Sordo", email: "roberto.sordo@acerored.com", rol: "Administrador", departamento: "Dirección", region: "Nacional", estatus: "Activo" },
  { id: "2", nombre: "Ana Martínez", email: "ana.martinez@acerored.com", rol: "Administrador", departamento: "TI", region: "Nacional", estatus: "Activo" },
  { id: "3", nombre: "Carlos Ruiz", email: "carlos.ruiz@acerored.com", rol: "Administrador", departamento: "Finanzas", region: "Nacional", estatus: "Activo" },
  
  // Gerentes (8)
  { id: "4", nombre: "María González", email: "maria.gonzalez@acerored.com", rol: "Gerente", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "5", nombre: "José López", email: "jose.lopez@acerored.com", rol: "Gerente", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "6", nombre: "Laura Fernández", email: "laura.fernandez@acerored.com", rol: "Gerente", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "7", nombre: "Miguel Torres", email: "miguel.torres@acerored.com", rol: "Gerente", departamento: "Operaciones", region: "Occidente", estatus: "Activo" },
  { id: "8", nombre: "Carmen Ramírez", email: "carmen.ramirez@acerored.com", rol: "Gerente", departamento: "Marketing", region: "Nacional", estatus: "Activo" },
  { id: "9", nombre: "David Morales", email: "david.morales@acerored.com", rol: "Gerente", departamento: "Recursos Humanos", region: "Nacional", estatus: "Activo" },
  { id: "10", nombre: "Elena Castro", email: "elena.castro@acerored.com", rol: "Gerente", departamento: "Logística", region: "Oriente", estatus: "Activo" },
  { id: "11", nombre: "Francisco Ortiz", email: "francisco.ortiz@acerored.com", rol: "Gerente", departamento: "Calidad", region: "Nacional", estatus: "Activo" },
  
  // Vendedores (57) - Solo mostraremos algunos representativos
  { id: "12", nombre: "Sofía Jiménez", email: "sofia.jimenez@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "13", nombre: "Javier Romero", email: "javier.romero@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "14", nombre: "Isabel Navarro", email: "isabel.navarro@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "15", nombre: "Pedro García", email: "pedro.garcia@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "16", nombre: "Lucía Díaz", email: "lucia.diaz@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "17", nombre: "Antonio Vargas", email: "antonio.vargas@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "18", nombre: "Marta Soto", email: "marta.soto@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "19", nombre: "Fernando Reyes", email: "fernando.reyes@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "20", nombre: "Patricia Herrera", email: "patricia.herrera@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "21", nombre: "Ricardo Medina", email: "ricardo.medina@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "22", nombre: "Gabriela Cruz", email: "gabriela.cruz@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "23", nombre: "Andrés Flores", email: "andres.flores@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "24", nombre: "Claudia Ramos", email: "claudia.ramos@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "25", nombre: "Jorge Mendoza", email: "jorge.mendoza@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "26", nombre: "Valeria Silva", email: "valeria.silva@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "27", nombre: "Héctor Mejía", email: "hector.mejia@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "28", nombre: "Diana Rojas", email: "diana.rojas@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "29", nombre: "Raúl Campos", email: "raul.campos@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "30", nombre: "Carolina Vega", email: "carolina.vega@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "31", nombre: "Sergio Aguilar", email: "sergio.aguilar@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "32", nombre: "Natalia Paredes", email: "natalia.paredes@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "33", nombre: "Manuel Cortés", email: "manuel.cortes@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "34", nombre: "Rosa Guzmán", email: "rosa.guzman@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "35", nombre: "Alberto Salazar", email: "alberto.salazar@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "36", nombre: "Daniela Pacheco", email: "daniela.pacheco@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "37", nombre: "Rodrigo Molina", email: "rodrigo.molina@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "38", nombre: "Alejandra León", email: "alejandra.leon@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "39", nombre: "Guillermo Ríos", email: "guillermo.rios@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "40", nombre: "Mariana Peña", email: "mariana.pena@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "41", nombre: "Pablo Sandoval", email: "pablo.sandoval@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "42", nombre: "Fernanda Ibarra", email: "fernanda.ibarra@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "43", nombre: "Óscar Luna", email: "oscar.luna@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "44", nombre: "Adriana Núñez", email: "adriana.nunez@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "45", nombre: "Mauricio Cárdenas", email: "mauricio.cardenas@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "46", nombre: "Verónica Fuentes", email: "veronica.fuentes@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "47", nombre: "Emilio Carrillo", email: "emilio.carrillo@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "48", nombre: "Silvia Domínguez", email: "silvia.dominguez@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "49", nombre: "Ignacio Zamora", email: "ignacio.zamora@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "50", nombre: "Beatriz Velasco", email: "beatriz.velasco@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "51", nombre: "Esteban Cervantes", email: "esteban.cervantes@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "52", nombre: "Mónica Castillo", email: "monica.castillo@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "53", nombre: "Arturo Cabrera", email: "arturo.cabrera@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "54", nombre: "Cecilia Arellano", email: "cecilia.arellano@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "55", nombre: "Gonzalo Ponce", email: "gonzalo.ponce@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "56", nombre: "Sandra Bravo", email: "sandra.bravo@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "57", nombre: "Víctor Espinoza", email: "victor.espinoza@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "58", nombre: "Lorena Delgado", email: "lorena.delgado@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "59", nombre: "Cristian Márquez", email: "cristian.marquez@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "60", nombre: "Julia Barrientos", email: "julia.barrientos@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "61", nombre: "Tomás Estrada", email: "tomas.estrada@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "62", nombre: "Alicia Villanueva", email: "alicia.villanueva@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "63", nombre: "Eduardo Montes", email: "eduardo.montes@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },
  { id: "64", nombre: "Paola Lara", email: "paola.lara@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Centro", estatus: "Activo" },
  { id: "65", nombre: "Bruno Santana", email: "bruno.santana@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Occidente", estatus: "Activo" },
  { id: "66", nombre: "Renata Acosta", email: "renata.acosta@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Oriente", estatus: "Activo" },
  { id: "67", nombre: "Leonel Gallardo", email: "leonel.gallardo@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Norte", estatus: "Activo" },
  { id: "68", nombre: "Irene Benavides", email: "irene.benavides@acerored.com", rol: "Vendedor", departamento: "Ventas", region: "Sur", estatus: "Activo" },

  // Pendientes (12)
  { id: "69", nombre: "Marcos Villalba", email: "marcos.villalba@acerored.com", rol: "Pendiente", departamento: "Ventas", region: "Norte", estatus: "Inactivo" },
  { id: "70", nombre: "Gloria Salgado", email: "gloria.salgado@acerored.com", rol: "Pendiente", departamento: "Ventas", region: "Sur", estatus: "Inactivo" },
  { id: "71", nombre: "Rubén Cisneros", email: "ruben.cisneros@acerored.com", rol: "Pendiente", departamento: "Ventas", region: "Centro", estatus: "Inactivo" },
  { id: "72", nombre: "Teresa Aragón", email: "teresa.aragon@acerored.com", rol: "Pendiente", departamento: "Ventas", region: "Occidente", estatus: "Inactivo" },
  { id: "73", nombre: "Agustín Camacho", email: "agustin.camacho@acerored.com", rol: "Pendiente", departamento: "Operaciones", region: "Oriente", estatus: "Inactivo" },
  { id: "74", nombre: "Liliana Monroy", email: "liliana.monroy@acerored.com", rol: "Pendiente", departamento: "Marketing", region: "Nacional", estatus: "Inactivo" },
  { id: "75", nombre: "Benjamín Olvera", email: "benjamin.olvera@acerored.com", rol: "Pendiente", departamento: "Logística", region: "Norte", estatus: "Inactivo" },
  { id: "76", nombre: "Yolanda Parra", email: "yolanda.parra@acerored.com", rol: "Pendiente", departamento: "Recursos Humanos", region: "Sur", estatus: "Inactivo" },
  { id: "77", nombre: "Salvador Arce", email: "salvador.arce@acerored.com", rol: "Pendiente", departamento: "Finanzas", region: "Centro", estatus: "Inactivo" },
  { id: "78", nombre: "Elisa Miranda", email: "elisa.miranda@acerored.com", rol: "Pendiente", departamento: "TI", region: "Occidente", estatus: "Inactivo" },
  { id: "79", nombre: "Gerardo Uribe", email: "gerardo.uribe@acerored.com", rol: "Pendiente", departamento: "Calidad", region: "Oriente", estatus: "Inactivo" },
  { id: "80", nombre: "Nora Hidalgo", email: "nora.hidalgo@acerored.com", rol: "Pendiente", departamento: "Ventas", region: "Nacional", estatus: "Inactivo" },
];

const regiones = ["Norte", "Sur", "Centro", "Occidente", "Oriente", "Nacional"];
const departamentos = ["Ventas", "Operaciones", "Marketing", "Logística", "Recursos Humanos", "Finanzas", "TI", "Calidad", "Dirección"];
const estatusOptions = ["Activo", "Inactivo"];
const rolesOptions = ["Administrador", "Gerente", "Vendedor"];

export function UsuariosYRoles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegiones, setSelectedRegiones] = useState<string[]>([]);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>([]);
  const [selectedEstatus, setSelectedEstatus] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"todos" | "Administrador" | "Gerente" | "Vendedor" | "Pendiente">("todos");
  
  // Estados para modal de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  
  // Estados para drawer de agregar/editar usuario
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    departamento: "",
    region: "",
    telefono: "",
  });

  // Toggle filters
  const toggleRegion = (region: string) => {
    setSelectedRegiones(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const toggleDepartamento = (departamento: string) => {
    setSelectedDepartamentos(prev =>
      prev.includes(departamento) ? prev.filter(d => d !== departamento) : [...prev, departamento]
    );
  };

  const toggleEstatus = (estatus: string) => {
    setSelectedEstatus(prev =>
      prev.includes(estatus) ? prev.filter(e => e !== estatus) : [...prev, estatus]
    );
  };

  const toggleRol = (rol: string) => {
    setSelectedRoles(prev =>
      prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
    );
  };

  // Remove filters
  const removeRegionFilter = (region: string) => {
    setSelectedRegiones(prev => prev.filter(r => r !== region));
  };

  const removeDepartamentoFilter = (departamento: string) => {
    setSelectedDepartamentos(prev => prev.filter(d => d !== departamento));
  };

  const removeEstatusFilter = (estatus: string) => {
    setSelectedEstatus(prev => prev.filter(e => e !== estatus));
  };

  const removeRolFilter = (rol: string) => {
    setSelectedRoles(prev => prev.filter(r => r !== rol));
  };

  // Filtrar usuarios
  const usuariosFiltrados = useMemo(() => {
    let filtered = [...usuariosMock];

    // Filtrar por tab activo
    if (activeTab !== "todos") {
      filtered = filtered.filter(u => u.rol === activeTab);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.nombre.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.departamento.toLowerCase().includes(term)
      );
    }

    // Filtrar por región
    if (selectedRegiones.length > 0) {
      filtered = filtered.filter(u => selectedRegiones.includes(u.region));
    }

    // Filtrar por departamento
    if (selectedDepartamentos.length > 0) {
      filtered = filtered.filter(u => selectedDepartamentos.includes(u.departamento));
    }

    // Filtrar por estatus
    if (selectedEstatus.length > 0) {
      filtered = filtered.filter(u => selectedEstatus.includes(u.estatus));
    }

    // Filtrar por rol
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(u => selectedRoles.includes(u.rol));
    }

    return filtered;
  }, [searchTerm, selectedRegiones, selectedDepartamentos, selectedEstatus, selectedRoles, activeTab]);

  // Contar usuarios por rol
  const contadores = useMemo(() => {
    return {
      administrador: usuariosMock.filter(u => u.rol === "Administrador").length,
      gerente: usuariosMock.filter(u => u.rol === "Gerente").length,
      vendedor: usuariosMock.filter(u => u.rol === "Vendedor").length,
      pendiente: usuariosMock.filter(u => u.rol === "Pendiente").length,
    };
  }, []);

  // Handlers para modal de eliminación
  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (usuarioToDelete) {
      toast.success(`Usuario ${usuarioToDelete.nombre} eliminado correctamente`);
      setShowDeleteDialog(false);
      setUsuarioToDelete(null);
    }
  };

  // Handlers para drawer de usuario
  const handleAddUserClick = () => {
    setEditingUser(null);
    setFormData({
      nombre: "",
      email: "",
      rol: "",
      departamento: "",
      region: "",
      telefono: "",
    });
    setShowUserDrawer(true);
  };

  const handleEditClick = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      departamento: usuario.departamento,
      region: usuario.region,
      telefono: usuario.telefono || "",
    });
    setShowUserDrawer(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      toast.success(`Usuario ${formData.nombre} actualizado correctamente`);
    } else {
      toast.success(`Usuario ${formData.nombre} creado correctamente`);
    }
    setShowUserDrawer(false);
    setEditingUser(null);
  };

  // Obtener iniciales del nombre
  const getInitials = (nombre: string) => {
    const parts = nombre.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  // Obtener color del badge de rol
  const getRolBadgeColor = (rol: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      Administrador: { bg: "#fee2e2", color: "#991b1b" },
      Gerente: { bg: "#e8e7ff", color: "#4338ca" },
      Vendedor: { bg: "#d1fae5", color: "#065f46" },
      Pendiente: { bg: "#fed7aa", color: "#9a3412" },
    };
    return colors[rol] || { bg: "#E8E7E4", color: "#6B6B6B" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Usuarios y Roles</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los usuarios del equipo y sus permisos de acceso
          </p>
        </div>
        <Button onClick={handleAddUserClick} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Agregar nuevo usuario
        </Button>
      </div>

      {/* Tabs por rol */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="todos">
            Todos ({usuariosMock.length})
          </TabsTrigger>
          <TabsTrigger value="Administrador">
            Administrador ({contadores.administrador})
          </TabsTrigger>
          <TabsTrigger value="Gerente">
            Gerente ({contadores.gerente})
          </TabsTrigger>
          <TabsTrigger value="Vendedor">
            Vendedor ({contadores.vendedor})
          </TabsTrigger>
          <TabsTrigger value="Pendiente">
            Pendientes ({contadores.pendiente})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, email o departamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Región
                        {selectedRegiones.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedRegiones.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="end">
                      <div className="space-y-3">
                        <h4>Filtrar por Región</h4>
                        <div className="space-y-2">
                          {regiones.map((region) => (
                            <div key={region} className="flex items-center space-x-2">
                              <Checkbox
                                id={`region-${region}`}
                                checked={selectedRegiones.includes(region)}
                                onCheckedChange={() => toggleRegion(region)}
                              />
                              <label
                                htmlFor={`region-${region}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {region}
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
                        Departamento
                        {selectedDepartamentos.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedDepartamentos.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="end">
                      <div className="space-y-3">
                        <h4>Filtrar por Departamento</h4>
                        <div className="space-y-2">
                          {departamentos.map((dept) => (
                            <div key={dept} className="flex items-center space-x-2">
                              <Checkbox
                                id={`dept-${dept}`}
                                checked={selectedDepartamentos.includes(dept)}
                                onCheckedChange={() => toggleDepartamento(dept)}
                              />
                              <label
                                htmlFor={`dept-${dept}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {dept}
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
                        Estatus
                        {selectedEstatus.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedEstatus.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="end">
                      <div className="space-y-3">
                        <h4>Filtrar por Estatus</h4>
                        <div className="space-y-2">
                          {estatusOptions.map((estatus) => (
                            <div key={estatus} className="flex items-center space-x-2">
                              <Checkbox
                                id={`estatus-${estatus}`}
                                checked={selectedEstatus.includes(estatus)}
                                onCheckedChange={() => toggleEstatus(estatus)}
                              />
                              <label
                                htmlFor={`estatus-${estatus}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {estatus}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {activeTab === "todos" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="w-4 h-4" />
                          Rol
                          {selectedRoles.length > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              {selectedRoles.length}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64" align="end">
                        <div className="space-y-3">
                          <h4>Filtrar por Rol</h4>
                          <div className="space-y-2">
                            {rolesOptions.map((rol) => (
                              <div key={rol} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`rol-${rol}`}
                                  checked={selectedRoles.includes(rol)}
                                  onCheckedChange={() => toggleRol(rol)}
                                />
                                <label
                                  htmlFor={`rol-${rol}`}
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  {rol}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Filtros activos */}
                {(selectedRegiones.length > 0 || 
                  selectedDepartamentos.length > 0 || 
                  selectedEstatus.length > 0 ||
                  selectedRoles.length > 0) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Filtros activos:</span>
                    
                    {selectedRegiones.map((region) => (
                      <Badge key={region} variant="outline" className="gap-1 rounded-full">
                        {region}
                        <button
                          onClick={() => removeRegionFilter(region)}
                          className="ml-1 hover:bg-muted rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}

                    {selectedDepartamentos.map((dept) => (
                      <Badge key={dept} variant="outline" className="gap-1 rounded-full">
                        {dept}
                        <button
                          onClick={() => removeDepartamentoFilter(dept)}
                          className="ml-1 hover:bg-muted rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}

                    {selectedEstatus.map((estatus) => (
                      <Badge key={estatus} variant="outline" className="gap-1 rounded-full">
                        {estatus}
                        <button
                          onClick={() => removeEstatusFilter(estatus)}
                          className="ml-1 hover:bg-muted rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}

                    {selectedRoles.map((rol) => (
                      <Badge key={rol} variant="outline" className="gap-1 rounded-full">
                        {rol}
                        <button
                          onClick={() => removeRolFilter(rol)}
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

          {/* Grid de usuarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {usuariosFiltrados.map((usuario) => {
              const rolColors = getRolBadgeColor(usuario.rol);
              
              return (
                <Card key={usuario.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Avatar y acciones */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <span>{getInitials(usuario.nombre)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(usuario)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(usuario)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Información del usuario */}
                      <div className="space-y-2">
                        <h3 className="truncate">{usuario.nombre}</h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="truncate underline">{usuario.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 shrink-0 text-muted-foreground" />
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: rolColors.bg, 
                              color: rolColors.color 
                            }}
                          >
                            {usuario.rol}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4 shrink-0" />
                          <span className="truncate">{usuario.departamento}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{usuario.region}</span>
                        </div>
                      </div>

                      {/* Badge de estatus */}
                      <div className="pt-2 border-t border-border">
                        <Badge 
                          variant={usuario.estatus === "Activo" ? "default" : "secondary"}
                          className={usuario.estatus === "Activo" ? "" : "bg-muted text-muted-foreground"}
                        >
                          {usuario.estatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mensaje si no hay resultados */}
          {usuariosFiltrados.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <UserCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3>No se encontraron usuarios</h3>
                <p className="text-muted-foreground mt-2">
                  Intenta ajustar los filtros para ver más resultados
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario <strong>{usuarioToDelete?.nombre}</strong> del sistema.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Drawer para agregar/editar usuario */}
      <Drawer open={showUserDrawer} onOpenChange={setShowUserDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {editingUser ? "Editar usuario" : "Agregar nuevo usuario"}
            </DrawerTitle>
            <DrawerDescription>
              {editingUser 
                ? "Actualiza la información del usuario" 
                : "Completa los datos para crear un nuevo usuario"
              }
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-4">
              <InputWithLabel
                id="nombre"
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
              <InputWithLabel
                id="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan.perez@acerored.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="rol" className="text-sm">Rol</label>
                <Select value={formData.rol} onValueChange={(v) => setFormData({ ...formData, rol: v })}>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="departamento" className="text-sm">Departamento</label>
                <Select value={formData.departamento} onValueChange={(v) => setFormData({ ...formData, departamento: v })}>
                  <SelectTrigger id="departamento">
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="region" className="text-sm">Región</label>
                <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Selecciona una región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regiones.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <InputWithLabel
                id="telefono"
                label="Teléfono (opcional)"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: +52 1 55 1234 5678"
              />
            </div>
          </div>

          <DrawerFooter>
            <div className="flex gap-3 max-w-2xl mx-auto w-full">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </DrawerClose>
              <Button onClick={handleSaveUser} className="flex-1">
                {editingUser ? "Guardar cambios" : "Crear usuario"}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
