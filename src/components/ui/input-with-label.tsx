import * as React from "react";
import { cn } from "./utils";

interface InputWithLabelProps extends React.ComponentProps<"input"> {
  label: string;
  id: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ className, type, label, id, leftIcon, rightIcon, helperText, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    React.useEffect(() => {
      if (props.value !== undefined && props.value !== "") {
        setHasValue(true);
      } else if (props.value === "") {
        setHasValue(false);
      }
    }, [props.value]);

    return (
      <div className="relative">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={id}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border-2 pt-4 pb-2 text-base bg-input-background transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              className,
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={props.placeholder || label}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              {rightIcon}
            </div>
          )}
          <label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              "bg-popover px-1 z-10",
              leftIcon ? "left-10" : "left-3",
              isFocused || hasValue
                ? "top-0 text-xs -translate-y-1/2"
                : "top-1/2 text-sm -translate-y-1/2",
              isFocused
                ? "text-ring"
                : "text-muted-foreground"
            )}
          >
            {label}
          </label>
        </div>
        {helperText && (
          <p className="text-xs text-muted-foreground mt-1.5 px-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export { InputWithLabel };
