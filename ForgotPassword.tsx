import { useState } from "react";
import { Button } from "./ui/button";
import { InputWithLabel } from "./ui/input-with-label";
import { Building2 } from "lucide-react";

interface ForgotPasswordProps {
  onCancel: () => void;
}

export function ForgotPassword({ onCancel }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el correo de recuperación
    console.log("Enviar correo a:", email);
    // Por ahora solo regresamos al login
    onCancel();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl">Restablece tu contraseña</h2>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-9 h-9 text-primary-foreground" />
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Escribe el correo electrónico de tu cuenta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputWithLabel
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Enviar correo
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          © 2025 Connecto. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}