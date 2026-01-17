"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import { cva, type VariantProps } from "cva";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@shared/utils";

const buttonVariants = cva({
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
      secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500",
      outline: "border-2 border-neutral-300 bg-transparent text-foreground hover:bg-neutral-100 focus:ring-neutral-500",
      ghost: "bg-transparent text-foreground hover:bg-neutral-100 focus:ring-neutral-500",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    },
    size: {
      sm: "px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm",
      md: "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base",
      lg: "px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends ComponentPropsWithoutRef<typeof HeadlessButton>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <HeadlessButton className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
