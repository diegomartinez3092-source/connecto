import { Card, CardContent } from "./ui/card";
import { Package, UserCircle, FolderOpen, Bot, Settings, Building2, Users as UsersIcon, Shield } from "lucide-react";
import { Button } from "./ui/button";

interface SeccionPlaceholderProps {
  seccion: string;
}

export function OtrasSecciones({ seccion }: SeccionPlaceholderProps) {
  const secciones: Record<string, { icon: any; title: string; description: string; features: string[] }> = {
    inventario: {
      icon: Package,
      title: "Inventario & Productos",
      description: "Gestión de catálogo con más de 70,000 SKUs y precios dinámicos",
      features: [
        "Catálogo completo de productos",
        "Actualización de precios en tiempo real",
        "Control de existencias por almacén",
        "Alertas de stock mínimo",
        "Gestión de láminas, paneles y perfiles",
      ],
    },
    clientes: {
      icon: UserCircle,
      title: "Gestión de Clientes",
      description: "Base de datos completa con historial de compras y preferencias",
      features: [
        "Perfil completo de cada cliente",
        "Historial de cotizaciones y compras",
        "Preferencias de productos",
        "Seguimiento de pagos",
        "Notas y documentos adjuntos",
      ],
    },
    documentos: {
      icon: FolderOpen,
      title: "Centro de Documentos",
      description: "Almacenamiento centralizado de cotizaciones, contratos y documentos",
      features: [
        "Versiones de cotizaciones",
        "Contratos y órdenes de compra",
        "Documentos fiscales",
        "Plantillas personalizables",
        "Búsqueda avanzada",
      ],
    },
    ia: {
      icon: Bot,
      title: "IA & Asistencia",
      description: "Inteligencia artificial para optimizar tu operación comercial",
      features: [
        "Recomendaciones inteligentes de productos",
        "Alertas de oportunidades",
        "Sugerencias de cross-sell y upsell",
        "Predicción de cierre de ventas",
        "Análisis de comportamiento del cliente",
      ],
    },
    configuracion: {
      icon: Settings,
      title: "Configuración",
      description: "Personaliza tu CRM y gestiona tu equipo",
      features: [
        "Perfil de usuario",
        "Configuración de empresa",
        "Gestión de usuarios y roles",
        "Permisos y accesos",
        "Integraciones y API",
      ],
    },
  };

  const config = secciones[seccion];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl mb-2">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
      </div>

      {/* Features */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Funcionalidades Principales</h3>
          <ul className="space-y-3">
            {config.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Config Specific Content */}
      {seccion === "configuracion" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <UserCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Perfil de Usuario</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Actualiza tu información personal y preferencias
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Datos de Empresa</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configura información fiscal y de contacto
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <UsersIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Usuarios y Roles</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gestiona tu equipo y permisos de acceso
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Administrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Coming Soon */}
      <Card className="bg-accent/50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="font-semibold mb-2">Sección en Desarrollo</h3>
          <p className="text-muted-foreground mb-4">
            Esta funcionalidad está siendo desarrollada y estará disponible pronto.
          </p>
          <Button variant="outline">
            Notificarme cuando esté lista
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
