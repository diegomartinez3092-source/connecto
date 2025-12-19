import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  GitBranch,
  Package,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  Bot,
} from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: number;
}

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  empresaNombre: string;
  onLogout: () => void;
  userName: string;
  userRole: string;
}

const navigationItems: NavItem[] = [
  { title: "Empleados Digitales", icon: Bot, href: "empleados-digitales" },
  { title: "Dashboard", icon: LayoutDashboard, href: "dashboard" },
  { title: "Prospectos", icon: Users, href: "prospectos" },
  { title: "Cotizaciones", icon: FileText, href: "cotizaciones" },
  { title: "Clientes", icon: UserCircle, href: "clientes" },
  { title: "Pipeline", icon: GitBranch, href: "pipeline" },
  { title: "Productos y Servicios", icon: Package, href: "productos-servicios" },
];

export function AppSidebar({
  currentView,
  onNavigate,
  empresaNombre,
  onLogout,
  userName,
  userRole,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "US";

  return (
    <div
      className={cn(
        "bg-card border-r border-sidebar-border h-screen transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span className="font-bold">{empresaNombre} CRM</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-accent rounded-md transition-colors ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.href;
            
            return (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="truncate">{item.title}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => onNavigate("configuracion")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            currentView === "configuracion"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent text-foreground"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Configuración</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span>{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{userName}</p>
                <p className="text-sm text-gray-500 truncate">{userRole}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
              <span>{initials}</span>
            </div>
            <button
              onClick={onLogout}
              className="w-full p-2 hover:bg-accent rounded-md transition-colors flex items-center justify-center"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
