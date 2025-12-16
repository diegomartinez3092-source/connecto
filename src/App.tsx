import { useState, useEffect } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ForgotPassword } from "./components/ForgotPassword";
import { Dashboard } from "./components/Dashboard";
import { Prospectos } from "./components/Prospectos";
import { Cotizaciones } from "./components/Cotizaciones";
import { Clientes } from "./components/Clientes";
import ProductosYServicios from "./components/ProductosYServicios";
import { Pipeline } from "./components/Pipeline";
import { Facturacion } from "./components/Facturacion";
import { Reportes } from "./components/Reportes";
import { OtrasSecciones } from "./components/OtrasSecciones";
import { UsuariosYRoles } from "./components/UsuariosYRoles";
import { EmpleadosDigitales } from "./components/EmpleadosDigitales";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedEmpresa, setSelectedEmpresa] =
    useState("Acerored");
  const [isNewCotizacionMode, setIsNewCotizacionMode] =
    useState(false);

  // Auth handlers
  const handleLogin = (empresaNombre: string) => {
    setSelectedEmpresa(empresaNombre);
    setIsAuthenticated(true);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("dashboard");
  };

  const handleRegister = () => {
    setSelectedEmpresa("Acerored");
    setIsAuthenticated(true);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  // Reset nueva cotización mode when changing views
  useEffect(() => {
    if (currentView !== "cotizaciones") {
      setIsNewCotizacionMode(false);
    }
  }, [currentView]);

  // Not authenticated - show login/register/forgot password
  if (!isAuthenticated) {
    if (showForgotPassword) {
      return (
        <ForgotPassword
          onCancel={() => setShowForgotPassword(false)}
        />
      );
    }
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegister}
          onShowLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
        onShowForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  // Authenticated - show CRM
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar
        currentView={
          currentView.startsWith("cliente-detalle-")
            ? "clientes"
            : currentView.startsWith("empleados-digitales-")
            ? "empleados-digitales"
            : currentView
        }
        onNavigate={setCurrentView}
        empresaNombre={selectedEmpresa}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-colors duration-500 ${isNewCotizacionMode ? "bg-[#BFF6FD]" : ""}`}
      >
        <div className="container mx-auto p-8">
          {currentView === "dashboard" && (
            <Dashboard onNavigate={setCurrentView} />
          )}
          {currentView === "prospectos" && (
            <Prospectos onNavigate={setCurrentView} />
          )}
          {currentView === "cotizaciones" && (
            <Cotizaciones
              onModeChange={setIsNewCotizacionMode}
            />
          )}
          {(currentView === "clientes" ||
            currentView.startsWith("cliente-detalle-")) && (
            <Clientes
              onNavigate={setCurrentView}
              clienteDetalleId={
                currentView.startsWith("cliente-detalle-")
                  ? currentView
                  : undefined
              }
              onClienteDetalleClose={() =>
                setCurrentView("clientes")
              }
            />
          )}
          {currentView === "productos-servicios" && (
            <ProductosYServicios />
          )}
          {currentView === "pipeline" && <Pipeline />}
          {currentView === "facturacion" && <Facturacion />}
          {currentView === "reportes" && <Reportes />}
          {(currentView === "empleados-digitales" ||
            currentView.startsWith("empleados-digitales-")) && (
            <EmpleadosDigitales view={currentView} onNavigate={setCurrentView} />
          )}
          {currentView === "documentos" && (
            <OtrasSecciones seccion="documentos" />
          )}
          {currentView === "ia" && (
            <OtrasSecciones seccion="ia" />
          )}
          {currentView === "configuracion" && (
            <UsuariosYRoles />
          )}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}