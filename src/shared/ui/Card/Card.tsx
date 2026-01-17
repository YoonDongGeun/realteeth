"use client";

import { cva, type VariantProps } from "cva";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@shared/utils";

const cardVariants = cva({
  base: "rounded-lg bg-background shadow-sm transition-shadow",
  variants: {
    variant: {
      default: "border border-neutral-200",
      elevated: "shadow-md hover:shadow-lg",
      outlined: "border-2 border-neutral-300",
      ghost: "shadow-none border-none",
    },
    padding: {
      none: "",
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-5 md:p-6",
      lg: "p-5 sm:p-6 md:p-8",
      xl: "p-6 sm:p-8 md:p-10",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

export interface CardProps extends ComponentPropsWithoutRef<"div">, VariantProps<typeof cardVariants> {
  header?: ReactNode;
}

export function Card({ className, variant, padding, header, children, ...props }: CardProps) {
  const hasPadding = padding !== "none";

  return (
    <div className={cn(cardVariants({ variant, padding: "none" }), className)} {...props}>
      {header && (
        <div className={cn("border-b border-neutral-200", hasPadding && "px-4 py-3 sm:px-5 sm:py-4 md:px-6")}>
          {header}
        </div>
      )}
      {children && <div className={cn(hasPadding && cardVariants({ padding }))}>{children}</div>}
    </div>
  );
}
