import { PhoneInput } from "./phone-input";

interface PhoneInputWithLabelProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PhoneInputWithLabel({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
}: PhoneInputWithLabelProps) {
  return (
    <div className="relative">
      <PhoneInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-12 pt-4 pb-2 ${className || ""}`}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-0 text-xs -translate-y-1/2 bg-popover px-1 text-muted-foreground pointer-events-none z-10"
      >
        {label}
      </label>
    </div>
  );
}
