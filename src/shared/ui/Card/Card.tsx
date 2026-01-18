"use client";

import { cva, type VariantProps } from "cva";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@shared/utils";

const cardVariants = cva({
  base: "rounded-3xl bg-background dark:bg-foreground shadow-sm transition-colors",
  variants: {
    variant: {
      default: "border border-neutral-100",
      elevated: "shadow-md hover:shadow-lg",
      outlined: "border border-neutral-100",
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

export interface CardProps extends ComponentPropsWithoutRef<"div">, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </div>
  );
}
