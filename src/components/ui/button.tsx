import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground shadow-[0_8px_24px_rgba(191,31,46,.2)] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_12px_30px_rgba(191,31,46,.28)]",
        secondary: "bg-foreground text-white hover:bg-[#1b3b41]",
        outline: "border border-foreground/30 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-white",
        ghost: "bg-transparent text-foreground hover:bg-surface",
        inverse: "bg-white text-foreground hover:bg-[#d8ff55]",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    href?: string;
    children: ReactNode;
  };

export function Button({ className, variant, size, href, children, type = "button", ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export { buttonVariants };
