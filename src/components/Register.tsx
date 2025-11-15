import { useState } from "react";
import { Button } from "./ui/button";
import { InputWithLabel } from "./ui/input-with-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Building2, Check, X } from "lucide-react";
import { cn } from "./ui/utils";

interface RegisterProps {
  onRegister: () => void;
  onShowLogin: () => void;
}

interface Empresa {
  id: string;
  nombre: string;
  nombreCorto: string;
}

const empresas: Empresa[] = [
  { id: "acerored", nombre: "Acerored", nombreCorto: "Acerored" },
  { id: "max-acero", nombre: "Max Acero Monterrey", nombreCorto: "Max Acero" },
  { id: "acermet", nombre: "Acermet", nombreCorto: "Acermet" },
  { id: "superpanel", nombre: "Superpanel", nombreCorto: "Superpanel" },
  { id: "cubiertas", nombre: "Cubiertas y Lámina", nombreCorto: "Cubiertas y Lámina" },
  { id: "supertecho", nombre: "Supertecho", nombreCorto: "Supertecho" },
  { id: "metecno", nombre: "Metecno México", nombreCorto: "Metecno" },
];

export function Register({ onRegister, onShowLogin }: RegisterProps) {
  const [step, setStep] = useState(1);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    razonSocial: "",
    rfc: "",
    sector: "",
    region: "",
    rol: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo mostrar modal si el usuario ha seleccionado un rol
    if (formData.rol) {
      setShowConfirmModal(true);
    }
  };

  const handleModalClose = () => {
    setShowConfirmModal(false);
    onShowLogin();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-lg shadow-lg border border-border">
            {/* Header */}
            <div className="p-8 border-b border-border">
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl mb-2">Crear nueva cuenta</h2>
                <p className="text-muted-foreground">
                  Paso {step} de 3: {step === 1 ? "Datos personales" : step === 2 ? "Datos de la empresa" : "Selección de rol"}
                </p>
              </div>

              {/* Logo + Selector de Empresa */}
              <div className="mb-8 flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-9 h-9 text-primary-foreground" />
                </div>
                <div className="flex-1 relative">
                  <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                    <SelectTrigger className="w-full h-12 pt-4 pb-2">
                      <SelectValue placeholder="Empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map((empresa) => (
                        <SelectItem 
                          key={empresa.id} 
                          value={empresa.id}
                          className="cursor-pointer"
                        >
                          {empresa.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedEmpresa && (
                    <label
                      className={cn(
                        "absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-ring pointer-events-none z-10"
                      )}
                    >
                      Empresa
                    </label>
                  )}
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                        i < step
                          ? "border-[#15803D] text-primary-foreground"
                          : i === step
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-muted-foreground"
                      )}
                      style={i < step ? { backgroundColor: '#15803D' } : {}}
                    >
                      {i < step ? <Check className="w-5 h-5" /> : i}
                    </div>
                    {i < 3 && (
                      <div
                        className={cn(
                          "w-16 h-0.5 mx-2",
                          i < step ? "" : "bg-border"
                        )}
                        style={i < step ? { backgroundColor: '#15803D' } : {}}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Datos Personales */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithLabel
                    id="nombre"
                    label="Nombre completo"
                    placeholder="Juan Pérez"
                    value={formData.nombre}
                    onChange={(e) => updateField("nombre", e.target.value)}
                    required
                  />

                  <InputWithLabel
                    id="telefono"
                    type="tel"
                    label="Teléfono"
                    placeholder="+52 123 456 7890"
                    value={formData.telefono}
                    onChange={(e) => updateField("telefono", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithLabel
                    id="email"
                    type="email"
                    label="Correo electrónico"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />

                  <InputWithLabel
                    id="password"
                    type={showPassword ? "text" : "password"}
                    label="Contraseña"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-primary hover:opacity-70 underline"
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    }
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Datos de Empresa */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithLabel
                    id="razonSocial"
                    label="Razón social"
                    placeholder="Acerored S.A. de C.V."
                    value={formData.razonSocial}
                    onChange={(e) => updateField("razonSocial", e.target.value)}
                    required
                  />

                  <InputWithLabel
                    id="rfc"
                    label="RFC (opcional)"
                    placeholder="ACE123456ABC"
                    value={formData.rfc}
                    onChange={(e) => updateField("rfc", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => updateField("sector", value)}
                    >
                      <SelectTrigger className="h-12 pt-4 pb-2">
                        <SelectValue placeholder="Selecciona un sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laminas">Láminas y paneles</SelectItem>
                        <SelectItem value="construccion">Construcción</SelectItem>
                        <SelectItem value="manufactura">Manufactura</SelectItem>
                        <SelectItem value="agricola">Agrícola</SelectItem>
                        <SelectItem value="automotriz">Automotriz</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.sector && (
                      <label
                        className={cn(
                          "absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-ring pointer-events-none z-10"
                        )}
                      >
                        Sector industrial
                      </label>
                    )}
                  </div>

                  <div className="relative">
                    <Select
                      value={formData.region}
                      onValueChange={(value) => updateField("region", value)}
                    >
                      <SelectTrigger className="h-12 pt-4 pb-2">
                        <SelectValue placeholder="Selecciona una región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="norte">Norte</SelectItem>
                        <SelectItem value="sur">Sur</SelectItem>
                        <SelectItem value="centro">Centro</SelectItem>
                        <SelectItem value="bajio">Bajío</SelectItem>
                        <SelectItem value="occidente">Occidente</SelectItem>
                        <SelectItem value="sureste">Sureste</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.region && (
                      <label
                        className={cn(
                          "absolute left-3 top-0 text-xs -translate-y-1/2 bg-card px-1 text-ring pointer-events-none z-10"
                        )}
                      >
                        Región
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Selección de Rol */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground">
                    Selecciona tu rol en la empresa
                  </p>
                </div>

                <RadioGroup value={formData.rol} onValueChange={(value) => updateField("rol", value)}>
                  <div className="grid gap-4">
                    {[
                      {
                        value: "vendedor",
                        title: "Vendedor",
                        description: "Gestión de prospectos y cotizaciones",
                      },
                      {
                        value: "gerente",
                        title: "Gerente de ventas",
                        description: "Supervisión de equipos y reportes",
                      },
                      {
                        value: "administrador",
                        title: "Administrador",
                        description: "Control total del sistema",
                      },
                    ].map((rol) => (
                      <label
                        key={rol.value}
                        htmlFor={`rol-${rol.value}`}
                        className={cn(
                          "p-6 rounded-lg border-2 text-left transition-all hover:border-primary cursor-pointer",
                          formData.rol === rol.value
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="pt-0.5">
                            <RadioGroupItem value={rol.value} id={`rol-${rol.value}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{rol.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {rol.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  Atrás
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={!formData.rol}>
                  Registrarme
                </Button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="text-center">
              <button
                type="button"
                onClick={onShowLogin}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ¿Ya tienes cuenta?{" "}
                <span className="text-primary underline hover:opacity-70">
                  Iniciar sesión
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          © 2025 Connecto. Todos los derechos reservados.
        </p>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md p-0 gap-0" hideCloseButton>
          <DialogTitle className="sr-only">Confirmación de registro</DialogTitle>
          <DialogDescription className="sr-only">
            Por favor valida tu registro a través del correo electrónico
          </DialogDescription>
          
          <button
            onClick={() => setShowConfirmModal(false)}
            className="absolute right-6 top-6 z-10 hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="p-12 text-center">
            <h2 className="text-2xl mb-6 font-bold">¡Ya casi terminas!</h2>
            <p className="text-lg mb-8 leading-relaxed">
              Valida tu registro a través del correo electrónico que te acabamos de enviar
            </p>
            
            <Button
              onClick={handleModalClose}
              className="w-full max-w-sm mx-auto h-12"
            >
              Entendido
            </Button>
            
            <div className="mt-8">
              <p className="text-base mb-2">¿No te ha llegado nuestro correo?</p>
              <button className="text-base text-primary underline hover:opacity-70">
                Enviar de nuevo
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}