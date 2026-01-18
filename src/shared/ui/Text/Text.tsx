"use client";

import { cva, type VariantProps } from "cva";
import { ComponentPropsWithoutRef, createElement } from "react";
import { cn } from "@shared/utils";

const textVariants = cva({
  base: "",
  variants: {
    variant: {
      h1: "text-3xl font-bold sm:text-4xl md:text-5xl",
      h2: "text-2xl font-bold sm:text-3xl md:text-4xl",
      h3: "text-xl font-semibold sm:text-2xl md:text-3xl",
      h4: "text-lg font-semibold sm:text-xl md:text-2xl",
      h5: "text-base font-semibold sm:text-lg md:text-xl",
      h6: "text-sm font-semibold sm:text-base md:text-lg",
      body: "text-sm sm:text-base",
      small: "text-xs sm:text-sm",
      caption: "text-xs",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    color: {
      default: "text-zinc-900 dark:text-zinc-50",
      muted: "text-zinc-600 dark:text-zinc-400",
      subtle: "text-zinc-500 dark:text-zinc-500",
      primary: "text-blue-600 dark:text-blue-400",
      success: "text-green-600 dark:text-green-400",
      warning: "text-amber-600 dark:text-amber-400",
      danger: "text-red-600 dark:text-red-400",
      inherit: "text-inherit",
    },
  },
  defaultVariants: {
    variant: "body",
    align: "left",
    color: "default",
  },
});

type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface TextProps extends Omit<ComponentPropsWithoutRef<"p">, "color">, VariantProps<typeof textVariants> {
  as?: TextElement;
}

export function Text({ className, variant, weight, align, color, as, ...props }: TextProps) {
  const element = as || (variant?.startsWith("h") ? (variant as TextElement) : "p");

  return createElement(element, {
    className: cn(textVariants({ variant, weight, align, color }), className),
    ...props,
  });
}
