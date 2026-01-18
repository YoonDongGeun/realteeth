"use client";

import { Input as HeadlessInput, InputProps as HeadlessInputProps } from "@headlessui/react";
import { cva, type VariantProps } from "cva";
import { cn } from "@shared/utils";
import { RefObject } from "react";

const inputVariants = cva({
  base: "w-full rounded-lg border-2 font-medium transition-all text-foreground placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "border-neutral-300 bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30",
      error: "border-red-500 bg-background focus:border-red-600 focus:ring-2 focus:ring-red-500/30",
    },
    size: {
      sm: "px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm",
      md: "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base",
      lg: "px-4 py-2 text-base sm:px-5 sm:py-3 sm:text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type InputVariantProps = VariantProps<typeof inputVariants> & {
  ref: RefObject<HTMLInputElement | null>;
};

export interface InputProps extends Omit<HeadlessInputProps, "size">, InputVariantProps {}

export const Input = ({ className, variant, size, ref, ...props }: InputProps) => {
  return <HeadlessInput ref={ref} className={cn(inputVariants({ variant, size }), className)} {...props} />;
};
