"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import { cva, type VariantProps } from "cva";
import { ComponentPropsWithoutRef } from "react";
import { IconType } from "react-icons";
import { cn } from "@shared/utils";

const iconButtonVariants = cva({
  base: "inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed",
  variants: {
    variant: {
      default:
        "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-yellow-500 dark:hover:text-yellow-400",
      favorite:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
      ghost: "bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
      outline:
        "border-2 border-neutral-300 bg-transparent text-foreground hover:bg-neutral-100 dark:border-neutral-700",
      danger: "bg-transparent text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
    size: {
      sm: "p-1.5",
      md: "p-2",
      lg: "p-2.5",
    },
    disabledState: {
      true: "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "default",
      disabledState: true,
      className: "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-400 dark:hover:text-zinc-600",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    disabledState: false,
  },
});

export interface IconButtonProps extends ComponentPropsWithoutRef<"button">, VariantProps<typeof iconButtonVariants> {
  icon: IconType;
  iconClassName?: string;
}

export function IconButton({
  className,
  variant,
  size,
  icon: Icon,
  iconClassName,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <HeadlessButton
      disabled={disabled}
      className={cn(iconButtonVariants({ variant, size, disabledState: !!disabled }), className)}
      {...props}
    >
      <Icon className={cn("w-6 h-6", iconClassName)} />
    </HeadlessButton>
  );
}
