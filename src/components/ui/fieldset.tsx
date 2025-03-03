import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
  legendClassName?: string;
  fieldsetClassName?: string;
}

const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (
    {
      className,
      children,
      legend,
      legendClassName,
      fieldsetClassName,
      ...props
    },
    ref
  ) => {
    return (
      <fieldset
        ref={ref}
        className={cn(
          "rounded-lg border border-input bg-transparent px-3 py-2",
          fieldsetClassName
        )}
        {...props}
      >
        {legend && (
          <legend
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              legendClassName
            )}
          >
            {legend}
          </legend>
        )}
        <div className={cn("grid gap-2 mt-2", className)}>{children}</div>
      </fieldset>
    );
  }
);
Fieldset.displayName = "Fieldset";

export { Fieldset };
