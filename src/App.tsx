import { useState, useEffect, useCallback } from "react";
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState("Usuario");
  const [userRole, setUserRole] = useState("Invitado");

  const fetchUserProfile = useCallback(async (email: string) => {
    try {
      const response = await fetch(
        "https://hook.us2.make.com/t5yit0qglt76fuqgdrtzbtcp4f3spzgv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = (await response.json().catch(() => undefined)) as
        | { ok?: boolean; Nombre?: string; Puesto?: string }
        | undefined;

      if (data?.ok) {
        setUserName(data.Nombre || "Usuario");
        setUserRole(data.Puesto || "Invitado");
      } else {
        setUserName("Usuario");
        setUserRole("Invitado");
      }
    } catch (error) {
      console.error("Error al cargar perfil de usuario", error);
      setUserName("Usuario");
      setUserRole("Invitado");
    }
  }, []);

  // Auth handlers
  const handleLogin = (empresaNombre: string, email: string) => {
    setSelectedEmpresa(empresaNombre);
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("email", email);
    localStorage.setItem("selectedEmpresa", empresaNombre);
    setIsAuthenticated(true);
    setShowRegister(false);
    setShowForgotPassword(false);
    fetchUserProfile(email);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    localStorage.removeItem("selectedEmpresa");
    setUserEmail(null);
    setUserName("Usuario");
    setUserRole("Invitado");
    setIsAuthenticated(false);
    setCurrentView("dashboard");
  }, []);

  const handleRegister = () => {
    setSelectedEmpresa("Acerored");
    setIsAuthenticated(true);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedEmail = localStorage.getItem("userEmail");
      const storedEmpresa = localStorage.getItem("selectedEmpresa");

      if (!storedEmail) {
        handleLogout();
        return;
      }

      setUserEmail(storedEmail);
      setSelectedEmpresa(storedEmpresa || "Acerored");
      setIsAuthenticated(true);
      localStorage.setItem("email", storedEmail);
      await fetchUserProfile(storedEmail);
    };

    fetchUserInfo();
  }, [fetchUserProfile, handleLogout]);

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
        userName={userName}
        userRole={userRole}
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
