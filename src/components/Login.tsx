import { useState } from "react";
import { Button } from "./ui/button";
import { InputWithLabel } from "./ui/input-with-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Building2 } from "lucide-react";
import { cn } from "./ui/utils";

interface LoginProps {
  onLogin: (empresaNombre: string) => void;
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
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

export function Login({ onLogin, onShowRegister, onShowForgotPassword }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const empresaActual = empresas.find(e => e.id === selectedEmpresa);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://hook.us2.make.com/v9osel66uty4b5wjafv1pupqk4qk4b2n",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            rememberMe,
            empresa: empresaActual?.nombre || "Acerored",
          }),
        }
      );

      const data = await response.json().catch(() => undefined);
      const isPositiveResponse =
        response.ok &&
        (data === undefined
          ? true
          : typeof data === "object"
            ? "success" in data
              ? Boolean((data as { success: unknown }).success)
              : "ok" in data
                ? Boolean((data as { ok: unknown }).ok)
                : "status" in data
                  ? (data as { status: unknown }).status === "success"
                  : "result" in data
                    ? (data as { result: unknown }).result === "positive" ||
                      (data as { result: unknown }).result === "success"
                    : true
            : true);

      if (!isPositiveResponse) {
        setErrorMessage("Algo está mal. Intenta de nuevo.");
        return;
      }

      onLogin(empresaActual?.nombre || "Acerored");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Algo está mal. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl mb-2">Iniciar sesión</h2>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputWithLabel
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputWithLabel
              id="password"
              type={showPassword ? "text" : "password"}
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm cursor-pointer"
                >
                  Recordarme
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary underline hover:opacity-70"
                onClick={onShowForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Validando..." : "Iniciar sesión"}
            </Button>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onShowRegister}
          >
            Crear nueva cuenta
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          © 2025 Connecto. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}