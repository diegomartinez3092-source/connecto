import * as React from "react";
import { cn } from "./utils";

interface TextareaWithLabelProps extends React.ComponentProps<"textarea"> {
  label: string;
  id: string;
}

const TextareaWithLabel = React.forwardRef<HTMLTextAreaElement, TextareaWithLabelProps>(
  ({ className, label, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-input-background px-3 pt-6 pb-2 text-base placeholder:text-transparent transition-[color,box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={props.placeholder || label}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            "bg-card px-1 z-10",
            "top-0 text-xs -translate-y-1/2",
            isFocused
              ? "text-ring"
              : "text-muted-foreground"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

TextareaWithLabel.displayName = "TextareaWithLabel";

export { TextareaWithLabel };
