import { useState, useEffect } from "react";
import { Input } from "./input";
import { cn } from "./utils";
import { AlertCircle } from "lucide-react";

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function PhoneInput({ 
  id, 
  value, 
  onChange, 
  className,
  placeholder = "Ej. 55 1234 5678"
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [error, setError] = useState("");

  // Formatear el número para mostrar
  const formatPhoneNumber = (phoneNumber: string) => {
    // Eliminar todo excepto dígitos
    const cleaned = phoneNumber.replace(/\D/g, "");
    
    // Si está vacío, retornar vacío
    if (!cleaned) return "";
    
    // Limitar a 10 dígitos
    const limited = cleaned.slice(0, 10);
    
    // Formatear según la longitud
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)} ${limited.slice(2, 6)} ${limited.slice(6)}`;
    }
  };

  // Cuando el valor externo cambia (desde el componente padre)
  useEffect(() => {
    if (value) {
      // Si el valor viene en formato E.164 (+52XXXXXXXXXX)
      const cleaned = value.replace(/\D/g, "");
      const nationalNumber = cleaned.startsWith("52") ? cleaned.slice(2) : cleaned;
      setDisplayValue(formatPhoneNumber(nationalNumber));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Formatear el valor para mostrar
    const formatted = formatPhoneNumber(input);
    setDisplayValue(formatted);
    
    // Obtener solo los dígitos
    const digitsOnly = input.replace(/\D/g, "");
    
    // Validar
    if (digitsOnly && digitsOnly.length < 10) {
      setError("Ingresa un número válido de 10 dígitos");
    } else {
      setError("");
    }
    
    // Enviar al padre en formato E.164 si tiene 10 dígitos, o el valor limpio si no
    if (digitsOnly.length === 10) {
      onChange(`+52${digitsOnly}`);
    } else {
      onChange(digitsOnly);
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center">
          <span className="text-sm">+52</span>
          <div className="h-4 w-px bg-border mx-2"></div>
        </div>
        <Input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn("pl-16", className)}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
